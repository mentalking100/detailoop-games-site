import { content, facts, type Locale } from './content.ts';

/** Each game's visible copy, page metadata, and structured data share these fields. */
export function gameCatalog(locale: Locale) {
  const c = content[locale];
  const ko = locale === 'ko';
  return [
    {
      route: 'games/hoegwi-button',
      name: c.game.name,
      tagline: c.game.tagline,
      description: c.home.gameDescription,
      storeUrl: facts.storeUrl,
      image: '/media/room.webp',
      icon: '/media/icon-a.webp',
      ogImage: '/media/share-game.jpg',
      visualLabel: '2006',
      cta: c.home.gameCta,
      detailCta: c.games.detailCta,
      status: ko ? '출시작' : 'RELEASED GAME',
    },
    {
      route: 'games/cat-courier-club',
      name: '고양이 택배국',
      tagline: ko ? '귀여운 고양이와 함께, 만만하지 않은 배달 퍼즐을 풀어 보세요.' : 'A cute cat, three clever delivery puzzles.',
      description: ko
        ? '고양이와 다섯 섬을 여행하며 세 가지 배달 퍼즐을 풀어 보세요.'
        : 'Travel across five islands with a cat and solve three kinds of delivery puzzles.',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.jaeyoung.catcourierclub',
      storeVerified: true,
      privacyUrl: 'https://cat-courier-club-jaeyoung.honey-trout-7714.chatgpt.site/privacy',
      image: '/media/cat-screen-8.webp',
      icon: '/media/cat-icon.webp',
      ogImage: '/media/share-cat.jpg',
      visualLabel: ko ? '다섯 섬' : 'FIVE ISLANDS',
      cta: ko ? '고양이 택배국 살펴보기' : 'Explore 고양이 택배국',
      detailCta: c.games.detailCta,
      status: ko ? '출시작' : 'RELEASED GAME',
      features: ko ? [
        {title: '한붓 배달', body: '고양이에서 출발해 모든 집을 거쳐 깃발까지 이어 주세요. 같은 칸은 두 번 지날 수 없습니다.'},
        {title: '도로 연결', body: '도로 조각을 돌려 고양이와 집을 연결하고, 배달차가 지나갈 길을 만드세요.'},
        {title: '선물 담기', body: '모양이 다른 선물을 돌려 상자를 빈틈없이 채워 보세요.'},
      ] : [
        {title: 'One-Stroke Delivery', body: 'Start at the cat, visit every house, and reach the flag without stepping on the same square twice.'},
        {title: 'Road Connection', body: 'Rotate the road pieces to connect the cat to each house and clear a route for the delivery van.'},
        {title: 'Packing Gifts', body: 'Rotate differently shaped gifts and fit them into the box.'},
      ],
      story: ko ? [
        '고양이와 함께 다섯 섬을 여행합니다.',
        '배달길을 한 번에 잇고, 도로를 돌려 연결하고, 선물을 상자에 담아 보세요. 섬마다 새로운 퍼즐이 기다립니다.',
      ] : [
        'Travel across five islands with a cat.',
        'Trace a delivery route, rotate the roads, and pack gifts into a box. New puzzles await on each island.',
      ],
      screenshotsTitle: ko ? '게임 화면' : 'Inside the game',
      screenshotsIntro: ko ? 'Google Play에 공개된 실제 게임 화면입니다.' : 'Actual game screenshots published on Google Play.',
      screenshots: [8, 2, 4, 5].map((number, index) => ({src: `/media/cat-screen-${number}.webp`, alt: ko ? `고양이 택배국 게임 화면 ${index + 1}` : `고양이 택배국 game screenshot ${index + 1}`})),
      privacyLabel: ko ? '고양이 택배국 개인정보처리방침' : '고양이 택배국 Privacy Policy',
      storeCta: c.game.storeCta,
    },
  ] as const;
}

export function gameForRoute(locale: Locale, route: string) {
  return gameCatalog(locale).find(game => game.route === route);
}
