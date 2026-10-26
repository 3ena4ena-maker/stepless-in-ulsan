import React, { useState, useRef, useEffect } from 'react';
import { useKtoCourseThumbs } from './services/ulsanTourApi';

type Lang = 'KR' | 'EN';
type MainTab = 'home' | 'courses' | 'schedule';
type CourseCategoryTab = 'itinerary' | 'gourmet' | 'attraction' | 'experience';
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
  badge: { KR: string; EN: string };
  title: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  stops: { KR: string[]; EN: string[] };
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
  tip: { KR: string; EN: string };
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
      KR: '고래박물관과 해저터널부터 단차 없는 대왕암 해송 데크길, 일산해변 오션뷰 카페까지 이어지는 울산 대표 당일치기 코스입니다.',
      EN: 'Experience the underwater dolphin tunnel, elevator-linked monorail, and a zero-step pine boardwalk along the East Sea.',
    },
    ktoThumbKeys: ['whaleMuseum', 'whaleEco', 'daewangam', 'ilsanBeach'],
    stops: {
      KR: ['장생포 고래박물관', '고래생태체험관', '대왕암공원 무장애데크', '일산해수욕장 카페'],
      EN: ['Jangsaengpo Whale Museum', 'Whale Eco Tunnel', 'Daewangam Boardwalk', 'Ilsan Beach Cafe'],
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
      KR: '부산에서 동해선 전철로 40분! 바퀴 빠짐 없는 십리대숲 평지 산책로와 무장애 전동관람차, 정원 앞 브런치를 즐기는 힐링 코스입니다.',
      EN: 'Arrive via the step-free Donghae Line and stroll through flat bamboo groves and flower meadows.',
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
      KR: '탁 트인 간절곶 소망우체통 평지 광장과 명선도 야간조명, 엘리베이터로 오르는 울산대교 전망대 노을을 만끽하는 감성 코스입니다.',
      EN: 'From the flat sunrise plaza of Ganjeolgot Cape to sparkling golden-hour views at Ulsan Bridge Observatory.',
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
      KR: 'KTX 울산역에서 출발해 실내 무계단 슬로프로 꾸며진 암각화박물관과 1층 입식 언양 한우불고기, 외고산 옹기마을을 둘러봅니다.',
      EN: 'Discover 7,000-year-old whale rock carvings in a ramp-equipped museum and savor authentic Eonyang Hanwoo Bulgogi.',
    },
    ktoThumbKeys: ['petroglyphMuseum', 'bangudae', 'eonyangBulgogi', 'onggiVillage'],
    stops: {
      KR: ['KTX 울산역', '울산암각화박물관', '언양불고기 거리', '외고산 옹기마을'],
      EN: ['KTX Ulsan Station', 'Petroglyph Museum', 'Eonyang Bulgogi Street', 'Oegosan Onggi Village'],
    },
  },

  // ==========================================
  // 2. 식도락 (gourmet) - 추후 목록 추가·편집 가능
  // ==========================================
  {
    id: 'gourmet-eonyang-hanwoo',
    category: 'gourmet',
    badge: { KR: '식도락 · 울산 대표 한우미식', EN: 'Gourmet · Signature Hanwoo' },
    title: {
      KR: '언양·봉계 한우불고기 특구 & KTX 로컬 미식 로드',
      EN: 'Eonyang Hanwoo Bulgogi & Local Dessert Trail',
    },
    desc: {
      KR: '신발을 벗지 않는 1층 평지 입식 테이블을 갖춘 언양 석쇠불고기 명가와 KTX 울산역 인근 대형 베이커리 카페를 잇는 식도락 코스입니다.',
      EN: 'Savor charcoal-grilled Eonyang Hanwoo Bulgogi at step-free 1F restaurants followed by local artisanal bakeries.',
    },
    ktoThumbKeys: ['eonyangBulgogi', 'coastalCafe'],
    stops: {
      KR: ['언양 한우불고기 거리', '언양전통시장 떡갈비', '자수정동굴 인근 대형카페'],
      EN: ['Eonyang Bulgogi Street', 'Eonyang Market Tteokgalbi', 'Spacious Garden Bakery'],
    },
  },
  {
    id: 'gourmet-ocean-seafood',
    category: 'gourmet',
    badge: { KR: '식도락 · 동해 해산물 & 오션뷰 카페', EN: 'Gourmet · East Sea Seafood & Cafe' },
    title: {
      KR: '방어진 가자미물회·장생포 고래빵 & 해안 카페 투어',
      EN: 'Bangeojin Seafood, Whale Bread & Oceanview Cafe Tour',
    },
    desc: {
      KR: '장생포 명물 고래빵 간식부터 방어진·일산해변의 신선한 활어회·물회, 그리고 간절곶·정자해변 1층 통창 오션뷰 카페까지 즐기는 미식 동선입니다.',
      EN: 'Taste warm whale-shaped pastries, fresh East Sea flounder mulhoe, and oceanfront specialty coffee.',
    },
    ktoThumbKeys: ['whaleVillage', 'ganjeolgotSeafood', 'coastalCafe'],
    stops: {
      KR: ['장생포 고래빵 본점', '방어진·일산 활어회센터', '정자·간절곶 오션뷰 카페', '신정시장 손칼국수 골목'],
      EN: ['Jangsaengpo Whale Bread', 'Bangeojin Seafood Center', 'Oceanview Coastal Cafe', 'Sinjeong Market Noodles'],
    },
  },

  // ==========================================
  // 3. 명소 (attraction) - 반구천을 누비다 등
  // ==========================================
  {
    id: 'attraction-bangucheon-program',
    category: 'attraction',
    badge: {
      KR: '명소 · 반구천 일원 문화·자연사 탐방 프로그램',
      EN: 'Attraction · Bangucheon Heritage & Nature Program',
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
    stops: {
      KR: ['울산암각화박물관 (출발)', '대곡리 반구대 암각화', '집청정 · 반구서원', '공룡발자국 화석'],
      EN: ['Ulsan Petroglyph Museum (Start)', 'Bangudae Petroglyphs', 'Jipcheongjeong & Banguseowon', 'Dinosaur Footprints'],
    },
  },
  {
    id: 'attraction-east-coast',
    category: 'attraction',
    badge: { KR: '명소 · 바다·해맞이 랜드마크', EN: 'Attraction · Coastal Landmarks' },
    title: {
      KR: '대왕암공원 · 간절곶 · 명선도 동해안 3대 명소',
      EN: 'Daewangam Park, Ganjeolgot & Myeongseondo Highlights',
    },
    desc: {
      KR: '백년 해송 숲과 기암괴석이 어우러진 대왕암공원 무장애 데크길, 한반도 첫 일출 간절곶 소망우체통, 신비로운 명선도까지 울산 핵심 해안 명소입니다.',
      EN: 'Explore Ulsan’s top three coastal landmarks equipped with wide wooden boardwalks and flat plazas.',
    },
    ktoThumbKeys: ['daewangam', 'daewangamBridge', 'ganjeolgot', 'ilsanBeach'],
    stops: {
      KR: ['대왕암공원 솔바람길', '일산해수욕장 평지해변', '간절곶 소망우체통 광장', '명선도 해안산책로'],
      EN: ['Daewangam Pine Trail', 'Ilsan Beach Promenade', 'Ganjeolgot Wish Postbox', 'Myeongseondo Island'],
    },
  },
  {
    id: 'attraction-garden-skyline',
    category: 'attraction',
    badge: { KR: '명소 · 국가정원 & 야경 전망대', EN: 'Attraction · National Garden & Skyline' },
    title: {
      KR: '태화강 국가정원 십리대숲 & 울산대교 전망대',
      EN: 'Taehwagang National Garden & Ulsan Bridge Observatory',
    },
    desc: {
      KR: '낮에는 초록빛 대나무 숲과 계절 꽃밭을 평지로 산책하고, 해 질 녘에는 엘리베이터를 타고 올라가 반짝이는 울산 스카이라인을 감상합니다.',
      EN: 'Walk through 100% flat bamboo groves by day and ride the elevator up Ulsan Bridge Observatory at sunset.',
    },
    ktoThumbKeys: ['taehwagangGarden', 'taehwaru', 'ulsanBridge'],
    stops: {
      KR: ['태화강 국가정원 초화원', '십리대숲 은하수길', '태화루 스카이워크', '울산대교 전망대'],
      EN: ['Taehwagang Flower Garden', 'Bamboo Starlight Path', 'Taehwaru Skywalk', 'Ulsan Bridge Observatory'],
    },
  },

  // ==========================================
  // 4. 체험 (experience) - 추후 목록 추가·편집 가능
  // ==========================================
  {
    id: 'experience-whale-monorail',
    category: 'experience',
    badge: { KR: '체험 · 고래생태·모노레일·전동차', EN: 'Experience · Whale Eco & Monorail' },
    title: {
      KR: '장생포 고래생태체험관 & 태화강 무장애 전동관람차',
      EN: 'Whale Underwater Tunnel, Monorail & Garden Electric Tram',
    },
    desc: {
      KR: '수중 해저터널 돌고래 관람과 엘리베이터 직결 장생포 모노레일 탑승, 태화강 국가정원 휠체어 리프트 전동관람차까지 온 가족이 즐기는 체험입니다.',
      EN: 'Meet dolphins in the underwater tunnel, ride the elevator-accessible monorail, and tour the garden by electric tram.',
    },
    ktoThumbKeys: ['whaleEco', 'whaleVillage', 'taehwagangGarden', 'ulsanZoo'],
    stops: {
      KR: ['고래생태체험관 해저터널', '장생포 모노레일 (엘리베이터)', '태화강 무장애 전동관람차', '울산대공원 동물원'],
      EN: ['Dolphin Underwater Tunnel', 'Jangsaengpo Monorail', 'Accessible Garden Tram', 'Ulsan Grand Park Zoo'],
    },
  },
  {
    id: 'experience-onggi-museum',
    category: 'experience',
    badge: { KR: '체험 · 전통옹기·실내 미디어아트', EN: 'Experience · Onggi Craft & Media Art' },
    title: {
      KR: '외고산 옹기마을 도자기 체험 & 장생포 문화창고 미디어아트',
      EN: 'Oegosan Onggi Pottery Workshop & Culture Depot Media Art',
    },
    desc: {
      KR: '비 오는 날이나 무더운 날에도 쾌적한 전 층 엘리베이터 복합문화공간(장생포 문화창고·울산시립미술관)과 전통 옹기 만들기 체험을 즐깁니다.',
      EN: 'Hands-on pottery making and immersive indoor media art galleries with full elevator access.',
    },
    ktoThumbKeys: ['onggiVillage', 'petroglyphMuseum', 'ulsanMuseum'],
    stops: {
      KR: ['외고산 옹기마을 공방체험', '장생포 문화창고 미디어아트', '울산암각화박물관 3D체험', '울산시립미술관'],
      EN: ['Onggi Pottery Workshop', 'Culture Depot Media Art', 'Petroglyph 3D Museum', 'Ulsan Art Museum'],
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
    ktoThumbKeys: ['whaleMuseum', 'whaleVillage'],
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
    tip: {
      KR: '무장애 팁: 동해선 망양역 1번 출구 엘리베이터 하차 후 마을 입구 평지 진입',
      EN: 'Step-free tip: Easy access from Donghae Line Mangyang Station Exit 1 elevator.',
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
    tip: {
      KR: '무장애 팁: 경화마사토 포장으로 밤에도 유모차·휠체어 바퀴 빠짐 없이 안전한 이동',
      EN: 'Step-free tip: Firm eco-paved bamboo paths ensure smooth rolling even at night.',
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
    tip: {
      KR: '무장애 팁: 태화강 둔치 평지 관람석 및 교통약자 전용 관람 구역 운영',
      EN: 'Step-free tip: Dedicated accessible viewing zones along the flat riverside plaza.',
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
      KR: '한반도에서 가장 먼저 해가 뜨는 간절곶 평지 광장에서 새해 소망 콘서트와 드론쇼를 감상합니다.',
      EN: 'Welcome the earliest sunrise on the Korean peninsula on a wide, step-free coastal plaza.',
    },
    tip: {
      KR: '무장애 팁: 장애인 주차장에서 소망우체통 해안데크까지 단차 0cm 직결',
      EN: 'Step-free tip: Zero-step connection from accessible parking to Wish Postbox deck.',
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
    tip: {
      KR: '무장애 팁: 은하수길 전 구간 경사 0° 평지 · 고래바다여행선 1층 휠체어 승선 지원',
      EN: 'Step-free tip: 0° flat starlight path & wheelchair boarding assistance on 1F cruise deck.',
    },
    ktoThumbKeys: ['whaleEco', 'taehwagangGarden'],
  },
];

// Parse pathname into MainTab + sub-category state
function parseRouteFromPathname(pathname: string): {
  tab: MainTab;
  courseCategory: CourseCategoryTab;
  scheduleFilter: ScheduleSeasonFilter;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/courses' || clean.startsWith('/courses/')) {
    const sub = clean.split('/')[2] as CourseCategoryTab | undefined;
    const validCategories: CourseCategoryTab[] = [
      'itinerary',
      'gourmet',
      'attraction',
      'experience',
    ];
    return {
      tab: 'courses',
      courseCategory: sub && validCategories.includes(sub) ? sub : 'itinerary',
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
      scheduleFilter: sub && validSeasons.includes(sub) ? sub : 'all_seasons',
    };
  }
  return {
    tab: 'home',
    courseCategory: 'itinerary',
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

          <div className="curated-flow">
            {course.stops[lang].map((stopName, idx) => (
              <React.Fragment key={stopName}>
                <span className="flow-step">
                  <span className="flow-num">{idx + 1}</span>
                  <span>{stopName}</span>
                </span>
                {idx < course.stops[lang].length - 1 && (
                  <span className="flow-arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
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
          ? '울산 여행 코스 추천 & 무장애 가이드 | STEPLESS IN ULSAN'
          : 'Step-Free Ulsan Travel Guide | STEPLESS IN ULSAN';
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

  const filteredCuratedCourses = CURATED_COURSES.filter(
    (c) => c.category === courseCategory,
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

          {/* 귀여운 일러스트로 안내하는 부산 → 울산 오는 3가지 방법 */}
          <section
            className="how-to-come"
            aria-label={
              lang === 'KR'
                ? '부산에서 울산으로 오는 3가지 방법'
                : '3 Ways to Get to Ulsan from Busan'
            }
          >
            <div className="sep" />
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
