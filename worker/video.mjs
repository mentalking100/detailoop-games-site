import intro from './intro-meta.json';

const VIDEO_PATH = '/media/intro.mp4';

// _headers does not apply to Worker-generated responses.
function videoHeaders(original) {
  const headers = new Headers(original);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Content-Security-Policy', "default-src 'none'; media-src 'self'; frame-ancestors 'none'; base-uri 'none'");
  return headers;
}

function byteRange(header, size) {
  // Unknown units and multipart ranges may legally be ignored.
  if (!/^bytes=/i.test(header) || header.includes(',')) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!match || (!match[1] && !match[2]) || size === 0) return false;
  const length = BigInt(size);
  if (!match[1]) {
    const suffix = BigInt(match[2]);
    if (suffix === 0n) return false;
    return {start: Number(suffix >= length ? 0n : length - suffix), end: size - 1};
  }
  const start = BigInt(match[1]);
  const end = match[2] ? BigInt(match[2]) : length - 1n;
  if (start >= length || end < start) return false;
  return {start: Number(start), end: Number(end >= length ? length - 1n : end)};
}

function ifRangeMatches(value, headers) {
  if (!value) return true;
  // Weak validators cannot satisfy If-Range. Dates require a matching Last-Modified.
  if (value.startsWith('W/')) return false;
  if (value.startsWith('"')) return value === headers.get('ETag');
  const modified = headers.get('Last-Modified');
  return !!modified && Number.isFinite(Date.parse(value)) && Date.parse(value) === Date.parse(modified);
}

// Discard preceding chunks and stop reading as soon as the requested range ends.
function sliceStream(body, start, end) {
  const reader = body.getReader();
  let offset = 0;
  return new ReadableStream({
    async pull(controller) {
      while (true) {
        const {done, value} = await reader.read();
        if (done) {
          controller.error(new Error('Video asset ended before the requested byte range.'));
          return;
        }
        const next = offset + value.byteLength;
        if (next > start) {
          controller.enqueue(value.subarray(Math.max(0, start - offset), Math.min(value.byteLength, end + 1 - offset)));
        }
        offset = next;
        if (offset > end) {
          controller.close();
          await reader.cancel();
          return;
        }
        if (offset > start) return;
      }
    },
    cancel(reason) {return reader.cancel(reason);},
  });
}

export default {
  async fetch(request, env, ctx) {
    if (new URL(request.url).pathname !== VIDEO_PATH) return env.ASSETS.fetch(request);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response(null, {status: 405, headers: {Allow: 'GET, HEAD'}});
    }
    const assetRequest = new Request(request);
    assetRequest.headers.delete('Range');
    assetRequest.headers.delete('If-Range');
    assetRequest.headers.set('Accept-Encoding', 'identity');
    const asset = await env.ASSETS.fetch(assetRequest);
    const headers = videoHeaders(asset.headers);
    if (request.method === 'HEAD' && asset.status === 200 && !headers.has('Content-Length')) {
      headers.set('Content-Length', String(intro.byteLength));
    }
    if (asset.status !== 200 || request.method === 'HEAD') {
      return new Response(asset.body, {status: asset.status, headers});
    }
    const requested = request.headers.get('Range');
    // Assets can omit Content-Length internally. The build derives this fallback
    // from the exact MP4 deployed with this Worker, without buffering its body.
    const size = Number(asset.headers.get('Content-Length') ?? intro.byteLength);
    if (!requested || !asset.body || !Number.isSafeInteger(size)
      || !ifRangeMatches(request.headers.get('If-Range'), asset.headers)) {
      return new Response(asset.body, {status: 200, headers});
    }
    const range = byteRange(requested, size);
    if (range === null) return new Response(asset.body, {status: 200, headers});
    if (range === false) {
      await asset.body.cancel();
      headers.set('Content-Range', `bytes */${size}`);
      headers.delete('Content-Length');
      return new Response(null, {status: 416, headers});
    }
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
    headers.set('Content-Length', String(range.end - range.start + 1));
    const stream = new FixedLengthStream(range.end - range.start + 1);
    ctx.waitUntil(sliceStream(asset.body, range.start, range.end).pipeTo(stream.writable));
    return new Response(stream.readable, {status: 206, headers});
  },
};

