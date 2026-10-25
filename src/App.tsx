import React, { useState, useRef } from 'react';

type Lang = 'KR' | 'EN';
type MainTab = 'home' | 'courses' | 'schedule';

interface PlaceItem {
  id: string;
  KR: string;
  EN: string;
}

interface TasteOption {
  id: string;
  KR: string;
  EN: string;
  places: PlaceItem[];
}

interface CompanionOption {
  id: string;
  KR: string;
  EN: string;
}

interface DurationOption {
  id: string;
  KR: string;
  EN: string;
  count: number;
}

interface CuratedCourseItem {
  id: string;
  theme: 'ocean' | 'garden' | 'night' | 'heritage';
  badge: { KR: string; EN: string };
  title: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  stops: { KR: string[]; EN: string[] };
}

interface UlsanScheduleItem {
  id: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  period: { KR: string; EN: string };
  title: { KR: string; EN: string };
  place: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  tip: { KR: string; EN: string };
}

const BODY_PATH =
  'M26 96 C26 58 58 36 98 36 C138 36 168 58 168 94 C168 126 138 146 98 146 C58 146 26 130 26 96Z';

const TASTE_OPTIONS: TasteOption[] = [
  {
    id: 'ocean',
    KR: '바다',
    EN: 'Ocean',
    places: [
      { id: 'daewangam', KR: '대왕암공원', EN: 'Daewangam Park' },
      { id: 'ganjeolgot', KR: '간절곶', EN: 'Ganjeolgot Cape' },
      { id: 'ilsan', KR: '일산해수욕장', EN: 'Ilsan Beach' },
      { id: 'jujeon', KR: '주전 몽돌해변', EN: 'Jujeon Pebble Beach' },
      { id: 'gangdong', KR: '강동 화암주상절리', EN: 'Hwaam Basalt Columns' },
    ],
  },
  {
    id: 'whale',
    KR: '고래와 생태',
    EN: 'Whale & Eco',
    places: [
      { id: 'whale-village', KR: '장생포 고래문화마을', EN: 'Whale Culture Village' },
      { id: 'whale-eco', KR: '고래생태체험관', EN: 'Whale Eco Experience' },
      { id: 'whale-museum', KR: '장생포 고래박물관', EN: 'Jangsaengpo Whale Museum' },
      { id: 'taehwa-eco', KR: '태화강 생태관', EN: 'Taehwagang Eco Center' },
      { id: 'grand-zoo', KR: '울산대공원 동물원', EN: 'Ulsan Grand Park Zoo' },
    ],
  },
  {
    id: 'cafe',
    KR: '카페',
    EN: 'Cafes',
    places: [
      { id: 'ganjeolgot-cafe', KR: '간절곶 해안 카페', EN: 'Ganjeolgot Coastal Cafe' },
      { id: 'taehwa-cafe', KR: '태화강 국가정원 카페', EN: 'Taehwagang Garden Cafe' },
      { id: 'jeongja-cafe', KR: '정자해변 오션뷰 카페', EN: 'Jeongja Oceanview Cafe' },
      { id: 'seongnam-cafe', KR: '성남동 감성 카페거리', EN: 'Seongnam Cafe Street' },
      { id: 'samsan-dessert', KR: '삼산동 디저트 골목', EN: 'Samsan Dessert Alley' },
    ],
  },
  {
    id: 'food',
    KR: '맛집',
    EN: 'Local Food',
    places: [
      { id: 'eonyang-bulgogi', KR: '언양불고기 거리', EN: 'Eonyang Bulgogi Street' },
      { id: 'whale-food', KR: '장생포 고래 거리', EN: 'Jangsaengpo Food Street' },
      { id: 'bangeojin', KR: '방어진 회센터', EN: 'Bangeojin Seafood Center' },
      { id: 'byeongyeong-makchang', KR: '병영 막창골목', EN: 'Byeongyeong Makchang Alley' },
      { id: 'samsan-food', KR: '삼산 미식거리', EN: 'Samsan Gourmet Street' },
    ],
  },
  {
    id: 'garden',
    KR: '숲과 정원',
    EN: 'Forest & Garden',
    places: [
      { id: 'taehwagang-garden', KR: '태화강 국가정원', EN: 'Taehwagang National Garden' },
      { id: 'bamboo-forest', KR: '십리대숲', EN: 'Simnidaesup Bamboo Grove' },
      { id: 'rose-garden', KR: '울산대공원 장미원', EN: 'Ulsan Grand Rose Garden' },
      { id: 'seonam-lake', KR: '선암호수공원', EN: 'Seonam Lake Park' },
      { id: 'alps-welcome', KR: '영남알프스 웰컴센터', EN: 'Yeongnam Alps Center' },
    ],
  },
  {
    id: 'history',
    KR: '역사와 문화',
    EN: 'History & Culture',
    places: [
      { id: 'bangudae', KR: '반구대 암각화', EN: 'Bangudae Petroglyphs' },
      { id: 'onggi-village', KR: '외고산 옹기마을', EN: 'Oegosan Onggi Village' },
      { id: 'ulsan-museum', KR: '울산박물관', EN: 'Ulsan Museum' },
      { id: 'byeongyeongseong', KR: '울산경상좌도병영성', EN: 'Byeongyeongseong Fortress' },
      { id: 'eonyang-eupseong', KR: '언양읍성', EN: 'Eonyang Eupseong Walled Town' },
    ],
  },
  {
    id: 'photo',
    KR: '사진 명소',
    EN: 'Photo Spots',
    places: [
      { id: 'ganjeolgot-lighthouse', KR: '간절곶 등대', EN: 'Ganjeolgot Lighthouse' },
      { id: 'daewangam-bridge', KR: '대왕암 출렁다리', EN: 'Daewangam Suspension Bridge' },
      { id: 'whale-monorail', KR: '장생포 모노레일', EN: 'Jangsaengpo Monorail' },
      { id: 'milkyway-path', KR: '십리대숲 은하수길', EN: 'Bamboo Starlight Path' },
      { id: 'myeongseondo', KR: '명선도', EN: 'Myeongseondo Island' },
    ],
  },
  {
    id: 'night',
    KR: '야경과 전망',
    EN: 'Night Views',
    places: [
      { id: 'ulsan-bridge', KR: '울산대교 전망대', EN: 'Ulsan Bridge Observatory' },
      { id: 'taehwaru', KR: '태화루 스카이워크', EN: 'Taehwaru Skywalk' },
      { id: 'hamwollu', KR: '함월루 야경', EN: 'Hamwollu Pavilion Night View' },
      { id: 'myeongseon-light', KR: '명선도 야간조명', EN: 'Myeongseondo Night Lights' },
      { id: 'ferris-wheel', KR: '울산 그랜드휠 관람차', EN: 'Ulsan Grand Ferris Wheel' },
    ],
  },
  {
    id: 'market',
    KR: '전통시장과 골목',
    EN: 'Markets & Alleys',
    places: [
      { id: 'sinjeong-market', KR: '신정시장 칼국수골목', EN: 'Sinjeong Market Noodle Alley' },
      { id: 'taehwa-market', KR: '태화종합시장', EN: 'Taehwa Traditional Market' },
      { id: 'jungang-night-market', KR: '중앙전통시장 야시장', EN: 'Jungang Night Market' },
      { id: 'youth-street', KR: '성남동 젊음의거리', EN: 'Seongnam Youth Street' },
      { id: 'namchang-market', KR: '남창 옹기종기시장', EN: 'Namchang Onggi Market' },
    ],
  },
  {
    id: 'indoor',
    KR: '실내와 전시',
    EN: 'Indoor & Art',
    places: [
      { id: 'art-museum', KR: '울산시립미술관', EN: 'Ulsan Art Museum' },
      { id: 'culture-depot', KR: '장생포 문화창고', EN: 'Jangsaengpo Culture Depot' },
      { id: 'petroglyph-museum', KR: '암각화박물관', EN: 'Petroglyph Museum' },
      { id: 'science-museum', KR: '울산과학관', EN: 'Ulsan Science Museum' },
      { id: 'fe01', KR: 'FE01 재생복합문화공간', EN: 'FE01 Upcycling Art Complex' },
    ],
  },
];

const COMPANION_OPTIONS: CompanionOption[] = [
  { id: 'solo', KR: '혼자', EN: 'Solo' },
  { id: 'friends', KR: '친구와', EN: 'With Friends' },
  { id: 'family', KR: '가족과', EN: 'With Family' },
  { id: 'partner', KR: '연인과', EN: 'With Partner' },
];

const DURATION_OPTIONS: DurationOption[] = [
  { id: 'half', KR: '가볍게 반나절', EN: 'Half-Day', count: 3 },
  { id: 'day', KR: '알차게 당일치기', EN: 'Day Trip', count: 4 },
  { id: '1night', KR: '여유롭게 1박 2일', EN: '2 Days 1 Night', count: 6 },
  { id: '2nights', KR: '느긋하게 2박 3일', EN: '3 Days 2 Nights', count: 8 },
];

const CURATED_COURSES: CuratedCourseItem[] = [
  {
    id: 'course-whale-sea',
    theme: 'ocean',
    badge: { KR: '고래와 바다 · 당일치기', EN: 'Whale & Ocean · Day Trip' },
    title: {
      KR: '장생포 고래문화특구 & 대왕암 솔바람 코스',
      EN: 'Jangsaengpo Whale Zone & Daewangam Pine Trail',
    },
    desc: {
      KR: '고래박물관과 해저터널부터 단차 없는 대왕암 해송 데크길, 일산해변 오션뷰 카페까지 이어지는 울산 대표 바다 코스입니다.',
      EN: 'Experience the underwater dolphin tunnel, elevator-linked monorail, and a zero-step pine boardwalk along the East Sea.',
    },
    stops: {
      KR: ['장생포 고래박물관', '고래생태체험관', '대왕암공원 무장애데크', '일산해수욕장 카페'],
      EN: ['Jangsaengpo Whale Museum', 'Whale Eco Tunnel', 'Daewangam Boardwalk', 'Ilsan Beach Cafe'],
    },
  },
  {
    id: 'course-bamboo-garden',
    theme: 'garden',
    badge: { KR: '숲과 정원 · 반나절~당일', EN: 'Forest & Garden · Half/Full Day' },
    title: {
      KR: '동해선 태화강 국가정원 & 십리대숲 은하수길 코스',
      EN: 'Taehwagang National Garden & Bamboo Starlight Course',
    },
    desc: {
      KR: '부산에서 동해선 전철로 40분! 바퀴 빠짐 없는 십리대숲 평지 산책로와 무장애 전동관람차, 정원 앞 브런치를 즐기는 힐링 코스입니다.',
      EN: 'Arrive via the step-free Donghae Line and stroll through flat bamboo groves and flower meadows.',
    },
    stops: {
      KR: ['동해선 태화강역', '태화강 국가정원 안내센터', '십리대숲 은하수길', '국가정원 카페거리'],
      EN: ['Taehwagang Station', 'National Garden Center', 'Bamboo Starlight Path', 'Garden Cafe Street'],
    },
  },
  {
    id: 'course-sunset-bridge',
    theme: 'night',
    badge: { KR: '야경과 전망 · 오후~저녁', EN: 'Sunset & Night View · Afternoon' },
    title: {
      KR: '간절곶 해안광장 & 울산대교 골든아워 야경 코스',
      EN: 'Ganjeolgot Coastal Plaza & Ulsan Bridge Sunset Course',
    },
    desc: {
      KR: '탁 트인 간절곶 소망우체통 평지 광장과 명선도 야간조명, 엘리베이터로 오르는 울산대교 전망대 노을을 만끽하는 감성 코스입니다.',
      EN: 'From the flat sunrise plaza of Ganjeolgot Cape to sparkling golden-hour views at Ulsan Bridge Observatory.',
    },
    stops: {
      KR: ['간절곶 소망우체통', '간절곶 해안 카페', '명선도 야간조명', '울산대교 전망대'],
      EN: ['Ganjeolgot Wish Postbox', 'Ganjeolgot Coastal Cafe', 'Myeongseondo Lights', 'Ulsan Bridge Observatory'],
    },
  },
  {
    id: 'course-heritage-food',
    theme: 'heritage',
    badge: { KR: '역사와 미식 · 1박 2일 추천', EN: 'History & Foodie · Weekend' },
    title: {
      KR: '반구대 암각화 박물관 & 언양불고기 미식 코스',
      EN: 'Bangudae Petroglyph Museum & Eonyang Bulgogi Course',
    },
    desc: {
      KR: 'KTX 울산역에서 출발해 실내 무계단 슬로프로 꾸며진 암각화박물관과 1층 입식 언양 한우불고기, 외고산 옹기마을을 둘러봅니다.',
      EN: 'Discover 7,000-year-old whale rock carvings in a ramp-equipped museum and savor authentic Eonyang Hanwoo Bulgogi.',
    },
    stops: {
      KR: ['KTX 울산역', '울산암각화박물관', '언양불고기 거리', '외고산 옹기마을'],
      EN: ['KTX Ulsan Station', 'Petroglyph Museum', 'Eonyang Bulgogi Street', 'Oegosan Onggi Village'],
    },
  },
];

const ULSAN_SCHEDULES: UlsanScheduleItem[] = [
  {
    id: 'evt-whale-fest',
    season: 'autumn',
    period: { KR: '매년 9월 말 ~ 10월', EN: 'Late Sep – Oct' },
    title: { KR: '울산고래축제 (장생포 고래문화특구)', EN: 'Ulsan Whale Festival (Jangsaengpo)' },
    place: { KR: '남구 장생포 고래문화마을·박물관 일원', EN: 'Jangsaengpo Whale Culture Zone' },
    desc: {
      KR: '고래 퍼레이드, 미디어아트 야간 퍼포먼스, 장생포 뮤직페스티벌이 펼쳐지는 울산 대표 가을 축제입니다.',
      EN: 'Ulsan’s signature festival featuring parades, waterfront media art, and live music across flat harbor plazas.',
    },
    tip: {
      KR: '무장애 팁: 고래박물관 광장 전 구간 평지 동선 · 모노레일 엘리베이터 상시 가동',
      EN: 'Step-free tip: Flat harbor plaza & full elevator access to the monorail.',
    },
  },
  {
    id: 'evt-taehwa-flower',
    season: 'spring',
    period: { KR: '매년 5월 (봄꽃) · 10월 (가을국화)', EN: 'May (Spring) & Oct (Chrysanthemum)' },
    title: { KR: '태화강 국가정원 봄꽃축제 & 가을 국화전', EN: 'Taehwagang National Garden Flower Festival' },
    place: { KR: '중구 태화강 국가정원 초화원·십리대숲', EN: 'Taehwagang National Garden' },
    desc: {
      KR: '봄에는 꽃양귀비·작약·수레국화가, 가을에는 노란 국화와 억새 물결이 평지 정원을 가득 채웁니다.',
      EN: 'Millions of spring poppies, peonies, and autumn chrysanthemums along 100% flat riverside trails.',
    },
    tip: {
      KR: '무장애 팁: 안내센터 휠체어·유모차 무료 대여 및 무장애 전동관람차 운행',
      EN: 'Step-free tip: Free wheelchair/stroller rental & accessible electric garden tram.',
    },
  },
  {
    id: 'evt-onggi',
    season: 'spring',
    period: { KR: '매년 5월 초', EN: 'Early May' },
    title: { KR: '울산옹기축제 (외고산 옹기마을)', EN: 'Ulsan Onggi Pottery Festival' },
    place: { KR: '울주군 온양읍 외고산 옹기마을 (동해선 망양역 인접)', EN: 'Oegosan Onggi Village (Near Mangyang Stn.)' },
    desc: {
      KR: '국내 최대 전통 옹기마을에서 흙 놀이 체험과 장인의 물레 시연, 옹기박물관 전시를 만날 수 있습니다.',
      EN: 'Hands-on clay workshops and traditional pottery exhibitions in Korea’s largest Onggi village.',
    },
    tip: {
      KR: '무장애 팁: 동해선 망양역 1번 출구 엘리베이터 하차 후 마을 입구 평지 진입',
      EN: 'Step-free tip: Easy access from Donghae Line Mangyang Station Exit 1 elevator.',
    },
  },
  {
    id: 'evt-bamboo-summer',
    season: 'summer',
    period: { KR: '매년 7월 ~ 8월 야간', EN: 'Jul – Aug Evenings' },
    title: { KR: '태화강 대숲납량축제 & 장생포 호러페스티벌', EN: 'Bamboo Grove Summer Night Festival' },
    place: { KR: '태화강 십리대숲 & 장생포 문화창고 일원', EN: 'Simnidaesup Bamboo Grove & Jangsaengpo' },
    desc: {
      KR: '시원한 강바람이 부는 대나무 숲 야간 산책과 여름밤 야외 공연, 푸드트럭 마켓이 열립니다.',
      EN: 'Cool riverside bamboo night walks, outdoor concerts, and summer night markets.',
    },
    tip: {
      KR: '무장애 팁: 경화마사토 포장으로 밤에도 유모차·휠체어 바퀴 빠짐 없이 안전한 이동',
      EN: 'Step-free tip: Firm eco-paved bamboo paths ensure smooth rolling even at night.',
    },
  },
  {
    id: 'evt-industrial',
    season: 'autumn',
    period: { KR: '매년 10월 중순', EN: 'Mid October' },
    title: { KR: '울산공업축제 & 태화강 낙화놀이', EN: 'Ulsan Industrial Festival & Fireflower Show' },
    place: { KR: '공업탑로터리 ~ 태화강 국가정원 남구 둔치', EN: 'Taehwagang Riverside & Downtown Ulsan' },
    desc: {
      KR: '화려한 거리 퍼레이드와 태화강 물 위를 수놓는 전통 낙화놀이, 대규모 드론·불꽃쇼가 펼쳐집니다.',
      EN: 'Grand street parades, traditional riverside fireflower illumination, and drone light shows.',
    },
    tip: {
      KR: '무장애 팁: 태화강 둔치 평지 관람석 및 교통약자 전용 관람 구역 운영',
      EN: 'Step-free tip: Dedicated accessible viewing zones along the flat riverside plaza.',
    },
  },
  {
    id: 'evt-sunrise',
    season: 'winter',
    period: { KR: '매년 12월 31일 ~ 1월 1일 (상시 일출명소)', EN: 'Dec 31 – Jan 1 (Year-round Sunrise)' },
    title: { KR: '간절곶 해맞이 축전 & 명선도 야간 라이트쇼', EN: 'Ganjeolgot New Year Sunrise & Myeongseondo Lights' },
    place: { KR: '울주군 서생면 간절곶 해맞이광장 · 진하해수욕장', EN: 'Ganjeolgot Sunrise Plaza & Jinha Beach' },
    desc: {
      KR: '한반도에서 가장 먼저 해가 뜨는 간절곶 평지 광장에서 새해 소망 콘서트와 드론쇼를 감상합니다.',
      EN: 'Welcome the earliest sunrise on the Korean peninsula on a wide, step-free coastal plaza.',
    },
    tip: {
      KR: '무장애 팁: 장애인 주차장에서 소망우체통 해안데크까지 단차 0cm 직결',
      EN: 'Step-free tip: Zero-step connection from accessible parking to Wish Postbox deck.',
    },
  },
  {
    id: 'evt-all-year',
    season: 'all',
    period: { KR: '연중 상시 (매주 화~일)', EN: 'Year-round (Tue – Sun)' },
    title: { KR: '장생포 고래바다여행선 & 십리대숲 은하수길 야간점등', EN: 'Whale Cruise & Bamboo Starlight Night Illumination' },
    place: { KR: '장생포항 선착장 · 태화강 십리대숲', EN: 'Jangsaengpo Port & Simnidaesup' },
    desc: {
      KR: '일몰 후 매일 밤 반딧불처럼 빛나는 십리대숲 은하수길(무료)과 동해 바다를 가르는 고래바다여행선이 상시 운영됩니다.',
      EN: 'Free nightly firefly illumination in the bamboo forest and scenic coastal whale cruises.',
    },
    tip: {
      KR: '무장애 팁: 은하수길 전 구간 경사 0° 평지 · 고래바다여행선 1층 휠체어 승선 지원',
      EN: 'Step-free tip: 0° flat starlight path & wheelchair boarding assistance on 1F cruise deck.',
    },
  },
];

interface WhaleSvgContentProps {
  mood: 'smile' | 'happy';
}

function WhaleInnerGroup({ mood }: WhaleSvgContentProps) {
  const isHappy = mood === 'happy';
  const mouthPath = isHappy
    ? 'M34 108 C48 126 74 128 90 108'
    : 'M34 108 C48 121 72 123 86 109';

  return (
    <g className="fl">
      {/* Water Spout */}
      <g fill="none" stroke="var(--water)" strokeWidth="3" strokeLinecap="round">
        <path d="M98 30 v-16" />
        <path d="M86 32 q-6 -6 -6 -14" />
        <path d="M110 32 q6 -6 6 -14" />
      </g>

      {/* Tail Stem Lines */}
      <path
        d="M158 98 C178 96 186 82 182 66 M164 116 C186 112 196 88 190 62"
        fill="none"
        stroke="var(--line)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Tail Fin */}
      <path
        d="M186 62 C172 64 164 52 166 38 C174 48 181 51 186 51 C191 51 198 48 206 38 C208 52 200 64 186 62Z"
        fill="var(--mint)"
        stroke="var(--line)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Mint Offset Shadow & Main Body */}
      <path d={BODY_PATH} transform="translate(7 7)" fill="var(--mint)" />
      <path d={BODY_PATH} fill="var(--paper)" stroke="var(--line)" strokeWidth="3" />

      {/* Side Fin */}
      <path
        d="M96 114 C108 112 124 122 124 136 C110 136 98 128 96 114Z"
        fill="none"
        stroke="var(--line)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Rosy Cheek */}
      <ellipse
        cx={isHappy ? 100 : 94}
        cy="104"
        rx="9.5"
        ry="6"
        fill="var(--blush)"
        opacity=".85"
      />

      {/* Eye */}
      {isHappy ? (
        <path
          d="M56 93 Q64 81 72 93"
          stroke="var(--line)"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <>
          <ellipse cx="64" cy="90" rx="6" ry="6.6" fill="var(--line)" />
          <circle cx="66" cy="87.6" r="2.2" fill="var(--paper)" />
          <circle cx="62" cy="92.4" r="1" fill="var(--paper)" opacity=".8" />
        </>
      )}

      {/* Smile */}
      <path
        d={mouthPath}
        stroke="var(--line)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>('KR');
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  // Home curation states
  const [selectedTasteIds, setSelectedTasteIds] = useState<string[]>([]);
  const [selectedCompanionIds, setSelectedCompanionIds] = useState<string[]>([]);
  const [selectedDurationId, setSelectedDurationId] = useState<string>('');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [showCourse, setShowCourse] = useState<boolean>(false);
  const [courseStops, setCourseStops] = useState<PlaceItem[]>([]);
  const [courseRenderKey, setCourseRenderKey] = useState<number>(0);

  // Tab 2 (여행코스 추천) filter state
  const [courseThemeFilter, setCourseThemeFilter] = useState<
    'all' | 'ocean' | 'garden' | 'night' | 'heritage'
  >('all');

  // Tab 3 (울산 주요일정표) filter state
  const [scheduleSeasonFilter, setScheduleSeasonFilter] = useState<
    'all_seasons' | 'all' | 'spring' | 'summer' | 'autumn' | 'winter'
  >('all_seasons');

  const heroRef = useRef<HTMLElement | null>(null);
  const courseRef = useRef<HTMLElement | null>(null);

  const toggleTaste = (tasteId: string) => {
    setSelectedTasteIds((prev) =>
      prev.includes(tasteId) ? prev.filter((t) => t !== tasteId) : [...prev, tasteId],
    );
  };

  const toggleCompanion = (companionId: string) => {
    setSelectedCompanionIds((prev) =>
      prev.includes(companionId)
        ? prev.filter((c) => c !== companionId)
        : [...prev, companionId],
    );
  };

  const toggleDuration = (durationId: string) => {
    setSelectedDurationId((prev) => (prev === durationId ? '' : durationId));
  };

  const handleBuildCourse = () => {
    setIsJumping(false);
    requestAnimationFrame(() => {
      setIsJumping(true);
    });

    const pickIds =
      selectedTasteIds.length > 0 ? selectedTasteIds : ['ocean', 'whale'];
    const durationObj = DURATION_OPTIONS.find((d) => d.id === selectedDurationId);
    const targetCount = durationObj ? durationObj.count : 4;

    const stops: PlaceItem[] = [];
    let i = 0;
    let more = true;
    while (stops.length < targetCount && more) {
      more = false;
      pickIds.forEach((tid) => {
        const tasteObj = TASTE_OPTIONS.find((t) => t.id === tid);
        const list = tasteObj ? tasteObj.places : [];
        const p = list[i];
        if (p && !stops.some((s) => s.id === p.id) && stops.length < targetCount) {
          stops.push(p);
        }
        if (list[i + 1]) {
          more = true;
        }
      });
      i++;
    }

    if (stops.length < targetCount) {
      for (const fallbackTaste of TASTE_OPTIONS) {
        for (const p of fallbackTaste.places) {
          if (!stops.some((s) => s.id === p.id) && stops.length < targetCount) {
            stops.push(p);
          }
        }
        if (stops.length >= targetCount) break;
      }
    }

    setCourseStops(stops);
    setCourseRenderKey((prev) => prev + 1);
    setShowCourse(true);

    setTimeout(() => {
      courseRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  };

  const handleRedo = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      setShowCourse(false);
    }, 500);
  };

  const whoObj = COMPANION_OPTIONS.find((c) => c.id === selectedCompanionIds[0]);
  const durObj = DURATION_OPTIONS.find((d) => d.id === selectedDurationId);
  const computedCourseTitle =
    lang === 'KR'
      ? [whoObj?.KR, durObj?.KR, '울산 코스'].filter(Boolean).join(' ')
      : [whoObj?.EN, durObj?.EN, 'Ulsan Course'].filter(Boolean).join(' · ');

  const n = courseStops.length;
  const svgHeight = n * 120 + 90;
  const pts: [number, number][] = courseStops.map((_, j) => [
    j % 2 ? 240 : 80,
    60 + j * 120,
  ]);

  let routePath = '';
  let wxEnd = 200;
  let lastY = 60;

  if (n > 0) {
    routePath = `M${pts[0][0]} ${pts[0][1]}`;
    for (let j = 1; j < n; j++) {
      const a = pts[j - 1];
      const b = pts[j];
      const my = (a[1] + b[1]) / 2;
      routePath += ` C${a[0]} ${my} ${b[0]} ${my} ${b[0]} ${b[1]}`;
    }
    const last = pts[n - 1];
    lastY = last[1];
    wxEnd = last[0] < 160 ? 200 : 120;
    routePath += ` C${last[0]} ${last[1] + 50} ${wxEnd} ${last[1] + 50} ${wxEnd} ${last[1] + 60}`;
  }

  const filteredCuratedCourses = CURATED_COURSES.filter((c) =>
    courseThemeFilter === 'all' ? true : c.theme === courseThemeFilter,
  );

  const filteredSchedules = ULSAN_SCHEDULES.filter((s) =>
    scheduleSeasonFilter === 'all_seasons' ? true : s.season === scheduleSeasonFilter,
  );

  return (
    <>
      <header className="top">
        <a
          href="/"
          className="stepless-logo"
          title={lang === 'KR' ? 'STEPLESS IN ULSAN 홈으로 이동' : 'Go to STEPLESS IN ULSAN Home'}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>STEPLESS</span>
          <span>IN ULSAN</span>
        </a>

        {/* Representative 3 Main Tabs */}
        <nav
          className="main-tabs"
          role="tablist"
          aria-label={lang === 'KR' ? '대표 메뉴 탭' : 'Main Navigation Tabs'}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'home'}
            className="main-tab-btn"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {lang === 'KR' ? '홈' : 'Home'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'courses'}
            className="main-tab-btn"
            onClick={() => {
              setActiveTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {lang === 'KR' ? '여행코스 추천' : 'Recommended Courses'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'schedule'}
            className="main-tab-btn"
            onClick={() => {
              setActiveTab('schedule');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {lang === 'KR' ? '울산 주요일정표' : 'Ulsan Schedule'}
          </button>
        </nav>

        <div className="lang-switch" role="group" aria-label="Language Switcher">
          <button
            type="button"
            className={`lang-btn ${lang === 'KR' ? 'active' : ''}`}
            onClick={() => setLang('KR')}
          >
            한국어
          </button>
          <span className="lang-divider">|</span>
          <button
            type="button"
            className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
            onClick={() => setLang('EN')}
          >
            English
          </button>
        </div>
      </header>

      {/* ==========================================
          TAB 1: 홈 (Interactive Whale Curation)
         ========================================== */}
      {activeTab === 'home' && (
        <>
          <section className="hero" id="hero" ref={heroRef}>
            <div className="blob" />
            <div
              className={`whale ${isJumping ? 'jump' : ''}`}
              id="heroWhale"
              onAnimationEnd={() => setIsJumping(false)}
            >
              <svg
                viewBox="0 0 215 170"
                role="img"
                aria-label={lang === 'KR' ? '결 고래' : 'Gyeol Whale'}
              >
                <WhaleInnerGroup mood="smile" />
              </svg>
            </div>

            <h1 className="ask-title">
              {lang === 'KR'
                ? '어떤 울산 여행을 원해요?'
                : 'What kind of Ulsan trip do you want?'}
            </h1>

            <fieldset
              className="group"
              id="g1"
              aria-label={lang === 'KR' ? '취향 10가지' : '10 Travel Vibes'}
            >
              {TASTE_OPTIONS.map((taste) => {
                const pressed = selectedTasteIds.includes(taste.id);
                return (
                  <button
                    key={taste.id}
                    type="button"
                    className="chip"
                    aria-pressed={pressed}
                    onClick={() => toggleTaste(taste.id)}
                  >
                    {taste[lang]}
                  </button>
                );
              })}
            </fieldset>

            <div className="sep" />

            <fieldset
              className="group"
              id="g2"
              aria-label={lang === 'KR' ? '누구와' : 'Companion'}
            >
              {COMPANION_OPTIONS.map((companion) => {
                const pressed = selectedCompanionIds.includes(companion.id);
                return (
                  <button
                    key={companion.id}
                    type="button"
                    className="chip"
                    aria-pressed={pressed}
                    onClick={() => toggleCompanion(companion.id)}
                  >
                    {companion[lang]}
                  </button>
                );
              })}
            </fieldset>

            <div className="sep" />

            <fieldset
              className="group"
              id="g3"
              aria-label={lang === 'KR' ? '일정 시간' : 'Trip Duration'}
            >
              {DURATION_OPTIONS.map((item) => {
                const pressed = selectedDurationId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="chip"
                    aria-pressed={pressed}
                    onClick={() => toggleDuration(item.id)}
                  >
                    {item[lang]}
                  </button>
                );
              })}
            </fieldset>

            <button type="button" className="go" id="go" onClick={handleBuildCourse}>
              {lang === 'KR' ? '내 코스 만들기' : 'Build My Course'}
            </button>
          </section>

          <section
            className={`course ${showCourse ? 'show' : ''}`}
            id="course"
            ref={courseRef}
          >
            <h2 id="ct">{computedCourseTitle}</h2>
            <div id="cm" key={courseRenderKey}>
              {n > 0 && (
                <svg viewBox={`0 0 320 ${svgHeight}`}>
                  <path
                    className="route"
                    d={routePath}
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {pts.map((p, j) => {
                    const isLeft = p[0] < 160;
                    const stop = courseStops[j];
                    return (
                      <g
                        key={stop.id}
                        className="stop"
                        style={{ animationDelay: `${0.3 + j * 0.25}s` }}
                      >
                        <circle
                          cx={p[0]}
                          cy={p[1]}
                          r="11"
                          fill="var(--mint)"
                          stroke="var(--line)"
                          strokeWidth="3.5"
                        />
                        <text
                          x={isLeft ? p[0] + 20 : p[0] - 20}
                          y={p[1] + 6}
                          textAnchor={isLeft ? 'start' : 'end'}
                          fontFamily="Gowun Dodum"
                          fontSize={lang === 'KR' ? '17' : '15'}
                          fill="var(--line)"
                        >
                          {stop[lang]}
                        </text>
                      </g>
                    );
                  })}
                  <g
                    className="stop"
                    style={{ animationDelay: `${0.3 + n * 0.25}s` }}
                  >
                    <svg
                      x={wxEnd - 48}
                      y={lastY + 54}
                      width="96"
                      height="76"
                      viewBox="0 0 215 170"
                    >
                      <WhaleInnerGroup mood="happy" />
                    </svg>
                  </g>
                </svg>
              )}
            </div>
            <button type="button" className="redo" id="redo" onClick={handleRedo}>
              {lang === 'KR' ? '다시 고르기' : 'Pick Again'}
            </button>
          </section>
        </>
      )}

      {/* ==========================================
          TAB 2: 여행코스 추천 (Recommended Courses)
         ========================================== */}
      {activeTab === 'courses' && (
        <section className="tab-section" aria-label={lang === 'KR' ? '여행코스 추천' : 'Recommended Courses'}>
          <div className="blob" />
          <div style={{ width: '140px', marginBottom: '4px' }}>
            <svg viewBox="0 0 215 170" role="img" aria-label="결 고래">
              <WhaleInnerGroup mood="happy" />
            </svg>
          </div>

          <h1 className="ask-title">
            {lang === 'KR' ? '울산 여행코스 추천' : 'Recommended Ulsan Courses'}
          </h1>
          <p className="tab-subtitle">
            {lang === 'KR'
              ? '계단과 턱 걱정 없이 편안하게 이어지는 울산 대표 4대 추천 코스예요.'
              : 'Four curated step-free itineraries connecting Ulsan’s signature spots.'}
          </p>

          <div className="group" role="tablist">
            {[
              { id: 'all' as const, KR: '전체 코스', EN: 'All' },
              { id: 'ocean' as const, KR: '고래와 바다', EN: 'Whale & Ocean' },
              { id: 'garden' as const, KR: '국가정원·대숲', EN: 'Garden & Bamboo' },
              { id: 'night' as const, KR: '야경·해맞이', EN: 'Sunset & Night' },
              { id: 'heritage' as const, KR: '역사·언양불고기', EN: 'History & Food' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                className="chip"
                aria-pressed={courseThemeFilter === filter.id}
                onClick={() => setCourseThemeFilter(filter.id)}
              >
                {filter[lang]}
              </button>
            ))}
          </div>

          <div className="sep" />

          <div className="curated-list">
            {filteredCuratedCourses.map((c) => (
              <article key={c.id} className="curated-item">
                <span className="curated-badge">{c.badge[lang]}</span>
                <h2 className="curated-title">{c.title[lang]}</h2>
                <p className="curated-desc">{c.desc[lang]}</p>
                <div className="curated-flow">
                  {c.stops[lang].map((stopName, idx) => (
                    <React.Fragment key={stopName}>
                      <span className="flow-step">
                        <span className="flow-num">{idx + 1}</span>
                        <span>{stopName}</span>
                      </span>
                      {idx < c.stops[lang].length - 1 && (
                        <span className="flow-arrow">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ==========================================
          TAB 3: 울산 주요일정표 (Ulsan Schedule)
         ========================================== */}
      {activeTab === 'schedule' && (
        <section className="tab-section" aria-label={lang === 'KR' ? '울산 주요일정표' : 'Ulsan Schedule'}>
          <div className="blob" />
          <div style={{ width: '140px', marginBottom: '4px' }}>
            <svg viewBox="0 0 215 170" role="img" aria-label="결 고래">
              <WhaleInnerGroup mood="smile" />
            </svg>
          </div>

          <h1 className="ask-title">
            {lang === 'KR' ? '울산 주요일정표' : 'Ulsan Major Schedule & Festivals'}
          </h1>
          <p className="tab-subtitle">
            {lang === 'KR'
              ? '계절별 울산 대표 축제와 연중 상시 야간개장·크루즈 일정을 확인하세요.'
              : 'Explore Ulsan’s seasonal festivals, night illuminations, and whale cruise schedules.'}
          </p>

          <div className="group" role="tablist">
            {[
              { id: 'all_seasons' as const, KR: '전체 일정', EN: 'All Events' },
              { id: 'all' as const, KR: '연중 상시', EN: 'Year-Round' },
              { id: 'spring' as const, KR: '봄 (5월)', EN: 'Spring' },
              { id: 'summer' as const, KR: '여름 (7~8월)', EN: 'Summer' },
              { id: 'autumn' as const, KR: '가을 (9~10월)', EN: 'Autumn' },
              { id: 'winter' as const, KR: '겨울·해맞이', EN: 'Winter Sunrise' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                className="chip"
                aria-pressed={scheduleSeasonFilter === s.id}
                onClick={() => setScheduleSeasonFilter(s.id)}
              >
                {s[lang]}
              </button>
            ))}
          </div>

          <div className="sep" />

          <div className="curated-list">
            {filteredSchedules.map((item) => (
              <article key={item.id} className="curated-item">
                <span className="curated-badge">{item.period[lang]}</span>
                <h2 className="curated-title">{item.title[lang]}</h2>
                <p className="curated-desc">{item.desc[lang]}</p>
                <div className="schedule-meta">
                  <span>📍 {item.place[lang]}</span>
                  <span>·</span>
                  <span>♿ {item.tip[lang]}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="minimal-footer">
        <span>© 2026 Stepless</span>
        <span>·</span>
        <a href="/about.html">{lang === 'KR' ? '서비스 소개' : 'About'}</a>
        <span>·</span>
        <a href="/privacy.html">{lang === 'KR' ? '개인정보처리방침' : 'Privacy Policy'}</a>
        <span>·</span>
        <a href="/terms.html">{lang === 'KR' ? '이용약관' : 'Terms'}</a>
        <span>·</span>
        <a href="mailto:floreur88@gmail.com">{lang === 'KR' ? '문의' : 'Contact'}</a>
      </footer>
    </>
  );
}
