export const prerender = true;
export function GET() {
  const release = import.meta.env.PUBLIC_RELEASE === 'true';
  return new Response(release ? 'User-agent: *\nAllow: /\nSitemap: https://detailoopgames.com/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
