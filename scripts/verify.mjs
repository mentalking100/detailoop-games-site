import {readFile,readdir,access,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {load} from 'cheerio';
import {facts,locales} from '../src/data/content.ts';
import {gameCatalog} from '../src/data/games.ts';
import {isPolicyDraft,buildRoutes,pathFor,assertPublicationReady} from '../src/lib/site.ts';
import {policyDocuments} from '../src/data/policies.ts';
const {values:options}=parseArgs({options:{
  profile:{type:'string',default:'review'},
  root:{type:'string',default:'dist'},
  report:{type:'string',default:'verification-report.json'},
  public:{type:'boolean',default:false},
}});
const profile=options.profile;
if(!['review','website'].includes(profile))throw new Error('Use --profile review or --profile website.');
if(options.public){
  if(profile!=='website')throw new Error('Public builds use --profile website.');
  assertPublicationReady(profile);
}
const root=path.resolve(options.root);
const reportPath=path.resolve(options.report);
const failures=[];let checks=0;
const check=(test,message)=>{checks++;if(!test)failures.push(message);};
const normalize=s=>s.replace(/\s+/g,' ').trim();
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const files=(await walk(root)).filter(f=>f.endsWith('.html'));
const pages=files.filter(f=>/[\\/](ko|en)[\\/]/.test(f));
const routeFromPath=urlPath=>urlPath.replace(/^\/(ko|en)\//,'').replace(/\/$/,'');
const titles=new Set();
for(const file of pages){
  const relative=path.relative(root,file).replaceAll('\\','/');
  const urlPath='/'+relative.replace(/index\.html$/,'');
  const locale=urlPath.split('/')[1];
  const route=routeFromPath(urlPath);
  const games=gameCatalog(locale);
  const game=games.find(item=>item.route===route);
  const html=await readFile(file,'utf8');const $=load(html);
  const robots=($('meta[name="robots"]').attr('content')||'').split(',').map(x=>x.trim());
  check(robots.includes(options.public?'index':'noindex')&&!robots.includes(options.public?'noindex':'index'),`${relative}: ${options.public?'public indexing':'review noindex'}`);
  check($('html').attr('lang')===locale,`${relative}: language`);
  check($('main h1').length===1,`${relative}: exactly one main heading`);
  check(!titles.has(locale+$('title').text()),`${relative}: unique title per language`);titles.add(locale+$('title').text());
  check($('link[rel="canonical"]').attr('href')===facts.domain+urlPath,`${relative}: canonical`);
  for(const lang of ['ko','en']) check($(`link[hreflang="${lang}"]`).attr('href')===facts.domain+urlPath.replace(/^\/(ko|en)\//,`/${lang}/`),`${relative}: ${lang} alternate`);
  check($('link[hreflang="x-default"]').length===1,`${relative}: x-default`);
  let graph=[];
  try{const data=JSON.parse($('script[type="application/ld+json"]').text());check(data['@context']==='https://schema.org',`${relative}: schema context`);graph=data['@graph'];}catch{failures.push(`${relative}: invalid JSON-LD`);}
  const visible=load(html);visible('script,style').remove();visible('p,h1,h2,h3,li,section,div,span').append(' ');const body=normalize(visible('body').text());
  const page=graph.find(x=>['WebPage','ProfilePage','AboutPage','ContactPage'].includes(x['@type']));
  check(page?.description===$('meta[name="description"]').attr('content'),`${relative}: metadata and JSON-LD match`);
  check(body.includes(normalize(page?.description||'__missing__')),`${relative}: description is visible`);
  check($('meta[property="og:description"]').attr('content')===page?.description,`${relative}: share description matches`);
  for(const entity of graph){
    for(const prop of ['name','description','jobTitle']) if(entity[prop]) check(body.includes(normalize(entity[prop])),`${relative}: ${entity['@type']}.${prop} is visible`);
    if(entity['@type']==='VideoGame'){
      check(Boolean(game),`${relative}: VideoGame is on a game detail page`);
      if(game){
        check(entity.name===game.name,`${relative}: game name matches catalog`);
        check(entity.description===game.description,`${relative}: game description matches catalog`);
        check(entity.url===facts.domain+pathFor(locale,game.route),`${relative}: game URL matches catalog route`);
        check([game.image,game.icon].map(image=>facts.domain+image).includes(entity.image),`${relative}: game image matches catalog`);
        check(page?.mainEntity?.['@id']===entity['@id'],`${relative}: game is page main entity`);
      }
      for(const prop of ['offers','aggregateRating','review','datePublished','releaseDate','inLanguage','softwareVersion']) check(!(prop in entity),`${relative}: no unverified ${prop}`);
    }
    if(entity['@type']==='Person'){
      check(!('birthDate' in entity),`${relative}: no invented birthday`);
      check(body.includes(entity.alumniOf.name),`${relative}: visible education`);
    }
  }
  if(game){
    check(graph.filter(entity=>entity['@type']==='VideoGame').length===1,`${relative}: exactly one game entity`);
    check($('meta[property="og:image"]').attr('content')===facts.domain+game.ogImage,`${relative}: game share image matches catalog`);
    check($('meta[property="og:image:alt"]').attr('content')===game.name,`${relative}: game share image alt matches catalog`);
    check($(`main a[href="${game.storeUrl}"]`).length>0,`${relative}: game store link matches catalog`);
  }
  if(route==='' || route==='games'){
    const cardLinks=$('main a.game-card').toArray().map(node=>$(node).attr('href'));
    const expectedLinks=games.map(item=>pathFor(locale,item.route));
    check(games.length===2 && games[0]?.route==='games/hoegwi-button' && games[1]?.route==='games/cat-courier-club',`${relative}: catalog order is Hoegwi then Cat`);
    check(cardLinks.length===expectedLinks.length && cardLinks.every((href,i)=>href===expectedLinks[i]),`${relative}: equal game cards appear once each in catalog order`);
    games.forEach((item,i)=>{
      const cardText=normalize($('main a.game-card').eq(i).text());
      check(cardText.includes(item.name),`${relative}: card ${i+1} shows catalog game name`);
      check(cardText.includes(normalize(item.description)),`${relative}: card ${i+1} shows catalog description`);
    });
  }
  if(route==='games/cat-courier-club'){
    const mainLinks=$('main a[href]').toArray().map(node=>({href:$(node).attr('href'),label:normalize($(node).text())}));
    const privacyLinks=mainLinks.filter(link=>/개인정보|privacy/i.test(link.label) && /^https:\/\//.test(link.href) && !link.href.startsWith(facts.domain) && link.href!==game?.storeUrl);
    check(privacyLinks.length>0,`${relative}: Cat game has an external game privacy link`);
    check(!mainLinks.some(link=>link.href?.includes('#account-deletion') || /\/(ko|en)\/policies\/game-privacy\//.test(link.href||'')),`${relative}: Hoegwi account and game policy links do not appear in Cat detail`);
  }
  for(const node of $('a[href],img[src],source[src],link[rel="stylesheet"],link[rel="icon"]')){
    const ref=$(node).attr('href')||$(node).attr('src');if(!ref||/^(https?:|mailto:|data:)/.test(ref))continue;
    const target=new URL(ref,'https://local.test'+urlPath);
    let targetFile=path.join(root,decodeURIComponent(target.pathname));
    if(target.pathname.endsWith('/'))targetFile=path.join(targetFile,'index.html');
    try{await access(targetFile);check(true,'');if(target.hash){const targetHtml=load(await readFile(targetFile,'utf8'));check(targetHtml(`[id="${target.hash.slice(1)}"]`).length>0,`${relative}: anchor ${ref}`);}}catch{check(false,`${relative}: missing asset or link ${ref}`);}
  }
  for(const img of $('img'))check($(img).attr('alt')!==undefined,`${relative}: image has alt`);
  for(const og of $('meta[property="og:image"]')){try{await access(path.join(root,new URL($(og).attr('content')).pathname));check(true,'');}catch{check(false,`${relative}: missing share image`);}}
  if(!facts.storeVerified)check(!$(`a[href="${facts.storeUrl}"]`).length,`${relative}: unverified store URL not linked`);
  if(isPolicyDraft(routeFromPath(urlPath))){
    check($('meta[name="robots"]').attr('content')?.includes('noindex'),`${relative}: policy draft excluded`);
    const policy=policyDocuments[routeFromPath(urlPath).slice('policies/'.length)][locale];
    check($('.policy-review-banner').length===1,`${relative}: draft status is visible`);
    check($('.policy-body section').length===policy.sections.length,`${relative}: all policy sections rendered`);
    for(const section of policy.sections){
      check(body.includes(normalize(section.heading)),`${relative}: policy heading ${section.heading}`);
      for(const paragraph of section.paragraphs)check(body.includes(normalize(paragraph)),`${relative}: policy paragraph is visible`);
    }
    for(const note of policy.reviewNotes)check(body.includes(normalize(note)),`${relative}: readiness note is visible`);
  }
}
const sitemapText=await readFile(path.join(root,'sitemap.xml'),'utf8');
const sitemap=load(sitemapText,{xmlMode:true});
const expectedSitemapUrls=pages.map(file=>'/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'')).filter(urlPath=>!isPolicyDraft(routeFromPath(urlPath))).map(urlPath=>facts.domain+urlPath);
const sitemapUrls=sitemap('loc').toArray().map(el=>sitemap(el).text());
check(sitemap('url').length===expectedSitemapUrls.length,'Sitemap includes all generated pages except policy drafts, including news');
check(new Set(sitemapUrls).size===expectedSitemapUrls.length && expectedSitemapUrls.every(url=>sitemapUrls.includes(url)),'Sitemap URLs match all generated non-draft pages');
check(!sitemapUrls.some(url=>isPolicyDraft(routeFromPath(new URL(url).pathname))),'Draft policy pages excluded from sitemap');
for(const locale of locales)for(const game of gameCatalog(locale))check(sitemapUrls.includes(facts.domain+pathFor(locale,game.route)),`Sitemap includes ${locale} ${game.name} detail page`);
const actualPaths=pages.map(file=>'/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,''));
const expectedBasePaths=locales.flatMap(locale=>buildRoutes(profile).map(route=>pathFor(locale,route)));
const basePaths=actualPaths.filter(urlPath=>!/^\/(ko|en)\/news\/[^/]+\/$/.test(urlPath));
check(basePaths.length===expectedBasePaths.length && expectedBasePaths.every(urlPath=>basePaths.includes(urlPath)),`All bilingual base pages match the ${profile} profile`);
for(const urlPath of actualPaths)check(actualPaths.includes(urlPath.replace(/^\/(ko|en)\//,urlPath.startsWith('/ko/')?'/en/':'/ko/')),`Bilingual page pair: ${urlPath}`);
const robotsText=await readFile(path.join(root,'robots.txt'),'utf8');
check(options.public?(/^Allow: \/$/m.test(robotsText)&&!/^Disallow: \/$/m.test(robotsText)):/^Disallow: \/$/m.test(robotsText),'robots.txt matches the publication mode');
if(profile==='website'){
  const excludedPaths=new Set(locales.flatMap(locale=>['policies/terms','policies/game-privacy']
    .map(route=>pathFor(locale,route)).filter(urlPath=>!expectedBasePaths.includes(urlPath))));
  const excluded=urlPath=>excludedPaths.has(urlPath.endsWith('/')?urlPath:urlPath+'/');
  check(!actualPaths.some(excluded),'Website bundle excludes unpublished game policy pages');
  check(!sitemapUrls.some(url=>excluded(new URL(url).pathname)),'Website sitemap excludes unpublished game policy URLs');
  for(const file of files){
    const relative=path.relative(root,file).replaceAll('\\','/');
    const $=load(await readFile(file,'utf8'));
    const refs=$('[href],[src]').toArray().map(node=>$(node).attr('href')||$(node).attr('src'));
    check(!refs.some(ref=>excluded(new URL(ref,'https://local.test/'+relative).pathname)),`${relative}: no excluded game policy links`);
  }
}
const report={checkedAt:new Date().toISOString(),profile,publicationMode:options.public?'public':'review',root,pages:pages.length,checks,passed:failures.length===0,failures};
await writeFile(reportPath,JSON.stringify(report,null,2));
if(failures.length){console.error(JSON.stringify(report,null,2));process.exitCode=1;}else console.log(`PASS: ${profile} profile, ${pages.length} bilingual pages, ${checks} content, schema, language, link and publication-mode checks.`);
