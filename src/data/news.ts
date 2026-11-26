import { facts } from './content';
import { policyOperationRules } from './policies';
import { gameCatalog } from './games.ts';

export const newsCategories = ['notice', 'update', 'devlog'] as const;
export type NewsCategory = (typeof newsCategories)[number];

export interface NewsTranslation {
  readonly title: string;
  readonly summary: string;
  readonly paragraphs: readonly string[];
  readonly links?: readonly { label: string; url: string }[];
}

/** Dates use YYYY-MM-DD and must reflect the actual publication or revision. */
export interface NewsPost {
  readonly slug: string;
  readonly category: NewsCategory;
  readonly publishedAt: string;
  readonly dateModified?: string;
  readonly author: typeof facts.brand;
  readonly ko: NewsTranslation;
  readonly en: NewsTranslation;
}

export const newsAuthor = facts.brand;

export const posts: readonly NewsPost[] = [
  {
    slug: 'cat-courier-club-release',
    category: 'notice',
    publishedAt: '2026-11-16',
    author: newsAuthor,
    ko: {
      title: '고양이 택배국 Google Play 출시 안내',
      summary: '고양이와 다섯 섬을 여행하며 세 가지 배달 퍼즐을 풀어 보는 고양이 택배국을 소개합니다.',
      paragraphs: [
        '고양이 택배국이 Google Play에 출시되었습니다.',
        gameCatalog('ko')[1].description,
        '한붓 배달에서는 같은 칸을 다시 지나지 않고 모든 집을 거쳐 깃발에 도착합니다. 도로 연결에서는 도로 조각을 돌려 배달길을 만들고, 선물 담기에서는 모양이 다른 선물을 상자에 맞춰 넣습니다.',
      ],
      links: [
        {label: '고양이 택배국 소개', url: '/ko/games/cat-courier-club/'},
        {label: 'Google Play에서 보기', url: gameCatalog('ko')[1].storeUrl},
        {label: '고양이 택배국 개인정보처리방침', url: gameCatalog('ko')[1].privacyUrl},
      ],
    },
    en: {
      title: '고양이 택배국 is now on Google Play',
      summary: 'Meet 고양이 택배국, a delivery puzzle game across five islands with a cat.',
      paragraphs: [
        '고양이 택배국 is now available on Google Play.',
        gameCatalog('en')[1].description,
        'In One-Stroke Delivery, visit every house and reach the flag without revisiting a square. In Road Connection, rotate the roads to make a delivery route. In Packing Gifts, fit differently shaped gifts into a box.',
      ],
      links: [
        {label: 'Explore 고양이 택배국', url: '/en/games/cat-courier-club/'},
        {label: 'View on Google Play', url: gameCatalog('en')[1].storeUrl},
        {label: '고양이 택배국 Privacy Policy', url: gameCatalog('en')[1].privacyUrl},
      ],
    },
  },
  {
    slug: 'hoegwi-0504-online-records',
    category: 'notice',
    publishedAt: '2026-11-13',
    author: newsAuthor,
    ko: {
      title: '회귀버튼 0.50.4 온라인 기록과 명예의 전당 안내',
      summary: '완료한 회차의 월별 기록과 최종 결과를 보관하고, 선택한 결과를 명예의 전당에 공개할 수 있습니다.',
      paragraphs: [
        `회귀버튼 0.50.4가 Google Play에 출시됐습니다. 회차를 마친 뒤 원하는 경우 Google 계정을 연결해 온라인 기록을 이용할 수 있습니다. 계정 연결과 온라인 기록은 만 ${policyOperationRules.minOnlineAge}세 이상이 이용할 수 있으며, 게임 진행과 기기 저장은 로그인 없이도 이용할 수 있습니다.`,
        'Google 로그인만으로는 게임 기록이 전송되지 않습니다. 완료한 회차에서 별명과 공개 항목을 확인하고 등록하면 월별 기록과 최종 결과가 보관됩니다. 명예의 전당에는 별명, 게임 캐릭터, 최종 순자산, 순위가 표시됩니다. 공개를 해제하면 순위에서는 빠지고, 보관한 기록은 계정에서 확인할 수 있습니다.',
        '온라인에 보관한 기록은 월별 요약과 최종 결과입니다. 플레이 중인 회차는 저장한 기기에서 이어갈 수 있습니다. 온라인 계정 삭제는 앱에서 요청하거나 아래 계정 삭제 안내에서 이메일로 요청할 수 있습니다.',
      ],
      links: [
        { label: 'Google Play에서 회귀버튼 보기', url: facts.storeUrl },
        { label: '회귀버튼 이용약관', url: '/ko/policies/terms/' },
        { label: '회귀버튼 개인정보처리방침', url: '/ko/policies/game-privacy/' },
        { label: '온라인 계정 삭제 요청', url: '/ko/contact/#account-deletion' },
      ],
    },
    en: {
      title: 'Hoegwi Button 0.50.4 Online Records and Hall of Fame',
      summary: 'Keep monthly records and final results from completed runs and choose which results appear in the Hall of Fame.',
      paragraphs: [
        `Hoegwi Button 0.50.4 is available on Google Play. After finishing a run, you can choose to connect a Google account and use online records. Account linking and online records are available to players aged ${policyOperationRules.minOnlineAge} or older. Gameplay and on-device saves remain available without signing in.`,
        'Signing in alone does not send game records. When you register a completed run after reviewing the nickname and public fields, its monthly records and final result are stored. The Hall of Fame displays your nickname, game character, final net worth and rank. Withdrawing publication removes the result from the ranking while keeping it in your account.',
        'Online records contain monthly summaries and final results. You can resume a run on the device where you saved it. You can request online account deletion in the app or by email using the account deletion page below.',
      ],
      links: [
        { label: 'View Hoegwi Button on Google Play', url: facts.storeUrl },
        { label: 'Hoegwi Button Terms of Use', url: '/en/policies/terms/' },
        { label: 'Hoegwi Button Privacy Policy', url: '/en/policies/game-privacy/' },
        { label: 'Request online account deletion', url: '/en/contact/#account-deletion' },
      ],
    },
  },
];

const seen = new Set<string>();
for (const post of posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || seen.has(post.slug)) throw new Error(`Invalid or duplicate news slug: ${post.slug}`);
  seen.add(post.slug);
  for (const date of [post.publishedAt, post.dateModified].filter(Boolean) as string[]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date) throw new Error(`Invalid news date: ${post.slug}`);
  }
  if (post.dateModified && post.dateModified < post.publishedAt) throw new Error(`News revision predates publication: ${post.slug}`);
  if (post.author !== newsAuthor || !newsCategories.includes(post.category)) throw new Error(`Invalid author or category: ${post.slug}`);
  for (const lang of ['ko','en'] as const) {
    const text = post[lang];
    if (!text.title.trim() || !text.summary.trim() || !text.paragraphs.length || text.paragraphs.some(p=>!p.trim())) throw new Error(`Missing ${lang} news copy: ${post.slug}`);
  }
}
