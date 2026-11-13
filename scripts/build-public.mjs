import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {assertPublicationReady} from '../src/lib/site.ts';

// Never reuse a review bundle (noindex/draft policies) for the custom domain.
assertPublicationReady('website');
const cwd=fileURLToPath(new URL('..',import.meta.url));
const env={...process.env,PUBLIC_RELEASE:'true',SITE_PROFILE:'website'};
for(const args of [
  ['worker/prepare-video.mjs'],
  ['node_modules/astro/bin/astro.mjs','build','--outDir','dist-public'],
  ['scripts/verify.mjs','--profile','website','--public','--root','dist-public','--report','dist-public-verification.json'],
]){
  const result=spawnSync(process.execPath,args,{cwd,env,stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}
