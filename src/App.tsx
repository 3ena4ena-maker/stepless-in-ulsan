import React, { useState, useRef, useEffect } from 'react';
import {
  useKtoCourseThumbs,
  fetchLiveKtoPetSpots,
  getKtoThumbCaption,
} from './services/ulsanTourApi';
import {
  Lang,
  LANGUAGE_OPTIONS,
  UI_TEXT,
  getTasteCategoryLabel,
  getTastePlaceLabel,
  getCompanionLabel,
  getDurationLabel,
  getCourseTitle,
  getCourseDesc,
  getCourseBadge,
  getCourseShortTab,
  getCourseStops,
  getCourseProgramInfo,
  getCourseProgramNote,
  getItineraryStopField,
  getMapPinLabel,
  getScheduleField,
} from './i18n';
import { StampTourSection } from './components/StampTourSection';
import { supabase, isSupabaseConfigured } from './lib/supabase';
type MainTab = 'home' | 'courses' | 'schedule';
type CourseCategoryTab =
  | 'itinerary'
  | 'stamp'
  | 'pet'
  | 'gourmet'
  | 'attraction'
  | 'experience';
type PetSubTab = 'all' | 'walk' | 'park' | 'activity' | 'dining';
type GourmetSubTab = 'all' | 'cafe' | 'brunch' | 'restaurant' | 'dessert';
type AttractionSubTab = 'all' | 'nature' | 'coast' | 'heritage' | 'view';
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

interface ItineraryStopDetail {
  step: number;
  color: string;
  time: { KR: string; EN: string };
  title: { KR: string; EN: string };
  shortMapName: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  tip: { KR: string; EN: string };
  mapQuery: string;
  ktoThumbKeys: string[];
  x: number;
  y: number;
  dotX: number;
  dotY: number;
}

interface CuratedCourseItem {
  id: string;
  category: CourseCategoryTab;
  petSub?: Exclude<PetSubTab, 'all'>;
  gourmetSub?: Exclude<GourmetSubTab, 'all'>;
  attractionSub?: Exclude<AttractionSubTab, 'all'>;
  experienceSub?: Exclude<ExperienceSubTab, 'all'>;
  themeColor?: string;
  shortTab?: { KR: string; EN: string };
  badge: { KR: string; EN: string };
  title: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  stops?: { KR: string[]; EN: string[] };
  itineraryStops?: ItineraryStopDetail[];
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
  // 1. 일정별 코스 (itinerary) - 클릭 시 각 코스 전용 지도 페이지로 이동
  // ==========================================
  {
    id: 'course-whale-sea',
    category: 'itinerary',
    themeColor: '#3A7BB8',
    shortTab: { KR: '코스 1 · 고래·바다 당일', EN: 'Course 1 · Whale & Sea' },
    badge: { KR: '일정별 코스 01 · 당일치기 (고래·바다)', EN: 'Course 01 · Day Trip (Whale & Ocean)' },
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
      KR: ['장생포 고래박물관', '고래생태체험관 & 모노레일', '대왕암공원 해송산책로', '일산해수욕장 카페'],
      EN: ['Jangsaengpo Whale Museum', 'Whale Eco & Monorail', 'Daewangam Pine Trail', 'Ilsan Beach Cafe'],
    },
    itineraryStops: [
      {
        step: 1,
        color: '#3A7BB8',
        time: { KR: '오전 10:30 · 약 1시간', EN: '10:30 AM · 1 hr' },
        title: { KR: '장생포 고래박물관', EN: 'Jangsaengpo Whale Museum' },
        shortMapName: { KR: '장생포 고래박물관', EN: 'Whale Museum' },
        desc: {
          KR: '국내 유일의 고래 전문 박물관으로, 거대한 실물 브라이드고래 골격 표본과 해양 생태 전시를 엘리베이터·경사로로 편안하게 관람합니다.',
          EN: 'Korea’s only dedicated whale museum featuring giant real whale skeletons and step-free exhibition halls.',
        },
        tip: {
          KR: '무장애 포인트: 전 층 엘리베이터 및 완만한 경사로 완비 · 장애인 화장실 및 전용 주차구역 운영',
          EN: 'Accessibility: Full elevator access across all floors with gentle ramps and accessible restrooms.',
        },
        mapQuery: '울산 장생포 고래박물관',
        ktoThumbKeys: ['whaleMuseum'],
        x: 358,
        y: 492,
        dotX: 522,
        dotY: 368,
      },
      {
        step: 2,
        color: '#3B8C62',
        time: { KR: '낮 12:00 · 약 1시간 30분', EN: '12:00 PM · 1.5 hrs' },
        title: { KR: '고래생태체험관 & 장생포 모노레일', EN: 'Whale Eco Center & Monorail' },
        shortMapName: { KR: '고래생태체험관', EN: 'Whale Eco Center' },
        desc: {
          KR: '박물관 바로 옆 해저터널에서 바닷속 생태를 감상하고, 장생포 순환 모노레일을 타고 고래문화마을과 울산만 바다를 하늘 위에서 조망합니다.',
          EN: 'Walk through the curved underwater aquarium tunnel and ride the panoramic monorail above Jangsaengpo Port.',
        },
        tip: {
          KR: '동선 팁: 고래박물관 광장에서 도보 1분 거리로 바로 이어져 이동 부담이 전혀 없습니다.',
          EN: 'Route Tip: Located just a 1-minute flat walk across the plaza from the Whale Museum.',
        },
        mapQuery: '울산 고래생태체험관',
        ktoThumbKeys: ['whaleEco', 'whaleVillage'],
        x: 455,
        y: 318,
        dotX: 542,
        dotY: 352,
      },
      {
        step: 3,
        color: '#D48124',
        time: { KR: '오후 14:30 · 약 1시간 30분', EN: '2:30 PM · 1.5 hrs' },
        title: { KR: '대왕암공원 해송산책로', EN: 'Daewangam Park Sea Pine Trail' },
        shortMapName: { KR: '대왕암 해송산책로', EN: 'Daewangam Trail' },
        desc: {
          KR: '울산대교를 건너 동구 대왕암공원으로 이동해, 100년 넘은 해송 1만 5천여 그루가 그늘을 만들어주는 평탄한 솔바람 산책길을 거닙니다.',
          EN: 'Cross Ulsan Bridge to stroll along flat, shaded trails through 15,000 century-old sea pines overlooking East Sea rocks.',
        },
        tip: {
          KR: '무장애 포인트: 입구부터 등대까지 턱 없는 무장애 나눔길(데크·포장길)이 조성되어 유모차·휠체어·개모차 모두 편안합니다.',
          EN: 'Accessibility: Curb-free boardwalk and paved forest paths from the entrance all the way to Ulgi Lighthouse.',
        },
        mapQuery: '울산 대왕암공원',
        ktoThumbKeys: ['daewangam', 'daewangamPine'],
        x: 612,
        y: 175,
        dotX: 645,
        dotY: 235,
      },
      {
        step: 4,
        color: '#DC5648',
        time: { KR: '오후 16:30 · 오션뷰 휴식', EN: '4:30 PM · Oceanfront Break' },
        title: { KR: '일산해수욕장 오션뷰 카페거리', EN: 'Ilsan Beach Oceanfront Cafe Street' },
        shortMapName: { KR: '일산해수욕장 카페', EN: 'Ilsan Beach Cafe' },
        desc: {
          KR: '대왕암공원 산책로와 바로 맞닿은 일산해수욕장 해변 카페에서 탁 트인 동해 바다와 파도 소리를 즐기며 당일 코스를 마무리합니다.',
          EN: 'Unwind with coffee and desserts overlooking the half-moon sandy bay of Ilsan Beach right next to Daewangam Park.',
        },
        tip: {
          KR: '동선 팁: 대왕암공원 입구에서 해변 산책데크로 바로 연결되어 계단 없이 이동할 수 있습니다.',
          EN: 'Route Tip: Directly connected to Daewangam Park’s entrance via a flat beachfront promenade.',
        },
        mapQuery: '울산 일산해수욕장 카페',
        ktoThumbKeys: ['ilsanBeach'],
        x: 625,
        y: 332,
        dotX: 595,
        dotY: 336,
      },
    ],
  },
  {
    id: 'course-bamboo-garden',
    category: 'itinerary',
    themeColor: '#3B8C62',
    shortTab: { KR: '코스 2 · 국가정원 힐링', EN: 'Course 2 · National Garden' },
    badge: { KR: '일정별 코스 02 · 반나절~당일 (국가정원)', EN: 'Course 02 · Half/Full Day (Garden)' },
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
      KR: ['동해선 태화강역', '태화루 누각', '십리대숲 & 은하수길', '국가정원 브런치·카페거리'],
      EN: ['Taehwagang Station', 'Taehwaru Pavilion', 'Bamboo Starlight Path', 'Garden Cafe Street'],
    },
    itineraryStops: [
      {
        step: 1,
        color: '#3A7BB8',
        time: { KR: '오전 11:00 · 동해선 도착', EN: '11:00 AM · Donghae Line Arrival' },
        title: { KR: '동해선 태화강역 출발', EN: 'Donghae Line Taehwagang Station' },
        shortMapName: { KR: '동해선 태화강역', EN: 'Taehwagang Stn.' },
        desc: {
          KR: '부산 부전·센텀·기장역에서 동해선 광역전철을 타고 환승이나 계단 걱정 없이 태화강역에 도착해 여유롭게 여행을 시작합니다.',
          EN: 'Hop on the Donghae Line metro from Busan for a smooth, step-free arrival at Taehwagang Station.',
        },
        tip: {
          KR: '교통 팁: 역사 내 엘리베이터와 평지 광장을 통해 버스·택시 승강장으로 바로 연결됩니다.',
          EN: 'Transit Tip: Full elevator access from train platforms straight to the ground-level plaza and taxi stand.',
        },
        mapQuery: '울산 태화강역',
        ktoThumbKeys: ['taehwagangRiver'],
        x: 472,
        y: 392,
        dotX: 488,
        dotY: 342,
      },
      {
        step: 2,
        color: '#D48124',
        time: { KR: '낮 12:00 · 약 1시간', EN: '12:00 PM · 1 hr' },
        title: { KR: '태화루 & 강변 스카이워크', EN: 'Taehwaru Pavilion & River Skywalk' },
        shortMapName: { KR: '태화루 누각', EN: 'Taehwaru Pavilion' },
        desc: {
          KR: '영남 3대 누각인 태화루 마루에서 시원한 강바람을 맞으며 유유히 흐르는 태화강과 국가정원 전경을 한눈에 감상합니다.',
          EN: 'Admire sweeping views of the Taehwagang River from one of Yeongnam’s Three Great Historic Pavilions.',
        },
        tip: {
          KR: '무장애 포인트: 엘리베이터와 경사로가 설치되어 있어 누각 광장과 스카이워크 전망대까지 턱 없이 이동 가능합니다.',
          EN: 'Accessibility: Equipped with an elevator and gentle ramps leading to the pavilion courtyard and river skywalk.',
        },
        mapQuery: '울산 태화루',
        ktoThumbKeys: ['taehwaru'],
        x: 335,
        y: 175,
        dotX: 382,
        dotY: 265,
      },
      {
        step: 3,
        color: '#3B8C62',
        time: { KR: '오후 14:00 · 전동관람차 & 산책', EN: '2:00 PM · Eco-Tram & Bamboo Walk' },
        title: { KR: '태화강 국가정원 & 십리대숲 은하수길', EN: 'Taehwagang National Garden & Bamboo Grove' },
        shortMapName: { KR: '태화강 국가정원', EN: 'Taehwagang Garden' },
        desc: {
          KR: '계단 하나 없는 평탄한 4km 초록빛 대나무숲길(십리대숲)과 계절 꽃밭을 거닐고, 해 질 녘에는 반딧불이처럼 빛나는 은하수길을 만납니다.',
          EN: 'Stroll or ride the electric sightseeing tram along 4km of flat bamboo trails that glow like a galaxy after sunset.',
        },
        tip: {
          KR: '무장애 포인트: 정원 전 구간 평지 동선 · 무장애 전동관람차 운행 및 무료 휠체어·유모차 대여소 운영',
          EN: 'Accessibility: 100% flat garden paths with an electric sightseeing tram and free wheelchair/stroller rentals.',
        },
        mapQuery: '울산 태화강 국가정원',
        ktoThumbKeys: ['taehwagangGarden', 'taehwagangRiver'],
        x: 198,
        y: 348,
        dotX: 400,
        dotY: 322,
      },
      {
        step: 4,
        color: '#DC5648',
        time: { KR: '오후 17:00 · 브런치 & 커피', EN: '5:00 PM · Garden Dining & Cafe' },
        title: { KR: '국가정원 브런치 & 감성 카페거리', EN: 'National Garden Brunch & Cafe Street' },
        shortMapName: { KR: '국가정원 카페거리', EN: 'Garden Cafe St.' },
        desc: {
          KR: '십리대숲 산책로 바로 맞은편 태화동 카페거리에서 정원 뷰 브런치와 향긋한 스페셜티 커피를 즐기며 여유롭게 쉬어갑니다.',
          EN: 'Cross right over to the garden-view cafes and brunch restaurants lining Taehwa-dong for a relaxing meal.',
        },
        tip: {
          KR: '동선 팁: 십리대숲 출구에서 횡단보도 하나만 건너면 바로 카페거리로 이어집니다.',
          EN: 'Route Tip: Located right across the crosswalk from the Simnidaesup Bamboo Grove exit.',
        },
        mapQuery: '울산 태화강국가정원 카페거리',
        ktoThumbKeys: ['ricoPasto', 'camonsi'],
        x: 355,
        y: 416,
        dotX: 432,
        dotY: 332,
      },
    ],
  },
  {
    id: 'course-sunset-bridge',
    category: 'itinerary',
    themeColor: '#DC5648',
    shortTab: { KR: '코스 3 · 간절곶·야경', EN: 'Course 3 · Sunset & Night' },
    badge: { KR: '일정별 코스 03 · 오후~야간 (노을·야경)', EN: 'Course 03 · Afternoon to Night (Sunset)' },
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
      KR: ['간절곶 소망우체통', '간절곶 오션뷰 카페', '명선도 해안산책로', '울산대교 전망대'],
      EN: ['Ganjeolgot Wish Postbox', 'Ganjeolgot Coastal Cafe', 'Myeongseondo Walk', 'Ulsan Bridge Observatory'],
    },
    itineraryStops: [
      {
        step: 1,
        color: '#DC5648',
        time: { KR: '오후 14:00 · 약 1시간 20분', EN: '2:00 PM · 1 hr 20 mins' },
        title: { KR: '간절곶 소망우체통 & 해맞이 잔디광장', EN: 'Ganjeolgot Wish Postbox & Lawn Plaza' },
        shortMapName: { KR: '간절곶 소망우체통', EN: 'Ganjeolgot Postbox' },
        desc: {
          KR: '한반도에서 가장 먼저 해가 뜨는 간절곶의 푸른 잔디 해안광장과 커다란 빨간 소망우체통, 하얀 등대를 따라 바닷바람을 만끽합니다.',
          EN: 'Stroll across wide coastal lawns to the iconic 5-meter red Wish Postbox and white lighthouse by the East Sea.',
        },
        tip: {
          KR: '무장애 포인트: 주차장에서 소망우체통 광장까지 턱 없는 평탄한 산책로로 연결되어 누구나 편하게 이동합니다.',
          EN: 'Accessibility: Flat, step-free paved promenade connecting the parking lot directly to the Wish Postbox plaza.',
        },
        mapQuery: '울산 간절곶 소망우체통',
        ktoThumbKeys: ['ganjeolgot', 'ganjeolgotSunrise'],
        x: 492,
        y: 526,
        dotX: 542,
        dotY: 458,
      },
      {
        step: 2,
        color: '#D48124',
        time: { KR: '오후 15:30 · 오션뷰 티타임', EN: '3:30 PM · Oceanfront Cafe' },
        title: { KR: '간절곶 해안 대형 베이커리 카페', EN: 'Ganjeolgot Oceanfront Bakery Cafe' },
        shortMapName: { KR: '간절곶 해안 카페', EN: 'Ganjeolgot Cafe' },
        desc: {
          KR: '간절곶 해안선을 따라 자리한 통유리 오션뷰 베이커리 카페에서 끝없이 펼쳐진 동해 수평선을 바라보며 여유로운 티타임을 갖습니다.',
          EN: 'Relax with freshly baked pastries and ocean views through floor-to-ceiling windows along the Ganjeolgot coast.',
        },
        tip: {
          KR: '동선 팁: 간절곶 잔디광장 바로 옆 해안도로에 카페들이 모여 있어 도보나 차량 2분이면 도착합니다.',
          EN: 'Route Tip: Located right along the coastal road adjacent to Ganjeolgot Plaza.',
        },
        mapQuery: '울산 간절곶 시선310',
        ktoThumbKeys: ['siseon310', 'ortoCafe'],
        x: 358,
        y: 492,
        dotX: 515,
        dotY: 468,
      },
      {
        step: 3,
        color: '#3B8C62',
        time: { KR: '오후 17:00 · 노을 해변 산책', EN: '5:00 PM · Sunset Beach Walk' },
        title: { KR: '진하해수욕장 & 명선도 해안산책로', EN: 'Jinha Beach & Myeongseondo Island' },
        shortMapName: { KR: '진하해변 · 명선도', EN: 'Myeongseondo Walk' },
        desc: {
          KR: '간절곶 바로 북쪽 진하해변의 고운 백사장 데크길과 신비로운 섬 명선도 주변을 거닐며 붉게 물드는 골든아워 노을을 감상합니다.',
          EN: 'Walk along the flat beachfront boardwalk of Jinha Beach facing the glowing island of Myeongseondo at sunset.',
        },
        tip: {
          KR: '관람 포인트: 해 질 무렵 명선교와 해변 산책로에 조명이 켜지면 바다 위 낭만적인 야경 포토존이 펼쳐집니다.',
          EN: 'Highlight: Evening lights illuminate the beach promenade and island view at dusk.',
        },
        mapQuery: '울산 진하해수욕장 명선도',
        ktoThumbKeys: ['ganjeolgotSunrise'],
        x: 262,
        y: 456,
        dotX: 482,
        dotY: 422,
      },
      {
        step: 4,
        color: '#895B9E',
        time: { KR: '저녁 19:00 · 파노라마 야경', EN: '7:00 PM · Panoramic Nightscape' },
        title: { KR: '울산대교 전망대 야경 감상', EN: 'Ulsan Bridge Observatory Night View' },
        shortMapName: { KR: '울산대교 전망대', EN: 'Bridge Observatory' },
        desc: {
          KR: '국내 최장 단경간 현수교인 울산대교와 울산만 일대의 반짝이는 불빛을 360도 실내·옥상 전망대에서 한눈에 내려다봅니다.',
          EN: 'Take in a 360-degree sparkling nighttime panorama of Ulsan Bridge and Ulsan Bay from the observatory.',
        },
        tip: {
          KR: '무장애 포인트: 전망대 바로 앞까지 차량 진입 및 전용 주차가 가능하며 실내 엘리베이터로 전망층까지 바로 올라갑니다.',
          EN: 'Accessibility: Drive right up to the entrance parking lot and take the indoor elevator straight to the observation deck.',
        },
        mapQuery: '울산대교 전망대',
        ktoThumbKeys: ['ulsanBridge'],
        x: 625,
        y: 332,
        dotX: 565,
        dotY: 282,
      },
    ],
  },
  {
    id: 'course-heritage-food',
    category: 'itinerary',
    themeColor: '#D48124',
    shortTab: { KR: '코스 4 · 역사·언양불고기', EN: 'Course 4 · Heritage & Bulgogi' },
    badge: { KR: '일정별 코스 04 · 1박 2일 (역사·미식)', EN: 'Course 04 · 2 Days 1 Night (Heritage)' },
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
      KR: ['KTX 울산역', '울산암각화박물관', '언양 한우불고기 특구', '외고산 옹기마을'],
      EN: ['KTX Ulsan Station', 'Petroglyph Museum', 'Eonyang Bulgogi Zone', 'Oegosan Onggi Village'],
    },
    itineraryStops: [
      {
        step: 1,
        color: '#3A7BB8',
        time: { KR: '1일차 오전 10:30 · KTX 도착', EN: 'Day 1 · 10:30 AM Arrival' },
        title: { KR: 'KTX 울산역 도착 & 서부 여행 출발', EN: 'Arrive at KTX Ulsan Station' },
        shortMapName: { KR: 'KTX 울산역', EN: 'KTX Ulsan Stn.' },
        desc: {
          KR: '부산역에서 KTX로 약 20분 만에 울산역에 도착해 영남알프스와 반구천을 품은 울주군 역사·미식 여행을 시작합니다.',
          EN: 'Arrive at KTX Ulsan Station in just 20 minutes from Busan Station to begin your western Ulju heritage tour.',
        },
        tip: {
          KR: '교통 팁: KTX 울산역 1층 승강장에서 언양·반구대 방면 시내버스와 택시를 턱 없이 바로 이용할 수 있습니다.',
          EN: 'Transit Tip: Step-free ground-level access to taxis and buses bound for Eonyang and Bangudae.',
        },
        mapQuery: 'KTX 울산역',
        ktoThumbKeys: ['bangudae'],
        x: 132,
        y: 185,
        dotX: 195,
        dotY: 285,
      },
      {
        step: 2,
        color: '#3B8C62',
        time: { KR: '1일차 낮 11:30 · 약 1시간 30분', EN: 'Day 1 · 11:30 AM (1.5 hrs)' },
        title: { KR: '울산암각화박물관 & 반구천 산책길', EN: 'Ulsan Petroglyph Museum & Bangucheon Walk' },
        shortMapName: { KR: '울산암각화박물관', EN: 'Petroglyph Museum' },
        desc: {
          KR: '고래를 형상화한 박물관에서 7,000년 전 국보 반구대 암각화의 실물 모형과 입체 영상을 관람하고 평탄한 강변 숲길을 산책합니다.',
          EN: 'Explore full-scale replicas of 7,000-year-old whale rock carvings and walk the gentle riverside forest trail.',
        },
        tip: {
          KR: '무장애 포인트: 박물관 내부 경사로 및 엘리베이터 완비 · 관람료 무료',
          EN: 'Accessibility: Free admission with full interior ramp and elevator access.',
        },
        mapQuery: '울산암각화박물관',
        ktoThumbKeys: ['petroglyphMuseum', 'bangudae'],
        x: 198,
        y: 348,
        dotX: 145,
        dotY: 355,
      },
      {
        step: 3,
        color: '#DC5648',
        time: { KR: '1일차 오후 13:30 · 점심 미식', EN: 'Day 1 · 1:30 PM Lunch' },
        title: { KR: '언양 한우불고기 특구 미식 만찬', EN: 'Eonyang Hanwoo Bulgogi Culinary Zone' },
        shortMapName: { KR: '언양 한우불고기', EN: 'Eonyang Bulgogi' },
        desc: {
          KR: '은은한 참숯 향이 배어든 석쇠 언양 한우불고기와 향긋한 언양 미나리 쌈으로 울산을 대표하는 전통 미식을 맛봅니다.',
          EN: 'Savor charcoal-grilled Eonyang Hanwoo beef bulgogi served with fresh local water dropwort.',
        },
        tip: {
          KR: '이용 팁: 1층 평지 출입구와 넓은 전용 주차장, 입식 테이블을 갖춘 대형 한우불고기 전문점이 밀집해 있습니다.',
          EN: 'Dining Tip: Spacious ground-floor restaurants with dedicated parking and comfortable table seating.',
        },
        mapQuery: '울산 언양불고기',
        ktoThumbKeys: ['eonyangBulgogi'],
        x: 335,
        y: 175,
        dotX: 245,
        dotY: 265,
      },
      {
        step: 4,
        color: '#D48124',
        time: { KR: '2일차 오전 11:00 · 전통마을 & 공방', EN: 'Day 2 · 11:00 AM Village & Craft' },
        title: { KR: '외고산 옹기마을 & 도자기 공방 체험', EN: 'Oegosan Onggi Village & Pottery Workshop' },
        shortMapName: { KR: '외고산 옹기마을', EN: 'Onggi Village' },
        desc: {
          KR: '수천 개의 전통 옹기와 황토 돌담길이 어우러진 국내 최대 옹기마을을 거닐고, 옹기공방에서 나만의 도자기 컵을 만들어 봅니다.',
          EN: 'Walk along earthen walls lined with thousands of traditional pottery jars and craft your own clay cup.',
        },
        tip: {
          KR: '교통 팁: 동해선 망양역과도 인접해 있어 관람 후 기차로 부산·태화강 방면 복귀가 편리합니다.',
          EN: 'Transit Tip: Located right near Mangyang Station on the Donghae Line for easy return travel.',
        },
        mapQuery: '울산 외고산 옹기마을',
        ktoThumbKeys: ['onggiVillage'],
        x: 148,
        y: 532,
        dotX: 210,
        dotY: 468,
      },
    ],
  },
  {
    id: 'course-pet-healing',
    category: 'itinerary',
    themeColor: '#895B9E',
    shortTab: { KR: '코스 5 · 반려견 동반 펫투어', EN: 'Course 5 · Pet-Friendly Tour' },
    badge: { KR: '일정별 코스 05 · 반려동물 친화관광도시 추천', EN: 'Course 05 · Pet-Friendly City Special' },
    title: {
      KR: '태화강 십리대숲 & 동해 바다 댕댕이 동반 여행코스',
      EN: 'Taehwagang Bamboo Grove & East Sea Pet-Friendly Course',
    },
    desc: {
      KR: '전국 최초 반려동물 친화관광도시 울산의 국가정원 잔디 산책로, 전용 펫파크, 오션뷰 동반 브런치, 요트투어까지 하루에 즐기는 알찬 펫 코스입니다.',
      EN: 'Enjoy Ulsan’s flat bamboo garden trails, off-leash pet park, oceanfront pet-friendly brunch, and dog yacht tour in one seamless course.',
    },
    ktoThumbKeys: ['taehwagangGarden', 'anianPark', 'lamerPanji', 'ilsanBeach'],
    stops: {
      KR: ['태화강 국가정원 산책', '북구 애니언파크', '라메르판지 오션뷰 브런치', '일산해변 반려견 요트투어'],
      EN: ['Taehwagang Garden Walk', 'Anian Pet Park', 'La Mer Panji Brunch', 'Ilsan Beach Pet Yacht Tour'],
    },
    itineraryStops: [
      {
        step: 1,
        color: '#3B8C62',
        time: { KR: '오전 10:30 · 평지 정원 산책', EN: '10:30 AM · Flat Garden Walk' },
        title: { KR: '태화강 국가정원 & 십리대숲 반려견 산책', EN: 'Taehwagang National Garden Pet Walk' },
        shortMapName: { KR: '태화강 국가정원', EN: 'Taehwagang Garden' },
        desc: {
          KR: '계단 없이 평탄하게 펼쳐진 국가정원 잔디밭과 대나무숲 산책로를 반려견(또는 개모차)과 함께 상쾌하게 산책합니다.',
          EN: 'Start the morning strolling with your dog or pet stroller along wide, step-free bamboo and riverside paths.',
        },
        tip: {
          KR: '동반 안내: 야외 정원 전 구역 전 견종 동반 가능 (목줄 착용 및 배변봉투 지참)',
          EN: 'Pet Policy: All dog breeds welcome across outdoor garden paths on leash.',
        },
        mapQuery: '울산 태화강 국가정원',
        ktoThumbKeys: ['taehwagangGarden'],
        x: 355,
        y: 416,
        dotX: 400,
        dotY: 322,
      },
      {
        step: 2,
        color: '#3A7BB8',
        time: { KR: '낮 12:30 · 오프리쉬 놀이터', EN: '12:30 PM · Off-Leash Playground' },
        title: { KR: '애니언파크 (울산 반려동물 문화센터)', EN: 'Anian Park (Ulsan Pet Culture Center)' },
        shortMapName: { KR: '애니언파크', EN: 'Anian Pet Park' },
        desc: {
          KR: '북구 호계동에 위치한 반려동물 전용 복합 문화공간으로 이동해, 천연잔디 오프리쉬 운동장에서 반려견이 마음껏 뛰어놀게 해줍니다.',
          EN: 'Let your dog run free on natural grass off-leash playgrounds at Ulsan’s dedicated Pet Culture Center.',
        },
        tip: {
          KR: '동반 안내: 동물등록 및 예방접종 완료 반려견 입장 가능 · 보호자 휴식 라운지 및 포토존 완비',
          EN: 'Pet Policy: Open to registered and vaccinated dogs with comfortable owner lounges.',
        },
        mapQuery: '울산 애니언파크',
        ktoThumbKeys: ['anianPark'],
        x: 425,
        y: 156,
        dotX: 472,
        dotY: 185,
      },
      {
        step: 3,
        color: '#D48124',
        time: { KR: '오후 14:30 · 오션뷰 동반 식사', EN: '2:30 PM · Oceanfront Pet Dining' },
        title: { KR: '라메르판지 (오션뷰 애견동반 베이커리 & 브런치)', EN: 'La Mer Panji (Oceanfront Pet-Friendly Brunch)' },
        shortMapName: { KR: '라메르판지 브런치', EN: 'La Mer Panji' },
        desc: {
          KR: '북구 판지항 바다 바로 앞에 펼쳐진 대형 테라스·정원 베이커리 카페에서 동해 파도를 바라보며 반려견과 함께 브런치를 즐깁니다.',
          EN: 'Dine with your dog on a spacious oceanfront lawn and terrace overlooking the East Sea in Buk-gu.',
        },
        tip: {
          KR: '동반 안내: 바다가 맞닿은 넓은 야외 잔디 테라스 구역 반려견 동반 가능 · 주차장 평지 직결',
          EN: 'Pet Policy: Dogs welcome on the expansive ocean-view outdoor terrace with flat parking access.',
        },
        mapQuery: '울산 라메르판지',
        ktoThumbKeys: ['lamerPanji'],
        x: 592,
        y: 132,
        dotX: 608,
        dotY: 168,
      },
      {
        step: 4,
        color: '#DC5648',
        time: { KR: '오후 16:30 · 바다 위 이색체험', EN: '4:30 PM · Marine Pet Activity' },
        title: { KR: '일산해수욕장 반려견 동반 요트투어 & 대왕암 산책', EN: 'Ilsan Beach Pet Yacht Tour & Daewangam Walk' },
        shortMapName: { KR: '요트투어 · 일산해변', EN: 'Pet Yacht Tour' },
        desc: {
          KR: '일산해수욕장에서 반려견 전용 구명조끼를 입고 요트 크루즈(또는 패들보드)에 탑승해 대왕암 해안 절경을 바다 위에서 감상합니다.',
          EN: 'Board a pet-friendly yacht cruise or paddleboard at Ilsan Beach with complimentary dog life jackets.',
        },
        tip: {
          KR: '이용 안내: 요트 투어 전후로 바로 옆 대왕암공원 해송 산책로를 함께 거닐기 좋습니다.',
          EN: 'Route Tip: Pair your yacht cruise with a sunset stroll along the adjacent Daewangam pine trail.',
        },
        mapQuery: '울산 일산해수욕장 요트투어',
        ktoThumbKeys: ['ilsanBeach', 'daewangam'],
        x: 625,
        y: 332,
        dotX: 595,
        dotY: 336,
      },
    ],
  },

  // ==========================================
  // 1-2. 반려동물 (pet) - 전국 최초 반려동물 친화관광도시 울산 (산책명소 / 펫파크·놀이터 / 이색체험 / 동반카페·식당)
  // ==========================================
  // [반려동물 - 산책명소 (walk)]
  {
    id: 'pet-walk-taehwagang',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '태화강 국가정원 & 십리대숲 반려견 산책길',
      EN: 'Taehwagang National Garden Pet Walk',
    },
    desc: {
      KR: '드넓은 초록빛 잔디광장과 시원한 대나무숲 강변 산책로를 반려견과 함께 여유롭게 거닐 수 있는 울산 대표 도심 산책 명소입니다.',
      EN: 'Stroll with your dog along wide green lawns and breezy riverside bamboo trails at Taehwagang National Garden.',
    },
    ktoThumbKeys: ['taehwagangGarden', 'taehwagangRiver'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 중구 태화강국가정원길 154 일원',
          EN: '154, Taehwagang-gukgajeongwon-gil, Jung-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 정원 전 구역 반려동물 동반 가능 (목줄 착용 · 배변봉투 지참 필수)',
          EN: 'Pets welcome across all outdoor garden zones (leash & waste bags required)',
        },
      },
      {
        label: { KR: '산책특징', EN: 'Highlights' },
        value: {
          KR: '계단 없는 평탄한 흙길과 포장 산책로가 이어져 소형견·노령견·개모차 이동에 최적',
          EN: 'Flat, step-free soil and paved paths ideal for small dogs, senior dogs, and pet strollers',
        },
      },
    ],
  },
  {
    id: 'pet-walk-daewangam',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '대왕암공원 & 슬도 해안 반려견 산책로',
      EN: 'Daewangam Park & Seuldo Coastal Pet Trail',
    },
    desc: {
      KR: '100년 넘은 해송 숲길과 시원한 동해 바다, 슬도 해안 산책로를 따라 바닷바람을 맞으며 반려견과 걷기 좋은 해안 명소입니다.',
      EN: 'Walk with your dog through a century-old pine grove and scenic coastal decks overlooking the East Sea.',
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
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '공원 및 해안 산책로 전 구역 반려견 동반 가능 (목줄 필수 · 출렁다리 구간 제외)',
          EN: 'Dogs welcome throughout the park and coastal trails (leash required; suspension bridge excluded)',
        },
      },
      {
        label: { KR: '산책특징', EN: 'Highlights' },
        value: {
          KR: '울창한 소나무 그늘과 완만한 해안 데크길이 잘 정비되어 사계절 쾌적한 산책 가능',
          EN: 'Shaded pine trails and gentle coastal boardwalks comfortable in all four seasons',
        },
      },
    ],
  },
  {
    id: 'pet-walk-ganjeolgot',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '간절곶 해맞이광장 잔디 산책길',
      EN: 'Ganjeolgot Sunrise Plaza Lawn Walk',
    },
    desc: {
      KR: '탁 트인 동해 수평선과 소망우체통, 드넓은 해안 잔디광장이 어우러져 반려견과 바다 인생 사진을 남기기 좋은 명소입니다.',
      EN: 'Capture memorable seaside photos with your dog across wide coastal lawns by the iconic Wish Postbox.',
    },
    ktoThumbKeys: ['ganjeolgot', 'ganjeolgotSunrise'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 대송리 31-20 일원',
          EN: '31-20, Daesong-ri, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 해안광장 및 산책로 전 구역 반려동물 동반 가능 (목줄 착용 필수)',
          EN: 'Pets welcome across the outdoor coastal plaza and walking paths (leash required)',
        },
      },
      {
        label: { KR: '산책특징', EN: 'Highlights' },
        value: {
          KR: '턱이 없는 평지 잔디밭과 해안 산책로 구성 · 인근 애견동반 해안 카페 밀집',
          EN: 'Flat, curb-free lawns and coastal paths with pet-friendly oceanfront cafes nearby',
        },
      },
    ],
  },
  {
    id: 'pet-walk-somanggil',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '간절곶 소망길 해안 산책로',
      EN: 'Ganjeolgot Somang-gil Coastal Trail',
    },
    desc: {
      KR: '나사리 해변에서 간절곶까지 동해 바다를 바로 옆에 두고 걷는 평탄한 해안 산책길로, 한국관광공사 반려동물 동반여행 공식 선정 코스입니다.',
      EN: 'A scenic oceanfront walking path stretching from Nasa-ri Beach to Ganjeolgot Cape, officially certified by KTO Pet Tour.',
    },
    ktoThumbKeys: ['ganjeolgotSomanggil'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 나사리 ~ 간절곶 일원',
          EN: 'Nasa-ri to Ganjeolgot, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 구역 동반 가능 · 전 견종 동반 가능 (목줄 착용 · 배변봉투 지참 필수)',
          EN: 'All areas & all dog breeds welcome (leash and waste bags required)',
        },
      },
    ],
  },
  {
    id: 'pet-walk-seonam',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '선암호수공원 수변 산책길',
      EN: 'Seonam Lake Park Waterside Walk',
    },
    desc: {
      KR: '잔잔한 호수를 따라 평탄한 데크와 흙길 산책로가 둥글게 이어져 반려견과 사계절 여유롭게 호수 산책을 즐길 수 있는 도심 공원입니다.',
      EN: 'A peaceful lakeside park with flat boardwalks and dirt trails looping around the water, open year-round for dogs.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 선암동 490-2 일원',
          EN: '490-2, Seonam-dong, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 산책로 전 견종 동반 가능 (목줄 착용 · 배변봉투 지참 필수 · 연중무휴)',
          EN: 'All dog breeds welcome on outdoor trails (leash & waste bags required; open 24/7)',
        },
      },
    ],
  },
  {
    id: 'pet-walk-grandpark',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '울산대공원 산책로',
      EN: 'Ulsan Grand Park Walking Trail',
    },
    desc: {
      KR: '울산 도심 속 가장 넓은 생태공원으로, 잘 포장된 광장 산책길과 숲길을 따라 반려견과 쾌적하게 걷기 좋습니다.',
      EN: 'Ulsan’s largest urban eco-park featuring wide paved promenades and shaded forest paths for dog walks.',
    },
    ktoThumbKeys: ['ulsanGrandPark'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 대공원로 94',
          EN: '94, Daegongwon-ro, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 공원 산책로 전 견종 동반 가능 (목줄·배변봉투 필수 · 장미원/동물원 내부 구역 제외)',
          EN: 'All dog breeds welcome on outdoor park paths (Rose Garden & Zoo interior excluded)',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '매일 05:00 ~ 23:00 (연중무휴)',
          EN: 'Daily 05:00 – 23:00 (Year-round)',
        },
      },
    ],
  },
  {
    id: 'pet-walk-arboretum',
    category: 'pet',
    petSub: 'walk',
    badge: { KR: '반려동물 · 산책명소', EN: 'Pet-Friendly · Walk & Park' },
    title: {
      KR: '울산테마식물수목원 야외 산책로',
      EN: 'Ulsan Theme Botanical Arboretum',
    },
    desc: {
      KR: '동구 쇠평길 숲속에 자리한 자연 친화적 수목원으로, 한국관광공사 반려동물 동반여행에 등록된 소형견 동반 산책 명소입니다.',
      EN: 'A tranquil forest arboretum in Dong-gu registered with KTO Pet Tour for small-dog walks among seasonal plants.',
    },
    ktoThumbKeys: ['ulsanArboretum'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 쇠평길 33-1',
          EN: '33-1, Soepyeong-gil, Dong-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '일부 야외 구역 소형견 동반 가능 (목줄 착용 · 배변봉투 지참 필수)',
          EN: 'Small dogs welcome in designated outdoor areas (leash & waste bags required)',
        },
      },
    ],
  },

  // [반려동물 - 펫파크·놀이터 (park)]
  {
    id: 'pet-park-anian',
    category: 'pet',
    petSub: 'park',
    badge: { KR: '반려동물 · 펫파크·놀이터', EN: 'Pet-Friendly · Pet Park' },
    title: {
      KR: '애니언파크 (울산 반려동물 문화센터)',
      EN: 'Anian Park (Ulsan Pet Culture Center)',
    },
    desc: {
      KR: '울산 북구에 자리한 반려동물 전용 복합 문화공간으로, 넓은 천연잔디 오프리쉬 놀이터와 반려견 교감·문화 프로그램을 함께 즐길 수 있습니다.',
      EN: 'Ulsan’s dedicated pet culture complex featuring natural grass off-leash playgrounds and interactive dog programs.',
    },
    ktoThumbKeys: ['anianPark'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 북구 호계매곡6로 108 (호계동)',
          EN: '108, Hogyemaegok 6-ro, Buk-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요시설', EN: 'Facilities' },
        value: {
          KR: '천연잔디 야외 반려견 놀이터 · 펫 문화교실 · 보호자 휴식 공간 및 포토존',
          EN: 'Natural grass off-leash dog park, pet culture classrooms, owner lounge & photo zones',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '예방접종 및 반려동물 등록 완료한 전 견종 동반 가능 (맹견 제외)',
          EN: 'Open to all vaccinated and registered dog breeds (excluding fierce dog breeds)',
        },
      },
    ],
  },
  {
    id: 'pet-park-munsu',
    category: 'pet',
    petSub: 'park',
    badge: { KR: '반려동물 · 펫파크·놀이터', EN: 'Pet-Friendly · Pet Park' },
    title: {
      KR: '문수 울산애견공원',
      EN: 'Munsu Ulsan Dog Park',
    },
    desc: {
      KR: '전국 최초로 조성된 공공 반려견 전용 운동 시설로, 소형견과 중·대형견 놀이터가 분리되어 목줄 없이 마음껏 뛰어놀 수 있습니다.',
      EN: 'Korea’s first public off-leash dog park featuring separate turf yards for small and large dogs, agility obstacles, and a dog pool.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 남부순환도로 209 (문수국제양궁장 내)',
          EN: '209, Nambusunhwan-doro, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요시설', EN: 'Facilities' },
        value: {
          KR: '소형견·대형견 분리 잔디 운동장 · 어질리티 장애물 시설 · 여름철 반려견 전용 수영장',
          EN: 'Separate small/large dog turf yards, agility equipment, and summer dog swimming pool',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '화~일 09:00~18:00 (동절기 11~2월 ~17:00 · 매주 월요일 휴무 · 동물등록 필수)',
          EN: 'Tue–Sun 09:00–18:00 (Nov–Feb until 17:00; closed Mondays; registration required)',
        },
      },
    ],
  },
  {
    id: 'pet-park-meongsup',
    category: 'pet',
    petSub: 'park',
    badge: { KR: '반려동물 · 펫파크·놀이터', EN: 'Pet-Friendly · Pet Park' },
    title: {
      KR: '멍숲 (야외 잔디 애견파크 & 카페)',
      EN: 'Meongsup (Dog Forest Park & Cafe)',
    },
    desc: {
      KR: '울주군 삼동면의 맑은 숲속에 자리한 대규모 야외 잔디 운동장 겸 애견카페로, 모든 크기의 반려견이 실내·실외에서 자유롭게 뛰어놀 수 있습니다.',
      EN: 'A spacious forest dog park and cafe in Samdong-myeon welcoming dogs of all sizes both indoors and outdoors.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 삼동면 조일1길 25',
          EN: '25, Joil 1-gil, Samdong-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '모든 크기 반려견 입장 가능 · 실내 및 실외 전 구역 동반 가능',
          EN: 'All dog sizes welcome across both indoor and outdoor zones',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '매일 09:00 ~ 23:00 (연중무휴 · 주차 가능)',
          EN: 'Daily 09:00 – 23:00 (Open year-round; parking available)',
        },
      },
    ],
  },
  {
    id: 'pet-park-gaedeulland',
    category: 'pet',
    petSub: 'park',
    badge: { KR: '반려동물 · 펫파크·놀이터', EN: 'Pet-Friendly · Pet Park' },
    title: {
      KR: '개들랜드',
      EN: 'Gaedeul Land Pet Playground',
    },
    desc: {
      KR: '간절곶 인근 울주군 서생면에 위치한 반려견 전용 플레이스로, 쾌적한 운동장과 휴식 공간에서 반려견과 즐거운 시간을 보낼 수 있습니다.',
      EN: 'A dedicated pet playground and lounge in Seosaeng-myeon near Ganjeolgot Cape.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 홍골들길 41',
          EN: '41, Honggoldeul-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '소형견 중심 동반 가능 · 예방접종 완료 필수',
          EN: 'Small dogs welcome; vaccination completion required',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '매일 11:00 ~ 21:00 (연중무휴 · 주차 가능)',
          EN: 'Daily 11:00 – 21:00 (Open year-round; parking available)',
        },
      },
    ],
  },

  // [반려동물 - 이색체험 (activity)]
  {
    id: 'pet-activity-yacht',
    category: 'pet',
    petSub: 'activity',
    badge: { KR: '반려동물 · 이색체험', EN: 'Pet-Friendly · Activity' },
    title: {
      KR: '요트투어 (일산해수욕장 반려견 동반 요트 & 패들보드)',
      EN: 'Pet Yacht Tour (Ilsan Beach Yacht & SUP)',
    },
    desc: {
      KR: '일산해수욕장 바다 위에서 반려견과 함께 요트 크루즈, 패들보드(SUP), 투명카약을 즐기며 대왕암 해안 절경을 감상하는 울산 대표 펫 해양레저입니다.',
      EN: 'Set sail with your dog from Ilsan Beach on a pet-friendly yacht cruise, stand-up paddleboard (SUP), or clear kayak.',
    },
    ktoThumbKeys: ['ilsanBeach'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 일산진11길 163-1 (일산해수욕장)',
          EN: '163-1, Ilsanjin 11-gil, Dong-gu, Ulsan (Ilsan Beach)',
        },
      },
      {
        label: { KR: '체험내용', EN: 'Program' },
        value: {
          KR: '반려견 동반 요트투어 · 댕댕이 패들보드(SUP) & 투명카약 · 강아지 구명조끼 대여 지원',
          EN: 'Pet-friendly yacht cruise, dog SUP & clear kayak experience with dog life-jacket rental',
        },
      },
      {
        label: { KR: '예약안내', EN: 'Booking' },
        value: {
          KR: '사전 온라인 예약 필수 · 해상 기상 상황에 따라 출항 일정 확인 권장',
          EN: 'Advance reservation required; schedule subject to marine weather conditions',
        },
      },
    ],
  },
  {
    id: 'pet-activity-fe01',
    category: 'pet',
    petSub: 'activity',
    badge: { KR: '반려동물 · 이색체험', EN: 'Pet-Friendly · Activity' },
    title: {
      KR: 'Fe01 재생복합문화공간 (야외 정크아트 공원)',
      EN: 'Fe01 Upcycling Art Complex (Outdoor Sculpture Park)',
    },
    desc: {
      KR: '자동차 부품과 고철을 예술 작품으로 재탄생시킨 세계 최대 규모의 정크아트 테마파크로, 넓은 야외 전시장과 카페 테라스를 반려견과 함께 관람할 수 있습니다.',
      EN: 'Explore giant recycled metal sculptures with your dog across the spacious outdoor art park and garden cafe.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 용연길 160',
          EN: '160, Yongyeon-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 정크아트 조각공원 및 야외 카페 구역 반려견 동반 가능 (실내 전시관은 캐리어·개모차 이용)',
          EN: 'Dogs welcome on leash in the outdoor sculpture park & terrace (carrier/stroller required indoors)',
        },
      },
      {
        label: { KR: '특징', EN: 'Highlights' },
        value: {
          KR: '간절곶 인근 이색 포토스팟 · 턱 없이 이어지는 평탄한 야외 관람 동선',
          EN: 'Unique photo spots near Ganjeolgot Cape with flat outdoor viewing paths',
        },
      },
    ],
  },
  {
    id: 'pet-activity-onggi',
    category: 'pet',
    petSub: 'activity',
    badge: { KR: '반려동물 · 이색체험', EN: 'Pet-Friendly · Activity' },
    title: {
      KR: '외고산 옹기마을 (전통 옹기골목 반려견 산책)',
      EN: 'Oegosan Onggi Village Pet Walk',
    },
    desc: {
      KR: '수천 개의 전통 항아리와 황토 담벼락이 어우러진 국내 최대 옹기마을로, 야외 마을 산책로 전 구역을 반려견과 함께 거닐며 이색 사진을 남길 수 있습니다.',
      EN: 'Walk with your dog along earthen walls lined with thousands of traditional pottery jars at Korea’s largest Onggi village.',
    },
    ktoThumbKeys: ['onggiVillage'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 온양읍 외고산3길 36',
          EN: '36, Oegosan 3-gil, Onyang-eup, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '외부 마을 산책로 전 견종 동반 가능 (목줄 착용 · 실내 박물관/전시관 내부 제외)',
          EN: 'All dog breeds welcome on outdoor village paths (leash required; indoor museum excluded)',
        },
      },
    ],
  },
  {
    id: 'pet-activity-sinhwa',
    category: 'pet',
    petSub: 'activity',
    badge: { KR: '반려동물 · 이색체험', EN: 'Pet-Friendly · Activity' },
    title: {
      KR: '울산 신화마을 (고래 벽화골목 산책)',
      EN: 'Ulsan Sinhwa Art Village Pet Walk',
    },
    desc: {
      KR: '장생포 인근 알록달록한 고래·동화 벽화로 꾸며진 예술 마을로, 반려견과 함께 골목길 포토존마다 특별한 기념사진을 남기기 좋습니다.',
      EN: 'A colorful mural village near Jangsaengpo where you can take charming alley photos with your dog.',
    },
    ktoThumbKeys: ['ulsanSinhwaVillage'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 여천로66번길 7',
          EN: '7, Yeocheon-ro 66beon-gil, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 벽화골목 전 견종 동반 가능 (목줄 착용 · 배변봉투 지참 필수)',
          EN: 'All dog breeds welcome along outdoor mural alleys (leash & waste bags required)',
        },
      },
    ],
  },
  {
    id: 'pet-activity-camping',
    category: 'pet',
    petSub: 'activity',
    badge: { KR: '반려동물 · 이색체험', EN: 'Pet-Friendly · Activity' },
    title: {
      KR: '황방산생태야영장 (반려견 동반 오토캠핑)',
      EN: 'Hwangbangsan Eco Campground (Pet Auto-Camping)',
    },
    desc: {
      KR: '울산 도심 가까이에 자리한 자연 생태 야영장으로, 오토캠핑 사이트에서 반려견과 함께 여유로운 감성 캠핑을 즐길 수 있습니다.',
      EN: 'An urban eco-campground in Jung-gu where you can enjoy auto-camping with your dog.',
    },
    ktoThumbKeys: ['hwangbangsanCamping'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 중구 주연길 52 (장현동)',
          EN: '52, Juyeon-gil, Jung-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '오토캠핑장 구역 전 견종 동반 가능 (카라반 동반 불가 · 목줄 및 배변봉투 필수)',
          EN: 'All dog breeds welcome in auto-camping sites (caravans excluded; leash & waste bags required)',
        },
      },
    ],
  },

  // [반려동물 - 동반카페·식당 (dining)]
  {
    id: 'pet-dining-siseon310',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '시선310 간절곶점 (야외 오션뷰 잔디 테라스)',
      EN: 'Siseon 310 Ganjeolgot (Oceanview Lawn Terrace)',
    },
    desc: {
      KR: '간절곶 앞바다가 바로 내려다보이는 넓은 야외 잔디 정원과 테라스에서 반려견과 함께 오션뷰 베이커리와 커피를 즐길 수 있는 해안 카페입니다.',
      EN: 'Enjoy fresh bakery items and coffee with your dog on a breezy oceanfront lawn terrace at Ganjeolgot Cape.',
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
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '야외 잔디 정원 및 바다 전망 야외 테라스 구역 반려견 동반 가능 (목줄 착용 필수)',
          EN: 'Dogs welcome on the outdoor lawn garden and oceanfront terrace (leash required)',
        },
      },
    ],
  },
  {
    id: 'pet-dining-lamerpanji',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '라메르판지 (야외 오션뷰 가든 브런치)',
      EN: 'La Mer Panji (Outdoor Oceanview Garden Brunch)',
    },
    desc: {
      KR: '강동·판지항 파도 소리가 들리는 넓은 야외 오션뷰 정원 테이블에서 반려견과 여유롭게 브런치와 화덕피자를 맛볼 수 있습니다.',
      EN: 'Dine with your dog at oceanfront garden tables serving wood-fired pizza and Italian brunch by Panji Port.',
    },
    ktoThumbKeys: ['lamerPanji'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 북구 판지1길 30',
          EN: '30, Panji 1-gil, Buk-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '바다 앞 야외 가든 테라스 좌석 반려동물 동반 가능 (목줄 또는 개모차 이용)',
          EN: 'Pets welcome at outdoor oceanfront garden terrace tables (leash or pet stroller)',
        },
      },
    ],
  },
  {
    id: 'pet-dining-badadokchaji',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '바다독차지',
      EN: 'Bada Dokchaji Ocean Cafe',
    },
    desc: {
      KR: '울주군 서생면 바닷가에 자리한 오션뷰 카페로, 모든 크기의 반려견이 실내와 야외 테라스 모두 함께 입장할 수 있는 펫 프렌들리 공간입니다.',
      EN: 'An oceanfront cafe in Seosaeng-myeon where dogs of all sizes are welcome both indoors and on the seaside terrace.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 서생면 해맞이로 1376',
          EN: '1376, Haemaji-ro, Seosaeng-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 견종 동반 가능 · 실내 및 실외 모두 동반 가능',
          EN: 'All dog sizes welcome both indoors and outdoors',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '화~일 11:00 ~ 22:00 (매주 월요일 휴무 · 주차 가능)',
          EN: 'Tue–Sun 11:00 – 22:00 (Closed Mondays; parking available)',
        },
      },
    ],
  },
  {
    id: 'pet-dining-innerit',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '이너리트 (INNERIT)',
      EN: 'INNERIT Bakery & Garden Cafe',
    },
    desc: {
      KR: '울주군 삼남읍 수남벚꽃길에 위치한 대형 정원 베이커리 카페로, 넓은 야외 잔디밭과 동반 전용 공간에서 반려견과 여유로운 시간을 보낼 수 있습니다.',
      EN: 'A spacious garden bakery cafe along Sunam Cherry Blossom Road welcoming dogs in its outdoor lawn and pet zones.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 삼남읍 수남벚꽃길 9',
          EN: '9, Sunambeotkkot-gil, Samnam-eup, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 견종 동반 가능 · 실내(동반 구역) 및 야외 정원 동반 가능',
          EN: 'All dog sizes welcome in designated indoor pet zones and outdoor gardens',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '월~목 08:30~21:00 · 금~일 08:30~22:00 (연중무휴)',
          EN: 'Mon–Thu 08:30–21:00 · Fri–Sun 08:30–22:00 (Open year-round)',
        },
      },
    ],
  },
  {
    id: 'pet-dining-littleteagarden',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '리틀티가든',
      EN: 'Little Tea Garden',
    },
    desc: {
      KR: '영남알프스 인근 울주군 상북면의 고즈넉한 정원 티 카페로, 초록빛 야외 정원 테이블에서 반려견과 함께 향긋한 차와 디저트를 즐길 수 있습니다.',
      EN: 'A serene garden tea house near the Yeongnam Alps with lush outdoor tables welcoming dogs.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 상북면 신기길 50-1',
          EN: '50-1, Singi-gil, Sangbuk-myeon, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 견종 야외 정원 동반 가능 (목줄 필수 · 대형견 입마개 지참)',
          EN: 'All dog sizes welcome in the outdoor garden (leash required)',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '월~금 10:00~18:00 · 토~일 10:00~20:00 (연중무휴)',
          EN: 'Mon–Fri 10:00–18:00 · Sat–Sun 10:00–20:00 (Open year-round)',
        },
      },
    ],
  },
  {
    id: 'pet-dining-cocomatto',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '코코마또',
      EN: 'Cocomatto Pet-Friendly Cafe',
    },
    desc: {
      KR: '울산 북구 무룡로에 자리한 반려견 친화 카페로, 실내와 야외 공간 모두에서 반려동물과 편안하게 브런치와 음료를 즐길 수 있습니다.',
      EN: 'A cozy pet-friendly cafe on Muryong-ro in Buk-gu welcoming dogs both indoors and outdoors.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 북구 무룡로 995',
          EN: '995, Muryong-ro, Buk-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 견종 동반 가능 · 실내 및 실외 모두 동반 가능',
          EN: 'All dog sizes welcome both indoors and outdoors',
        },
      },
      {
        label: { KR: '운영시간', EN: 'Hours' },
        value: {
          KR: '매일 12:00 ~ 19:00 (연중무휴 · 주차 가능)',
          EN: 'Daily 12:00 – 19:00 (Open year-round; parking available)',
        },
      },
    ],
  },
  {
    id: 'pet-dining-gaerini',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '개린이세상',
      EN: 'Gaerini World Dog Cafe',
    },
    desc: {
      KR: '울산 남구 도심 속에서 반려견들이 날씨에 구애받지 않고 실내에서 신나게 교감하며 보호자와 쉬어갈 수 있는 애견 동반 카페입니다.',
      EN: 'An indoor dog cafe in downtown Nam-gu where dogs of all sizes can play and socialize regardless of the weather.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 정동로80번길 4',
          EN: '4, Jeongdong-ro 80beon-gil, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 견종 실내 동반 가능 · 매일 08:00 ~ 19:00 운영',
          EN: 'All dog sizes welcome indoors · Open daily 08:00 – 19:00',
        },
      },
    ],
  },
  {
    id: 'pet-dining-petvillage',
    category: 'pet',
    petSub: 'dining',
    badge: { KR: '반려동물 · 동반카페·식당', EN: 'Pet-Friendly · Dining & Cafe' },
    title: {
      KR: '펫빌리지',
      EN: 'Pet Village Cafe',
    },
    desc: {
      KR: '울산 중구 성남동·중앙길 인근에서 반려견과 함께 실내 입장이 가능해 도심 나들이 중 편하게 들르기 좋은 반려동물 카페입니다.',
      EN: 'A welcoming indoor pet cafe in Jung-gu ideal for a relaxing stop during a downtown Ulsan stroll.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 중구 중앙길 90-2',
          EN: '90-2, Jungang-gil, Jung-gu, Ulsan',
        },
      },
      {
        label: { KR: '동반안내', EN: 'Pet Policy' },
        value: {
          KR: '전 견종 실내 동반 가능 · 금~수 13:00 ~ 21:00 (매주 목요일 휴무)',
          EN: 'All dog sizes welcome indoors · Fri–Wed 13:00 – 21:00 (Closed Thursdays)',
        },
      },
    ],
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
    id: 'gourmet-brunch-orosalt',
    category: 'gourmet',
    gourmetSub: 'brunch',
    badge: { KR: '식도락 · 브런치', EN: 'Gourmet · Brunch' },
    title: {
      KR: '오로솔트 (OROSALT)',
      EN: 'OROSALT (Maegok-dong Brunch)',
    },
    desc: {
      KR: '울산 북구 매곡동에 위치한 감성 브런치 카페 겸 작은 그로서리샵으로, 직접 끓인 수제 소스와 신선한 계절 과일이 듬뿍 올라간 프렌치토스트, 바질 새우 리소또가 인기입니다.',
      EN: 'A cozy brunch cafe and mini grocery shop in Maegok-dong beloved for fruit-topped French toast, basil shrimp cream risotto, and house-made sauces.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 북구 신기3길 19-19 1층 (매곡동)',
          EN: '1F, 19-19, Singi 3-gil, Buk-gu, Ulsan (Maegok-dong)',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '과일 프렌치토스트 · 바질 새우 크림 리소또 · 비프 머쉬룸 파스타 · 포카치아 샌드위치',
          EN: 'Fruit French toast, basil shrimp cream risotto, beef mushroom pasta & focaccia sandwich',
        },
      },
    ],
  },
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
    id: 'gourmet-rest-mugeo-gondre',
    category: 'gourmet',
    gourmetSub: 'restaurant',
    badge: { KR: '식도락 · 음식점', EN: 'Gourmet · Restaurant' },
    title: {
      KR: '곤드레 산나물밥집',
      EN: 'Gondre Wild Herb Rice Restaurant (Mugeo-dong)',
    },
    desc: {
      KR: '울산 남구 무거동에 위치한 건강한 한식 맛집으로, 향긋한 곤드레 나물과 들깨가루를 듬뿍 올려 지어낸 구수한 곤드레 돌솥밥과 고소한 들기름 두부구이를 맛볼 수 있습니다.',
      EN: 'A beloved Korean restaurant in Mugeo-dong serving fragrant Gondre (thistle herb) stone-pot rice with savory soybean paste and perilla-oil grilled tofu.',
    },
    ktoThumbKeys: [],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 삼호로7번길 53 (무거동)',
          EN: '53, Samho-ro 7beon-gil, Nam-gu, Ulsan (Mugeo-dong)',
        },
      },
      {
        label: { KR: '대표메뉴', EN: 'Menu' },
        value: {
          KR: '곤드레 돌솥밥 (강된장·양념간장) · 들기름 두부구이 · 메밀전병',
          EN: 'Gondre stone-pot rice, perilla-oil grilled tofu & buckwheat crepes',
        },
      },
    ],
  },
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
  // 3. 명소 (attraction) - 장소 하나하나 개별 소개 (전체 / 자연·정원 / 해안·일출 / 역사·유산 / 전망·야경)
  // ==========================================
  {
    id: 'attraction-taehwagang-garden',
    category: 'attraction',
    attractionSub: 'nature',
    badge: { KR: '명소 · 자연·정원', EN: 'Attraction · Nature & Garden' },
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
    id: 'attraction-daewangam',
    category: 'attraction',
    attractionSub: 'coast',
    badge: { KR: '명소 · 해안·일출', EN: 'Attraction · Coast & Sunrise' },
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
    id: 'attraction-ganjeolgot',
    category: 'attraction',
    attractionSub: 'coast',
    badge: { KR: '명소 · 해안·일출', EN: 'Attraction · Coast & Sunrise' },
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
    id: 'attraction-bangudae',
    category: 'attraction',
    attractionSub: 'heritage',
    badge: { KR: '명소 · 역사·문화유산', EN: 'Attraction · Heritage' },
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
    id: 'attraction-ulsan-bridge',
    category: 'attraction',
    attractionSub: 'view',
    badge: { KR: '명소 · 전망·야경', EN: 'Attraction · View & Nightscape' },
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
    attractionSub: 'heritage',
    badge: { KR: '명소 · 역사·문화유산', EN: 'Attraction · Heritage' },
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
  {
    id: 'attraction-seonam-lake',
    category: 'attraction',
    attractionSub: 'nature',
    badge: { KR: '명소 · 자연·정원', EN: 'Attraction · Nature & Garden' },
    title: {
      KR: '선암호수공원',
      EN: 'Seonam Lake Park',
    },
    desc: {
      KR: '울산 남구 도심 속 잔잔한 호수를 따라 무장애 수변 데크길과 연꽃군락지, 초미니 종교 건축물 테마쉼터가 이어지는 생태 호수공원입니다.',
      EN: 'A tranquil urban lake park circled by flat waterside boardwalks, lotus ponds, and miniature architectural shrines.',
    },
    ktoThumbKeys: ['seonamLake'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 선암호수길 104 (선암동)',
          EN: '104, Seonamhosu-gil, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '호수 둘레 수변 산책데크(약 4km) · 무지개놀이터 · 계절별 벚꽃·연꽃 산책길',
          EN: '4km flat lakeside boardwalk, lotus ponds & seasonal cherry blossom promenade',
        },
      },
    ],
  },
  {
    id: 'attraction-ulsan-grandpark',
    category: 'attraction',
    attractionSub: 'nature',
    badge: { KR: '명소 · 자연·정원', EN: 'Attraction · Nature & Garden' },
    title: {
      KR: '울산대공원 (장미원 & 메타세쿼이아길)',
      EN: 'Ulsan Grand Park (Rose Garden & Metasequoia Path)',
    },
    desc: {
      KR: '여의도 면적의 1.3배에 달하는 국내 최대 규모 도심 생태공원으로, 300만 송이 장미가 피는 장미원과 초록빛 메타세쿼이아 숲길이 평탄하게 이어집니다.',
      EN: 'One of Korea’s largest urban eco-parks featuring a 3-million-bloom Rose Garden, butterfly house, and flat metasequoia trails.',
    },
    ktoThumbKeys: ['grandParkZoo'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 남구 대공원로 94 (옥동)',
          EN: '94, Daegongwon-ro, Nam-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '장미원 & 동물원 · 생태여행관(나비식물원) · 느티나무 산책로 & 풍차 광장',
          EN: 'Rose Garden, Zoo, Butterfly Eco Center & windmill lake promenade',
        },
      },
    ],
  },
  {
    id: 'attraction-seuldo',
    category: 'attraction',
    attractionSub: 'coast',
    badge: { KR: '명소 · 해안·일출', EN: 'Attraction · Coast & Sunrise' },
    title: {
      KR: '슬도 & 소리체험관',
      EN: 'Seuldo Island & Sound Experience Center',
    },
    desc: {
      KR: '바위섬 구멍마다 파도가 부딪히며 거문고 소리를 내는 신비로운 바위섬 슬도와 하얀 등대, 방어진 바다를 잇는 평탄한 해안 산책 명소입니다.',
      EN: 'A porous volcanic rock island that sings like a zither when waves crash, connected by a flat seawall walk to a white lighthouse.',
    },
    ktoThumbKeys: ['daewangam'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 동구 성끝길 103 (방어동)',
          EN: '103, Seongkkeut-gil, Dong-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '슬도 하얀 등대 포토존 · 슬도바다길 해안데크 · 울산동구 소리체험관',
          EN: 'White lighthouse photo spot, coastal boardwalk & Sound Experience Center',
        },
      },
    ],
  },
  {
    id: 'attraction-oegosan-onggi',
    category: 'attraction',
    attractionSub: 'heritage',
    badge: { KR: '명소 · 역사·문화유산', EN: 'Attraction · Heritage' },
    title: {
      KR: '외고산 옹기마을',
      EN: 'Oegosan Onggi Village',
    },
    desc: {
      KR: '전국 전통 옹기의 절반 이상을 구워내는 국내 최대 옹기 집산지로, 수천 개의 항아리가 늘어선 황토 돌담길과 울산옹기박물관을 함께 둘러볼 수 있습니다.',
      EN: 'Korea’s largest traditional pottery village lined with earthen stone walls, giant kilns, and the Ulsan Onggi Museum.',
    },
    ktoThumbKeys: ['onggiVillage'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 울주군 온양읍 외고산3길 36',
          EN: '36, Oegosan 3-gil, Onyang-eup, Ulju-gun, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '전통 옹기 가마 & 황토 담장 골목 · 울산옹기박물관 · 세계 최대 옹기 포토존',
          EN: 'Traditional climbing kilns, earthen jar alleys & world’s largest Onggi jar',
        },
      },
    ],
  },
  {
    id: 'attraction-hamwolsan',
    category: 'attraction',
    attractionSub: 'view',
    badge: { KR: '명소 · 전망·야경', EN: 'Attraction · View & Nightscape' },
    title: {
      KR: '함월루 (도심 파노라마 야경 누각)',
      EN: 'Hamwollu Pavilion (Panoramic City Night View)',
    },
    desc: {
      KR: '달을 품은 산이라는 뜻의 중구 함월산 자락에 세워진 전통 한옥 누각으로, 울산 도심과 태화강, 울산대교까지 한눈에 펼쳐지는 일몰·야경 명소입니다.',
      EN: 'A traditional hilltop pavilion in Jung-gu offering sweeping sunset and nighttime views over downtown Ulsan and the Taehwagang River.',
    },
    ktoThumbKeys: ['taehwaru'],
    programInfo: [
      {
        label: { KR: '위치', EN: 'Location' },
        value: {
          KR: '울산 중구 성안옛길 137 (성안동)',
          EN: '137, Seongan-yet-gil, Jung-gu, Ulsan',
        },
      },
      {
        label: { KR: '주요볼거리', EN: 'Highlights' },
        value: {
          KR: '전통 누각 야간 경관조명 · 울산 도심 파노라마 전망 · 누각 바로 앞 주차장 완비',
          EN: 'Illuminated traditional pavilion, city skyline panorama & adjacent parking lot',
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
  itineraryCourseId: string | null;
  petSub: PetSubTab;
  gourmetSub: GourmetSubTab;
  attractionSub: AttractionSubTab;
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
      'stamp',
      'pet',
      'gourmet',
      'attraction',
      'experience',
    ];
    const validItineraryIds = CURATED_COURSES.filter(
      (c) => c.category === 'itinerary',
    ).map((c) => c.id);
    const validPetSubs: PetSubTab[] = [
      'all',
      'walk',
      'park',
      'activity',
      'dining',
    ];
    const validGourmetSubs: GourmetSubTab[] = [
      'all',
      'cafe',
      'brunch',
      'restaurant',
      'dessert',
    ];
    const validAttractionSubs: AttractionSubTab[] = [
      'all',
      'nature',
      'coast',
      'heritage',
      'view',
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
      itineraryCourseId:
        sub === 'itinerary' && sub2 && validItineraryIds.includes(sub2)
          ? sub2
          : null,
      petSub:
        sub === 'pet' && sub2 && validPetSubs.includes(sub2 as PetSubTab)
          ? (sub2 as PetSubTab)
          : 'all',
      gourmetSub:
        sub === 'gourmet' && sub2 && validGourmetSubs.includes(sub2 as GourmetSubTab)
          ? (sub2 as GourmetSubTab)
          : 'all',
      attractionSub:
        sub === 'attraction' &&
        sub2 &&
        validAttractionSubs.includes(sub2 as AttractionSubTab)
          ? (sub2 as AttractionSubTab)
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
      itineraryCourseId: null,
      petSub: 'all',
      gourmetSub: 'all',
      attractionSub: 'all',
      experienceSub: 'all',
      scheduleFilter: sub && validSeasons.includes(sub) ? sub : 'all_seasons',
    };
  }
  return {
    tab: 'home',
    courseCategory: 'itinerary',
    itineraryCourseId: null,
    petSub: 'all',
    gourmetSub: 'all',
    attractionSub: 'all',
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
  const ui = UI_TEXT[lang];
  if (thumbs.length === 0) return null;

  if (thumbs.length === 1) {
    const single = thumbs[0];
    return (
      <div className="kto-single-wrap" aria-label={ui.ktoPhotoSingleAria}>
        <img
          src={single.imageUrl}
          alt={getKtoThumbCaption(single, lang)}
          className="kto-single-img"
          loading="lazy"
          onError={(e) => {
            const parent = e.currentTarget.parentElement;
            if (parent) parent.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className="kto-thumbs" aria-label={ui.ktoPhotoMultiAria}>
      {thumbs.map((thumb) => {
        const caption = getKtoThumbCaption(thumb, lang);
        return (
          <div key={thumb.contentId || thumb.imageUrl} className="kto-thumb-item">
            <img
              src={thumb.imageUrl}
              alt={caption}
              className="kto-thumb-img"
              loading="lazy"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) parent.style.display = 'none';
              }}
            />
            <span className="kto-thumb-caption">{caption}</span>
          </div>
        );
      })}
    </div>
  );
}

interface CuratedCourseRowProps {
  course: CuratedCourseItem;
  isExpanded: boolean;
  onToggle: () => void;
  lang: Lang;
}

function getMapSearchQuery(course: CuratedCourseItem): string {
  if (course.id === 'experience-tour-bangucheon-program') {
    return '울산암각화박물관';
  }
  if (course.id === 'gourmet-rest-mugeo-gondre') {
    return '울산 남구 삼호로7번길 53 곤드레산나물밥집';
  }
  if (course.id === 'pet-walk-taehwagang') {
    return '울산 태화강 국가정원';
  }
  if (course.id === 'pet-walk-daewangam') {
    return '울산 대왕암공원';
  }
  if (course.id === 'pet-walk-ganjeolgot') {
    return '울산 간절곶';
  }
  if (course.id === 'pet-park-munsu') {
    return '울산 남구 문수애견공원';
  }
  if (course.id === 'pet-activity-yacht') {
    return '울산 일산해수욕장 요트투어';
  }
  if (course.category === 'itinerary' && course.stops?.KR[0]) {
    return `울산 ${course.stops.KR[0]}`;
  }
  const cleanTitle = course.title.KR.replace(/\([^)]*\)/g, '').trim();
  return cleanTitle.startsWith('울산') ? cleanTitle : `울산 ${cleanTitle}`;
}

function CuratedCourseRow({
  course,
  isExpanded,
  onToggle,
  lang,
}: CuratedCourseRowProps) {
  const thumbs = useKtoCourseThumbs(course.ktoThumbKeys);
  const mainThumb = thumbs[0];
  const [thumbFailed, setThumbFailed] = useState(false);
  const ui = UI_TEXT[lang];
  const localizedTitle = getCourseTitle(course, lang);
  const localizedDesc = getCourseDesc(course, lang);
  const localizedProgramInfo = getCourseProgramInfo(course, lang);
  const localizedProgramNote = getCourseProgramNote(course, lang);
  const localizedStops = getCourseStops(course, lang);
  const shortThumbTitle = localizedTitle
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*（[^）]*）/g, '')
    .trim();
  const mapQuery = getMapSearchQuery(course);
  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(mapQuery)}`;
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;

  return (
    <article className={`curated-item ${isExpanded ? 'expanded' : ''}`}>
      <button
        type="button"
        className="course-title-btn"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <span className="course-title-left">
          {mainThumb && !thumbFailed ? (
            <img
              src={mainThumb.imageUrl}
              alt={getKtoThumbCaption(mainThumb, lang)}
              className="course-main-thumb"
              loading="lazy"
              onError={() => {
                setThumbFailed(true);
              }}
            />
          ) : (
            <span className="course-text-thumb" aria-hidden="true">
              {shortThumbTitle}
            </span>
          )}
          <span className="course-title-text">{localizedTitle}</span>
        </span>
        <span className="course-toggle-mark" aria-hidden="true">
          ▾
        </span>
      </button>

      {isExpanded && (
        <div className="course-detail-panel">
          <p className="curated-desc">{localizedDesc}</p>

          <KtoThumbnailRow
            presetKeys={course.ktoThumbKeys}
            lang={lang}
          />

          {localizedProgramInfo.length > 0 && (
            <dl className="program-details">
              {localizedProgramInfo.map((row) => (
                <React.Fragment key={row.key}>
                  <dt className="program-dt">{row.label}</dt>
                  <dd className="program-dd">{row.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}

          {localizedProgramNote && (
            <p className="program-note">{localizedProgramNote}</p>
          )}

          {localizedStops.length > 0 && (
            <div className="curated-flow">
              {localizedStops.map((stopName, idx) => (
                <React.Fragment key={stopName}>
                  <span className="flow-step">
                    <span className="flow-num">{idx + 1}</span>
                    <span>{stopName}</span>
                  </span>
                  {idx < localizedStops.length - 1 && (
                    <span className="flow-arrow">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="map-links-row">
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn naver"
            >
              <span className="map-badge-dot naver-dot" aria-hidden="true">
                N
              </span>
              <span>{ui.naverMapBtn}</span>
            </a>
            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn google"
            >
              <span className="map-badge-dot google-dot" aria-hidden="true">
                G
              </span>
              <span>{ui.googleMapBtn}</span>
            </a>
          </div>
        </div>
      )}
    </article>
  );
}

interface MapPinCoord {
  x: number;
  y: number;
  dotX?: number;
  dotY?: number;
  shortKR: string;
  shortEN: string;
  dir?: 'right' | 'left';
  featured?: boolean;
}

const ULSAN_MAP_COORDS: Record<string, MapPinCoord> = {
  // 반려동물 (pet) - 손그림 일러스트 지도 여백 배치 + 실제 랜드마크 지시점(dotX, dotY)
  'pet-walk-taehwagang': { x: 355, y: 416, dotX: 400, dotY: 322, shortKR: '태화강 국가정원', shortEN: 'Taehwagang Garden', dir: 'right', featured: true },
  'pet-walk-daewangam': { x: 612, y: 175, dotX: 645, dotY: 235, shortKR: '대왕암공원', shortEN: 'Daewangam Park', dir: 'right', featured: true },
  'pet-walk-ganjeolgot': { x: 492, y: 526, dotX: 542, dotY: 458, shortKR: '간절곶 잔디광장', shortEN: 'Ganjeolgot Plaza', dir: 'right', featured: true },
  'pet-walk-somanggil': { x: 525, y: 555, dotX: 568, dotY: 455, shortKR: '간절곶 소망길', shortEN: 'Somang-gil Trail', dir: 'right', featured: false },
  'pet-walk-seonam': { x: 455, y: 318, dotX: 472, dotY: 358, shortKR: '선암호수공원', shortEN: 'Seonam Lake Park', dir: 'right', featured: true },
  'pet-walk-grandpark': { x: 375, y: 448, dotX: 425, dotY: 362, shortKR: '울산대공원', shortEN: 'Ulsan Grand Park', dir: 'right', featured: false },
  'pet-walk-arboretum': { x: 525, y: 192, dotX: 585, dotY: 222, shortKR: '테마식물수목원', shortEN: 'Botanical Arboretum', dir: 'right', featured: false },
  'pet-park-anian': { x: 425, y: 156, dotX: 472, dotY: 185, shortKR: '애니언파크', shortEN: 'Anian Pet Park', dir: 'right', featured: true },
  'pet-park-munsu': { x: 198, y: 348, dotX: 325, dotY: 348, shortKR: '문수 울산애견공원', shortEN: 'Munsu Dog Park', dir: 'right', featured: true },
  'pet-park-meongsup': { x: 262, y: 456, dotX: 252, dotY: 428, shortKR: '멍숲 애견파크', shortEN: 'Meongsup Park', dir: 'right', featured: true },
  'pet-park-gaedeulland': { x: 395, y: 538, dotX: 482, dotY: 468, shortKR: '개들랜드', shortEN: 'Gaedeul Land', dir: 'right', featured: false },
  'pet-activity-yacht': { x: 625, y: 332, dotX: 595, dotY: 336, shortKR: '요트투어', shortEN: 'Pet Yacht Tour', dir: 'right', featured: true },
  'pet-activity-fe01': { x: 358, y: 492, dotX: 462, dotY: 465, shortKR: 'Fe01 정크아트공원', shortEN: 'Fe01 Art Park', dir: 'right', featured: true },
  'pet-activity-onggi': { x: 148, y: 532, dotX: 210, dotY: 468, shortKR: '외고산 옹기마을', shortEN: 'Onggi Village', dir: 'right', featured: true },
  'pet-activity-sinhwa': { x: 472, y: 392, dotX: 498, dotY: 365, shortKR: '울산 신화마을', shortEN: 'Sinhwa Village', dir: 'right', featured: false },
  'pet-activity-camping': { x: 335, y: 175, dotX: 412, dotY: 205, shortKR: '황방산생태야영장', shortEN: 'Eco Campground', dir: 'right', featured: false },
  'pet-dining-siseon310': { x: 515, y: 556, dotX: 558, dotY: 462, shortKR: '시선310 간절곶', shortEN: 'Siseon 310', dir: 'right', featured: false },
  'pet-dining-lamerpanji': { x: 592, y: 132, dotX: 608, dotY: 168, shortKR: '라메르판지', shortEN: 'La Mer Panji', dir: 'right', featured: true },
  'pet-dining-badadokchaji': { x: 505, y: 552, dotX: 548, dotY: 452, shortKR: '바다독차지', shortEN: 'Bada Dokchaji', dir: 'right', featured: false },
  'pet-dining-innerit': { x: 132, y: 185, dotX: 182, dotY: 228, shortKR: '이너리트', shortEN: 'INNERIT Cafe', dir: 'right', featured: true },
  'pet-dining-littleteagarden': { x: 215, y: 162, dotX: 245, dotY: 225, shortKR: '리틀티가든', shortEN: 'Little Tea Garden', dir: 'right', featured: false },
  'pet-dining-cocomatto': { x: 485, y: 182, dotX: 515, dotY: 205, shortKR: '코코마또', shortEN: 'Cocomatto', dir: 'right', featured: false },
  'pet-dining-gaerini': { x: 438, y: 386, dotX: 468, dotY: 352, shortKR: '개린이세상', shortEN: 'Gaerini World', dir: 'right', featured: false },
  'pet-dining-petvillage': { x: 342, y: 182, dotX: 418, dotY: 215, shortKR: '펫빌리지', shortEN: 'Pet Village', dir: 'right', featured: false },

  // 식도락 (gourmet)
  'gourmet-cafe-siseon310': { x: 492, y: 526, dotX: 542, dotY: 458, shortKR: '시선310 간절곶점', shortEN: 'Siseon 310', dir: 'right', featured: true },
  'gourmet-cafe-orto': { x: 358, y: 492, dotX: 462, dotY: 465, shortKR: '오르토커피', shortEN: 'Orto Coffee', dir: 'right', featured: true },
  'gourmet-cafe-camonsi': { x: 335, y: 175, dotX: 412, dotY: 215, shortKR: '카몬시', shortEN: 'Camonsi Cafe', dir: 'right', featured: true },
  'gourmet-brunch-lamerpanji': { x: 592, y: 132, dotX: 608, dotY: 168, shortKR: '라메르판지', shortEN: 'La Mer Panji', dir: 'right', featured: true },
  'gourmet-brunch-ricopasto': { x: 355, y: 416, dotX: 400, dotY: 322, shortKR: '리코파스토', shortEN: 'Rico Pasto', dir: 'right', featured: true },
  'gourmet-brunch-heydining': { x: 455, y: 318, dotX: 472, dotY: 358, shortKR: '헤이다이닝', shortEN: 'Hey Dining', dir: 'right', featured: true },
  'gourmet-brunch-orosalt': { x: 452, y: 152, dotX: 485, dotY: 185, shortKR: '오로솔트', shortEN: 'OROSALT', dir: 'right', featured: true },
  'gourmet-rest-bulgogi': { x: 132, y: 185, dotX: 182, dotY: 228, shortKR: '언양 한우불고기', shortEN: 'Eonyang Bulgogi', dir: 'right', featured: true },
  'gourmet-rest-eonyang-bulgogi': { x: 132, y: 185, dotX: 182, dotY: 228, shortKR: '언양 한우불고기', shortEN: 'Eonyang Bulgogi', dir: 'right', featured: true },
  'gourmet-rest-mugeo-gondre': { x: 198, y: 348, dotX: 325, dotY: 348, shortKR: '곤드레 산나물밥집', shortEN: 'Gondre Rice', dir: 'right', featured: true },
  'gourmet-rest-seafood': { x: 612, y: 175, dotX: 645, dotY: 235, shortKR: '방어진 활어회센터', shortEN: 'Bangeojin Seafood', dir: 'right', featured: true },
  'gourmet-rest-bangeojin-seafood': { x: 612, y: 175, dotX: 645, dotY: 235, shortKR: '방어진 활어회센터', shortEN: 'Bangeojin Seafood', dir: 'right', featured: true },
  'gourmet-rest-octopus': { x: 262, y: 456, dotX: 475, dotY: 468, shortKR: '간절곶 돌문어', shortEN: 'Octopus Dining', dir: 'right', featured: true },
  'gourmet-rest-ganjeolgot-octopus': { x: 262, y: 456, dotX: 475, dotY: 468, shortKR: '간절곶 돌문어', shortEN: 'Octopus Dining', dir: 'right', featured: true },
  'gourmet-dessert-papason': { x: 148, y: 532, dotX: 255, dotY: 468, shortKR: '파파앤썬 베이커리', shortEN: 'Papa & Son', dir: 'right', featured: true },
  'gourmet-dessert-papaandson': { x: 148, y: 532, dotX: 255, dotY: 468, shortKR: '파파앤썬 베이커리', shortEN: 'Papa & Son', dir: 'right', featured: true },
  'gourmet-dessert-bonmilk': { x: 525, y: 555, dotX: 568, dotY: 455, shortKR: '본밀크 디저트', shortEN: 'BONMILK', dir: 'right', featured: false },

  // 명소 (attraction)
  'attraction-taehwagang-garden': { x: 355, y: 416, dotX: 400, dotY: 322, shortKR: '태화강 국가정원', shortEN: 'Taehwagang Garden', dir: 'right', featured: true },
  'attraction-daewangam': { x: 612, y: 175, dotX: 645, dotY: 235, shortKR: '대왕암공원', shortEN: 'Daewangam Park', dir: 'right', featured: true },
  'attraction-ganjeolgot': { x: 492, y: 526, dotX: 542, dotY: 458, shortKR: '간절곶', shortEN: 'Ganjeolgot Cape', dir: 'right', featured: true },
  'attraction-bangudae': { x: 132, y: 185, dotX: 135, dotY: 355, shortKR: '반구대 암각화', shortEN: 'Bangudae Petroglyphs', dir: 'right', featured: true },
  'attraction-ulsan-bridge': { x: 625, y: 332, dotX: 565, dotY: 282, shortKR: '울산대교 전망대', shortEN: 'Bridge Observatory', dir: 'right', featured: true },
  'attraction-taehwaru': { x: 335, y: 175, dotX: 382, dotY: 265, shortKR: '태화루', shortEN: 'Taehwaru Pavilion', dir: 'right', featured: true },
  'attraction-seonam-lake': { x: 455, y: 318, dotX: 472, dotY: 358, shortKR: '선암호수공원', shortEN: 'Seonam Lake Park', dir: 'right', featured: true },
  'attraction-ulsan-grandpark': { x: 198, y: 348, dotX: 355, dotY: 355, shortKR: '울산대공원', shortEN: 'Ulsan Grand Park', dir: 'right', featured: true },
  'attraction-seuldo': { x: 592, y: 132, dotX: 678, dotY: 278, shortKR: '슬도 & 소리체험관', shortEN: 'Seuldo Island', dir: 'right', featured: true },
  'attraction-oegosan-onggi': { x: 148, y: 532, dotX: 210, dotY: 468, shortKR: '외고산 옹기마을', shortEN: 'Onggi Village', dir: 'right', featured: true },
  'attraction-hamwolsan': { x: 452, y: 148, dotX: 438, dotY: 195, shortKR: '함월루 전망누각', shortEN: 'Hamwollu View', dir: 'right', featured: true },

  // 체험 (experience)
  'experience-tour-bangucheon-program': { x: 132, y: 185, dotX: 145, dotY: 335, shortKR: '반구천을 누비다', shortEN: 'Bangucheon Tour', dir: 'right', featured: true },
  'experience-tour-whale-village': { x: 455, y: 318, dotX: 512, dotY: 358, shortKR: '고래문화마을·모노레일', shortEN: 'Whale Village', dir: 'right', featured: true },
  'experience-tour-whale-cruise': { x: 625, y: 332, dotX: 595, dotY: 336, shortKR: '고래바다여행선', shortEN: 'Whale Cruise', dir: 'right', featured: true },
  'experience-tour-monorail': { x: 455, y: 318, dotX: 512, dotY: 358, shortKR: '장생포 모노레일', shortEN: 'Monorail', dir: 'right', featured: true },
  'experience-workshop-whale-village': { x: 485, y: 182, dotX: 522, dotY: 348, shortKR: '고래문화마을 공방', shortEN: 'Whale Village', dir: 'right', featured: true },
  'experience-workshop-onggi': { x: 148, y: 532, dotX: 210, dotY: 468, shortKR: '외고산 옹기공방', shortEN: 'Onggi Workshop', dir: 'right', featured: true },
  'experience-workshop-onggi-village': { x: 148, y: 532, dotX: 210, dotY: 468, shortKR: '외고산 옹기공방', shortEN: 'Onggi Workshop', dir: 'right', featured: true },
  'experience-museum-petroglyph': { x: 198, y: 348, dotX: 155, dotY: 355, shortKR: '울산암각화박물관', shortEN: 'Petroglyph Museum', dir: 'right', featured: true },
  'experience-museum-whale': { x: 492, y: 526, dotX: 535, dotY: 368, shortKR: '장생포 고래박물관', shortEN: 'Whale Museum', dir: 'right', featured: true },
  'experience-museum-ulsan': { x: 355, y: 416, dotX: 400, dotY: 332, shortKR: '울산박물관', shortEN: 'Ulsan Museum', dir: 'right', featured: true },
  'experience-activity-whale-eco': { x: 358, y: 492, dotX: 528, dotY: 375, shortKR: '고래생태체험관', shortEN: 'Whale Eco Center', dir: 'right', featured: true },
  'experience-activity-daewangam-bridge': { x: 612, y: 175, dotX: 565, dotY: 268, shortKR: '대왕암 출렁다리', shortEN: 'Suspension Bridge', dir: 'right', featured: true },
  'experience-activity-zoo': { x: 262, y: 456, dotX: 385, dotY: 368, shortKR: '울산대공원 동물원', shortEN: 'Grand Park Zoo', dir: 'right', featured: true },
  'experience-activity-ulsan-zoo': { x: 262, y: 456, dotX: 385, dotY: 368, shortKR: '울산대공원 동물원', shortEN: 'Grand Park Zoo', dir: 'right', featured: true },
};

interface UlsanIllustratedMapProps {
  category: CourseCategoryTab;
  courses: CuratedCourseItem[];
  lang: Lang;
}

interface CategoryLegendItem {
  key: string;
  color: string;
  getLabel: (lang: Lang) => string;
}

const MAP_CATEGORY_LEGENDS: Partial<Record<CourseCategoryTab, CategoryLegendItem[]>> = {
  pet: [
    { key: 'walk', color: '#3B8C62', getLabel: (l) => UI_TEXT[l].petSubWalk },
    { key: 'park', color: '#3A7BB8', getLabel: (l) => UI_TEXT[l].petSubPark },
    { key: 'activity', color: '#DC5648', getLabel: (l) => UI_TEXT[l].petSubActivity },
    { key: 'dining', color: '#D48124', getLabel: (l) => UI_TEXT[l].petSubDining },
  ],
  gourmet: [
    { key: 'cafe', color: '#DC5648', getLabel: (l) => UI_TEXT[l].gourmetSubCafe },
    { key: 'brunch', color: '#D48124', getLabel: (l) => UI_TEXT[l].gourmetSubBrunch },
    { key: 'restaurant', color: '#3B8C62', getLabel: (l) => UI_TEXT[l].gourmetSubRestaurant },
    { key: 'dessert', color: '#895B9E', getLabel: (l) => UI_TEXT[l].gourmetSubDessert },
  ],
  attraction: [
    { key: 'nature', color: '#3B8C62', getLabel: (l) => UI_TEXT[l].attractionSubNature },
    { key: 'coast', color: '#3A7BB8', getLabel: (l) => UI_TEXT[l].attractionSubCoast },
    { key: 'heritage', color: '#D48124', getLabel: (l) => UI_TEXT[l].attractionSubHeritage },
    { key: 'view', color: '#895B9E', getLabel: (l) => UI_TEXT[l].attractionSubView },
  ],
  experience: [
    { key: 'tour', color: '#3A7BB8', getLabel: (l) => UI_TEXT[l].experienceSubTour },
    { key: 'workshop', color: '#D48124', getLabel: (l) => UI_TEXT[l].experienceSubWorkshop },
    { key: 'museum', color: '#895B9E', getLabel: (l) => UI_TEXT[l].experienceSubMuseum },
    { key: 'activity', color: '#DC5648', getLabel: (l) => UI_TEXT[l].experienceSubActivity },
  ],
};

function getCoursePinColor(course: CuratedCourseItem): string {
  if (course.category === 'pet') {
    switch (course.petSub) {
      case 'walk':
        return '#3B8C62'; // 포레스트 그린 (산책명소)
      case 'park':
        return '#3A7BB8'; // 스카이 블루 (펫파크·놀이터)
      case 'activity':
        return '#DC5648'; // 코랄 다홍 (이색체험)
      case 'dining':
        return '#D48124'; // 앰버 골드 (동반카페·식당)
      default:
        return '#3B8C62';
    }
  }
  if (course.category === 'gourmet') {
    switch (course.gourmetSub) {
      case 'cafe':
        return '#DC5648';
      case 'brunch':
        return '#D48124';
      case 'restaurant':
        return '#3B8C62';
      case 'dessert':
        return '#895B9E';
      default:
        return '#DC5648';
    }
  }
  if (course.category === 'attraction') {
    switch (course.attractionSub) {
      case 'nature':
        return '#3B8C62'; // 포레스트 그린 (자연·정원)
      case 'coast':
        return '#3A7BB8'; // 스카이 블루 (해안·일출)
      case 'heritage':
        return '#D48124'; // 앰버 골드 (역사·문화유산)
      case 'view':
        return '#895B9E'; // 플럼 퍼플 (전망·야경)
      default:
        return '#3B8C62';
    }
  }
  if (course.category === 'experience') {
    switch (course.experienceSub) {
      case 'tour':
        return '#3A7BB8';
      case 'workshop':
        return '#D48124';
      case 'museum':
        return '#895B9E';
      case 'activity':
        return '#DC5648';
      default:
        return '#3A7BB8';
    }
  }
  return '#DC5648';
}

function UlsanIllustratedMap({ category, courses, lang }: UlsanIllustratedMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(courses[0]?.id ?? null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedId(courses[0]?.id ?? null);
  }, [category, courses.length]);

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectCourse = (id: string, scrollToCard = false) => {
    setSelectedId(id);
    if (scrollToCard) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

  const t = UI_TEXT[lang];
  const bannerTitles: Record<CourseCategoryTab, { main: string; sub: string }> = {
    pet: {
      main: 'ULSAN PET TRAVEL MAP',
      sub: t.bannerSubPet,
    },
    gourmet: {
      main: 'ULSAN GOURMET MAP',
      sub: t.bannerSubGourmet,
    },
    experience: {
      main: 'ULSAN EXPERIENCE MAP',
      sub: t.bannerSubExperience,
    },
    attraction: {
      main: 'ULSAN ATTRACTION MAP',
      sub: t.bannerSubAttraction,
    },
    itinerary: {
      main: 'ULSAN TRAVEL MAP',
      sub: t.bannerSubItinerary,
    },
    stamp: {
      main: 'ULSAN STAMP TOUR MAP',
      sub: t.catStamp,
    },
  };

  const banner = bannerTitles[category];
  const legendItems = MAP_CATEGORY_LEGENDS[category] || [];
  const selectedCourse = courses.find((c) => c.id === selectedId) || courses[0];
  const selectedIndex = courses.findIndex((c) => c.id === selectedCourse?.id);

  // Pins shown on the map: featured 12 pins + currently selected pin (so map stays clean & readable)
  const visiblePins = courses
    .map((course, idx) => {
      const coord = ULSAN_MAP_COORDS[course.id] || {
        x: 340 + ((idx * 47) % 210),
        y: 165 + ((idx * 61) % 330),
        shortKR: course.title.KR.replace(/\s*\([^)]*\)/g, '').slice(0, 9),
        shortEN: course.title.EN.replace(/\s*\([^)]*\)/g, '').slice(0, 14),
        dir: 'right' as const,
        featured: idx < 12,
      };
      return { course, idx, num: idx + 1, coord, pinColor: getCoursePinColor(course) };
    })
    .filter((item) => item.coord.featured || item.course.id === selectedId || item.idx < 12);

  return (
    <div className="ulsan-map-poster">
      {/* 카테고리별 원형 번호 색상 안내 범례 */}
      {legendItems.length > 0 && (
        <div
          className="map-category-legend"
          role="note"
          aria-label={t.mapLegendAria}
        >
          {legendItems.map((item) => (
            <span key={item.key} className="map-legend-chip">
              <span
                className="map-legend-dot"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span>{item.getLabel(lang)}</span>
            </span>
          ))}
        </div>
      )}

      {/* 1. 귀여운 울산 손그림 일러스트 지도 캔버스 */}
      <div className="ulsan-map-canvas-wrap">
        <svg
          className="ulsan-map-svg"
          viewBox="0 0 800 600"
          role="img"
          aria-label={`${banner.sub} ${t.mapSvgSuffix}`}
        >
          {/* 배경: 손그림 동화책 일러스트 지도 */}
          <image
            href="/ulsan-illustrated-map.jpg"
            x="0"
            y="0"
            width="800"
            height="600"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* 1단계: 실제 위치 점(dotX, dotY)과 여백의 번호 뱃지를 잇는 카테고리 색상 손그림 점선 */}
          {visiblePins.map(({ course, coord, pinColor }) => {
            const isSelected = course.id === selectedId || course.id === hoveredId;
            const targetX = coord.dotX ?? coord.x;
            const targetY = coord.dotY ?? coord.y;
            const hasLeader =
              coord.dotX !== undefined &&
              coord.dotY !== undefined &&
              Math.hypot(coord.x - targetX, coord.y - targetY) > 12;

            if (!hasLeader) return null;

            return (
              <g key={`leader-${course.id}`} style={{ pointerEvents: 'none' }}>
                {/* 부드러운 양피지 외곽선 후광으로 점선이 지도 위에서 깔끔하게 보이도록 처리 */}
                <line
                  x1={targetX}
                  y1={targetY}
                  x2={coord.x}
                  y2={coord.y}
                  stroke="#FAF1DF"
                  strokeWidth={isSelected ? '4.5' : '3.2'}
                  strokeLinecap="round"
                  opacity="0.88"
                />
                <line
                  x1={targetX}
                  y1={targetY}
                  x2={coord.x}
                  y2={coord.y}
                  stroke={pinColor}
                  strokeWidth={isSelected ? '2.4' : '1.6'}
                  strokeDasharray={isSelected ? 'none' : '3.5 3.5'}
                  strokeLinecap="round"
                />
                {/* 실제 위치에 찍히는 작고 정교한 이중 타겟 포인트 점 (카테고리 색상) */}
                <circle
                  cx={targetX}
                  cy={targetY}
                  r={isSelected ? '6.5' : '4.8'}
                  fill="#FAF1DF"
                  stroke={pinColor}
                  strokeWidth="2"
                />
                <circle
                  cx={targetX}
                  cy={targetY}
                  r={isSelected ? '3.4' : '2.4'}
                  fill={pinColor}
                />
              </g>
            );
          })}

          {/* 2단계: 카테고리별 색상이 적용된 귀여운 원형 번호 뱃지 & 투명 손글씨 잉크 라벨 */}
          {visiblePins.map(({ course, num, coord, pinColor }) => {
            const isSelected = course.id === selectedId;
            const isHovered = course.id === hoveredId;
            const isActive = isSelected || isHovered;
            const placeName = getMapPinLabel(course.id, coord, lang);
            const pinX = coord.x;
            const pinY = coord.y;

            return (
              <g
                key={course.id}
                className={`ulsan-map-pin ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectCourse(course.id, true)}
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* 선택 시 해당 카테고리 색상의 부드러운 수채화 후광 */}
                {isActive && (
                  <circle
                    cx={pinX}
                    cy={pinY}
                    r="17.5"
                    fill={pinColor}
                    opacity="0.32"
                  />
                )}

                {/* 배경 박스 없이 지도 위에 직접 펜으로 쓴 듯한 크림 외곽선(Halo) 손글씨 */}
                <text
                  x={pinX + 14.5}
                  y={pinY + 4.5}
                  textAnchor="start"
                  fontFamily="Gowun Dodum, serif"
                  fontSize={isActive ? '14.5' : '13'}
                  fontWeight="700"
                  fill={isActive ? pinColor : '#3A2A1E'}
                  stroke="#FAF1DF"
                  strokeWidth="5.2"
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  {placeName}
                </text>

                {/* 바깥 양피지 크림 테두리 원 (지도 배경 위에서 카테고리 색상이 또렷하게 돋보이도록) */}
                <circle
                  cx={pinX}
                  cy={pinY}
                  r={isActive ? '13' : '11.2'}
                  fill="#FAF1DF"
                />

                {/* 카테고리별 색상이 입혀진 손그림 원형 번호 스탬프 뱃지 */}
                <circle
                  cx={pinX}
                  cy={pinY}
                  r={isActive ? '11.5' : '10'}
                  fill={pinColor}
                  stroke="#3A2A1E"
                  strokeWidth={isActive ? '2.1' : '1.6'}
                />
                {/* 빈티지 안쪽 점선 테두리 링 */}
                <circle
                  cx={pinX}
                  cy={pinY}
                  r={isActive ? '9' : '7.7'}
                  fill="none"
                  stroke="rgba(255, 253, 249, 0.55)"
                  strokeWidth="0.9"
                  strokeDasharray="2 1.5"
                />
                <text
                  x={pinX}
                  y={pinY + 3.8}
                  textAnchor="middle"
                  fontFamily="Gowun Dodum, serif"
                  fontSize={isActive ? '11.5' : '10.5'}
                  fontWeight="800"
                  fill="#FFFDF9"
                >
                  {num}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. 지도에서 클릭한 장소의 상세 정보 & 네이버·구글 지도 바로가기 카드 */}
      {selectedCourse && (
        <div className="map-selected-card" ref={detailRef}>
          <div className="map-selected-head">
            <span
              className="map-selected-num"
              style={{ backgroundColor: getCoursePinColor(selectedCourse) }}
            >
              #{selectedIndex + 1}
            </span>
            <span className="map-selected-badge">{getCourseBadge(selectedCourse, lang)}</span>
          </div>
          <CuratedCourseRow
            course={selectedCourse}
            isExpanded={true}
            onToggle={() => {}}
            lang={lang}
          />
        </div>
      )}

      {/* 3. 하단 버킷리스트 보드 (예시 이미지 하단 MY BUCKET LIST 스타일) */}
      <div className="bucket-board">
        <div className="bucket-board-inner">
          <div className="bucket-header">
            <span className="bucket-flourish" aria-hidden="true">
              ∾ ✦
            </span>
            <h2 className="bucket-title">
              {banner.sub}
            </h2>
            <span className="bucket-flourish" aria-hidden="true">
              ✦ ∾
            </span>
          </div>
          <p className="bucket-sub">
            {t.bucketInstruction}
          </p>

          <div className="bucket-grid">
            {courses.map((course, idx) => {
              const isSelected = course.id === selectedId;
              const isChecked = checkedIds.includes(course.id);
              const shortName = getCourseTitle(course, lang).replace(/\s*\([^)]*\)/g, '').trim();
              const itemPinColor = getCoursePinColor(course);

              return (
                <div
                  key={course.id}
                  className={`bucket-item ${isSelected ? 'selected' : ''} ${
                    isChecked ? 'checked' : ''
                  }`}
                  onClick={() => handleSelectCourse(course.id, true)}
                >
                  <button
                    type="button"
                    className={`bucket-check ${isChecked ? 'checked' : ''}`}
                    aria-label={t.bucketCheckAria(shortName)}
                    onClick={(e) => toggleCheck(course.id, e)}
                  >
                    {isChecked ? '✓' : ''}
                  </button>
                  <span className="bucket-item-text">
                    <span
                      className="bucket-num-dot"
                      style={{ backgroundColor: itemPinColor }}
                    >
                      {idx + 1}
                    </span>
                    {shortName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ItineraryCourseCardProps {
  course: CuratedCourseItem;
  index: number;
  lang: Lang;
  onSelect: (path: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function ItineraryCourseCard({ course, index, lang, onSelect }: ItineraryCourseCardProps) {
  const thumbs = useKtoCourseThumbs(course.ktoThumbKeys);
  const mainThumb = thumbs[0];
  const [thumbFailed, setThumbFailed] = useState(false);
  const coursePath = `/courses/itinerary/${course.id}`;
  const themeColor = course.themeColor || '#3A7BB8';
  const stops = course.itineraryStops || [];
  const t = UI_TEXT[lang];

  return (
    <a
      href={coursePath}
      className="itinerary-route-card"
      onClick={(e) => onSelect(coursePath, e)}
    >
      <div className="itinerary-card-top">
        <div className="itinerary-card-thumb-wrap">
          {mainThumb && !thumbFailed ? (
            <img
              src={mainThumb.imageUrl}
              alt={getKtoThumbCaption(mainThumb, lang)}
              className="itinerary-card-thumb"
              loading="lazy"
              onError={() => setThumbFailed(true)}
            />
          ) : (
            <span
              className="itinerary-card-thumb-fallback"
              style={{ backgroundColor: themeColor }}
            >
              COURSE 0{index + 1}
            </span>
          )}
        </div>
        <div className="itinerary-card-info">
          <div className="itinerary-card-head">
            <span
              className="itinerary-course-pill"
              style={{ backgroundColor: themeColor }}
            >
              {getCourseBadge(course, lang)}
            </span>
            <span className="itinerary-map-cta">
              {t.viewRouteMapCta}
            </span>
          </div>
          <h2 className="itinerary-card-title">{getCourseTitle(course, lang)}</h2>
          <p className="itinerary-card-desc">{getCourseDesc(course, lang)}</p>
        </div>
      </div>

      {stops.length > 0 && (
        <div className="itinerary-card-steps">
          {stops.map((st, idx) => (
            <React.Fragment key={st.step}>
              <span className="itinerary-step-chip">
                <span
                  className="itinerary-step-num"
                  style={{ backgroundColor: st.color }}
                >
                  {st.step}
                </span>
                <span>{getItineraryStopField(course.id, st, 'shortMapName', lang)}</span>
              </span>
              {idx < stops.length - 1 && (
                <span className="itinerary-step-arrow" aria-hidden="true">
                  ➔
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </a>
  );
}

interface ItineraryCourseMapPageProps {
  course: CuratedCourseItem;
  allItineraryCourses: CuratedCourseItem[];
  lang: Lang;
  onNavigate: (path: string, e?: React.MouseEvent<HTMLAnchorElement>) => void;
}

function ItineraryCourseMapPage({
  course,
  allItineraryCourses,
  lang,
  onNavigate,
}: ItineraryCourseMapPageProps) {
  const stops = course.itineraryStops || [];
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const t = UI_TEXT[lang];

  useEffect(() => {
    setSelectedStep(1);
    setHoveredStep(null);
  }, [course.id]);

  const toggleCheckStep = (step: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step],
    );
  };

  const handleSelectStop = (step: number, scrollToDetail = false) => {
    setSelectedStep(step);
    if (scrollToDetail) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

  const activeStop = stops.find((s) => s.step === selectedStep) || stops[0];

  // Build smooth curved SVG path connecting stop 1 -> 2 -> 3 -> 4
  let routeSvgPath = '';
  const arrowPoints: { x: number; y: number; angle: number }[] = [];
  if (stops.length > 1) {
    routeSvgPath = `M ${stops[0].dotX} ${stops[0].dotY}`;
    for (let i = 1; i < stops.length; i++) {
      const a = stops[i - 1];
      const b = stops[i];
      const mx = (a.dotX + b.dotX) / 2;
      const my = (a.dotY + b.dotY) / 2 - 18;
      routeSvgPath += ` Q ${mx} ${my} ${b.dotX} ${b.dotY}`;

      // Midpoint on quadratic Bezier (t = 0.5)
      const qx = 0.25 * a.dotX + 0.5 * mx + 0.25 * b.dotX;
      const qy = 0.25 * a.dotY + 0.5 * my + 0.25 * b.dotY;
      const angle = (Math.atan2(b.dotY - a.dotY, b.dotX - a.dotX) * 180) / Math.PI;
      arrowPoints.push({ x: qx, y: qy, angle });
    }
  }

  const naverMapUrl = activeStop
    ? `https://map.naver.com/p/search/${encodeURIComponent(activeStop.mapQuery)}`
    : '#';
  const googleMapUrl = activeStop
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        activeStop.mapQuery,
      )}`
    : '#';

  const courseTitle = getCourseTitle(course, lang);

  return (
    <div className="ulsan-map-poster itinerary-map-page">
      {/* 상단: 목록 돌아가기 + 다른 일정별 코스 바로 전환 탭 */}
      <div className="itinerary-page-nav">
        <a
          href="/courses"
          className="itinerary-back-btn"
          onClick={(e) => onNavigate('/courses', e)}
        >
          {t.backToCourseList}
        </a>
        <div className="itinerary-switch-row" role="navigation" aria-label={t.quickSwitchCourseAria}>
          {allItineraryCourses.map((c) => {
            const cPath = `/courses/itinerary/${c.id}`;
            const isCurrent = c.id === course.id;
            return (
              <a
                key={c.id}
                href={cPath}
                className={`sub-chip ${isCurrent ? 'active-course-chip' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
                style={
                  isCurrent
                    ? {
                        backgroundColor: c.themeColor || '#2B2438',
                        borderColor: c.themeColor || '#2B2438',
                        color: '#FFFDF9',
                      }
                    : undefined
                }
                onClick={(e) => onNavigate(cPath, e)}
              >
                {getCourseShortTab(c, lang)}
              </a>
            );
          })}
        </div>
      </div>

      {/* 현재 코스 헤더 배너 */}
      <div className="itinerary-route-banner">
        <span
          className="itinerary-course-pill"
          style={{ backgroundColor: course.themeColor || '#3A7BB8' }}
        >
          {getCourseBadge(course, lang)}
        </span>
        <h2 className="itinerary-route-title">{courseTitle}</h2>
        <p className="itinerary-route-sub">{getCourseDesc(course, lang)}</p>

        {/* 스텝별 원형 번호 색상 안내 */}
        <div className="map-category-legend itinerary-step-legend">
          {stops.map((st, idx) => (
            <React.Fragment key={st.step}>
              <button
                type="button"
                className={`map-legend-chip step-legend-btn ${
                  selectedStep === st.step ? 'active' : ''
                }`}
                onClick={() => handleSelectStop(st.step, false)}
              >
                <span
                  className="bucket-num-dot"
                  style={{ backgroundColor: st.color }}
                >
                  {st.step}
                </span>
                <span>{getItineraryStopField(course.id, st, 'shortMapName', lang)}</span>
              </button>
              {idx < stops.length - 1 && (
                <span className="itinerary-step-arrow" aria-hidden="true">
                  ➔
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 1. 손그림 울산 일러스트 지도 + 코스 이동 동선(①➔②➔③➔④) */}
      <div className="ulsan-map-canvas-wrap">
        <svg
          className="ulsan-map-svg"
          viewBox="0 0 800 600"
          role="img"
          aria-label={t.courseRouteMapAria(courseTitle)}
        >
          <image
            href="/ulsan-illustrated-map.jpg"
            x="0"
            y="0"
            width="800"
            height="600"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* 코스 경유지들을 순서대로 잇는 손그림 여행 동선 커브 (① ➔ ② ➔ ③ ➔ ④) */}
          {routeSvgPath && (
            <g style={{ pointerEvents: 'none' }}>
              <path
                d={routeSvgPath}
                fill="none"
                stroke="#FAF1DF"
                strokeWidth="8.5"
                strokeLinecap="round"
                opacity="0.92"
              />
              <path
                d={routeSvgPath}
                fill="none"
                stroke={course.themeColor || '#D95F4E'}
                strokeWidth="3.6"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
              {arrowPoints.map((pt, i) => (
                <g
                  key={i}
                  transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle})`}
                >
                  <circle r="8.5" fill="#FAF1DF" stroke={course.themeColor || '#D95F4E'} strokeWidth="1.6" />
                  <polygon
                    points="-3.5,-4 4.5,0 -3.5,4"
                    fill={course.themeColor || '#D95F4E'}
                  />
                </g>
              ))}
            </g>
          )}

          {/* 각 경유지의 실제 위치 점(dotX, dotY)과 여백의 원형 번호를 잇는 점선 지시선 */}
          {stops.map((st) => {
            const isSelected = st.step === selectedStep || st.step === hoveredStep;
            const hasLeader = Math.hypot(st.x - st.dotX, st.y - st.dotY) > 12;

            return (
              <g key={`stop-leader-${st.step}`} style={{ pointerEvents: 'none' }}>
                {hasLeader && (
                  <>
                    <line
                      x1={st.dotX}
                      y1={st.dotY}
                      x2={st.x}
                      y2={st.y}
                      stroke="#FAF1DF"
                      strokeWidth={isSelected ? '4.8' : '3.4'}
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <line
                      x1={st.dotX}
                      y1={st.dotY}
                      x2={st.x}
                      y2={st.y}
                      stroke={st.color}
                      strokeWidth={isSelected ? '2.5' : '1.8'}
                      strokeDasharray={isSelected ? 'none' : '3.5 3.5'}
                      strokeLinecap="round"
                    />
                  </>
                )}
                {/* 실제 경유지 지점 타겟 포인트 */}
                <circle
                  cx={st.dotX}
                  cy={st.dotY}
                  r={isSelected ? '7.5' : '5.8'}
                  fill="#FAF1DF"
                  stroke={st.color}
                  strokeWidth="2.4"
                />
                <circle
                  cx={st.dotX}
                  cy={st.dotY}
                  r={isSelected ? '3.8' : '2.8'}
                  fill={st.color}
                />
              </g>
            );
          })}

          {/* 각 경유지의 스텝별 색상 원형 번호 뱃지 & 손글씨 잉크 장소명 */}
          {stops.map((st) => {
            const isSelected = st.step === selectedStep;
            const isHovered = st.step === hoveredStep;
            const isActive = isSelected || isHovered;
            const placeName = getItineraryStopField(course.id, st, 'shortMapName', lang);

            return (
              <g
                key={`stop-pin-${st.step}`}
                className={`ulsan-map-pin ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectStop(st.step, true)}
                onMouseEnter={() => setHoveredStep(st.step)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ cursor: 'pointer' }}
              >
                {isActive && (
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r="19"
                    fill={st.color}
                    opacity="0.32"
                  />
                )}

                <text
                  x={st.x + 15.5}
                  y={st.y + 4.8}
                  textAnchor="start"
                  fontFamily="Gowun Dodum, serif"
                  fontSize={isActive ? '15' : '13.5'}
                  fontWeight="700"
                  fill={isActive ? st.color : '#3A2A1E'}
                  stroke="#FAF1DF"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke fill' }}
                >
                  {placeName}
                </text>

                <circle
                  cx={st.x}
                  cy={st.y}
                  r={isActive ? '14' : '12'}
                  fill="#FAF1DF"
                />
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={isActive ? '12.2' : '10.6'}
                  fill={st.color}
                  stroke="#3A2A1E"
                  strokeWidth={isActive ? '2.2' : '1.8'}
                />
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={isActive ? '9.5' : '8.2'}
                  fill="none"
                  stroke="rgba(255, 253, 249, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="2 1.5"
                />
                <text
                  x={st.x}
                  y={st.y + 4}
                  textAnchor="middle"
                  fontFamily="Gowun Dodum, serif"
                  fontSize={isActive ? '12.5' : '11.5'}
                  fontWeight="800"
                  fill="#FFFDF9"
                >
                  {st.step}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. 지도에서 선택한 코스 경유지(STEP) 상세 정보 & 사진 & 네이버·구글 지도 */}
      {activeStop && (
        <div className="map-selected-card itinerary-stop-detail-card" ref={detailRef}>
          <div className="map-selected-head">
            <span
              className="map-selected-num"
              style={{ backgroundColor: activeStop.color }}
            >
              STEP {activeStop.step}
            </span>
            <span className="map-selected-badge">{getItineraryStopField(course.id, activeStop, 'time', lang)}</span>
          </div>
          <div className="itinerary-stop-body">
            <h3 className="itinerary-stop-title">{getItineraryStopField(course.id, activeStop, 'title', lang)}</h3>
            <p className="curated-desc">{getItineraryStopField(course.id, activeStop, 'desc', lang)}</p>

            <KtoThumbnailRow
              presetKeys={activeStop.ktoThumbKeys}
              lang={lang}
            />

            <p className="program-note itinerary-stop-tip">{getItineraryStopField(course.id, activeStop, 'tip', lang)}</p>

            <div className="map-links-row">
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-btn naver"
              >
                <span className="map-badge-dot naver-dot" aria-hidden="true">
                  N
                </span>
                <span>{t.naverMapBtn}</span>
              </a>
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-btn google"
              >
                <span className="map-badge-dot google-dot" aria-hidden="true">
                  G
                </span>
                <span>{t.googleMapBtn}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. 하단 코스 순서 타임라인 보드 */}
      <div className="bucket-board">
        <div className="bucket-board-inner">
          <div className="bucket-header">
            <span className="bucket-flourish" aria-hidden="true">
              ∾ ✦
            </span>
            <h2 className="bucket-title">
              {t.courseChecklistTitle}
            </h2>
            <span className="bucket-flourish" aria-hidden="true">
              ✦ ∾
            </span>
          </div>
          <p className="bucket-sub">
            {t.courseChecklistSub}
          </p>

          <div className="itinerary-timeline-grid">
            {stops.map((st) => {
              const isSelected = st.step === selectedStep;
              const isChecked = checkedSteps.includes(st.step);
              const stopTitle = getItineraryStopField(course.id, st, 'title', lang);
              const stopTime = getItineraryStopField(course.id, st, 'time', lang);
              return (
                <div
                  key={st.step}
                  className={`bucket-item itinerary-timeline-item ${
                    isSelected ? 'selected' : ''
                  } ${isChecked ? 'checked' : ''}`}
                  onClick={() => handleSelectStop(st.step, true)}
                >
                  <button
                    type="button"
                    className={`bucket-check ${isChecked ? 'checked' : ''}`}
                    aria-label={t.stopCheckAria(stopTitle)}
                    onClick={(e) => toggleCheckStep(st.step, e)}
                  >
                    {isChecked ? '✓' : ''}
                  </button>
                  <span
                    className="bucket-num-dot"
                    style={{ backgroundColor: st.color }}
                  >
                    {st.step}
                  </span>
                  <div className="itinerary-timeline-text">
                    <strong className="itinerary-timeline-name">
                      {stopTitle}
                    </strong>
                    <span className="itinerary-timeline-time">{stopTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const initialRoute = parseRouteFromPathname(window.location.pathname);

  const [lang, setLang] = useState<Lang>('KR');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>(initialRoute.tab);

  const t = UI_TEXT[lang];
  const currentLangOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === lang) || LANGUAGE_OPTIONS[0];

  // Close language dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isLangMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLangMenuOpen]);

  // Sync <html lang="..."> attribute for native typography & screen readers
  useEffect(() => {
    const htmlLangMap: Record<Lang, string> = {
      KR: 'ko',
      EN: 'en',
      JA: 'ja',
      ZH: 'zh-CN',
      ES: 'es',
      FR: 'fr',
      DE: 'de',
    };
    document.documentElement.lang = htmlLangMap[lang];
  }, [lang]);

  // Home curation states
  const [selectedTasteIds, setSelectedTasteIds] = useState<string[]>([]);
  const [selectedCompanionIds, setSelectedCompanionIds] = useState<string[]>([]);
  const [selectedDurationId, setSelectedDurationId] = useState<string>('');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [showCourse, setShowCourse] = useState<boolean>(false);
  const [courseStops, setCourseStops] = useState<PlaceItem[]>([]);
  const [courseRenderKey, setCourseRenderKey] = useState<number>(0);

  // Tab 2 (추천 여행코스) category state: 일정별 코스 / 반려동물 / 식도락 / 명소 / 체험
  const [courseCategory, setCourseCategory] = useState<CourseCategoryTab>(
    initialRoute.courseCategory,
  );
  // 일정별 코스 상세 지도 페이지 ID (/courses/itinerary/:courseId)
  const [itineraryCourseId, setItineraryCourseId] = useState<string | null>(
    initialRoute.itineraryCourseId,
  );
  // 반려동물 하위 카테고리: 전체 / 산책명소 / 펫파크·놀이터 / 이색체험 / 동반카페·식당
  const [petSub, setPetSub] = useState<PetSubTab>(initialRoute.petSub);
  // 식도락 하위 카테고리: 카페 / 브런치 / 음식점 / 디저트
  const [gourmetSub, setGourmetSub] = useState<GourmetSubTab>(
    initialRoute.gourmetSub,
  );
  // 명소 하위 카테고리: 전체 / 자연·정원 / 해안·일출 / 역사·문화유산 / 전망·야경
  const [attractionSub, setAttractionSub] = useState<AttractionSubTab>(
    initialRoute.attractionSub,
  );
  // 체험 하위 카테고리: 전체 / 투어 / 공방 / 미술관박물관 / 체험
  const [experienceSub, setExperienceSub] = useState<ExperienceSubTab>(
    initialRoute.experienceSub,
  );
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [livePetItems, setLivePetItems] = useState<CuratedCourseItem[]>([]);

  // 스탬프 투어 리뷰 관리자 모드 상태
  const [adminPin, setAdminPin] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('stepless_stamp_admin_pin_v1');
    } catch {
      return null;
    }
  });
  const isAdminMode = Boolean(adminPin);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState<boolean>(false);

  const handleToggleAdminBtn = () => {
    if (isAdminMode) {
      setAdminPin(null);
      try {
        sessionStorage.removeItem('stepless_stamp_admin_pin_v1');
      } catch {
        // ignore
      }
      return;
    }
    setAdminPinInput('');
    setAdminPinError(null);
    setIsAdminModalOpen(true);
  };

  const handleAdminPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminPinInput.trim();
    if (!trimmed) return;

    setIsVerifyingAdmin(true);
    setAdminPinError(null);

    try {
      let verified = false;
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.rpc('verify_stamp_admin_pin', {
          p_pin: trimmed,
        });
        if (!error && data === true) {
          verified = true;
        }
      }

      if (!verified) {
        setAdminPinError(
          lang === 'KR'
            ? '비밀번호가 일치하지 않습니다.'
            : 'Incorrect administrator password.',
        );
        setIsVerifyingAdmin(false);
        return;
      }

      setAdminPin(trimmed);
      try {
        sessionStorage.setItem('stepless_stamp_admin_pin_v1', trimmed);
      } catch {
        // ignore
      }
      setIsAdminModalOpen(false);
      setAdminPinInput('');

      // 스탬프 투어 화면이 아니라면 즉시 스탬프 투어로 이동하여 바로 리뷰를 관리할 수 있도록 연결
      if (activeTab !== 'courses' || courseCategory !== 'stamp') {
        navigateToPath('/courses/stamp');
      }
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  // 한국관광공사_반려동물_동반여행_서비스 (KorPetTourService2) 실시간 신규 데이터 자동 동기화
  useEffect(() => {
    if (activeTab !== 'courses' || courseCategory !== 'pet') return;
    let cancelled = false;
    const knownOrSteepIds = new Set([
      '128213', // 간월산 (산악 등산)
      '128214', // 대운산 (산악 등산)
      '128197', // 배내골 (계곡)
      '127422', // 석남사계곡 (계곡)
      '2611135', // 내원암 계곡 (계곡)
      '128204', // 홍류폭포 (산악 폭포)
      '2507820', // 큐빅광장
      '2728939', // 대왕암공원 출렁다리 (개모차 불가, 대왕암공원에 통합 안내)
      '127515', // 대왕암공원
      '128022', // 간절곶
      '2610509', // 간절곶 소망길
      '2717813', // 애니언파크
      '128208', // 외고산 옹기마을
      '2611134', // 울산 신화마을
      '1395991', // 울산테마식물수목원
      '2605817', // 태화강 국가정원십리대숲
      '2731170', // 황방산생태야영장
    ]);
    fetchLiveKtoPetSpots().then((spots) => {
      if (cancelled || spots.length === 0) return;
      const existingTitles = CURATED_COURSES.filter((c) => c.category === 'pet').map(
        (c) => c.title.KR.replace(/\s+/g, ''),
      );
      const added: CuratedCourseItem[] = [];
      spots.forEach((sp) => {
        if (knownOrSteepIds.has(sp.contentId)) return;
        const cleanSp = sp.title.replace(/\s+/g, '');
        const alreadyIn = existingTitles.some(
          (tStr) => tStr.includes(cleanSp) || cleanSp.includes(tStr.slice(0, 4)),
        );
        if (!alreadyIn) {
          const isDining = sp.contentTypeId === '39';
          const isActivity = sp.contentTypeId === '14' || sp.contentTypeId === '28';
          const sub: Exclude<PetSubTab, 'all'> = isDining
            ? 'dining'
            : isActivity
            ? 'activity'
            : 'walk';
          added.push({
            id: `pet-live-${sp.contentId}`,
            category: 'pet',
            petSub: sub,
            badge: {
              KR: '반려동물 · 한국관광공사 공식 등록',
              EN: 'Pet-Friendly · KTO Official',
            },
            title: { KR: sp.title, EN: sp.title },
            desc: {
              KR: `${sp.addr1}에 위치한 한국관광공사 반려동물 동반여행 공식 등록 장소입니다.`,
              EN: `An official KTO Pet-Friendly registered destination located at ${sp.addr1}.`,
            },
            ktoThumbKeys: sp.imageUrl ? [`kto_pet_${sp.contentId}`] : [],
            programInfo: [
              {
                label: { KR: '위치', EN: 'Location' },
                value: { KR: sp.addr1, EN: sp.addr1 },
              },
              {
                label: { KR: '동반안내', EN: 'Pet Policy' },
                value: {
                  KR: '한국관광공사 반려동물 동반여행 서비스 공식 등록 (목줄·배변봉투 지참)',
                  EN: 'Official KTO Pet-Friendly destination (leash & waste bags required)',
                },
              },
            ],
          });
        }
      });
      if (added.length > 0) {
        setLivePetItems(added);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeTab, courseCategory]);

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
      setItineraryCourseId(parsed.itineraryCourseId);
      setPetSub(parsed.petSub);
      setGourmetSub(parsed.gourmetSub);
      setAttractionSub(parsed.attractionSub);
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
      const categoryTitles: Record<CourseCategoryTab, string> = {
        itinerary: t.docTitleItinerary,
        stamp: t.docTitleStamp,
        pet: t.docTitlePet,
        gourmet: t.docTitleGourmet,
        attraction: t.docTitleAttraction,
        experience: t.docTitleExperience,
      };
      document.title = categoryTitles[courseCategory];
    } else if (activeTab === 'schedule') {
      document.title = t.docTitleSchedule;
    } else {
      document.title = t.docTitleHome;
    }
  }, [activeTab, courseCategory, t]);

  // Navigate to a specific URL path and sync state
  const navigateToPath = (path: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    const parsed = parseRouteFromPathname(path);
    setActiveTab(parsed.tab);
    setCourseCategory(parsed.courseCategory);
    setItineraryCourseId(parsed.itineraryCourseId);
    setPetSub(parsed.petSub);
    setGourmetSub(parsed.gourmetSub);
    setAttractionSub(parsed.attractionSub);
    setExperienceSub(parsed.experienceSub);
    setExpandedCourseId(null);
    setScheduleSeasonFilter(parsed.scheduleFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTaste = (tasteId: string) => {
    setSelectedTasteIds((prev) =>
      prev.includes(tasteId) ? prev.filter((item) => item !== tasteId) : [...prev, tasteId],
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
        const tasteObj = TASTE_OPTIONS.find((taste) => taste.id === tid);
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
  const whoLabel = whoObj ? getCompanionLabel(whoObj, lang) : '';
  const durLabel = durObj ? getDurationLabel(durObj, lang) : '';
  const computedCourseTitle =
    lang === 'KR' || lang === 'JA' || lang === 'ZH'
      ? [whoLabel, durLabel, t.customCourseSuffix].filter(Boolean).join(' ')
      : [whoLabel, durLabel, t.customCourseSuffix].filter(Boolean).join(' · ');

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

  const allCuratedCourses =
    livePetItems.length > 0 ? [...CURATED_COURSES, ...livePetItems] : CURATED_COURSES;

  const filteredCuratedCourses = allCuratedCourses.filter((c) => {
    if (c.category !== courseCategory) return false;
    if (courseCategory === 'pet') {
      return petSub === 'all' ? true : c.petSub === petSub;
    }
    if (courseCategory === 'gourmet') {
      return gourmetSub === 'all' ? true : c.gourmetSub === gourmetSub;
    }
    if (courseCategory === 'attraction') {
      return attractionSub === 'all' ? true : c.attractionSub === attractionSub;
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
          title={t.logoTitle}
          onClick={(e) => navigateToPath('/', e)}
        >
          <span>STEPLESS</span>
          <span>IN ULSAN</span>
        </a>

        {/* Representative 3 Main Tabs with distinct URLs (/, /courses, /schedule) */}
        <nav
          className="main-tabs"
          aria-label={t.mainNavAria}
        >
          <a
            href="/"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            className="main-tab-btn"
            onClick={(e) => navigateToPath('/', e)}
          >
            {t.navHome}
          </a>
          <a
            href="/courses"
            aria-current={activeTab === 'courses' ? 'page' : undefined}
            className="main-tab-btn"
            onClick={(e) => navigateToPath('/courses', e)}
          >
            {t.navCourses}
          </a>
          <a
            href="/schedule"
            aria-current={activeTab === 'schedule' ? 'page' : undefined}
            className="main-tab-btn"
            onClick={(e) => navigateToPath('/schedule', e)}
          >
            {t.navSchedule}
          </a>
        </nav>

        {/* Compact Language Selector + Admin Mode Button */}
        <div className="header-right-actions">
          <div className="lang-dropdown" ref={langMenuRef}>
            <button
              type="button"
              className={`lang-dropdown-btn ${isLangMenuOpen ? 'open' : ''}`}
              aria-label={t.langButtonAria}
              aria-haspopup="listbox"
              aria-expanded={isLangMenuOpen}
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
            >
              <svg
                className="lang-globe-icon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="7.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <ellipse
                  cx="10"
                  cy="10"
                  rx="3.6"
                  ry="7.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M2.6 10h14.8M4.2 6.2h11.6M4.2 13.8h11.6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <span className="lang-current-label">{currentLangOption.nativeName}</span>
              <span className="lang-chevron" aria-hidden="true">
                ▾
              </span>
            </button>

            {isLangMenuOpen && (
              <ul
                className="lang-dropdown-menu"
                role="listbox"
                aria-label="Language selection"
              >
                {LANGUAGE_OPTIONS.map((option) => {
                  const isSelected = option.code === lang;
                  return (
                    <li key={option.code} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        className={`lang-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setLang(option.code);
                          setIsLangMenuOpen(false);
                        }}
                      >
                        <span className="lang-item-native">{option.nativeName}</span>
                        <span className="lang-item-code">
                          {isSelected ? '✓' : option.shortLabel}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            type="button"
            className={`admin-mode-btn ${isAdminMode ? 'active' : ''}`}
            onClick={handleToggleAdminBtn}
            title={
              isAdminMode
                ? lang === 'KR'
                  ? '클릭하면 관리자 모드를 종료합니다'
                  : 'Click to exit admin mode'
                : lang === 'KR'
                  ? '스탬프 투어 리뷰 관리자 모드'
                  : 'Stamp Tour Review Admin Mode'
            }
          >
            <svg
              className="admin-lock-icon"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4.2"
                y="9"
                width="11.6"
                height="8.4"
                rx="2.2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              {isAdminMode ? (
                <path
                  d="M7 9V6.4a3 3 0 0 1 5.6-1.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M7 9V6.5a3 3 0 0 1 6 0V9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              )}
              <circle cx="10" cy="13.2" r="1.15" fill="currentColor" />
            </svg>
            <span>
              {lang === 'KR'
                ? isAdminMode
                  ? '관리자 ON'
                  : '관리자'
                : lang === 'JA'
                  ? isAdminMode
                    ? '管理者 ON'
                    : '管理者'
                  : lang === 'ZH'
                    ? isAdminMode
                      ? '管理员 ON'
                      : '管理员'
                    : isAdminMode
                      ? 'Admin ON'
                      : 'Admin'}
            </span>
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
            aria-label={t.howSectionAria}
          >
            <h2 className="how-title">
              {t.howTitle}
            </h2>
            <p className="how-sub">
              {t.howSubtitle}
            </p>

            <div className="how-grid">
              {/* 1. KTX (부산역 -> 울산역) */}
              <div className="how-item">
                <svg
                  className="how-doodle"
                  viewBox="0 0 130 90"
                  role="img"
                  aria-label={t.ktxDoodleAria}
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
                  {t.ktxBadge}
                </span>
                <h3 className="how-name">
                  {t.ktxName}
                </h3>
                <p className="how-desc">
                  {t.ktxDesc}
                </p>
                <p className="how-tip">
                  {t.ktxTip}
                </p>
              </div>

              {/* 2. 동해선 광역전철 (부전·센텀·기장 -> 태화강역) */}
              <div className="how-item">
                <svg
                  className="how-doodle"
                  viewBox="0 0 130 90"
                  role="img"
                  aria-label={t.donghaeDoodleAria}
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
                  {t.donghaeBadge}
                </span>
                <h3 className="how-name">
                  {t.donghaeName}
                </h3>
                <p className="how-desc">
                  {t.donghaeDesc}
                </p>
                <p className="how-tip">
                  {t.donghaeTip}
                </p>
              </div>

              {/* 3. 부산 노포역 시외·직행버스 */}
              <div className="how-item">
                <svg
                  className="how-doodle"
                  viewBox="0 0 130 90"
                  role="img"
                  aria-label={t.busDoodleAria}
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
                  {t.busBadge}
                </span>
                <h3 className="how-name">
                  {t.busName}
                </h3>
                <p className="how-desc">
                  {t.busDesc}
                </p>
                <p className="how-tip">
                  {t.busTip}
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
                aria-label={t.whaleAria}
              >
                <WhaleInnerGroup mood="smile" />
              </svg>
            </div>

            <h1 className="ask-title">
              {t.heroTitle}
            </h1>

            <fieldset
              className="group"
              id="g1"
              aria-label={t.tasteGroupAria}
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
                    {getTasteCategoryLabel(taste, lang)}
                  </button>
                );
              })}
            </fieldset>

            <div className="sep" />

            <fieldset
              className="group"
              id="g2"
              aria-label={t.companionGroupAria}
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
                    {getCompanionLabel(companion, lang)}
                  </button>
                );
              })}
            </fieldset>

            <div className="sep" />

            <fieldset
              className="group"
              id="g3"
              aria-label={t.durationGroupAria}
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
                    {getDurationLabel(item, lang)}
                  </button>
                );
              })}
            </fieldset>

            <button type="button" className="go" id="go" onClick={handleBuildCourse}>
              {t.buildCourseBtn}
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
                          fontSize={lang === 'KR' || lang === 'JA' || lang === 'ZH' ? '16.5' : '14.5'}
                          fill="var(--line)"
                        >
                          {getTastePlaceLabel(stop, lang)}
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
              {t.pickAgainBtn}
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
          aria-label={t.navCourses}
        >
          <div className="blob" />
          {courseCategory !== 'stamp' && (
            <div style={{ width: '140px', marginBottom: '4px' }}>
              <svg viewBox="0 0 215 170" role="img" aria-label={t.whaleAria}>
                <WhaleInnerGroup mood="happy" />
              </svg>
            </div>
          )}

          <h1 className="ask-title">
            {courseCategory === 'stamp' ? t.catStamp : t.coursesTitle}
          </h1>

          <nav
            className="group"
            aria-label={t.courseCatAria}
          >
            {[
              {
                id: 'itinerary' as const,
                path: '/courses',
                label: t.catItinerary,
              },
              {
                id: 'stamp' as const,
                path: '/courses/stamp',
                label: t.catStamp,
              },
              {
                id: 'pet' as const,
                path: '/courses/pet',
                label: t.catPet,
              },
              {
                id: 'gourmet' as const,
                path: '/courses/gourmet',
                label: t.catGourmet,
              },
              {
                id: 'attraction' as const,
                path: '/courses/attraction',
                label: t.catAttraction,
              },
              {
                id: 'experience' as const,
                path: '/courses/experience',
                label: t.catExperience,
              },
            ].map((cat) => (
              <a
                key={cat.id}
                href={cat.path}
                className="chip"
                aria-current={courseCategory === cat.id ? 'page' : undefined}
                onClick={(e) => navigateToPath(cat.path, e)}
              >
                {cat.label}
              </a>
            ))}
          </nav>

          {courseCategory === 'pet' && (
            <>
              <div className="pet-city-banner" role="note">
                <p className="pet-city-title">
                  {t.petCityBanner}
                </p>
              </div>
              <nav
                className="sub-group"
                aria-label={t.petSubAria}
              >
                {[
                  {
                    id: 'all' as const,
                    path: '/courses/pet',
                    label: t.subAll,
                  },
                  {
                    id: 'walk' as const,
                    path: '/courses/pet/walk',
                    label: t.petSubWalk,
                  },
                  {
                    id: 'park' as const,
                    path: '/courses/pet/park',
                    label: t.petSubPark,
                  },
                  {
                    id: 'activity' as const,
                    path: '/courses/pet/activity',
                    label: t.petSubActivity,
                  },
                  {
                    id: 'dining' as const,
                    path: '/courses/pet/dining',
                    label: t.petSubDining,
                  },
                ].map((sub) => (
                  <a
                    key={sub.id}
                    href={sub.path}
                    className="sub-chip"
                    aria-current={petSub === sub.id ? 'page' : undefined}
                    onClick={(e) => navigateToPath(sub.path, e)}
                  >
                    {sub.label}
                  </a>
                ))}
              </nav>
            </>
          )}

          {courseCategory === 'gourmet' && (
            <nav
              className="sub-group"
              aria-label={t.gourmetSubAria}
            >
              {[
                {
                  id: 'all' as const,
                  path: '/courses/gourmet',
                  label: t.subAll,
                },
                {
                  id: 'cafe' as const,
                  path: '/courses/gourmet/cafe',
                  label: t.gourmetSubCafe,
                },
                {
                  id: 'brunch' as const,
                  path: '/courses/gourmet/brunch',
                  label: t.gourmetSubBrunch,
                },
                {
                  id: 'restaurant' as const,
                  path: '/courses/gourmet/restaurant',
                  label: t.gourmetSubRestaurant,
                },
                {
                  id: 'dessert' as const,
                  path: '/courses/gourmet/dessert',
                  label: t.gourmetSubDessert,
                },
              ].map((sub) => (
                <a
                  key={sub.id}
                  href={sub.path}
                  className="sub-chip"
                  aria-current={gourmetSub === sub.id ? 'page' : undefined}
                  onClick={(e) => navigateToPath(sub.path, e)}
                >
                  {sub.label}
                </a>
              ))}
            </nav>
          )}

          {courseCategory === 'attraction' && (
            <nav
              className="sub-group"
              aria-label={t.attractionSubAria}
            >
              {[
                {
                  id: 'all' as const,
                  path: '/courses/attraction',
                  label: t.subAll,
                },
                {
                  id: 'nature' as const,
                  path: '/courses/attraction/nature',
                  label: t.attractionSubNature,
                },
                {
                  id: 'coast' as const,
                  path: '/courses/attraction/coast',
                  label: t.attractionSubCoast,
                },
                {
                  id: 'heritage' as const,
                  path: '/courses/attraction/heritage',
                  label: t.attractionSubHeritage,
                },
                {
                  id: 'view' as const,
                  path: '/courses/attraction/view',
                  label: t.attractionSubView,
                },
              ].map((sub) => (
                <a
                  key={sub.id}
                  href={sub.path}
                  className="sub-chip"
                  aria-current={attractionSub === sub.id ? 'page' : undefined}
                  onClick={(e) => navigateToPath(sub.path, e)}
                >
                  {sub.label}
                </a>
              ))}
            </nav>
          )}

          {courseCategory === 'experience' && (
            <nav
              className="sub-group"
              aria-label={t.experienceSubAria}
            >
              {[
                {
                  id: 'all' as const,
                  path: '/courses/experience',
                  label: t.subAll,
                },
                {
                  id: 'tour' as const,
                  path: '/courses/experience/tour',
                  label: t.experienceSubTour,
                },
                {
                  id: 'workshop' as const,
                  path: '/courses/experience/workshop',
                  label: t.experienceSubWorkshop,
                },
                {
                  id: 'museum' as const,
                  path: '/courses/experience/museum',
                  label: t.experienceSubMuseum,
                },
                {
                  id: 'activity' as const,
                  path: '/courses/experience/activity',
                  label: t.experienceSubActivity,
                },
              ].map((sub) => (
                <a
                  key={sub.id}
                  href={sub.path}
                  className="sub-chip"
                  aria-current={experienceSub === sub.id ? 'page' : undefined}
                  onClick={(e) => navigateToPath(sub.path, e)}
                >
                  {sub.label}
                </a>
              ))}
            </nav>
          )}

          <div className="sep" />

          {courseCategory === 'stamp' ? (
            <StampTourSection
              lang={lang}
              adminPin={adminPin}
              onExitAdminMode={() => {
                setAdminPin(null);
                try {
                  sessionStorage.removeItem('stepless_stamp_admin_pin_v1');
                } catch {
                  // ignore
                }
              }}
              whaleMascot={
                <svg viewBox="0 0 215 170" role="img" aria-label={t.whaleAria}>
                  <WhaleInnerGroup mood="happy" />
                </svg>
              }
            />
          ) : courseCategory === 'itinerary' ? (
            itineraryCourseId ? (
              <ItineraryCourseMapPage
                course={
                  filteredCuratedCourses.find((c) => c.id === itineraryCourseId) ||
                  filteredCuratedCourses[0]
                }
                allItineraryCourses={filteredCuratedCourses}
                lang={lang}
                onNavigate={navigateToPath}
              />
            ) : (
              <div className="itinerary-card-list">
                {filteredCuratedCourses.map((c, idx) => (
                  <ItineraryCourseCard
                    key={c.id}
                    course={c}
                    index={idx}
                    lang={lang}
                    onSelect={navigateToPath}
                  />
                ))}
              </div>
            )
          ) : (courseCategory === 'pet' && petSub === 'all') ||
            (courseCategory === 'gourmet' && gourmetSub === 'all') ||
            (courseCategory === 'attraction' && attractionSub === 'all') ||
            (courseCategory === 'experience' && experienceSub === 'all') ? (
            <UlsanIllustratedMap
              category={courseCategory}
              courses={filteredCuratedCourses}
              lang={lang}
            />
          ) : (
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
          )}
        </section>
      )}

      {/* ==========================================
          PAGE 3: 울산 주요일정표 (/schedule, /schedule/:season)
         ========================================== */}
      {activeTab === 'schedule' && (
        <section
          className="tab-section"
          aria-label={t.navSchedule}
        >
          <div className="blob" />
          <div style={{ width: '140px', marginBottom: '4px' }}>
            <svg viewBox="0 0 215 170" role="img" aria-label={t.whaleAria}>
              <WhaleInnerGroup mood="smile" />
            </svg>
          </div>

          <h1 className="ask-title">
            {t.scheduleTitle}
          </h1>
          <p className="tab-subtitle">
            {t.scheduleSubtitle}
          </p>

          <nav className="group" aria-label={t.scheduleSeasonAria}>
            {[
              { id: 'all_seasons' as const, path: '/schedule', label: t.seasonAllEvents },
              { id: 'all' as const, path: '/schedule/all', label: t.seasonYearRound },
              { id: 'spring' as const, path: '/schedule/spring', label: t.seasonSpring },
              {
                id: 'summer' as const,
                path: '/schedule/summer',
                label: t.seasonSummer,
              },
              {
                id: 'autumn' as const,
                path: '/schedule/autumn',
                label: t.seasonAutumn,
              },
              {
                id: 'winter' as const,
                path: '/schedule/winter',
                label: t.seasonWinter,
              },
            ].map((s) => (
              <a
                key={s.id}
                href={s.path}
                className="chip"
                aria-current={scheduleSeasonFilter === s.id ? 'page' : undefined}
                onClick={(e) => navigateToPath(s.path, e)}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="sep" />

          <div className="curated-list">
            {filteredSchedules.map((item) => (
              <article key={item.id} className="curated-item">
                <span className="curated-badge">{getScheduleField(item, 'period', lang)}</span>
                <h2 className="curated-title">{getScheduleField(item, 'title', lang)}</h2>
                <p className="curated-desc">{getScheduleField(item, 'desc', lang)}</p>
                <KtoThumbnailRow
                  presetKeys={item.ktoThumbKeys}
                  fallbackKeyword={item.title.KR}
                  lang={lang}
                />
                <div className="schedule-meta">
                  <span>📍 {getScheduleField(item, 'place', lang)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="minimal-footer">
        <span>© 2026 Stepless</span>
        <span>·</span>
        <a href="/about.html">{t.footerAbout}</a>
        <span>·</span>
        <a href="/privacy.html">{t.footerPrivacy}</a>
        <span>·</span>
        <a href="/terms.html">{t.footerTerms}</a>
        <span>·</span>
        <a href="mailto:floreur88@gmail.com">{t.footerContact}</a>
      </footer>

      {isAdminModalOpen && (
        <div
          className="stamp-auth-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'KR' ? '관리자 모드 인증' : 'Admin Mode Authentication'}
          onClick={() => setIsAdminModalOpen(false)}
        >
          <form
            className="stamp-auth-modal-card admin-pin-modal-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAdminPinSubmit}
          >
            <div className="stamp-auth-modal-top">
              <span className="stamp-auth-icon-badge" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="4.2"
                    y="9"
                    width="11.6"
                    height="8.4"
                    rx="2.2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M7 9V6.5a3 3 0 0 1 6 0V9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <button
                type="button"
                className="stamp-auth-close-x"
                onClick={() => setIsAdminModalOpen(false)}
                aria-label={lang === 'KR' ? '닫기' : 'Close'}
              >
                ✕
              </button>
            </div>

            <h3 className="stamp-auth-modal-title">
              {lang === 'KR' ? '관리자 모드 인증' : 'Admin Mode'}
            </h3>
            <p className="stamp-auth-modal-desc">
              {lang === 'KR'
                ? '스탬프 투어에 등록된 방문자 리뷰를 수정·삭제할 수 있습니다. 관리자 비밀번호를 입력해 주세요.'
                : 'Enter the administrator password to edit or delete Stamp Tour reviews.'}
            </p>

            <input
              type="password"
              inputMode="numeric"
              autoFocus
              maxLength={12}
              className="admin-pin-input"
              placeholder={lang === 'KR' ? '비밀번호 4자리' : 'Password'}
              value={adminPinInput}
              onChange={(e) => {
                setAdminPinInput(e.target.value);
                if (adminPinError) setAdminPinError(null);
              }}
            />

            {adminPinError && <p className="stamp-auth-error">{adminPinError}</p>}

            <div className="admin-pin-actions">
              <button
                type="button"
                className="admin-pin-cancel-btn"
                onClick={() => setIsAdminModalOpen(false)}
              >
                {lang === 'KR' ? '취소' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="admin-pin-submit-btn"
                disabled={isVerifyingAdmin || !adminPinInput.trim()}
              >
                {isVerifyingAdmin
                  ? '...'
                  : lang === 'KR'
                    ? '관리자 모드 켜기'
                    : 'Unlock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
