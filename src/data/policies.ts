import { content, facts, type Locale } from './content.ts';

export type PolicyKey = 'terms' | 'game-privacy' | 'site-privacy';
export const policyReadiness: Record<PolicyKey, { status: 'draft' | 'ready'; effectiveDate: string | null }> = {
  terms: { status: 'ready', effectiveDate: '2026-11-13' },
  'game-privacy': { status: 'ready', effectiveDate: '2026-11-12' },
  'site-privacy': { status: 'ready', effectiveDate: null },
};
// Operator choices confirmed on 2026-11-12. Confirmation is not a policy effective date.
// Keep approved rules separate from implementation readiness.
export const policyOperationRules = {
  minOnlineAge: 14,
  supportRetentionDays: 90,
  reportRetentionDays: 30,
  reportCleanupAfterDays: 29,
  d1RecoveryDays: 7,
  agePolicyVersion: '2026-11-12',
  deletionTokenMinutes: 5,
} as const;
const rules = policyOperationRules;
export interface PolicyTranslation {
  title: string;
  summary: string;
  sections: { heading: string; paragraphs: string[] }[];
  reviewNotes: string[];
  sources?: { label: string; url: string }[];
}

// Names, contact details and navigation titles deliberately share the site's facts.
export const policyDocuments: Record<PolicyKey, Record<Locale, PolicyTranslation>> = {
  terms: {
    ko: {
      title: content.ko.policies.terms,
      summary: '회귀버튼의 온라인 기록과 명예의 전당을 이용할 때 적용되는 기준입니다. 회차 등록과 순위 공개는 이용자가 선택합니다.',
      sections: [
        { heading: '운영자와 적용 범위', paragraphs: [
          `${facts.brandKo}는 개인 개발자 ${facts.personName}이 사용하는 게임 개발 브랜드입니다. 이 약관은 ${facts.gameName} 0.50.4의 선택형 온라인 기록과 공개 순위 이용에 적용됩니다. 문의는 ${facts.email}으로 보내실 수 있습니다.`,
          '일반 게임 진행과 기기 저장은 로그인 없이 이용합니다. 온라인 기록은 본인이 원하는 경우 Google 계정을 연결하여 이용하는 선택 기능입니다.',
          `온라인 계정 연결·기록 저장·순위는 만 ${rules.minOnlineAge}세 이상이 이용할 수 있습니다. Google 로그인 전에 나이 구간을 직접 선택합니다. 기준에 미달하거나 확인을 취소해도 일반 게임은 계속 이용할 수 있습니다. 게임 이용등급은 스토어에서 별도로 확인할 수 있습니다.`
        ] },
        { heading: '온라인에 보관하는 기록', paragraphs: [
          '온라인에는 게임 속 월별 재산 요약과 최종 결과를 보관합니다. 전체 세이브 파일을 보관하거나, 삭제한 게임 진행을 복원하거나, 다른 기기에서 이어 하게 하는 기능은 아닙니다.',
          '로그인만으로 게임 기록을 업로드하거나 공개하지 않습니다. 이용자가 완료한 회차의 등록을 선택하고 공개 별명·항목을 확인한 뒤 동의해야 전송합니다. 연결이나 전송이 실패하면 해당 등록 요청의 기기 대기 기록을 다시 보낼 수 있습니다. 로그아웃만으로 이미 보관한 온라인 기록이 삭제되지는 않습니다.'
        ] },
        { heading: '공개 순위와 올바른 이용', paragraphs: [
          '개인 기록은 기본적으로 비공개입니다. 이용자가 사용할 별명과 공개 항목을 확인하고 해당 회차의 공개에 직접 동의한 경우에만 별명과 게임 결과가 순위에 표시됩니다. 공개는 다시 해제할 수 있습니다. 전체 참여자의 공개 결과 중 계정별 최고 결과 1개를 순위에 표시하며, 동점은 공동 순위로 처리합니다.',
          '순위는 이용자가 제출한 커뮤니티 기록이며 모든 게임 행동을 서버가 재검증하는 인증 점수가 아닙니다. 다른 사람의 계정을 사용하거나 기록을 조작하고, 서비스에 과도한 요청을 보내는 행위를 삼가 주세요.',
          '부정확하거나 부적절한 공개 결과를 신고할 수 있습니다. 운영자는 확인을 위해 해당 결과의 공개를 숨길 수 있으며, 처리에 관한 문의와 이의 제기는 공개 문의처로 받습니다.'
        ] },
        { heading: '보관 범위와 삭제', paragraphs: [
          '월별 상세는 서버에 등록한 최근 3회차를 보관하며, 한 회차는 최대 252개월입니다. 최종 결과는 최근 20개와 개인 최고 결과를 보관하고, 전체 순위에 해당하는 계정별 최고 공개 결과도 보존합니다. 순위가 100위 밖이라는 이유로 해당 공개 최고 기록을 삭제하지 않습니다. 한 번에 조회하는 목록의 최대 100개는 페이지 크기입니다.',
          '개별 회차 또는 온라인 계정 전체의 삭제를 요청할 수 있습니다. 온라인 계정 삭제 후에도 Google 계정, 기기 저장 진행, 외부에 공유한 게시물은 각 서비스에 남습니다. 삭제 대상과 보관기간은 아래 개인정보처리방침에서 확인할 수 있습니다.'
        ] },
        { heading: '서비스 변경과 문의', paragraphs: [
          '점검이나 장애로 온라인 기능 이용이 일시적으로 제한될 수 있습니다. 이용 조건을 변경할 때에는 변경 내용과 적용일을 소식 페이지에 미리 안내하고, 이용자에게 불리하거나 중요한 변경은 관계 법령에 따른 시기와 방법으로 알립니다.',
          `기록 오류나 이용 중 문제가 있으면 ${facts.email}으로 문의해 주세요. 비밀번호, Google 인증 코드 또는 전체 로그인 토큰은 보내지 마세요.`
        ] }
      ],
      reviewNotes: [],
      sources: [
        { label: '회귀버튼 개인정보처리방침', url: `${facts.domain}/ko/policies/game-privacy/` },
        { label: '온라인 계정 삭제 요청', url: `${facts.domain}/ko/contact/#account-deletion` }
      ]
    },
    en: {
      title: content.en.policies.terms,
      summary: 'Terms for using online records and the Hall of Fame in Hoegwi Button. Players choose whether to register each completed run and publish its result.',
      sections: [
        { heading: 'Operator and scope', paragraphs: [
          `${facts.brand} is the game development brand used by individual developer ${facts.personName}. These terms cover optional online records and public rankings in ${facts.gameName} 0.50.4. Contact: ${facts.email}.`,
          'Normal gameplay and on-device saves do not require sign-in. Online records are optional and use a Google account only when the player chooses to connect one.',
          `Players aged ${rules.minOnlineAge} or older can connect an online account, store records and use rankings. Before Google sign-in, players select their age group. Players can continue normal gameplay if they are below the minimum age or cancel the check. The game’s content rating is listed in the store.`
        ] },
        { heading: 'Records stored online', paragraphs: [
          'Online records contain monthly in-game wealth summaries and final results. They do not store a complete playable save, restore deleted game progress or let you continue a game on another device.',
          'Signing in alone does not upload or publish game records. Players must choose to register a completed run, review the public nickname and fields, and consent before transmission. If the connection or upload fails, the pending data for that registration request may be retried. Signing out does not delete records already stored online.'
        ] },
        { heading: 'Public rankings and fair use', paragraphs: [
          'Personal records are private by default. A nickname and game results appear in rankings only after the player reviews their chosen nickname and public fields and explicitly consents to publishing that run. Publication can be withdrawn. The overall ranking displays each participating account’s best public result, with tied results sharing a rank.',
          'Rankings are community-submitted records, not certified scores produced by replaying every game action on the server. Do not use someone else’s account, manipulate records or send excessive requests to the service.',
          'Players can report inaccurate or inappropriate public results. The operator may hide a reported result while reviewing it. Questions and objections can be sent to the public contact address.'
        ] },
        { heading: 'Retention and deletion', paragraphs: [
          'Monthly details are kept for the latest 3 registered runs, with up to 252 months per run. Final results include the latest 20 and the personal best, plus the account’s best public result eligible for the overall ranking. That public best is not deleted merely because it ranks below 100th. The maximum of 100 results per request is a page size.',
          'You can request deletion of an individual run or the entire online account. Your Google account, on-device game progress and posts shared elsewhere remain with their respective services. See the privacy policy below for the scope of deletion and retention periods.'
        ] },
        { heading: 'Service changes and contact', paragraphs: [
          'Maintenance or outages may temporarily limit online features. We post changes to these terms and their effective dates on the News page in advance. We notify users of material or unfavorable changes at the time and in the manner required by applicable law.',
          `For record errors or service issues, contact ${facts.email}. Do not send passwords, Google verification codes or complete sign-in tokens.`
        ] }
      ],
      reviewNotes: [],
      sources: [
        { label: 'Hoegwi Button privacy policy', url: `${facts.domain}/en/policies/game-privacy/` },
        { label: 'Request online account deletion', url: `${facts.domain}/en/contact/#account-deletion` }
      ]
    }
  },
  'game-privacy': {
    ko: {
      title: content.ko.policies.gamePrivacy,
      summary: '회귀버튼의 기기 저장과 0.50.4에서 제공할 선택형 온라인 기록에 관한 개인정보처리방침입니다. 온라인 기록에 관한 항목은 해당 기능의 제공이 시작된 뒤 적용됩니다.',
      sections: [
        { heading: '운영자와 문의', paragraphs: [
          `개인 개발자 ${facts.personName}이 ${facts.brandKo}라는 브랜드로 ${facts.gameName}을 개발합니다. 개인정보 관련 문의와 열람·정정·삭제·처리정지 요청은 ${facts.email}으로 받습니다. 요청 처리 시 필요한 범위에서 본인 확인을 할 수 있습니다.`,
          '이 문서는 게임의 기기 저장과 온라인 기록에 적용될 내용입니다. 홈페이지 방문 정보는 홈페이지 개인정보처리방침에서 안내합니다.'
        ] },
        { heading: '기기에 남는 정보와 선택적 연결', paragraphs: [
          '게임용 이름·설정·진행 상태·선택 기록과 공유용 이미지·영상은 기기에서 처리합니다. 앱 데이터 삭제나 앱 제거로 기기 기록이 사라질 수 있습니다. 사용자가 다른 앱에 전달한 파일은 그 서비스에서 별도로 관리합니다.',
          '앱은 온라인 기능의 이용 가능 여부를 확인하기 위해 서버에 요청을 보냅니다. 이 요청은 게임 기록을 포함하지 않으며 호스팅 과정에서 IP 주소와 요청 정보가 처리될 수 있습니다. Google 로그인만으로는 게임 기록을 보내지 않습니다. 완료한 회차를 명예의 전당에 등록할 때 별명과 공개 항목을 확인하고 동의하면, 월별 기록과 최종 결과를 서버에 저장한 뒤 최종 결과를 순위에 표시합니다. 온라인 기록으로 전체 게임 진행을 복원할 수는 없습니다.'
        ] },
        { heading: '온라인 처리 항목과 목적', paragraphs: [
          'Google 로그인 또는 삭제를 위한 본인 확인 시 앱은 Google이 발급한 ID 토큰을 HTTPS로 서버에 보냅니다. 토큰에는 계정 식별자와 이메일 주소, 이름, 프로필 사진 주소 등 Google이 제공하는 항목이 포함될 수 있습니다. 서버는 토큰을 검증할 때 처리하며 토큰 원문과 Google 이메일·이름·사진 주소를 운영 DB에 저장하지 않습니다. 계정 연결에는 변환한 Google 계정 식별자, 서비스 계정 번호, 별명, 생성 시각과 세션 해시·만료 시각을 저장합니다. Google 비밀번호는 받지 않습니다.',
          `온라인 이용 연령의 자기 확인에는 적용한 기준의 버전(${rules.agePolicyVersion})과 서버에서 확인한 시각을 계정에 저장합니다. 정상 로그인 때 확인 정보가 갱신되며 계정 삭제 시 함께 삭제됩니다. 생년월일·신분증·실제 이름을 이 연령 확인을 위해 수집하지 않습니다.`,
          '기록 보관과 순위 제공을 위해 회차 번호, 게임 규칙·그림 버전, 시작 조건, 월별 게임 연월·현금·순자산·수입·지출, 최종 나이·캐릭터·직업·주거·칭호와 생성·갱신 시각을 저장합니다. 시작 조건에는 게임 속 나이·성별·자산·주거·지역·직업·가치관·외모 모드·병역·연애 설정·대학 선택 등이 포함됩니다. 실제 은행 계좌나 실제 금융 자산을 요청하는 기능이 아닙니다.',
          '보안과 과도한 요청 방지를 위해 짧게 유효한 인증 요청, 요청 목적, 정상 로그인에 결합한 연령 확인 버전·시각, 변환된 접속 IP와 계정별 요청 횟수를 처리합니다. 삭제 전용 인증에는 별도의 토큰 해시값·계정 번호·발급 및 만료 시각을 저장합니다. 신고 기능에는 신고 대상·신고자 계정 번호·사유·접수 시각과 처리 완료 시각을 저장합니다.'
        ] },
        { heading: '공개와 제공업체', paragraphs: [
          '월별 기록과 개인 최종 결과는 해당 계정에서 조회할 수 있습니다. 다른 순위 참여자에게 제공하는 항목은 별명, 게임 캐릭터, 최종 순자산, 순위입니다. 공개를 해제하면 순위에서 제외되고, 계정에 보관된 기록은 개별 회차나 계정을 삭제할 때까지 또는 보관 한도에 따라 정리될 때까지 비공개로 남습니다. 순위에는 계정별 최고 공개 결과 1개가 표시됩니다.',
          'Google은 이용자가 선택한 Google 계정을 인증합니다. 회귀버튼은 Google의 인증 결과를 받아 게임 계정을 연결하거나 기존 계정의 삭제 요청을 확인합니다. Google 자체 서비스의 개인정보 처리에는 Google 개인정보처리방침이 적용됩니다.',
          'Cloudflare, Inc.의 Workers와 D1은 서비스 연결 확인, 로그인, 온라인 기록 저장·조회, 순위, 신고와 삭제 요청을 처리합니다. 기능을 호출할 때 접속 IP와 요청별 데이터가 HTTPS로 전달됩니다. Workers는 접속 요청을 받은 지점에 가까운 Cloudflare 데이터센터에서 처리하므로 처리 위치는 접속 경로에 따라 달라집니다. 아래 Cloudflare 네트워크 안내에서 데이터센터의 국가와 도시를 볼 수 있습니다.',
          '운영 D1의 주 데이터베이스 응답에서 싱가포르(SIN, 아시아·태평양)를 확인했으며 읽기 복제는 꺼져 있습니다. 저장 위치를 한 국가로 고정한 설정은 없습니다. 운영 앱 서버의 개발자용 요청 로그는 꺼져 있습니다. Cloudflare가 별도로 처리하는 보안 기록의 보관기간과 D1 복구 데이터의 처리 위치는 확인 중입니다. Cloudflare 관련 문의는 privacyquestions@cloudflare.com으로 보낼 수 있습니다.',
          '문의 이메일은 네이버 메일로 받습니다. 온라인 계정 연결과 기록 전송을 원하지 않으면 Google 로그인 및 온라인 기록 등록을 선택하지 않고 기기에서 게임을 계속 이용할 수 있습니다. 온라인 연결 가능 여부를 확인하는 요청과 문의 이메일의 처리는 위 안내와 아래 보관 기준을 따릅니다.'
        ] },
        { heading: '보관 범위와 만료', paragraphs: [
          '월별 상세는 등록한 최근 3회차, 회차당 최대 252개월을 보관합니다. 최종 결과는 최근 20개와 개인 최고, 그리고 전체 순위에 해당하는 계정별 최고 공개 결과를 보관합니다. 상위 100명에 들지 않아도 해당 공개 최고 결과를 보존합니다. 개수 제한에 따른 정리는 새 기록을 저장할 때 실행합니다. 상세가 정리된 회차의 식별 정보와 시작 조건은 개별 회차 또는 계정 삭제 전까지 남습니다.',
          `인증 요청은 5분, 일반 로그인 세션은 최대 30일, 삭제 전용 인증 토큰은 ${rules.deletionTokenMinutes}분 동안 유효합니다. 요청 제한용 임시 정보의 기본 유효기간은 2분입니다. 만료된 항목은 일일 정리에서 삭제하며, 유효기간이 끝난 즉시 저장된 행이 삭제되는 것은 아닙니다. 계정 삭제 시 일반 세션과 삭제 전용 토큰도 함께 제거합니다. 미이용 기간만으로 계정이나 회차를 자동 삭제하는 기능은 현재 적용하지 않습니다.`,
          `신고 기록은 처리 중 보관하며, 운영자가 처리 완료로 표시한 시각부터 ${rules.reportRetentionDays}일 이내에 삭제합니다. 일일 정리는 완료 후 ${rules.reportCleanupAfterDays}일이 지난 신고를 대상으로 합니다. 완료 표시를 반복해도 최초 완료 시각은 연장되지 않습니다.`
        ] },
        { heading: '삭제와 안전한 관리', paragraphs: [
          '온라인 계정 삭제 시 계정 연결 정보·세션·회차·월별 기록·최종 결과·공개 결과·관련 신고를 운영 DB에서 삭제합니다. 개별 회차 삭제 후에는 재전송 방지용 계정·회차 번호를 31일간 유효하게 두고 정기 정리에서 삭제합니다. 계정 삭제 시 이 재전송 방지 정보도 삭제하지만, 임시 요청 제한 정보는 다음 정리까지 남을 수 있습니다.',
          `온라인 계정을 연결한 경우 앱의 보관 설정에서 Google 계정을 확인하고 온라인 계정 삭제를 요청할 수 있습니다. 삭제 요청에는 연령 확인이 필요하지 않습니다. 삭제 전용 인증은 ${rules.deletionTokenMinutes}분간 유효하며 삭제 버튼으로 다시 확인한 뒤 요청이 처리됩니다.`,
          `로그인할 수 없거나 앱을 삭제한 경우 ${facts.email}으로 삭제를 요청할 수 있습니다. 계정과 요청자의 소유 관계를 필요한 최소한의 정보로 확인하며 이메일 주소만으로 타인의 기록을 삭제하지 않습니다. Google 비밀번호·인증 코드·전체 토큰·신분증은 보내지 마세요. Google 계정 자체와 기기 저장·외부 게시물은 이 온라인 계정 삭제와 별개입니다.`,
          `통신에는 HTTPS를 사용하며 계정 인증과 접근 권한으로 개인 기록을 구분합니다. 기기 로그인 세션은 암호화하여 보관하도록 구현되어 있습니다. 운영 DB에서 삭제한 정보는 Workers Free 요금제의 Cloudflare D1 복구 이력에 최대 ${rules.d1RecoveryDays}일간 남을 수 있습니다.`,
          '웹에서도 아래 계정 삭제 요청 페이지를 통해 이메일로 요청할 수 있습니다.'
        ] },
        { heading: '온라인 이용 연령', paragraphs: [
          `온라인 계정 연결·기록 저장·순위 이용의 기준은 만 ${rules.minOnlineAge}세 이상입니다. Google 인증 전에 이용자가 기준 충족 여부를 직접 선택합니다. 미충족 또는 취소를 선택하면 인증과 기록 연결을 시작하지 않습니다. Google 계정 보유·로그인 성공이나 이 자기 확인을 독립적인 연령 증명으로 간주하지 않습니다.`,
          '연령 확인을 위해 생년월일·신분증을 입력하거나 이메일로 보내도록 요구하지 않습니다. 기준의 버전과 서버 확인 시각만 계정에 저장하며, 일반 게임 진행과 기존 온라인 계정 삭제 요청은 연령 자기 확인으로 막지 않습니다. 영어 홈페이지 제공이 모든 국가의 온라인 이용 요건 충족을 뜻하지는 않습니다.'
        ] },
        { heading: '문의 정보와 변경 안내', paragraphs: [
          `${facts.email}으로 직접 보내신 이메일 주소·문의 내용·첨부자료는 문의 응답과 문제 해결을 위해 처리합니다. 일반 문의는 처리 중 보관하고, 처리 완료 후 후속 응대를 위해 최대 ${rules.supportRetentionDays}일 보관한 뒤 삭제하는 기준으로 준비합니다. 받은메일·보낸메일·첨부자료와 별도로 내려받은 사본을 함께 정리합니다. 비밀번호나 인증 코드는 보내지 마세요.`,
          '진행 중인 분쟁이나 법률에 따른 별도 보존 사유가 있으면 해당 항목·근거·기간을 따로 정하고, 사유가 종료되면 삭제합니다. 현재 해당 사유가 없는 자료에 일괄 장기 보관기간을 붙이지 않습니다.',
          '개인정보 처리 방식이 달라지면 이 페이지에 적용일과 변경 내용을 안내합니다.'
        ] }
      ],
      reviewNotes: [
        '운영 D1 질의 응답의 주 인스턴스가 SIN(싱가포르)으로 확인되었습니다. 관할 제한이 없으므로 이 위치를 계약상 고정 위치로 안내하지 않습니다. Google 인증과 Cloudflare 처리위탁을 구분하여 나머지 처리 국가·수령자·항목·시점·방법·목적·기간·적용 근거를 확인합니다.',
        `문의 ${rules.supportRetentionDays}일·신고 ${rules.reportRetentionDays}일 기준은 확정되었습니다. 신고 완료일과 ${rules.reportCleanupAfterDays}일 경과 정리는 로컬 구현에 반영했으며, 실제 일일 실행·실패 대응을 검증해야 합니다. 메일 삭제 운영과 7일 복구 이력에서의 삭제 재적용도 확인 대상입니다.`,
        '새 문의처를 앱·온라인 서버·삭제 화면·스토어에 일치시키고, 실제 Google 로그인과 삭제 요청을 검증해야 합니다.',
        `만 ${rules.minOnlineAge}세 이상 연령 확인과 국가별 제공 범위를 실제 배포 설정에 맞춰 점검합니다. 수집·이용 및 국외 이전 근거에 필요한 고지·동의와 권리 행사 절차를 실제 데이터 흐름에 맞춰 완성합니다.`,
        '기존 오프라인 버전의 개인정보 문서를 그대로 대체하거나, 미확정 날짜를 시행일로 사용하지 않습니다.'
      ],
      sources: [
        { label: '회귀버튼 온라인 계정 삭제 요청', url: `${facts.domain}/ko/contact/#account-deletion` },
        { label: 'Google 개인정보처리방침', url: 'https://policies.google.com/privacy?hl=ko' },
        { label: 'Cloudflare 개인정보처리방침', url: 'https://www.cloudflare.com/privacypolicy/' },
        { label: 'Cloudflare 데이터센터 국가와 도시', url: 'https://www.cloudflare.com/network/' },
        { label: 'Cloudflare D1 데이터 위치', url: 'https://developers.cloudflare.com/d1/configuration/data-location/' },
        { label: 'Cloudflare D1 복구 이력 안내', url: 'https://developers.cloudflare.com/d1/reference/time-travel/' }
      ]
    },
    en: {
      title: content.en.policies.gamePrivacy,
      summary: 'The privacy policy for on-device storage in 회귀버튼 and the optional online records planned for version 0.50.4. The online records provisions apply once the feature becomes available.',
      sections: [
        { heading: 'Operator and contact', paragraphs: [
          `Individual developer ${facts.personName} develops ${facts.gameName} under the ${facts.brand} brand. Privacy questions and requests to access, correct, delete or stop processing information can be sent to ${facts.email}. Identity may be checked to the extent needed to handle a request.`,
          'This notice covers on-device storage and online records for the game. The website privacy notice covers website visits.'
        ] },
        { heading: 'On-device information and optional connection', paragraphs: [
          'Game names, settings, progress, choices, and images and videos for sharing are processed on the device. Clearing app data or uninstalling the app may remove local records. Files sent to other apps are managed separately through those services.',
          'The app sends a request to check whether online records are available. This request carries no game records, and the hosting service may process IP addresses and request information. Google sign-in alone does not send game records. When you review the nickname and public fields and consent to register a completed run in the Hall of Fame, the service stores monthly records and the final result, then displays the final result in the ranking. Online records cannot restore complete playable game progress.'
        ] },
        { heading: 'Online data and purposes', paragraphs: [
          'For Google sign-in or identity verification before deletion, the app sends a Google-issued ID token to the server over HTTPS. It may contain a Google account identifier, email address, name and profile picture URL. The server processes the token to verify it and does not retain the raw token, Google email, name or picture URL in the operational database. Account linking stores a transformed Google account identifier, service account ID, nickname, creation time, and session hashes and expiration times. We do not receive your Google password.',
          `For the online age self-declaration, the account stores the applicable rule version (${rules.agePolicyVersion}) and server confirmation time. These are updated during normal sign-in and removed with the account. This check does not collect a date of birth, identity document or real name.`,
          'To retain records and provide rankings, the service stores run IDs, game-rule and art versions, starting conditions, monthly in-game dates, cash, net worth, income and spending, final age, character, career, housing, badges, and creation and update times. Starting conditions include in-game age, gender, assets, housing, region, job, values, appearance mode, military status, romance settings and university choices. The feature does not request real bank accounts or real financial assets.',
          'Security and request limits use short-lived authentication challenges, request purposes, the age-rule version and time attached to normal sign-in, transformed connection IP addresses and per-account request counts. Deletion-only authentication stores a separate token hash, account ID, issue time and expiration time. Reports store the target, reporting account ID, reason, submission time and resolution time.'
        ] },
        { heading: 'Public display and providers', paragraphs: [
          'Monthly records and personal final results are available to the account that stored them. Other ranking participants receive your nickname, game character, final net worth and rank. Withdrawing publication removes that result from the ranking. Stored records remain private until you delete the run or account or the retention limits remove the records. The ranking displays each account’s best published result.',
          'Google authenticates the Google account you choose. 회귀버튼 uses the result to link your game account or verify a request to delete an existing account. Google’s own services are governed by the Google Privacy Policy.',
          'Cloudflare, Inc. provides Workers and D1 for availability checks, sign-in, online record storage and retrieval, rankings, reports and deletion requests. When a feature makes a request, the connection IP address and data for that request are sent over HTTPS. Workers run in a Cloudflare data center near where the request is received, so the processing location varies with the connection route. See Cloudflare’s network directory below for data center countries and cities.',
          'A query to the live D1 primary database identified Singapore (SIN, Asia-Pacific), and read replication is disabled. The storage location is not restricted to one country. Developer request logging is disabled on the live app server. The retention period of Cloudflare’s own security records and the location of D1 recovery data are still being verified. Cloudflare questions can be sent to privacyquestions@cloudflare.com.',
          'We receive enquiries through Naver Mail. You can continue playing on your device by choosing to skip Google sign-in and online record registration. Availability checks and email enquiries are handled as described in this notice.'
        ] },
        { heading: 'Retention and expiration', paragraphs: [
          'Monthly details cover the latest 3 registered runs, with up to 252 months per run. Final results include the latest 20, the personal best and the account’s best public result eligible for the overall ranking. That public best remains even outside the top 100. Count-based cleanup runs when new records are stored. Run identifiers and starting conditions remain until the individual run or account is deleted, even after monthly details are removed.',
          `Authentication challenges are valid for 5 minutes, normal sign-in sessions for up to 30 days, and deletion-only tokens for ${rules.deletionTokenMinutes} minutes. Temporary request-limit entries have a default validity of 2 minutes. Expired entries are removed by daily cleanup; expiry does not immediately remove the stored row. Account deletion also removes normal sessions and deletion-only tokens. Accounts and runs are not currently deleted automatically solely because of inactivity.`,
          `Reports are retained while being handled and deleted within ${rules.reportRetentionDays} days after the operator marks them resolved. Daily cleanup targets reports resolved at least ${rules.reportCleanupAfterDays} days earlier. Repeating the completion action does not extend the original resolution time.`
        ] },
        { heading: 'Deletion and safeguards', paragraphs: [
          'Deleting an online account removes its account-linking information, sessions, runs, monthly records, final and public results, and associated reports from the operational database. After deleting an individual run, account and run IDs used to prevent re-upload remain valid for 31 days and are removed by scheduled cleanup. Account deletion also removes these re-upload markers, but temporary request-limit entries may remain until the next cleanup.',
          `If you have linked an online account, verify your Google account in the app’s record settings to request deletion. Deletion requests do not require an age declaration. Deletion-only authentication is valid for ${rules.deletionTokenMinutes} minutes and you confirm deletion before the request is processed.`,
          `If you cannot sign in or have uninstalled the app, request deletion through ${facts.email}. Account ownership is checked using only information needed for the request; an email address alone is not authority to delete someone else’s records. Do not send Google passwords, verification codes, complete tokens or identity documents. Your Google account, on-device saves and external posts are separate from this online account deletion.`,
          `Communications use HTTPS, and authentication and access checks separate personal records. The implementation encrypts sessions stored on the device. Data deleted from the live database may remain in Cloudflare D1 recovery history for up to ${rules.d1RecoveryDays} days under the Workers Free plan.`,
          'You can also request deletion by email through the account deletion page linked below.'
        ] },
        { heading: 'Age eligibility for online features', paragraphs: [
          `Online account connection, record storage and rankings are intended for players aged ${rules.minOnlineAge} or older. Before Google authentication, players select whether they meet the threshold. Selecting that they do not qualify or cancelling prevents authentication and record connection from starting. A Google account, successful sign-in or this self-declaration is not treated as independent proof of age.`,
          'Players are not asked to enter or email a date of birth or identity document for this check. Only the rule version and server confirmation time are stored on the account. Normal gameplay and requests to delete an existing online account are not blocked by the age self-declaration. Providing an English website does not establish compliance with online-service requirements in every country.'
        ] },
        { heading: 'Contact information and changes', paragraphs: [
          `Email addresses, messages and attachments voluntarily sent to ${facts.email} are processed to answer questions and resolve issues. The agreed rule is to keep ordinary enquiries while being handled, then for follow-up for up to ${rules.supportRetentionDays} days after resolution before deletion. Received and sent messages, attachments and separately downloaded copies will be cleaned up together. Do not send passwords or verification codes.`,
          'If an ongoing dispute or a legal retention duty requires separate preservation, the affected data, grounds and period will be defined separately and the data deleted when that reason ends. No blanket extended retention is assigned to information without such a reason.',
          'If our processing practices change, we will post the effective date and changes on this page.'
        ] }
      ],
      reviewNotes: [
        'The live D1 query identified SIN (Singapore) as the primary instance. This database has no jurisdiction restriction, so the observed location is not contractually fixed. Distinguish Google authentication from Cloudflare processing and verify the remaining countries, recipients, data, timing, methods, purposes, periods and applicable grounds.',
        `The ${rules.supportRetentionDays}-day enquiry and ${rules.reportRetentionDays}-day report rules are confirmed. Resolution dates and cleanup after ${rules.reportCleanupAfterDays} days are included in the local implementation; verify actual daily execution and failure handling. Email-deletion operations and reapplication of deletion requests when restoring from the 7-day recovery history remain to be checked.`,
        'Align the new contact address across the app, online server, deletion page and store, and test actual Google sign-in and deletion requests.',
        `Check the minimum age of ${rules.minOnlineAge} and country-specific availability against actual distribution settings. Complete required notices, consent and rights-request procedures based on the actual data flows and processing and transfer grounds.`,
        'Do not automatically replace the existing offline-version policy or assign an unconfirmed effective date.'
      ],
      sources: [
        { label: 'Request deletion of your Hoegwi Button online account', url: `${facts.domain}/en/contact/#account-deletion` },
        { label: 'Google Privacy Policy', url: 'https://policies.google.com/privacy?hl=en' },
        { label: 'Cloudflare Privacy Policy', url: 'https://www.cloudflare.com/privacypolicy/' },
        { label: 'Cloudflare data center countries and cities', url: 'https://www.cloudflare.com/network/' },
        { label: 'Cloudflare D1 data location', url: 'https://developers.cloudflare.com/d1/configuration/data-location/' },
        { label: 'Cloudflare D1 recovery history', url: 'https://developers.cloudflare.com/d1/reference/time-travel/' }
      ]
    }
  },
  'site-privacy': {
    ko: {
      title: content.ko.policies.sitePrivacy,
      summary: '디테일룹 게임즈 홈페이지의 방문 정보와 이메일 문의를 어떻게 처리하는지 안내합니다.',
      sections: [
        { heading: '운영자와 적용 범위', paragraphs: [
          `개인 개발자 ${facts.personName}이 운영하는 ${facts.brandKo} 홈페이지의 방문과 이메일 문의에 적용됩니다. 개인정보 관련 문의와 요청은 ${facts.email}에서 받습니다.`
        ] },
        { heading: '홈페이지 방문', paragraphs: [
          '홈페이지에는 회원가입, 로그인, 문의 입력폼, 자체 쿠키, 광고·방문 분석 도구가 없습니다.',
          '페이지와 영상을 열면 접속 요청이 암호화된 연결로 호스팅 제공업체 Cloudflare, Inc.에 전달됩니다. Cloudflare는 콘텐츠 전달, 접속 보호 및 장애 진단을 위해 IP 주소와 요청·브라우저·네트워크 관련 정보를 처리할 수 있습니다.',
          '영상 전송의 장애 진단을 위해 오류 로그와 Worker 호출의 약 1%를 표본으로 뽑은 처리 흐름 기록을 사용합니다. 자동 호출 로그는 끄고 진단 기록의 요청 URL에서 쿼리 문자열을 가립니다. Cloudflare 공식 문서에 따르면 Workers Free 로그는 3일, 처리 흐름 기록은 7일 보관됩니다.'
        ] },
        { heading: 'Cloudflare의 처리 지역과 보관', paragraphs: [
          'Cloudflare는 일반 개인정보처리방침에서 미국과 유럽경제지역을 주요 저장 지역으로 안내하며, 서비스 운영을 위해 다른 국가에서도 정보를 이전하거나 접근할 수 있다고 설명합니다. 이 홈페이지의 요청·보안 정보에 적용되는 구체적인 처리 국가와 Cloudflare 자체 네트워크·보안 기록의 보관기간은 확인 중입니다.',
          'Cloudflare의 접속 처리는 페이지를 여는 데 필요합니다. 해당 처리를 원치 않으면 홈페이지와 영상을 열지 않을 수 있습니다. 처리 관련 문의는 privacyquestions@cloudflare.com 또는 홈페이지 운영자에게 보낼 수 있습니다.'
        ] },
        { heading: '이메일 문의', paragraphs: [
          `${facts.email} 링크를 누르면 이용자의 이메일 앱으로 연결되며, 홈페이지 자체가 문의 내용을 제출하지는 않습니다. 메일을 보내면 발신 이메일 주소, 본문, 첨부자료를 ${facts.personName}이 문의 응답과 문제 해결에 이용합니다.`,
          `문의는 네이버 메일로 받습니다. 후속 응대에 필요한 일반 문의는 처리 완료 후 최대 ${rules.supportRetentionDays}일 이내에 받은 메일, 답장, 첨부자료 및 내려받은 사본을 함께 삭제합니다. 법령에 따른 보존 의무가 있는 자료는 필요한 기간 동안 별도로 보관한 뒤 삭제합니다. 비밀번호나 인증 코드처럼 문의에 필요하지 않은 정보는 보내지 마세요.`
        ] },
        { heading: '외부 서비스와 이용자의 요청', paragraphs: [
          'Google Play 등 외부 링크를 통해 이동한 뒤에는 해당 서비스의 개인정보 안내가 적용됩니다.',
          `열람·정정·삭제·처리정지 요청은 ${facts.email}로 보내 주세요. 요청 처리에 필요한 범위에서 본인을 확인할 수 있습니다. 처리 방식이 바뀌거나 Cloudflare 관련 세부 정보가 확인되면 이 안내를 갱신합니다.`
        ] }
      ],
      reviewNotes: [],
      sources: [
        { label: 'Cloudflare 개인정보처리방침', url: 'https://www.cloudflare.com/privacypolicy/' },
        { label: 'Workers 로그 보관 안내', url: 'https://developers.cloudflare.com/workers/observability/logs/workers-logs/#pricing' },
        { label: 'Workers 처리 흐름 기록 보관 안내', url: 'https://developers.cloudflare.com/workers/observability/traces/#limits-and-pricing' }
      ]
    },
    en: {
      title: content.en.policies.sitePrivacy,
      summary: 'How Detailoop Games handles website visit information and email enquiries.',
      sections: [
        { heading: 'Operator and scope', paragraphs: [
          `This notice covers visits to the ${facts.brand} website and enquiries by email. The website is operated by individual developer ${facts.personName}. For privacy questions and requests, email ${facts.email}.`
        ] },
        { heading: 'Website visits', paragraphs: [
          'The website has no registration, sign-in, contact form, first-party cookies, advertising tools or visitor analytics.',
          'When you open a page or video, your request is sent over an encrypted connection to the hosting provider, Cloudflare, Inc. Cloudflare may process IP addresses and information about the request, browser and network to deliver content, protect connections and diagnose failures.',
          'For video troubleshooting, we use error logs and traces sampled from about 1% of Worker invocations. Automatic invocation logs are disabled, and query strings in diagnostic request URLs are redacted. Cloudflare documents retention of three days for Workers Free logs and seven days for traces.'
        ] },
        { heading: 'Cloudflare processing locations and retention', paragraphs: [
          'In its general privacy policy, Cloudflare identifies the United States and European Economic Area as its primary storage regions and describes possible transfers and access from other countries. The specific countries that handle this website’s requests and security information, and the retention periods for Cloudflare’s own network and security records, are still being verified.',
          'Cloudflare processes requests to deliver the site. You can avoid that processing by choosing not to open the site or its videos. Send questions to privacyquestions@cloudflare.com or to the website operator.'
        ] },
        { heading: 'Email enquiries', paragraphs: [
          `The ${facts.email} link opens the visitor’s email application; the website itself does not submit an enquiry. If you send a message, ${facts.personName} uses your sender address, message and attachments to respond and resolve issues.`,
          `We receive enquiries through Naver Mail. Within ${rules.supportRetentionDays} days after an ordinary enquiry is resolved, we delete the received message, replies, attachments and downloaded copies kept for follow-up. If the law requires retention, we keep the affected records separately for the required period and then delete them. Please leave out information the enquiry does not need, such as passwords and verification codes.`
        ] },
        { heading: 'External services and requests', paragraphs: [
          'When you follow a link to an external service such as Google Play, that service’s privacy notice applies.',
          `Email ${facts.email} to request access, correction, deletion or suspension of processing. We may verify your identity as needed to respond. We will update this notice if our practices change or further details about Cloudflare’s processing are confirmed.`
        ] }
      ],
      reviewNotes: [],
      sources: [
        { label: 'Cloudflare Privacy Policy', url: 'https://www.cloudflare.com/privacypolicy/' },
        { label: 'Workers log retention', url: 'https://developers.cloudflare.com/workers/observability/logs/workers-logs/#pricing' },
        { label: 'Workers trace retention', url: 'https://developers.cloudflare.com/workers/observability/traces/#limits-and-pricing' }
      ]
    }
  }
};
