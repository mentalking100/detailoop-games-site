import { content, facts, type Locale } from '../data/content.ts';
import { policyDocuments, policyReadiness, type PolicyKey } from '../data/policies.ts';

export const routes = ['', 'philosophy', 'games', 'games/hoegwi-button', 'studio', 'studio/park-jaeyoung', 'news', 'contact', 'policies', 'policies/terms', 'policies/game-privacy', 'policies/site-privacy'] as const;
export type Route = typeof routes[number];
export const pathFor = (locale: Locale, route: string = '') => `/${locale}/${route ? route + '/' : ''}`;
export const absolute = (path: string) => `${facts.domain}${path}`;
export const isPolicyDraft = (route: string) => route.startsWith('policies/') && policyReadiness[route.slice('policies/'.length) as PolicyKey]?.status !== 'ready';
export type SiteProfile = 'review' | 'website';
export function buildRoutes(profile: SiteProfile = 'review'): readonly Route[] {
  return profile === 'website' ? routes.filter(route => !isPolicyDraft(route)) : routes;
}
export function assertPublicationReady(profile: SiteProfile) {
  const unresolved = buildRoutes(profile).filter(route => isPolicyDraft(route));
  if (unresolved.length) throw new Error(`공개 빌드 중단: 미확정 정책 ${unresolved.join(', ')}. 본문·실제 처리 정보·시행일을 확정한 뒤 공개본을 생성하세요.`);
  for (const route of buildRoutes(profile).filter(route => route.startsWith('policies/'))) {
    const date = policyReadiness[route.slice('policies/'.length) as PolicyKey].effectiveDate;
    if (route === 'policies/site-privacy' && date === null) continue; // Effective from first publication.
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) throw new Error(`공개 빌드 중단: ${route} 시행일이 유효한 날짜가 아닙니다.`);
  }
}
export function pageInfo(locale: Locale, route: Route) {
  const c = content[locale];
  const table: Record<Route, {title: string; description: string}> = {
    '': { title: facts.brand, description: c.home.description.join(' ') },
    'philosophy': {title: c.philosophy.title, description: c.philosophy.intro},
    'games': {title: c.games.title, description: c.games.intro},
    'games/hoegwi-button': {title: facts.gameName, description: c.home.gameDescription},
    'studio': {title: c.studio.title, description: c.studio.description.join(' ')},
    'studio/park-jaeyoung': {title: facts.personName, description: c.founder.intro},
    'news': {title: c.news.title, description: c.news.intro},
    'contact': {title: c.contact.title, description: c.contact.intro},
    'policies': {title: c.policies.title, description: c.policies.intro},
    'policies/terms': {title: c.policies.terms, description: policyDocuments.terms[locale].summary},
    'policies/game-privacy': {title: c.policies.gamePrivacy, description: policyDocuments['game-privacy'][locale].summary},
    'policies/site-privacy': {title: c.policies.sitePrivacy, description: policyDocuments['site-privacy'][locale].summary},
  };
  return table[route];
}
export function structuredData(locale: Locale, route: Route) {
  const c = content[locale];
  const info = pageInfo(locale, route);
  const url = absolute(pathFor(locale, route));
  const orgId = `${facts.domain}/#organization`;
  const gameId = `${facts.domain}/#hoegwi-button`;
  const personId = `${facts.domain}/#park-jaeyoung`;
  const graph: Record<string, unknown>[] = [
    {'@type': 'Organization', '@id': orgId, name: facts.brand, alternateName: facts.brandKo, url: facts.domain, logo: absolute('/media/detailoop-logo.png')},
    {'@type': 'WebSite', '@id': `${facts.domain}/#website`, url: facts.domain, name: facts.brand, publisher: {'@id': orgId}, inLanguage: ['ko', 'en']},
    {'@type': route === 'studio/park-jaeyoung' ? 'ProfilePage' : route === 'studio' ? 'AboutPage' : route === 'contact' ? 'ContactPage' : 'WebPage', '@id': `${url}#webpage`, url, name: info.title, description: info.description, inLanguage: locale, isPartOf: {'@id': `${facts.domain}/#website`}, ...(route === 'studio/park-jaeyoung' ? {mainEntity: {'@id': personId}} : route === 'games/hoegwi-button' ? {mainEntity: {'@id': gameId}} : {})},
  ];
  if (route === 'games/hoegwi-button') graph.push({'@type': 'VideoGame', '@id': gameId, name: facts.gameName, url, description: c.home.gameDescription, publisher: {'@id': orgId}, image: absolute('/media/icon-a.webp')});
  if (['studio', 'studio/park-jaeyoung'].includes(route)) graph.push({'@type': 'Person', '@id': personId, name: facts.personName, url: absolute(pathFor(locale,'studio/park-jaeyoung')), jobTitle: c.founder.role, description: c.founder.intro, worksFor: {'@id': orgId}, alumniOf: {'@type': 'CollegeOrUniversity', name: locale === 'ko' ? facts.universityKo : facts.universityEn}});
  return {'@context': 'https://schema.org', '@graph': graph};
}
