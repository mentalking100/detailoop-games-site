import { locales } from '../data/content';
import { buildRoutes, pathFor, absolute, isPolicyDraft } from '../lib/site';
import {posts} from '../data/news';
export const prerender = true;
export function GET() {
  const profile=import.meta.env.PUBLIC_RELEASE === 'true' || import.meta.env.SITE_PROFILE === 'website' ? 'website' : 'review';
  const allRoutes=[...buildRoutes(profile).filter(r=>!isPolicyDraft(r)),...posts.map(p=>`news/${p.slug}`)];
  const items = locales.flatMap(locale => allRoutes.map(route=>`<url><loc>${absolute(pathFor(locale,route))}</loc>${locales.map(lang=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${absolute(pathFor(lang,route))}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(pathFor('ko',route))}"/></url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${items.join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
