import React, { useState, useRef, useEffect } from 'react';
import { useKtoCourseThumbs } from './services/ulsanTourApi';

type Lang = 'KR' | 'EN';
type MainTab = 'home' | 'courses' | 'schedule';
type CourseCategoryTab = 'itinerary' | 'gourmet' | 'attraction' | 'experience';
type GourmetSubTab = 'all' | 'cafe' | 'brunch' | 'restaurant' | 'dessert';
type ExperienceSubTab = 'all' | 'tour' | 'workshop' | 'museum' | 'activity';
type ScheduleSeasonFilter = 'all_seasons' | 'all' | 'spring' | 'summer' | 'autumn' | 'winter';

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

interface ProgramDetailRow {
  label: { KR: string; EN: string };
  value: { KR: string; EN: string };
}

interface CuratedCourseItem {
  id: string;
  category: CourseCategoryTab;
  gourmetSub?: Exclude<GourmetSubTab, 'all'>;
  experienceSub?: Exclude<ExperienceSubTab, 'all'>;
  badge: { KR: string; EN: string };
  title: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  stops?: { KR: string[]; EN: string[] };
  ktoThumbKeys: string[];
  programInfo?: ProgramDetailRow[];
  programNote?: { KR: string; EN: string };
}

interface UlsanScheduleItem {
  id: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  period: { KR: string; EN: string };
  title: { KR: string; EN: string };
  place: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  ktoThumbKeys: string[];
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
  // ==========================================
  // 1. 일정별 코스 (itinerary) - 기존 4대 추천 여행코스
  // ==========================================
  {
    id: 'course-whale-sea',
    category: 'itinerary',
    badge: { KR: '일정별 코스 · 당일치기 (고래·바다)', EN: 'Itinerary · Day Trip (Whale & Ocean)' },
    title: {
      KR: '장생포 고래문화특구 & 대왕암 솔바람 코스',
      EN: 'Jangsaengpo Whale Zone & Daewangam Pine Trail',
    },
    desc: {
      KR: '고래박물관과 해저터널부터 푸른 대왕암 해송 산책길, 일산해변 오션뷰 카페까지 이어지는 울산 대표 당일치기 코스입니다.',
      EN: 'Experience the underwater dolphin tunnel, monorail, and a scenic pine forest trail along the East Sea.',
    },
    ktoThumbKeys: ['whaleMuseum', 'whaleEco', 'daewangam', 'ilsanBeach'],
    stops: {
      KR: ['장생포 고래박물관', '고래생태체험관', '대왕암공원 해송산책로', '일산해수욕장 카페'],
      EN: ['Jangsaengpo Whale Museum', 'Whale Eco Tunnel', 'Daewangam Pine Trail', 'Ilsan Beach Cafe'],
    },
  },
  {
    id: 'course-bamboo-garden',
    category: 'itinerary',
    badge: { KR: '일정별 코스 · 반나절~당일 (국가정원)', EN: 'Itinerary · Half/Full Day (Garden)' },
    title: {
      KR: '동해선 태화강 국가정원 & 십리대숲 은하수길 코스',
      EN: 'Taehwagang National Garden & Bamboo Starlight Course',
    },
    desc: {
      KR: '부산에서 동해선 전철로 편하게 도착해 초록빛 십리대숲 산책로와 전동관람차, 정원 앞 브런치를 즐기는 힐링 코스입니다.',
      EN: 'Arrive via the Donghae Line and stroll through lush bamboo groves and seasonal flower meadows.',
    },
    ktoThumbKeys: ['taehwagangGarden', 'taehwagangRiver', 'taehwaru'],
    stops: {
      KR: ['동해선 태화강역', '태화강 국가정원 안내센터', '십리대숲 은하수길', '국가정원 카페거리'],
      EN: ['Taehwagang Station', 'National Garden Center', 'Bamboo Starlight Path', 'Garden Cafe Street'],
    },
  },
  {
    id: 'course-sunset-bridge',
    category: 'itinerary',
    badge: { KR: '일정별 코스 · 오후~야간 (노을·야경)', EN: 'Itinerary · Afternoon to Night (Sunset)' },
    title: {
      KR: '간절곶 해안광장 & 울산대교 골든아워 야경 코스',
      EN: 'Ganjeolgot Coastal Plaza & Ulsan Bridge Sunset Course',
    },
    desc: {
      KR: '탁 트인 간절곶 소망우체통 해안 광장과 명선도 야간조명, 울산대교 전망대 노을을 만끽하는 감성 코스입니다.',
      EN: 'From the coastal sunrise plaza of Ganjeolgot Cape to sparkling golden-hour views at Ulsan Bridge Observatory.',
    },
    ktoThumbKeys: ['ganjeolgot', 'coastalCafe', 'ulsanBridge'],
    stops: {
      KR: ['간절곶 소망우체통', '간절곶 해안 카페', '명선도 야간조명', '울산대교 전망대'],
      EN: ['Ganjeolgot Wish Postbox', 'Ganjeolgot Coastal Cafe', 'Myeongseondo Lights', 'Ulsan Bridge Observatory'],
    },
  },
  {
    id: 'course-heritage-food',
    category: 'itinerary',
    badge: { KR: '일정별 코스 · 1박 2일 (역사·미식)', EN: 'Itinerary · 2 Days 1 Night (Heritage)' },
    title: {
      KR: '반구대 암각화 박물관 & 언양불고기 미식 코스',
      EN: 'Bangudae Petroglyph Museum & Eonyang Bulgogi Course',
    },
    desc: {
      KR: 'KTX 울산역에서 출발해 선사시대 고래 바위그림을 만나는 암각화박물관과 언양 한우불고기, 외고산 옹기마을을 둘러봅니다.',
      EN: 'Discover 7,000-year-old whale rock carvings at the Petroglyph Museum and savor authentic Eonyang Hanwoo Bulgogi.',
    },
    ktoThumbKeys: ['petroglyphMuseum', 'bangudae', 'eonyangBulgogi', 'onggiVillage'],
    stops: {
      KR: ['KTX 울산역', '울산암각화박물관', '언양불고기 거리', '외고산 옹기마을'],
      EN: ['KTX Ulsan Station', 'Petroglyph Museum', 'Eonyang Bulgogi Street', 'Oegosan Onggi Village'],
    },
  },

  // ==========================================
  // 2. 식도락 (gourmet) - 장소 하나하나 개별 소개 (카페 / 브런치 / 음식점 / 디저트)
  // ==========================================
  // [2-1. 카페 (cafe)]
  {
    id: 'gourmet-cafe-siseon310',
    category: 'gourmet',
    gourmetSub: 'cafe',
    badge: { KR: '식도락 · 카페', EN: 'Gourmet · Cafe' },
    title: {
      KR: '시선310 간절곶점',
      EN: 'Siseon 310 Ganjeolgot',
    },
    desc: {
      KR: '간절곶 바다 바로 앞에 자리해 통창 너머로 푸른 동해 파도와 수평선을 한눈에 담을 수 있는 대형 오션뷰 베이커리 카페입니다.',
      EN: 'A spacious oceanfront bakery cafe right at Ganjeolgot Cape offering panoramic East Sea views through floor-to-ceiling windows.',
    },
    ktoThumbKeys: ['coastalCafe'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 간절곶1길 25-6',
          EN: '25-6, Ganjeolgot 1-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '특징', EN: 'Highlights' },
        value: {
          KR: '간절곶 앞바다 파노라마 오션뷰 · 야외 잔디 테라스 · 수제 베이커리 & 시그니처 커피',
          EN: 'Panoramic ocean views, outdoor lawn terrace, artisanal bakery & signature coffee',
        },
      },
    ],
  },
  {
    id: 'gourmet-cafe-orto',
    category: 'gourmet',
    gourmetSub: 'cafe',
    badge: { KR: '식도락 · 카페', EN: 'Gourmet · Cafe' },
    title: {
      KR: '오르토커피',
      EN: 'Orto Coffee',
    },
    desc: {
      KR: '울주군 서생면의 잔잔한 바다 풍경과 감각적인 정원 인테리어가 어우러져 여유롭게 커피를 즐기기 좋은 해안 카페입니다.',
      EN: 'A serene coastal cafe in Seosaeng-myeon blending warm garden interiors with peaceful ocean views.',
    },
    ktoThumbKeys: ['ortoCoffee'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 해맞이로 일원',
          EN: 'Haemaji-ro, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '특징', EN: 'Highlights' },
        value: {
          KR: '차분한 정원 & 오션뷰 포토존 · 스페셜티 핸드드립 · 수제 디저트',
          EN: 'Garden & oceanview photo zones, specialty drip coffee, and homemade desserts',
        },
      },
    ],
  },
  {
    id: 'gourmet-cafe-camonsi',
    category: 'gourmet',
    gourmetSub: 'cafe',
    badge: { KR: '식도락 · 카페', EN: 'Gourmet · Cafe' },
    title: {
      KR: '카몬시',
      EN: 'Camonsi Cafe',
    },
    desc: {
      KR: '이국적인 휴양지 감성의 인테리어와 진한 베트남식 연유라떼·코코넛커피를 맛볼 수 있는 울산 감성 카페입니다.',
      EN: 'An exotic resort-style cafe in Ulsan famous for rich Vietnamese condensed-milk lattes and coconut coffee.',
    },
    ktoThumbKeys: ['camonsiCafe'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 삼산동 일원',
          EN: 'Samsan-dong, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '특징', EN: 'Highlights' },
        value: {
          KR: '코코넛 스무디 커피 · 연유라떼 · 이국적인 실내외 테라스 공간',
          EN: 'Coconut smoothie coffee, condensed milk latte, and tropical-inspired terrace',
        },
      },
    ],
  },

  // [2-2. 브런치 (brunch)]
  {
    id: 'gourmet-brunch-lamerpanji',
    category: 'gourmet',
    gourmetSub: 'brunch',
    badge: { KR: '식도락 · 브런치', EN: 'Gourmet · Brunch' },
    title: {
      KR: '라메르판지',
      EN: 'La Mer Panji',
    },
    desc: {
      KR: '북구 판지해변 몽돌 바다 바로 앞에 위치한 초대형 오션뷰 브런치 & 베이커리 공간으로, 파도 소리를 들으며 브런치와 화덕피자를 즐길 수 있습니다.',
      EN: 'A grand oceanfront brunch & bakery space right on Panji Pebble Beach serving brunch platters and wood-fired pizza.',
    },
    ktoThumbKeys: ['lamerPanji'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 북구 판지1길 30 (판지해변)',
          EN: '30, Panji 1-gil, Buk-gu, Ulsan (Panji Beach)',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '오션뷰 브런치 플래터 · 화덕피자 · 파스타 · 천연발효 베이커리',
          EN: 'Oceanview brunch platters, wood-fired pizza, pasta & sourdough bakery',
        },
      },
    ],
  },
  {
    id: 'gourmet-brunch-heydining',
    category: 'gourmet',
    gourmetSub: 'brunch',
    badge: { KR: '식도락 · 브런치', EN: 'Gourmet · Brunch' },
    title: {
      KR: '헤이다이닝',
      EN: 'Hey Dining',
    },
    desc: {
      KR: '강동·정자 해안가에서 탁 트인 동해 바다를 바라보며 여유로운 브런치와 이탈리안 다이닝을 맛볼 수 있는 레스토랑입니다.',
      EN: 'A coastal dining & brunch restaurant overlooking Gangdong and Jeongja Beach.',
    },
    ktoThumbKeys: ['heyDining'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 북구 동해안로 일원 (강동·정자해변)',
          EN: 'Donghaean-ro, Buk-gu, Ulsan (Gangdong Beach)',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '해산물 파스타 · 브런치 플레이트 · 스테이크 & 리조또',
          EN: 'Seafood pasta, brunch plates, steak & risotto',
        },
      },
    ],
  },
  {
    id: 'gourmet-brunch-ricopasto',
    category: 'gourmet',
    gourmetSub: 'brunch',
    badge: { KR: '식도락 · 브런치', EN: 'Gourmet · Brunch' },
    title: {
      KR: '리코파스토',
      EN: 'Rico Pasto',
    },
    desc: {
      KR: '따스한 햇살이 들어오는 아늑한 공간에서 신선한 제철 재료로 만든 브런치와 생면 파스타를 선보이는 브런치 맛집입니다.',
      EN: 'A warm, sun-lit brunch bistro serving seasonal brunch plates and handmade pasta.',
    },
    ktoThumbKeys: ['ricopasto'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 도심 브런치 거리',
          EN: 'Downtown Ulsan',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '에그베네딕트 · 프렌치토스트 브런치 · 수제 파스타 & 뇨끼',
          EN: 'Eggs Benedict, French toast brunch, handmade pasta & gnocchi',
        },
      },
    ],
  },

  // [2-3. 음식점 (restaurant)]
  {
    id: 'gourmet-rest-eonyang-bulgogi',
    category: 'gourmet',
    gourmetSub: 'restaurant',
    badge: { KR: '식도락 · 음식점', EN: 'Gourmet · Restaurant' },
    title: {
      KR: '언양 한우불고기',
      EN: 'Eonyang Hanwoo Bulgogi',
    },
    desc: {
      KR: '얇게 썬 최상급 암소 한우를 특제 양념에 재워 참숯 석쇠에 구워내는 울산 언양 지역의 대표 향토 음식점입니다.',
      EN: 'Ulsan’s iconic culinary specialty featuring thinly sliced premium Hanwoo beef grilled over fragrant charcoal.',
    },
    ktoThumbKeys: ['eonyangBulgogi'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 언양읍 한우불고기 특구 (KTX 울산역 인접)',
          EN: 'Eonyang Hanwoo Bulgogi District, Ulju-gun, Ulsan (Near KTX Ulsan Stn.)',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '언양 참숯 석쇠 한우불고기 · 한우 육회 · 수제 떡갈비',
          EN: 'Charcoal-grilled Eonyang Hanwoo Bulgogi, Beef Tartare & Tteokgalbi',
        },
      },
    ],
  },
  {
    id: 'gourmet-rest-ganjeolgot-octopus',
    category: 'gourmet',
    gourmetSub: 'restaurant',
    badge: { KR: '식도락 · 음식점', EN: 'Gourmet · Restaurant' },
    title: {
      KR: '간절곶 돌문어 해물요리',
      EN: 'Ganjeolgot Stone Octopus Dining',
    },
    desc: {
      KR: '간절곶 해안가 인근에서 동해안의 싱싱한 돌문어와 전복, 해산물을 듬뿍 넣은 매콤한 돌문어 볶음과 해물전골을 맛볼 수 있는 해물 전문 음식점입니다.',
      EN: 'A coastal seafood restaurant near Ganjeolgot famous for tender East Sea stone octopus stir-fry and abalone hot pot.',
    },
    ktoThumbKeys: ['ganjeolgotOctopus'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 간절곶 해안 일원',
          EN: 'Ganjeolgot Coast, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '간절곶 돌문어 한상 · 해물전골 · 문어숙회',
          EN: 'Stone octopus platter, seafood hot pot & boiled octopus',
        },
      },
    ],
  },
  {
    id: 'gourmet-rest-bangeojin-seafood',
    category: 'gourmet',
    gourmetSub: 'restaurant',
    badge: { KR: '식도락 · 음식점', EN: 'Gourmet · Restaurant' },
    title: {
      KR: '방어진·간절곶 활어회 & 가자미물회',
      EN: 'Bangeojin Live Sashimi & Flounder Mulhoe',
    },
    desc: {
      KR: '울산 동해안 포구에서 당일 공수한 자연산 가자미로 만든 시원하고 새콤달콤한 울산식 물회와 싱싱한 모둠회를 즐기는 해산물 음식점입니다.',
      EN: 'Enjoy Ulsan-style chilled spicy flounder soup (Mulhoe) and fresh daily-caught East Sea sashimi.',
    },
    ktoThumbKeys: ['ganjeolgotSeafood'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 방어진항 · 울주군 서생면 해안가',
          EN: 'Bangeojin Port (Dong-gu) & Seosaeng Coast (Ulju-gun), Ulsan',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '울산식 자연산 가자미물회 · 제철 모둠 활어회 · 매운탕',
          EN: 'Wild flounder Mulhoe, seasonal live sashimi & spicy fish stew',
        },
      },
    ],
  },

  // [2-4. 디저트 (dessert)]
  {
    id: 'gourmet-dessert-papaandson',
    category: 'gourmet',
    gourmetSub: 'dessert',
    badge: { KR: '식도락 · 디저트', EN: 'Gourmet · Dessert' },
    title: {
      KR: '파파앤썬by랑콩뜨레',
      EN: 'Papa & Son by Rencontrer',
    },
    desc: {
      KR: '울산을 대표하는 제과명장 베이커리 랑콩뜨레의 디저트·베이커리 공간으로, 유기농 밀가루와 천연 발효종으로 구워낸 빵과 케이크를 만날 수 있습니다.',
      EN: 'An artisanal bakery & dessert house by Ulsan’s master baker Rencontrer, crafting organic sourdough pastries and cakes.',
    },
    ktoThumbKeys: ['papaAndSon'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 · 북구 일원',
          EN: 'Ulsan',
        },
      },
      {
        label: { KR: '대표디저트', EN: 'Desserts' },
        value: {
          KR: '망고무스 · 바게트 & 크루아상 · 수제 타르트 & 구움과자',
          EN: 'Mango mousse, croissants, handmade tarts & baked financiers',
        },
      },
    ],
  },
  {
    id: 'gourmet-dessert-bonmilk',
    category: 'gourmet',
    gourmetSub: 'dessert',
    badge: { KR: '식도락 · 디저트', EN: 'Gourmet · Dessert' },
    title: {
      KR: '본밀크 (BONMILK)',
      EN: 'BONMILK',
    },
    desc: {
      KR: '신선한 유기농 원유로 만든 진하고 부드러운 우유 소프트 아이스크림과 수제 요거트, 밀크티 등 우유 디저트를 전문으로 선보이는 디저트 가게입니다.',
      EN: 'A specialty farm-milk dessert shop serving rich organic soft-serve ice cream, handmade yogurt, and milk tea.',
    },
    ktoThumbKeys: ['bonMilk'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 간절곶 일원',
          EN: 'Ganjeolgot area, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '대표디저트', EN: 'Desserts' },
        value: {
          KR: '유기농 목장 우유 아이스크림 · 수제 그릭요거트 · 밀크 푸딩',
          EN: 'Organic farm-milk soft serve, handmade Greek yogurt & milk pudding',
        },
      },
    ],
  },

  // ==========================================
  // 3. 명소 (attraction) - 장소 하나하나 개별 소개
  // ==========================================
  {
    id: 'attraction-bangudae',
    category: 'attraction',
    badge: { KR: '명소 · 국보 문화유산', EN: 'Attraction · National Treasure' },
    title: {
      KR: '대곡리 반구대 암각화',
      EN: 'Bangudae Petroglyphs',
    },
    desc: {
      KR: '약 7,000년 전 신석기·청동기 시대 사람들이 대곡천 절벽 바위면에 고래와 바다동물, 사슴, 호랑이 등 300여 점의 그림을 새겨 넣은 세계적인 선사시대 바위그림 유적(국보)입니다.',
      EN: 'A 7,000-year-old prehistoric cliffside rock carving site (National Treasure) depicting over 300 whales, sea turtles, and land animals along Bangucheon Stream.',
    },
    ktoThumbKeys: ['bangudae'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 언양읍 반구대안길 285',
          EN: '285, Bangudaean-gil, Eonyang-eup, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '국보 대곡리 반구대 암각화 전망대 · 대곡천 숲길 산책로 · 집청정 & 반구서원',
          EN: 'Bangudae Petroglyphs Viewpoint, Daegokcheon Forest Trail, Jipcheongjeong & Banguseowon',
        },
      },
    ],
  },
  {
    id: 'attraction-daewangam',
    category: 'attraction',
    badge: { KR: '명소 · 해안공원', EN: 'Attraction · Coastal Park' },
    title: {
      KR: '대왕암공원',
      EN: 'Daewangam Park',
    },
    desc: {
      KR: '100년 넘은 해송 1만 5천여 그루가 우거진 솔바람 산책길과 동해 바다 위 신비로운 바위섬 대왕암이 어우러진 울산 대표 해안 명소입니다.',
      EN: 'Ulsan’s premier coastal park where a century-old forest of 15,000 sea pines meets dramatic East Sea rock formations.',
    },
    ktoThumbKeys: ['daewangam', 'daewangamPine'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 등대로 95 (일산동)',
          EN: '95, Deungdae-ro, Dong-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '해송림 산책로 · 대왕교 & 대왕암 바위섬 · 울기등대 · 수국 & 맥문동 꽃길',
          EN: 'Sea pine forest trail, Daewangam Rock Island, Ulgi Lighthouse & seasonal flower paths',
        },
      },
    ],
  },
  {
    id: 'attraction-taehwagang-garden',
    category: 'attraction',
    badge: { KR: '명소 · 국가정원', EN: 'Attraction · National Garden' },
    title: {
      KR: '태화강 국가정원 (십리대숲)',
      EN: 'Taehwagang National Garden (Simnidaesup Bamboo Grove)',
    },
    desc: {
      KR: '울산 도심을 가로지르는 태화강변을 따라 끝없이 펼쳐진 초록빛 십리대숲과 사계절 꽃이 피어나는 대한민국 제2호 국가정원입니다.',
      EN: 'Korea’s 2nd National Garden featuring the lush 4km Simnidaesup Bamboo Grove, seasonal flower meadows, and nightly starlight paths.',
    },
    ktoThumbKeys: ['taehwagangGarden', 'taehwagangRiver'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 중구 태화강국가정원길 154',
          EN: '154, Taehwagang-gukgajeongwon-gil, Jung-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '십리대숲 산책길 · 십리대숲 은하수길(야간 점등) · 대나무생태원 · 계절 초화원',
          EN: 'Simnidaesup Bamboo Grove, Starlight Night Path, Bamboo Eco Garden & Seasonal Meadows',
        },
      },
    ],
  },
  {
    id: 'attraction-ganjeolgot',
    category: 'attraction',
    badge: { KR: '명소 · 일출명소', EN: 'Attraction · Sunrise Cape' },
    title: {
      KR: '간절곶',
      EN: 'Ganjeolgot Cape',
    },
    desc: {
      KR: '한반도 육지에서 가장 먼저 해가 떠오르는 일출 명소로, 푸른 잔디 해안광장과 커다란 소망우체통, 하얀 간절곶 등대가 그림처럼 펼쳐집니다.',
      EN: 'The earliest sunrise spot on the Korean mainland, iconic for its giant red Wish Postbox, white lighthouse, and coastal lawn plaza.',
    },
    ktoThumbKeys: ['ganjeolgot', 'ganjeolgotSunrise'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 대송리 (간절곶 해맞이광장)',
          EN: 'Daesong-ri, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '소망우체통(실제 엽서 발송 가능) · 간절곶 등대 · 드라마하우스 해안산책로',
          EN: 'Giant Wish Postbox (working mail service), Ganjeolgot Lighthouse & Coastal Trail',
        },
      },
    ],
  },
  {
    id: 'attraction-ulsan-bridge',
    category: 'attraction',
    badge: { KR: '명소 · 야경전망대', EN: 'Attraction · Observatory' },
    title: {
      KR: '울산대교 전망대',
      EN: 'Ulsan Bridge Observatory',
    },
    desc: {
      KR: '해발 203m 화정산 정상에 우뚝 솟아 국내 최장 단경간 현수교인 울산대교와 울산만, 도심 야경을 360도 파노라마로 내려다보는 전망 명소입니다.',
      EN: 'Perched atop Mt. Hwajeong (203m), offering 360-degree panoramic sunset and night views of Ulsan Bridge and Ulsan Bay.',
    },
    ktoThumbKeys: ['ulsanBridge'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 봉수로 155-1',
          EN: '155-1, Bongsu-ro, Dong-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '360도 실내 전망대 · 야외 옥상 테라스 · 울산 7대 야경 조망 (입장료 무료)',
          EN: '360° indoor observatory, rooftop sunset terrace & sparkling night skyline (Free admission)',
        },
      },
    ],
  },
  {
    id: 'attraction-taehwaru',
    category: 'attraction',
    badge: { KR: '명소 · 전통누각', EN: 'Attraction · Historic Pavilion' },
    title: {
      KR: '태화루',
      EN: 'Taehwaru Pavilion',
    },
    desc: {
      KR: '진주 촉석루, 밀양 영남루와 함께 영남 3대 누각으로 꼽히는 울산의 대표 전통 누각으로, 태화강 절벽 위에서 시원한 강바람과 풍경을 감상할 수 있습니다.',
      EN: 'One of the Three Great Pavilions of Yeongnam, standing gracefully on a cliff overlooking the Taehwagang River.',
    },
    ktoThumbKeys: ['taehwaru'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 중구 태화로 300',
          EN: '300, Taehwa-ro, Jung-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '전통 목조 누각 마루 휴식 · 태화강 조망 스카이워크 · 역사문화 전시실',
          EN: 'Traditional wooden pavilion floor, river-view skywalk & history exhibition hall',
        },
      },
    ],
  },

  // ==========================================
  // 4. 체험 (experience) - 장소·프로그램 하나하나 개별 소개 (전체 / 투어 / 공방 / 미술관박물관 / 체험)
  // ==========================================
  // [4-1. 투어 (tour)]
  {
    id: 'experience-tour-bangucheon-program',
    category: 'experience',
    experienceSub: 'tour',
    badge: {
      KR: '체험 · 투어',
      EN: 'Experience · Tour',
    },
    title: {
      KR: '반구천을 누비다',
      EN: 'Exploring Bangucheon Stream (Guided Heritage Program)',
    },
    desc: {
      KR: '울산암각화박물관에서 출발하여 대곡리 반구대 암각화, 집청정, 반구서원, 공룡발자국 등 반구천 일원의 소중한 문화 및 자연사 자원을 함께 탐방하는 무료 해설 프로그램입니다.',
      EN: 'A free 70-minute guided exploration starting from Ulsan Petroglyph Museum through Bangudae Petroglyphs, Jipcheongjeong Pavilion, Banguseowon Confucian Academy, and Dinosaur Footprints.',
    },
    ktoThumbKeys: ['petroglyphMuseum', 'bangudae', 'banguseowon', 'dinoFootprints'],
    programInfo: [
      {
        label: { KR: '운영일정', EN: 'Schedule' },
        value: {
          KR: '운영기간: 상반기(2월~6월), 하반기(9월~11월) · 출발시간: 화~금 15:00 / 토~일 10:30, 15:00 · 소요시간: 약 70분',
          EN: 'Period: 1st Half (Feb–Jun), 2nd Half (Sep–Nov) · Departure: Tue–Fri 15:00 / Sat–Sun 10:30, 15:00 · Duration: Approx. 70 mins',
        },
      },
      {
        label: { KR: '답사내용', EN: 'Content' },
        value: {
          KR: '반구천 일원 문화 및 자연사 자원 탐방 (대곡리 반구대 암각화, 집청정, 반구서원, 공룡발자국 등)',
          EN: 'Cultural & natural history exploration around Bangucheon Stream (Bangudae Petroglyphs, Jipcheongjeong, Banguseowon, Dinosaur Footprints, etc.)',
        },
      },
      {
        label: { KR: '교육장소', EN: 'Venue' },
        value: {
          KR: '울산암각화박물관(출발 장소), 반구천 일원',
          EN: 'Ulsan Petroglyph Museum (Departure Point) & Bangucheon Stream area',
        },
      },
      {
        label: { KR: '참가대상', EN: 'Eligibility' },
        value: {
          KR: '초등학생 이상 누구나(미취학 아동 참여 불가) · 회당 20명 내외, 단체일 경우 인솔자 포함 최대 40명까지 가능',
          EN: 'Elementary school students & older (Preschoolers not permitted) · Around 20 per session (Up to 40 for groups including leader)',
        },
      },
      {
        label: { KR: '참가비', EN: 'Fee' },
        value: {
          KR: '무료',
          EN: 'Free',
        },
      },
      {
        label: { KR: '신청기간', EN: 'Application' },
        value: {
          KR: '상시',
          EN: 'Open year-round',
        },
      },
      {
        label: { KR: '신청방법', EN: 'Booking' },
        value: {
          KR: '전화(052-229-4794) 및 현장(울산암각화박물관 안내데스크) 예약',
          EN: 'Phone (052-229-4794) or On-site reservation at Ulsan Petroglyph Museum Info Desk',
        },
      },
    ],
    programNote: {
      KR: '※ 예약 취소 시에도 반드시 사전 연락 부탁드리며, 악천후 시에는 안전을 위해 일정이 조정될 수 있습니다.',
      EN: '※ Please notify us in advance if canceling a reservation. Schedules may be adjusted during inclement weather for safety.',
    },
  },
  {
    id: 'experience-tour-whale-village',
    category: 'experience',
    experienceSub: 'tour',
    badge: { KR: '체험 · 투어', EN: 'Experience · Tour' },
    title: {
      KR: '장생포 고래문화마을 (모노레일 투어)',
      EN: 'Jangsaengpo Whale Culture Village & Monorail Tour',
    },
    desc: {
      KR: '1960~70년대 장생포 포경 어촌의 정겨운 골목 풍경을 그대로 재현한 마을로, 장생포 모노레일을 타고 마을과 바다를 하늘 위에서 내려다보는 투어를 즐길 수 있습니다.',
      EN: 'Step back into a 1960s whaling village and ride the scenic monorail overlooking Jangsaengpo Port and the East Sea.',
    },
    ktoThumbKeys: ['whaleVillage'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 장생포고래로 244',
          EN: '244, Jangsaengpogorae-ro, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '투어포인트', EN: 'Highlights' },
        value: {
          KR: '장생포 옛마을 골목투어 · 장생포 순환 모노레일 탑승 · 고래광장 & 수국정원',
          EN: 'Retro village alley tour, panoramic monorail ride, Whale Plaza & Hydrangea Garden',
        },
      },
    ],
  },

  // [4-2. 공방 (workshop)]
  {
    id: 'experience-workshop-onggi-village',
    category: 'experience',
    experienceSub: 'workshop',
    badge: { KR: '체험 · 공방', EN: 'Experience · Workshop' },
    title: {
      KR: '외고산 옹기마을 도자기·옹기 공방',
      EN: 'Oegosan Onggi Village Pottery Workshop',
    },
    desc: {
      KR: '전국 최대 규모의 전통 옹기 집산지인 외고산 옹기마을에서 장인의 손길을 따라 직접 흙을 만지고 물레를 돌리며 나만의 도자기 컵·화분을 만들어보는 공방입니다.',
      EN: 'Korea’s largest traditional Onggi pottery village where visitors can shape their own clay cups and planters with master artisans.',
    },
    ktoThumbKeys: ['onggiVillage'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 온양읍 외고산3길 36 (동해선 망양역 인접)',
          EN: '36, Oegosan 3-gil, Onyang-eup, Ulju-gun, Ulsan (Near Mangyang Stn.)',
        },
      },
      {
        label: { KR: '공방내용', EN: 'Workshop' },
        value: {
          KR: '전통 옹기 물레 성형 · 나만의 흙 인형·화분 만들기 (옹기아카데미관 상시 운영)',
          EN: 'Pottery wheel shaping & handmade clay planter crafting at Onggi Academy',
        },
      },
    ],
  },

  // [4-3. 미술관박물관 (museum)]
  {
    id: 'experience-museum-petroglyph',
    category: 'experience',
    experienceSub: 'museum',
    badge: { KR: '체험 · 미술관박물관', EN: 'Experience · Museum & Art' },
    title: {
      KR: '울산암각화박물관',
      EN: 'Ulsan Petroglyph Museum',
    },
    desc: {
      KR: '고래 모양을 본뜬 독특한 건축물 안에서 국보 대곡리 반구대 암각화와 천전리 명문과 암각화의 실물 모형, 입체 영상을 생생하게 관람할 수 있는 전문 박물관입니다.',
      EN: 'A whale-inspired museum showcasing full-scale replicas and interactive 3D exhibits of the 7,000-year-old Bangudae Petroglyphs.',
    },
    ktoThumbKeys: ['petroglyphMuseum'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 두동면 반구대안길 254',
          EN: '254, Bangudaean-gil, Dudong-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '관람안내', EN: 'Visitor Info' },
        value: {
          KR: '화~일 09:00~18:00 (월요일 휴관) · 관람료 무료',
          EN: 'Tue–Sun 09:00–18:00 (Closed Mondays) · Free Admission',
        },
      },
    ],
  },
  {
    id: 'experience-museum-whale',
    category: 'experience',
    experienceSub: 'museum',
    badge: { KR: '체험 · 미술관박물관', EN: 'Experience · Museum & Art' },
    title: {
      KR: '장생포 고래박물관',
      EN: 'Jangsaengpo Whale Museum',
    },
    desc: {
      KR: '국내 유일의 고래 전문 박물관으로, 거대한 실물 브라이드고래·범고래 골격 표본과 해양 생태 전시, 어린이 고래체험실을 갖추고 있습니다.',
      EN: 'Korea’s only dedicated whale museum featuring giant real whale skeletons, marine history exhibits, and interactive halls.',
    },
    ktoThumbKeys: ['whaleMuseum'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 장생포고래로 244',
          EN: '244, Jangsaengpogorae-ro, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '관람안내', EN: 'Visitor Info' },
        value: {
          KR: '화~일 09:00~18:00 (월요일 휴관) · 실물 고래 골격 & 해양생태 전시',
          EN: 'Tue–Sun 09:00–18:00 (Closed Mondays) · Real whale skeletons & marine exhibits',
        },
      },
    ],
  },
  {
    id: 'experience-museum-ulsan',
    category: 'experience',
    experienceSub: 'museum',
    badge: { KR: '체험 · 미술관박물관', EN: 'Experience · Museum & Art' },
    title: {
      KR: '울산박물관',
      EN: 'Ulsan Museum',
    },
    desc: {
      KR: '울산대공원 입구에 자리 잡은 대표 역사박물관으로, 반구대 암각화 선사시대부터 대한민국 산업수도로 성장한 울산의 역사와 문화를 한눈에 만날 수 있습니다.',
      EN: 'Located at the entrance of Ulsan Grand Park, chronicling Ulsan’s journey from prehistoric rock art to modern industrial capital.',
    },
    ktoThumbKeys: ['ulsanMuseum'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 두왕로 277 (울산대공원 인접)',
          EN: '277, Duwang-ro, Nam-gu, Ulsan (Next to Ulsan Grand Park)',
        },
      },
      {
        label: { KR: '관람안내', EN: 'Visitor Info' },
        value: {
          KR: '화~일 09:00~18:00 (월요일 휴관) · 상설전시 관람료 무료',
          EN: 'Tue–Sun 09:00–18:00 (Closed Mondays) · Free Permanent Exhibition',
        },
      },
    ],
  },

  // [4-4. 체험 (activity)]
  {
    id: 'experience-activity-whale-eco',
    category: 'experience',
    experienceSub: 'activity',
    badge: { KR: '체험 · 체험', EN: 'Experience · Activity' },
    title: {
      KR: '고래생태체험관',
      EN: 'Whale Eco Experience Center',
    },
    desc: {
      KR: '우리나라 최초의 돌고래 수족관으로, 아치형 수중 해저터널을 걸으며 머리 위로 헤엄치는 돌고래와 바닷속 어류를 생생하게 관찰하는 체험관입니다.',
      EN: 'Walk through an arched underwater glass tunnel as dolphins and marine life swim right overhead.',
    },
    ktoThumbKeys: ['whaleEco'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 장생포고래로 248',
          EN: '248, Jangsaengpogorae-ro, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '체험내용', EN: 'Experience' },
        value: {
          KR: '해저터널 돌고래 생태관람 · 해양생물 수족관 · 4D 입체영상관',
          EN: 'Underwater dolphin tunnel, marine aquarium & 4D theater',
        },
      },
    ],
  },
  {
    id: 'experience-activity-daewangam-bridge',
    category: 'experience',
    experienceSub: 'activity',
    badge: { KR: '체험 · 체험', EN: 'Experience · Activity' },
    title: {
      KR: '대왕암공원 해상 출렁다리',
      EN: 'Daewangam Park Sea Suspension Bridge',
    },
    desc: {
      KR: '대왕암공원 해안 산책로 햇개비에서 수루방까지 바다 위 기암괴석 사이를 중간 지지대 없이 303m 길이로 연결한 아찔하고 시원한 해상 출렁다리 체험입니다.',
      EN: 'A thrilling 303m-long suspension bridge spanning directly over the crashing emerald waves and coastal cliffs of Daewangam Park.',
    },
    ktoThumbKeys: ['daewangamBridge'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 일산동 대왕암공원 내 해안산책로',
          EN: 'Inside Daewangam Park, Ilsan-dong, Dong-gu, Ulsan',
        },
      },
      {
        label: { KR: '이용안내', EN: 'Visitor Info' },
        value: {
          KR: '09:00~18:00 (매월 둘째 주 화요일 휴장) · 입장료 무료',
          EN: '09:00–18:00 (Closed 2nd Tue of each month) · Free Admission',
        },
      },
    ],
  },
  {
    id: 'experience-activity-ulsan-zoo',
    category: 'experience',
    experienceSub: 'activity',
    badge: { KR: '체험 · 체험', EN: 'Experience · Activity' },
    title: {
      KR: '울산대공원 동물원 & 생태여행관(나비원)',
      EN: 'Ulsan Grand Park Zoo & Butterfly Eco Center',
    },
    desc: {
      KR: '울산대공원 남문 일원에서 사막여우, 미어캣, 앵무새 등 귀여운 동물 친구들과 사계절 살아있는 나비가 날아다니는 나비식물원을 함께 만나는 자연 생태 체험 공간입니다.',
      EN: 'Meet fennec foxes, meerkats, and tropical parrots alongside a year-round live butterfly greenhouse inside Ulsan Grand Park.',
    },
    ktoThumbKeys: ['ulsanZoo', 'ulsanGrandPark'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 대공원로 94 (울산대공원 남문)',
          EN: '94, Daegongwon-ro, Nam-gu, Ulsan (South Gate of Ulsan Grand Park)',
        },
      },
      {
        label: { KR: '체험내용', EN: 'Experience' },
        value: {
          KR: '어린이 동물원 교감 관람 · 나비식물원 · 장미원 산책',
          EN: 'Zoo animal encounters, Butterfly Botanical Garden & Rose Garden walk',
        },
      },
    ],
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
      EN: 'Ulsan’s signature festival featuring parades, waterfront media art, and live music across harbor plazas.',
    },
    ktoThumbKeys: ['whaleMuseum', 'whaleVillage'],
  },
  {
    id: 'evt-taehwa-flower',
    season: 'spring',
    period: { KR: '매년 5월 (봄꽃) · 10월 (가을국화)', EN: 'May (Spring) & Oct (Chrysanthemum)' },
    title: { KR: '태화강 국가정원 봄꽃축제 & 가을 국화전', EN: 'Taehwagang National Garden Flower Festival' },
    place: { KR: '중구 태화강 국가정원 초화원·십리대숲', EN: 'Taehwagang National Garden' },
    desc: {
      KR: '봄에는 꽃양귀비·작약·수레국화가, 가을에는 노란 국화와 억새 물결이 정원을 가득 채웁니다.',
      EN: 'Millions of spring poppies, peonies, and autumn chrysanthemums along scenic riverside trails.',
    },
    ktoThumbKeys: ['taehwagangGarden', 'taehwagangRiver'],
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
    ktoThumbKeys: ['onggiVillage'],
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
    ktoThumbKeys: ['taehwagangGarden', 'whaleVillage'],
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
    ktoThumbKeys: ['taehwagangRiver', 'taehwaru'],
  },
  {
    id: 'evt-sunrise',
    season: 'winter',
    period: { KR: '매년 12월 31일 ~ 1월 1일 (상시 일출명소)', EN: 'Dec 31 – Jan 1 (Year-round Sunrise)' },
    title: { KR: '간절곶 해맞이 축전 & 명선도 야간 라이트쇼', EN: 'Ganjeolgot New Year Sunrise & Myeongseondo Lights' },
    place: { KR: '울주군 서생면 간절곶 해맞이광장 · 진하해수욕장', EN: 'Ganjeolgot Sunrise Plaza & Jinha Beach' },
    desc: {
      KR: '한반도에서 가장 먼저 해가 뜨는 간절곶 광장에서 새해 소망 콘서트와 드론쇼를 감상합니다.',
      EN: 'Welcome the earliest sunrise on the Korean peninsula at Ganjeolgot Coastal Plaza.',
    },
    ktoThumbKeys: ['ganjeolgotSunrise', 'ganjeolgot'],
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
    ktoThumbKeys: ['whaleEco', 'taehwagangGarden'],
  },
];

// Parse pathname into MainTab + sub-category state
function parseRouteFromPathname(pathname: string): {
  tab: MainTab;
  courseCategory: CourseCategoryTab;
  gourmetSub: GourmetSubTab;
  experienceSub: ExperienceSubTab;
  scheduleFilter: ScheduleSeasonFilter;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/courses' || clean.startsWith('/courses/')) {
    const parts = clean.split('/');
    const sub = parts[2] as CourseCategoryTab | undefined;
    const sub2 = parts[3] as string | undefined;
    const validCategories: CourseCategoryTab[] = [
      'itinerary',
      'gourmet',
      'attraction',
      'experience',
    ];
    const validGourmetSubs: GourmetSubTab[] = [
      'all',
      'cafe',
      'brunch',
      'restaurant',
      'dessert',
    ];
    const validExperienceSubs: ExperienceSubTab[] = [
      'all',
      'tour',
      'workshop',
      'museum',
      'activity',
    ];
    return {
      tab: 'courses',
      courseCategory: sub && validCategories.includes(sub) ? sub : 'itinerary',
      gourmetSub:
        sub === 'gourmet' && sub2 && validGourmetSubs.includes(sub2 as GourmetSubTab)
          ? (sub2 as GourmetSubTab)
          : 'all',
      experienceSub:
        sub === 'experience' &&
        sub2 &&
        validExperienceSubs.includes(sub2 as ExperienceSubTab)
          ? (sub2 as ExperienceSubTab)
          : 'all',
      scheduleFilter: 'all_seasons',
    };
  }
  if (clean === '/schedule' || clean.startsWith('/schedule/')) {
    const sub = clean.split('/')[2] as ScheduleSeasonFilter | undefined;
    const validSeasons: ScheduleSeasonFilter[] = [
      'all_seasons',
      'all',
      'spring',
      'summer',
      'autumn',
      'winter',
    ];
    return {
      tab: 'schedule',
      courseCategory: 'itinerary',
      gourmetSub: 'all',
      experienceSub: 'all',
      scheduleFilter: sub && validSeasons.includes(sub) ? sub : 'all_seasons',
    };
  }
  return {
    tab: 'home',
    courseCategory: 'itinerary',
    gourmetSub: 'all',
    experienceSub: 'all',
    scheduleFilter: 'all_seasons',
  };
}

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

interface KtoThumbnailRowProps {
  presetKeys: string[];
  fallbackKeyword?: string;
  lang: Lang;
}

function KtoThumbnailRow({ presetKeys, fallbackKeyword, lang }: KtoThumbnailRowProps) {
  const thumbs = useKtoCourseThumbs(presetKeys, fallbackKeyword);
  if (thumbs.length === 0) return null;

  return (
    <div
      className="kto-thumbs"
      aria-label={
        lang === 'KR'
          ? '한국관광공사 TourAPI 관광지 사진'
          : 'Korea Tourism Organization TourAPI Photos'
      }
    >
      {thumbs.map((thumb) => (
        <div key={thumb.contentId || thumb.imageUrl} className="kto-thumb-item">
          <img
            src={thumb.imageUrl}
            alt={thumb.label[lang]}
            className="kto-thumb-img"
            loading="lazy"
            onError={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) parent.style.display = 'none';
            }}
          />
          <span className="kto-thumb-caption">{thumb.label[lang]}</span>
        </div>
      ))}
    </div>
  );
}

interface CuratedCourseRowProps {
  course: CuratedCourseItem;
  isExpanded: boolean;
  onToggle: () => void;
  lang: Lang;
}

function CuratedCourseRow({
  course,
  isExpanded,
  onToggle,
  lang,
}: CuratedCourseRowProps) {
  const thumbs = useKtoCourseThumbs(course.ktoThumbKeys, course.title.KR);
  const mainThumb = thumbs[0];

  return (
    <article className="curated-item">
      <button
        type="button"
        className="course-title-btn"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <span className="course-title-left">
          {mainThumb && (
            <img
              src={mainThumb.imageUrl}
              alt={mainThumb.label[lang]}
              className="course-main-thumb"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="course-title-text">{course.title[lang]}</span>
        </span>
        <span className="course-toggle-mark" aria-hidden="true">
          ▾
        </span>
      </button>

      {isExpanded && (
        <div className="course-detail-panel">
          <p className="curated-desc">{course.desc[lang]}</p>

          <KtoThumbnailRow
            presetKeys={course.ktoThumbKeys}
            fallbackKeyword={course.title.KR}
            lang={lang}
          />

          {course.programInfo && course.programInfo.length > 0 && (
            <dl className="program-details">
              {course.programInfo.map((row) => (
                <React.Fragment key={row.label.KR}>
                  <dt className="program-dt">{row.label[lang]}</dt>
                  <dd className="program-dd">{row.value[lang]}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}

          {course.programNote && (
            <p className="program-note">{course.programNote[lang]}</p>
          )}

          {course.stops && course.stops[lang].length > 0 && (
            <div className="curated-flow">
              {course.stops[lang].map((stopName, idx) => (
                <React.Fragment key={stopName}>
                  <span className="flow-step">
                    <span className="flow-num">{idx + 1}</span>
                    <span>{stopName}</span>
                  </span>
                  {idx < course.stops![lang].length - 1 && (
                    <span className="flow-arrow">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function App() {
  const initialRoute = parseRouteFromPathname(window.location.pathname);

  const [lang, setLang] = useState<Lang>('KR');
  const [activeTab, setActiveTab] = useState<MainTab>(initialRoute.tab);

  // Home curation states
  const [selectedTasteIds, setSelectedTasteIds] = useState<string[]>([]);
  const [selectedCompanionIds, setSelectedCompanionIds] = useState<string[]>([]);
  const [selectedDurationId, setSelectedDurationId] = useState<string>('');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [showCourse, setShowCourse] = useState<boolean>(false);
  const [courseStops, setCourseStops] = useState<PlaceItem[]>([]);
  const [courseRenderKey, setCourseRenderKey] = useState<number>(0);

  // Tab 2 (추천 여행코스) category state: 일정별 코스 / 식도락 / 명소 / 체험
  const [courseCategory, setCourseCategory] = useState<CourseCategoryTab>(
    initialRoute.courseCategory,
  );
  // 식도락 하위 카테고리: 카페 / 브런치 / 음식점 / 디저트
  const [gourmetSub, setGourmetSub] = useState<GourmetSubTab>(
    initialRoute.gourmetSub,
  );
  // 체험 하위 카테고리: 전체 / 투어 / 공방 / 미술관박물관 / 체험
  const [experienceSub, setExperienceSub] = useState<ExperienceSubTab>(
    initialRoute.experienceSub,
  );
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Tab 3 (울산 주요일정표) filter state
  const [scheduleSeasonFilter, setScheduleSeasonFilter] =
    useState<ScheduleSeasonFilter>(initialRoute.scheduleFilter);

  const heroRef = useRef<HTMLElement | null>(null);
  const courseRef = useRef<HTMLElement | null>(null);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromPathname(window.location.pathname);
      setActiveTab(parsed.tab);
      setCourseCategory(parsed.courseCategory);
      setGourmetSub(parsed.gourmetSub);
      setExperienceSub(parsed.experienceSub);
      setExpandedCourseId(null);
      setScheduleSeasonFilter(parsed.scheduleFilter);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document.title dynamically for each distinct page URL
  useEffect(() => {
    if (activeTab === 'courses') {
      const categoryTitles: Record<CourseCategoryTab, { KR: string; EN: string }> = {
        itinerary: {
          KR: '울산 일정별 추천 여행코스 | STEPLESS IN ULSAN',
          EN: 'Ulsan Itinerary Courses | STEPLESS IN ULSAN',
        },
        gourmet: {
          KR: '울산 식도락 추천 여행코스 | STEPLESS IN ULSAN',
          EN: 'Ulsan Gourmet & Foodie Courses | STEPLESS IN ULSAN',
        },
        attraction: {
          KR: '울산 대표 명소 추천 여행코스 | STEPLESS IN ULSAN',
          EN: 'Ulsan Top Attractions | STEPLESS IN ULSAN',
        },
        experience: {
          KR: '울산 체험·문화 추천 여행코스 | STEPLESS IN ULSAN',
          EN: 'Ulsan Experiences & Museums | STEPLESS IN ULSAN',
        },
      };
      document.title = categoryTitles[courseCategory][lang];
    } else if (activeTab === 'schedule') {
      document.title =
        lang === 'KR'
          ? '울산 주요일정표 & 축제 안내 | STEPLESS IN ULSAN'
          : 'Ulsan Major Schedule & Festivals | STEPLESS IN ULSAN';
    } else {
      document.title =
        lang === 'KR'
          ? '울산 여행 코스 추천 | STEPLESS IN ULSAN'
          : 'Ulsan Travel Course Guide | STEPLESS IN ULSAN';
    }
  }, [activeTab, courseCategory, lang]);

  // Navigate to a specific URL path and sync state
  const navigateToPath = (path: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    const parsed = parseRouteFromPathname(path);
    setActiveTab(parsed.tab);
    setCourseCategory(parsed.courseCategory);
    setGourmetSub(parsed.gourmetSub);
    setExperienceSub(parsed.experienceSub);
    setExpandedCourseId(null);
    setScheduleSeasonFilter(parsed.scheduleFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const filteredCuratedCourses = CURATED_COURSES.filter((c) => {
    if (c.category !== courseCategory) return false;
    if (courseCategory === 'gourmet') {
      return gourmetSub === 'all' ? true : c.gourmetSub === gourmetSub;
    }
    if (courseCategory === 'experience') {
      return experienceSub === 'all' ? true : c.experienceSub === experienceSub;
    }
    return true;
  });

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
          onClick={(e) => navigateToPath('/', e)}
        >
          <span>STEPLESS</span>
          <span>IN ULSAN</span>
        </a>

        {/* Representative 3 Main Tabs with distinct URLs (/, /courses, /schedule) */}
        <nav
          className="main-tabs"
          aria-label={lang === 'KR' ? '대표 메뉴 탭' : 'Main Navigation Tabs'}
        >
          <a
            href="/"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            className="main-tab-btn"
            onClick={(e) => navigateToPath('/', e)}
          >
            {lang === 'KR' ? '홈' : 'Home'}
          </a>
          <a
            href="/courses"
            aria-current={activeTab === 'courses' ? 'page' : undefined}
            className="main-tab-btn"
            onClick={(e) => navigateToPath('/courses', e)}
          >
            {lang === 'KR' ? '추천 여행코스' : 'Recommended Courses'}
          </a>
          <a
            href="/schedule"
            aria-current={activeTab === 'schedule' ? 'page' : undefined}
            className="main-tab-btn"
            onClick={(e) => navigateToPath('/schedule', e)}
          >
            {lang === 'KR' ? '울산 주요일정표' : 'Ulsan Schedule'}
          </a>
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
          PAGE 1: 홈 (/)
         ========================================== */}
      {activeTab === 'home' && (
        <>
          {/* 1. 상단: 부산 → 울산 오는 3가지 방법 */}
          <section
            className="how-to-come"
            aria-label={
              lang === 'KR'
                ? '부산에서 울산으로 오는 3가지 방법'
                : '3 Ways to Get to Ulsan from Busan'
            }
          >
            <h2 className="how-title">
              {lang === 'KR'
                ? '부산에서 울산, 어떻게 올까요?'
                : 'How to Get to Ulsan from Busan?'}
            </h2>
            <p className="how-sub">
              {lang === 'KR'
                ? '출발지와 여행 코스에 맞춰 가장 편한 방법을 골라보세요!'
                : 'Pick the easiest way to hop over from Busan to Ulsan!'}
            </p>

            <div className="how-grid">
              {/* 1. KTX (부산역 -> 울산역) */}
              <div className="how-item">
                <svg
                  className="how-doodle"
                  viewBox="0 0 130 90"
                  role="img"
                  aria-label="KTX 고속열차 일러스트"
                >
                  <g className="fl">
                    {/* Speed lines */}
                    <path
                      d="M8 38 h10 M4 50 h14"
                      stroke="var(--line)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Mint Offset Shadow */}
                    <path
                      d="M26 64 L26 34 C26 26 34 22 48 22 L84 22 C102 22 116 38 118 54 C119 60 114 64 106 64 Z"
                      transform="translate(5 5)"
                      fill="var(--mint)"
                    />
                    {/* KTX Train Body */}
                    <path
                      d="M26 64 L26 34 C26 26 34 22 48 22 L84 22 C102 22 116 38 118 54 C119 60 114 64 106 64 Z"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                      strokeLinejoin="round"
                    />
                    {/* Mint Stripe */}
                    <path
                      d="M28 48 L114 48"
                      stroke="var(--mint)"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    {/* Windows */}
                    <rect
                      x="36"
                      y="29"
                      width="16"
                      height="11"
                      rx="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.3"
                    />
                    <rect
                      x="58"
                      y="29"
                      width="16"
                      height="11"
                      rx="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.3"
                    />
                    {/* Cute Eye & Smile & Rosy Cheek */}
                    <circle cx="94" cy="40" r="3.2" fill="var(--line)" />
                    <ellipse
                      cx="88"
                      cy="46"
                      rx="5"
                      ry="3.2"
                      fill="var(--blush)"
                      opacity="0.9"
                    />
                    <path
                      d="M95 54 Q101 59 107 54"
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    {/* Wheels */}
                    <circle
                      cx="44"
                      cy="66"
                      r="6.5"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                    <circle
                      cx="88"
                      cy="66"
                      r="6.5"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                  </g>
                </svg>
                <span className="how-badge">
                  {lang === 'KR' ? '부산역 → 울산역 (약 20분)' : 'Busan Stn. → Ulsan Stn. (20m)'}
                </span>
                <h3 className="how-name">
                  {lang === 'KR' ? 'KTX 타고 울산역 하차' : 'KTX to Ulsan Station'}
                </h3>
                <p className="how-desc">
                  {lang === 'KR'
                    ? '부산역에서 KTX를 타면 슈웅~ 눈 깜짝할 새 울산역에 도착해요!'
                    : 'Hop on the KTX at Busan Station and arrive at Ulsan Station in just 20 minutes!'}
                </p>
                <p className="how-tip">
                  {lang === 'KR'
                    ? '반구대 암각화 · 언양불고기 갈 때 딱!'
                    : 'Best for Bangudae Petroglyphs & Eonyang Bulgogi'}
                </p>
              </div>

              {/* 2. 동해선 광역전철 (부전·센텀·기장 -> 태화강역) */}
              <div className="how-item">
                <svg
                  className="how-doodle"
                  viewBox="0 0 130 90"
                  role="img"
                  aria-label="동해선 전철 일러스트"
                >
                  <g className="fl" style={{ animationDelay: '0.6s' }}>
                    {/* Pantograph on roof */}
                    <path
                      d="M56 22 L65 13 L74 22"
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Mint Offset Shadow */}
                    <rect
                      x="24"
                      y="22"
                      width="82"
                      height="42"
                      rx="12"
                      transform="translate(5 5)"
                      fill="var(--mint)"
                    />
                    {/* Metro Body */}
                    <rect
                      x="24"
                      y="22"
                      width="82"
                      height="42"
                      rx="12"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                    {/* Windows */}
                    <rect
                      x="33"
                      y="30"
                      width="17"
                      height="13"
                      rx="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.3"
                    />
                    <rect
                      x="56"
                      y="30"
                      width="17"
                      height="13"
                      rx="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.3"
                    />
                    {/* Cute Face on Right End */}
                    <circle cx="88" cy="38" r="3.2" fill="var(--line)" />
                    <ellipse
                      cx="82"
                      cy="45"
                      rx="5"
                      ry="3.2"
                      fill="var(--blush)"
                      opacity="0.9"
                    />
                    <path
                      d="M86 52 Q92 57 98 52"
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    {/* Wheels */}
                    <circle
                      cx="42"
                      cy="66"
                      r="6.5"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                    <circle
                      cx="88"
                      cy="66"
                      r="6.5"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                  </g>
                </svg>
                <span className="how-badge">
                  {lang === 'KR'
                    ? '부전·센텀·기장 → 태화강역'
                    : 'Bujeon / BEXCO → Taehwagang Stn.'}
                </span>
                <h3 className="how-name">
                  {lang === 'KR' ? '동해선 타고 태화강역 하차' : 'Donghae Line to Taehwagang'}
                </h3>
                <p className="how-desc">
                  {lang === 'KR'
                    ? '교통카드 찍고 동해선 전철 타면 울산 중심 태화강역에서 바로 내려요!'
                    : 'Tap your transit card on the Donghae Line and step right into downtown Ulsan!'}
                </p>
                <p className="how-tip">
                  {lang === 'KR'
                    ? '태화강 국가정원 · 장생포 · 대왕암 갈 때 최고!'
                    : 'Best for National Garden, Jangsaengpo & Daewangam'}
                </p>
              </div>

              {/* 3. 부산 노포역 시외·직행버스 */}
              <div className="how-item">
                <svg
                  className="how-doodle"
                  viewBox="0 0 130 90"
                  role="img"
                  aria-label="노포역 버스 일러스트"
                >
                  <g className="fl" style={{ animationDelay: '1.2s' }}>
                    {/* Little puff of happy exhaust */}
                    <circle
                      cx="14"
                      cy="56"
                      r="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.2"
                    />
                    {/* Mint Offset Shadow */}
                    <rect
                      x="24"
                      y="20"
                      width="84"
                      height="44"
                      rx="14"
                      transform="translate(5 5)"
                      fill="var(--mint)"
                    />
                    {/* Bus Body */}
                    <rect
                      x="24"
                      y="20"
                      width="84"
                      height="44"
                      rx="14"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                    {/* Side Mirror */}
                    <path
                      d="M108 32 Q115 32 115 40"
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    {/* Bus Windows */}
                    <rect
                      x="33"
                      y="28"
                      width="18"
                      height="14"
                      rx="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.3"
                    />
                    <rect
                      x="56"
                      y="28"
                      width="18"
                      height="14"
                      rx="4"
                      fill="var(--mint)"
                      stroke="var(--line)"
                      strokeWidth="2.3"
                    />
                    {/* Cute Bus Face */}
                    <circle cx="90" cy="37" r="3.2" fill="var(--line)" />
                    <ellipse
                      cx="84"
                      cy="45"
                      rx="5.2"
                      ry="3.4"
                      fill="var(--blush)"
                      opacity="0.9"
                    />
                    <path
                      d="M88 52 Q94 57 100 52"
                      fill="none"
                      stroke="var(--line)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    {/* Wheels */}
                    <circle
                      cx="44"
                      cy="66"
                      r="7"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                    <circle
                      cx="88"
                      cy="66"
                      r="7"
                      fill="var(--paper)"
                      stroke="var(--line)"
                      strokeWidth="2.8"
                    />
                  </g>
                </svg>
                <span className="how-badge">
                  {lang === 'KR' ? '부산 노포역 → 울산' : 'Busan Nopo Stn. → Ulsan'}
                </span>
                <h3 className="how-name">
                  {lang === 'KR' ? '노포역에서 버스 타고 오기' : 'Express Bus from Nopo Stn.'}
                </h3>
                <p className="how-desc">
                  {lang === 'KR'
                    ? '부산 1호선 노포역 종합버스터미널에서 버스를 타고 편하게 올 수 있어요!'
                    : 'Catch a comfortable bus directly from Busan Line 1 Nopo Station Terminal!'}
                </p>
                <p className="how-tip">
                  {lang === 'KR'
                    ? '배차 간격이 짧아 언제든 부릉부릉 출발!'
                    : 'Frequent departures for easy, flexible trips'}
                </p>
              </div>
            </div>
            <div className="sep" style={{ marginTop: '24px', marginBottom: '0' }} />
          </section>

          {/* 2. 큰 고래와 함께하는 '어떤 울산 여행을 원해요?' 코스 만들기 섹션 */}
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
          PAGE 2: 추천 여행코스 (/courses, /courses/gourmet, /courses/attraction, /courses/experience)
         ========================================== */}
      {activeTab === 'courses' && (
        <section
          className="tab-section"
          aria-label={lang === 'KR' ? '추천 여행코스' : 'Recommended Courses'}
        >
          <div className="blob" />
          <div style={{ width: '140px', marginBottom: '4px' }}>
            <svg viewBox="0 0 215 170" role="img" aria-label="결 고래">
              <WhaleInnerGroup mood="happy" />
            </svg>
          </div>

          <h1 className="ask-title">
            {lang === 'KR' ? '울산 추천 여행코스' : 'Recommended Ulsan Courses'}
          </h1>

          <nav
            className="group"
            aria-label={lang === 'KR' ? '추천 여행코스 카테고리' : 'Course Categories'}
          >
            {[
              {
                id: 'itinerary' as const,
                path: '/courses',
                KR: '일정별 코스',
                EN: 'By Schedule',
              },
              {
                id: 'gourmet' as const,
                path: '/courses/gourmet',
                KR: '식도락',
                EN: 'Gourmet',
              },
              {
                id: 'attraction' as const,
                path: '/courses/attraction',
                KR: '명소',
                EN: 'Attractions',
              },
              {
                id: 'experience' as const,
                path: '/courses/experience',
                KR: '체험',
                EN: 'Experiences',
              },
            ].map((cat) => (
              <a
                key={cat.id}
                href={cat.path}
                className="chip"
                aria-current={courseCategory === cat.id ? 'page' : undefined}
                onClick={(e) => navigateToPath(cat.path, e)}
              >
                {cat[lang]}
              </a>
            ))}
          </nav>

          {courseCategory === 'gourmet' && (
            <nav
              className="sub-group"
              aria-label={
                lang === 'KR' ? '식도락 세부 카테고리' : 'Gourmet Sub-categories'
              }
            >
              {[
                {
                  id: 'all' as const,
                  path: '/courses/gourmet',
                  KR: '전체',
                  EN: 'All',
                },
                {
                  id: 'cafe' as const,
                  path: '/courses/gourmet/cafe',
                  KR: '카페',
                  EN: 'Cafes',
                },
                {
                  id: 'brunch' as const,
                  path: '/courses/gourmet/brunch',
                  KR: '브런치',
                  EN: 'Brunch',
                },
                {
                  id: 'restaurant' as const,
                  path: '/courses/gourmet/restaurant',
                  KR: '음식점',
                  EN: 'Restaurants',
                },
                {
                  id: 'dessert' as const,
                  path: '/courses/gourmet/dessert',
                  KR: '디저트',
                  EN: 'Desserts',
                },
              ].map((sub) => (
                <a
                  key={sub.id}
                  href={sub.path}
                  className="sub-chip"
                  aria-current={gourmetSub === sub.id ? 'page' : undefined}
                  onClick={(e) => navigateToPath(sub.path, e)}
                >
                  {sub[lang]}
                </a>
              ))}
            </nav>
          )}

          {courseCategory === 'experience' && (
            <nav
              className="sub-group"
              aria-label={
                lang === 'KR' ? '체험 세부 카테고리' : 'Experience Sub-categories'
              }
            >
              {[
                {
                  id: 'all' as const,
                  path: '/courses/experience',
                  KR: '전체',
                  EN: 'All',
                },
                {
                  id: 'tour' as const,
                  path: '/courses/experience/tour',
                  KR: '투어',
                  EN: 'Tours',
                },
                {
                  id: 'workshop' as const,
                  path: '/courses/experience/workshop',
                  KR: '공방',
                  EN: 'Workshops',
                },
                {
                  id: 'museum' as const,
                  path: '/courses/experience/museum',
                  KR: '미술관박물관',
                  EN: 'Museums & Art',
                },
                {
                  id: 'activity' as const,
                  path: '/courses/experience/activity',
                  KR: '체험',
                  EN: 'Activities',
                },
              ].map((sub) => (
                <a
                  key={sub.id}
                  href={sub.path}
                  className="sub-chip"
                  aria-current={experienceSub === sub.id ? 'page' : undefined}
                  onClick={(e) => navigateToPath(sub.path, e)}
                >
                  {sub[lang]}
                </a>
              ))}
            </nav>
          )}

          <div className="sep" />

          <div className="curated-list">
            {filteredCuratedCourses.map((c) => (
              <CuratedCourseRow
                key={c.id}
                course={c}
                isExpanded={expandedCourseId === c.id}
                onToggle={() =>
                  setExpandedCourseId((prev) => (prev === c.id ? null : c.id))
                }
                lang={lang}
              />
            ))}
          </div>
        </section>
      )}

      {/* ==========================================
          PAGE 3: 울산 주요일정표 (/schedule, /schedule/:season)
         ========================================== */}
      {activeTab === 'schedule' && (
        <section
          className="tab-section"
          aria-label={lang === 'KR' ? '울산 주요일정표' : 'Ulsan Schedule'}
        >
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

          <nav className="group" aria-label={lang === 'KR' ? '일정 계절별 보기' : 'Schedule Seasons'}>
            {[
              { id: 'all_seasons' as const, path: '/schedule', KR: '전체 일정', EN: 'All Events' },
              { id: 'all' as const, path: '/schedule/all', KR: '연중 상시', EN: 'Year-Round' },
              { id: 'spring' as const, path: '/schedule/spring', KR: '봄 (5월)', EN: 'Spring' },
              {
                id: 'summer' as const,
                path: '/schedule/summer',
                KR: '여름 (7~8월)',
                EN: 'Summer',
              },
              {
                id: 'autumn' as const,
                path: '/schedule/autumn',
                KR: '가을 (9~10월)',
                EN: 'Autumn',
              },
              {
                id: 'winter' as const,
                path: '/schedule/winter',
                KR: '겨울·해맞이',
                EN: 'Winter Sunrise',
              },
            ].map((s) => (
              <a
                key={s.id}
                href={s.path}
                className="chip"
                aria-current={scheduleSeasonFilter === s.id ? 'page' : undefined}
                onClick={(e) => navigateToPath(s.path, e)}
              >
                {s[lang]}
              </a>
            ))}
          </nav>

          <div className="sep" />

          <div className="curated-list">
            {filteredSchedules.map((item) => (
              <article key={item.id} className="curated-item">
                <span className="curated-badge">{item.period[lang]}</span>
                <h2 className="curated-title">{item.title[lang]}</h2>
                <p className="curated-desc">{item.desc[lang]}</p>
                <KtoThumbnailRow
                  presetKeys={item.ktoThumbKeys}
                  fallbackKeyword={item.title.KR}
                  lang={lang}
                />
                <div className="schedule-meta">
                  <span>📍 {item.place[lang]}</span>
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
