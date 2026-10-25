export type Language = 'KR' | 'EN';

export type MobilityMode = 'ALL' | 'WHEELCHAIR' | 'STROLLER' | 'SENIOR';

export interface CurationOption {
  id: string;
  iconName: 'wheelchair' | 'stroller' | 'senior' | 'train' | 'whale' | 'bamboo' | 'bridge' | 'utensils' | 'taxi' | 'car';
  title: { KR: string; EN: string };
  subtitle: { KR: string; EN: string };
  badge: { KR: string; EN: string };
  accentColor: 'aqua' | 'sage' | 'coral' | 'lavender';
  matchedCourseId: string;
  matchScore: number;
}

export interface CurationQuestion {
  step: number;
  stepLabel: { KR: string; EN: string };
  categoryTitle: { KR: string; EN: string };
  question: { KR: string; EN: string };
  helperText: { KR: string; EN: string };
  options: CurationOption[];
}

export interface CourseStop {
  order: number;
  name: { KR: string; EN: string };
  area: { KR: string; EN: string };
  surfaceSpec: { KR: string; EN: string };
  elevatorOrRamp: { KR: string; EN: string };
  desc: { KR: string; EN: string };
  highlightBadge: { KR: string; EN: string };
}

export interface UlsanCourse {
  id: string;
  title: { KR: string; EN: string };
  subtitle: { KR: string; EN: string };
  themeTag: { KR: string; EN: string };
  duration: { KR: string; EN: string };
  totalSlope: { KR: string; EN: string };
  SteplessGrade: string;
  chargerInfo: { KR: string; EN: string };
  restroomInfo: { KR: string; EN: string };
  accentTheme: 'aqua' | 'sage' | 'coral' | 'lavender';
  whaleTip: { KR: string; EN: string };
  tags: { KR: string[]; EN: string[] };
  stops: CourseStop[];
}

export interface UlsanStationHub {
  id: string;
  name: { KR: string; EN: string };
  line: '동해선' | 'KTX·SRT' | '무장애환승';
  elevatorExits: { KR: string; EN: string };
  chargerLocation: { KR: string; EN: string };
  connectedSpots: { KR: string; EN: string };
  travelTimeFromBusan: { KR: string; EN: string };
  slopeGrade: { KR: string; EN: string };
}

export const CURATION_QUESTIONS: CurationQuestion[] = [
  {
    step: 1,
    stepLabel: { KR: 'STEP 01', EN: 'STEP 01' },
    categoryTitle: { KR: '동행자 & 이동 스타일', EN: 'Companion & Mobility' },
    question: {
      KR: '이번 울산 여행, 누구와 어떤 걸음으로 떠나시나요?',
      EN: 'Who are you traveling with, and what is your mobility style?',
    },
    helperText: {
      KR: '선택하신 이동 방식에 맞춰 경사도·노면 재질·휴게 인프라를 최우선으로 필터링합니다.',
      EN: 'We prioritize slope gradient, surface material, and rest facilities based on your choice.',
    },
    options: [
      {
        id: 'wheelchair',
        iconName: 'wheelchair',
        title: {
          KR: '전동·수동휠체어 시원한 바다 & 고래 드라이브',
          EN: 'Wheelchair-Friendly Ocean & Whale Breeze Drive',
        },
        subtitle: {
          KR: '단차 0cm 무장애 목재데크 · 전동급속충전소 300m 이내 · 회전반경 1.5m 화장실',
          EN: '0cm step-free wooden boardwalk · Rapid charger within 300m · Spacious accessible restrooms',
        },
        badge: { KR: '단차 0cm 검증', EN: 'Zero-Step Verified' },
        accentColor: 'aqua',
        matchedCourseId: 'whale-daewangam',
        matchScore: 98,
      },
      {
        id: 'stroller',
        iconName: 'stroller',
        title: {
          KR: '아이·부모님과 유모차 초록빛 힐링 산책',
          EN: 'Stroller & Family Bamboo Garden Healing Walk',
        },
        subtitle: {
          KR: '경사 2° 미만 평지보도 · 깨끗한 가족수유실 · 유모차/무장애 전동카트 대여',
          EN: 'Under 2° flat paths · Family nursing rooms · Stroller & electric cart rental',
        },
        badge: { KR: '수유실·평지 최우선', EN: 'Family & Stroller Best' },
        accentColor: 'sage',
        matchedCourseId: 'taehwagang-bamboo',
        matchScore: 97,
      },
      {
        id: 'senior',
        iconName: 'bridge',
        title: {
          KR: '걸음은 최소로! 반짝이는 울산대교 야경 & 해맞이',
          EN: 'Minimal Walking! Ulsan Bridge Night View & Sunrise',
        },
        subtitle: {
          KR: '전망대 직결 엘리베이터 · 차량 바로 앞 하차 뷰포인트 · 바다 앞 1층 오션뷰 라운지',
          EN: 'Direct observatory elevator · Drop-off right by the view · 1st-floor oceanfront lounges',
        },
        badge: { KR: '최단 보행·전망특화', EN: 'Short Walk & Panorama' },
        accentColor: 'coral',
        matchedCourseId: 'bridge-ganjeolgot',
        matchScore: 96,
      },
      {
        id: 'heritage',
        iconName: 'utensils',
        title: {
          KR: '7천 년 고래 역사와 턱 없는 언양불고기 미식 여행',
          EN: 'Petroglyph Whale History & Eonyang Bulgogi Foodie Tour',
        },
        subtitle: {
          KR: '전 층 엘리베이터 실내 박물관 · 휠체어 진입 1층 대형 한우명가 · KTX 울산역 인접',
          EN: 'Full-elevator indoor museum · Step-free 1st-floor Hanwoo dining · Near KTX Ulsan',
        },
        badge: { KR: '실내문화·미식추천', EN: 'Indoor & Gourmet' },
        accentColor: 'lavender',
        matchedCourseId: 'petroglyph-gourmet',
        matchScore: 95,
      },
    ],
  },
  {
    step: 2,
    stepLabel: { KR: 'STEP 02', EN: 'STEP 02' },
    categoryTitle: { KR: '울산 테마 & 풍경 취향', EN: 'Ulsan Scenery & Vibe' },
    question: {
      KR: '울산에서 가장 마주하고 싶은 순간은 언제인가요?',
      EN: 'Which Ulsan moment excites you the most?',
    },
    helperText: {
      KR: '고래의 도시이자 빛나는 산업·생태 정원 도시 울산의 4가지 얼굴 중 하나를 골라주세요.',
      EN: 'Pick your favorite among Ulsan’s whale coast, bamboo garden, luminous bridge, or culinary heritage.',
    },
    options: [
      {
        id: 'vibe_whale',
        iconName: 'whale',
        title: {
          KR: '장생포 고래문화특구와 대왕암 해송 솔바람길',
          EN: 'Jangsaengpo Whale Culture Zone & Daewangam Pine Trail',
        },
        subtitle: {
          KR: '수중 고래생태체험관 1층 관람터널 · 모노레일 엘리베이터 · 동해 파도 소리 데크길',
          EN: 'Underwater dolphin tunnel · Monorail elevator · East Sea wave-sound boardwalk',
        },
        badge: { KR: '울산 대표 고래·바다', EN: 'Whale & East Sea' },
        accentColor: 'aqua',
        matchedCourseId: 'whale-daewangam',
        matchScore: 99,
      },
      {
        id: 'vibe_bamboo',
        iconName: 'bamboo',
        title: {
          KR: '태화강 국가정원 십리대숲과 은하수길 산책',
          EN: 'Taehwagang National Garden & Starlight Bamboo Path',
        },
        subtitle: {
          KR: '바퀴 빠짐 없는 친환경 경화마사토길 · 무장애 열린관광 전동관람차 · 리버뷰 브런치',
          EN: 'Firm wheel-friendly garden trails · Accessible electric tram · Riverview brunch cafes',
        },
        badge: { KR: '국가정원 평지 100%', EN: '100% Flat Eco Garden' },
        accentColor: 'sage',
        matchedCourseId: 'taehwagang-bamboo',
        matchScore: 98,
      },
      {
        id: 'vibe_bridge',
        iconName: 'bridge',
        title: {
          KR: '공업도시의 로맨틱한 변신, 울산대교 골든아워 & 간절곶',
          EN: 'Romantic Industrial Lights, Ulsan Bridge & Ganjeolgot',
        },
        subtitle: {
          KR: '석양 뒤로 별처럼 켜지는 스마트 산업단지 스카이라인과 간절곶 소망우체통 해안광장',
          EN: 'Sparkling skyline at sunset and Ganjeolgot Cape’s flat coastal sunrise plaza',
        },
        badge: { KR: '화사한 노을·야경', EN: 'Sunset & Night View' },
        accentColor: 'coral',
        matchedCourseId: 'bridge-ganjeolgot',
        matchScore: 97,
      },
      {
        id: 'vibe_food',
        iconName: 'utensils',
        title: {
          KR: '반구대 고래 바위그림 박물관 & 언양 한우불고기',
          EN: 'Bangudae Whale Petroglyph Museum & Eonyang Bulgogi',
        },
        subtitle: {
          KR: '선사시대 고래 조각 실감 미디어아트 · 단차 없는 1층 테이블석 한우불고기 & 고래빵',
          EN: 'Immersive prehistoric whale media art · Step-free table seating for Eonyang Bulgogi',
        },
        badge: { KR: '역사·로컬미식', EN: 'History & Local Food' },
        accentColor: 'lavender',
        matchedCourseId: 'petroglyph-gourmet',
        matchScore: 96,
      },
    ],
  },
  {
    step: 3,
    stepLabel: { KR: 'STEP 03', EN: 'STEP 03' },
    categoryTitle: { KR: '선호 교통수단 & 부산 연계', EN: 'Transit & Busan Link' },
    question: {
      KR: '울산까지 어떻게 이동하고, 어떻게 둘러보실 계획인가요?',
      EN: 'How will you travel to and around Ulsan?',
    },
    helperText: {
      KR: 'Stepless in Busan에서 동해선으로 바로 넘어오시거나, 울산 부름콜·자차 동선을 맞춤 연결해 드립니다.',
      EN: 'Connect seamlessly from Busan via Donghae Line, Ulsan Bureum-Call accessible taxi, or car.',
    },
    options: [
      {
        id: 'transit_donghae',
        iconName: 'train',
        title: {
          KR: '부산에서 동해선 광역전철 직결 (태화강역·망양역 출발)',
          EN: 'Direct Donghae Line from Busan (Taehwagang Station)',
        },
        subtitle: {
          KR: '벡스코·기장역에서 무장애 전철로 40분! 태화강역 엘리베이터 1·2번 출구 및 저상버스 연계',
          EN: '40 mins from Busan via step-free metro! Direct elevator exits & low-floor bus link',
        },
        badge: { KR: 'STEPLESS BUSAN 연계', EN: 'Busan Universe Link' },
        accentColor: 'sage',
        matchedCourseId: 'taehwagang-bamboo',
        matchScore: 99,
      },
      {
        id: 'transit_bureum',
        iconName: 'taxi',
        title: {
          KR: '울산 교통약자 부름콜(특장차) & 무장애 관광택시',
          EN: 'Ulsan Bureum-Call Wheelchair Van & Accessible Taxi',
        },
        subtitle: {
          KR: '휠체어 슬로프·리프트 장착 특장차량(052-292-8253) 및 문화관광해설사 동행 무장애 택시',
          EN: 'Wheelchair-ramp vans & barrier-free tour taxis with door-to-door drop-off',
        },
        badge: { KR: '도어 투 도어 케어', EN: 'Door-to-Door Care' },
        accentColor: 'aqua',
        matchedCourseId: 'whale-daewangam',
        matchScore: 98,
      },
      {
        id: 'transit_car',
        iconName: 'car',
        title: {
          KR: '자차·렌터카 드라이브 (장애인·가족 전용 주차장 직결)',
          EN: 'Private Car / Rental (Direct Accessible Parking)',
        },
        subtitle: {
          KR: '매표소·데크 입구 50m 이내 1층 평지 장애인 주차구역이 확보된 명소만 엄선',
          EN: 'Curated spots with flat accessible parking within 50m of the main entrance',
        },
        badge: { KR: '입구 50m 주차보장', EN: '50m Flat Parking' },
        accentColor: 'coral',
        matchedCourseId: 'bridge-ganjeolgot',
        matchScore: 97,
      },
    ],
  },
];

export const ULSAN_COURSES: Record<string, UlsanCourse> = {
  'whale-daewangam': {
    id: 'whale-daewangam',
    title: {
      KR: '장생포 고래문화특구 & 대왕암 솔바람 무장애 바다 코스',
      EN: 'Jangsaengpo Whale Zone & Daewangam Step-Free Ocean Course',
    },
    subtitle: {
      KR: '푸른 고래의 숨결부터 1만 5천 그루 해송이 감싸는 단차 0cm 해안 우든데크까지, 울산 바다의 정수를 가장 편안하게 누리는 대표 코스입니다.',
      EN: 'Experience Ulsan’s signature whale museum and a zero-step coastal wooden boardwalk through 15,000 sea pines.',
    },
    themeTag: { KR: '고래·동해바다 베스트', EN: 'Whale & Ocean Best' },
    duration: { KR: '반나절 ~ 당일 (약 4.5시간)', EN: 'Half / Full Day (4.5 hrs)' },
    totalSlope: { KR: '전 구간 평균 2° 이하 (단차 0cm 데크)', EN: 'Avg slope < 2° (0cm step-free deck)' },
    SteplessGrade: 'STEPLESS S+',
    chargerInfo: {
      KR: '장생포 고래박물관 매표소 옆 & 대왕암공원 관리사무소 급속충전소 완비',
      EN: 'Rapid wheelchair chargers at Jangsaengpo Museum & Daewangam Park Office',
    },
    restroomInfo: {
      KR: '전 코스 자동문 장애인 화장실 · 성인 기저귀교환대 및 가족수유실 4곳 검증',
      EN: 'Automatic-door accessible restrooms & family nursing rooms at 4 stops',
    },
    accentTheme: 'aqua',
    whaleTip: {
      KR: '장생포 모노레일은 고래박물관 옆 승강장 대형 엘리베이터로 3층 탑승장까지 계단 없이 바로 올라갈 수 있어요! 대왕암공원은 해안 산책로 북측 무장애 우든데크(1.2km)를 이용하시면 휠체어·유모차 진동 없이 바다 코앞까지 산책할 수 있답니다.',
      EN: 'Take the large elevator next to the Whale Museum straight to the 3F Monorail platform! At Daewangam, follow the 1.2km northern wooden boardwalk for a smooth, vibration-free oceanfront stroll.',
    },
    tags: {
      KR: ['#단차0cm해안데크', '#장생포고래생태관', '#전동급속충전완비', '#오션뷰1층카페'],
      EN: ['#ZeroStepBoardwalk', '#WhaleEcoMuseum', '#RapidChargerReady', '#1FOceanCafe'],
    },
    stops: [
      {
        order: 1,
        name: { KR: '장생포 고래박물관 & 고래생태체험관', EN: 'Jangsaengpo Whale Museum & Eco Experience' },
        area: { KR: '남구 장생포고래로 244', EN: 'Jangsaengpo, Nam-gu' },
        surfaceSpec: { KR: '평지 보도블록 · 실내 무소음 평탄 바닥', EN: 'Flat pavement & smooth indoor floor' },
        elevatorOrRamp: { KR: '전 층 대형 엘리베이터 · 1층 해저터널 완만한 경사로', EN: 'All-floor elevator & gentle underwater tunnel ramp' },
        desc: {
          KR: '수중 해저터널에서 헤엄치는 돌고래를 눈높이에서 만나고, 박물관 입구에서 장생포 명물 고래빵과 전동휠체어 급속충전까지 한 번에 해결합니다.',
          EN: 'Meet swimming dolphins at eye level in the step-free underwater tunnel and enjoy warm whale-shaped pastries.',
        },
        highlightBadge: { KR: '급속충전소 · 수유실', EN: 'Rapid Charger · Nursing' },
      },
      {
        order: 2,
        name: { KR: '장생포 고래문화마을 무장애 산책로 (고래광장)', EN: 'Whale Culture Village Step-Free Plaza' },
        area: { KR: '남구 장생포고래로 271-1', EN: 'Jangsaengpo Culture Village' },
        surfaceSpec: { KR: '무장애 데크로드 & 포장 산책길 (경사 3° 이하)', EN: 'Accessible boardwalk & paved path (<3°)' },
        elevatorOrRamp: { KR: '모노레일 3층 승강장 엘리베이터 직결', EN: 'Direct elevator to 3F Monorail station' },
        desc: {
          KR: '실물 크기 고래 조각정원과 수생식물원을 잇는 상부 무장애 데크길을 따라 장생포 앞바다와 울산항의 활기찬 풍경을 감상합니다.',
          EN: 'Stroll along the upper step-free boardwalk featuring life-sized whale sculptures overlooking Ulsan Port.',
        },
        highlightBadge: { KR: '모노레일 엘리베이터', EN: 'Monorail Elevator' },
      },
      {
        order: 3,
        name: { KR: '대왕암공원 열린관광 무장애 솔바람길', EN: 'Daewangam Park Open-Tourism Pine Boardwalk' },
        area: { KR: '동구 등대로 95', EN: 'Daewangam Park, Dong-gu' },
        surfaceSpec: { KR: '단차 0cm 광폭 친환경 목재데크 (폭 2.2m)', EN: '2.2m-wide zero-step wooden boardwalk' },
        elevatorOrRamp: { KR: '주차장 → 해송숲 → 해안전망대 전 구간 무계단 직결', EN: 'Zero stairs from parking to pine forest & cliff lookout' },
        desc: {
          KR: '문화체육관광부 열린관광지로 선정된 명품 무장애 숲길입니다. 백년 해송 그늘 아래 턱 없는 목재데크를 따라 에메랄드빛 동해 기암괴석 전망대까지 편안하게 이동합니다.',
          EN: 'Certified Open Tourism site with a wide, flat wooden deck winding through century-old pines to emerald sea cliffs.',
        },
        highlightBadge: { KR: '열린관광지 S등급', EN: 'Open Tourism Grade S' },
      },
      {
        order: 4,
        name: { KR: '일산해수욕장 평지 해변 산책로 & 1층 오션뷰 카페', EN: 'Ilsan Beach Flat Promenade & 1F Ocean Cafe' },
        area: { KR: '동구 일산진길 해변로', EN: 'Ilsan Beach, Dong-gu' },
        surfaceSpec: { KR: '해변 평지 프롬나드 & 자동문 1층 진입', EN: 'Flat beachfront promenade & 1F automatic doors' },
        elevatorOrRamp: { KR: '전 매장 출입구 경사로 및 이동식 테이블 완비', EN: 'Entrance ramps & movable wheelchair tables' },
        desc: {
          KR: '대왕암공원 바로 옆 일산해변 평지 산책로를 따라 이동해, 통창 너머로 윤슬이 반짝이는 1층 무장애 베이커리 카페에서 여유롭게 여행을 마무리합니다.',
          EN: 'Unwind at a step-free first-floor bakery cafe overlooking the sparkling waves of Ilsan Beach.',
        },
        highlightBadge: { KR: '휠체어 테이블 완비', EN: 'Accessible Seating' },
      },
    ],
  },

  'taehwagang-bamboo': {
    id: 'taehwagang-bamboo',
    title: {
      KR: '태화강 국가정원 십리대숲 & 동해선 무장애 초록 힐링 코스',
      EN: 'Taehwagang National Garden Bamboo Forest & Donghae Line Eco Course',
    },
    subtitle: {
      KR: '부산에서 동해선 전철을 타고 태화강역에 내리면 펼쳐지는 대한민국 제2호 국가정원! 바퀴 빠짐 없는 대나무 숲길과 무장애 전동관람차를 즐기는 평지 100% 코스입니다.',
      EN: 'Step off the Donghae Line from Busan into Korea’s 2nd National Garden—100% flat bamboo trails and accessible electric trams.',
    },
    themeTag: { KR: '국가정원·유모차·가족 1위', EN: 'National Garden & Family #1' },
    duration: { KR: '반나절 (약 3.5~4시간)', EN: 'Half Day (3.5–4 hrs)' },
    totalSlope: { KR: '전 구간 평지 1° 미만 (바퀴 빠짐 없는 경화마사토)', EN: 'Flat < 1° (Firm eco-paved garden trail)' },
    SteplessGrade: 'STEPLESS S+',
    chargerInfo: {
      KR: '태화강역 1층 맞이방 & 국가정원 안내센터 무장애 충전·대여소 운영',
      EN: 'Chargers & rentals at Taehwagang Station 1F & National Garden Info Center',
    },
    restroomInfo: {
      KR: '국가정원 내 BF인증 화장실 6개소 · 프리미엄 아기쉼터(수유실·이유식 전자레인지) 완비',
      EN: '6 BF-certified restrooms & baby lounge with nursing rooms and bottle warmers',
    },
    accentTheme: 'sage',
    whaleTip: {
      KR: 'Stepless in Busan에서 동해선(부전·벡스코·기장역)을 타면 환승 없이 태화강역까지 한 번에 오실 수 있어요! 국가정원 방문자센터에서 휠체어·유모차 무료 대여는 물론, 휠체어 탑승이 가능한 무장애 전동관람차도 운행 중입니다.',
      EN: 'Ride the Donghae Line straight from Busan (Bujeon/BEXCO/Gijang) to Taehwagang Station! Free strollers, wheelchairs, and wheelchair-accessible electric garden trams are available at the Visitor Center.',
    },
    tags: {
      KR: ['#부산동해선40분직결', '#십리대숲은하수길', '#바퀴안빠지는흙길', '#프리미엄수유실'],
      EN: ['#40MinFromBusan', '#BambooStarlightPath', '#FirmGardenTrail', '#BabyNursingLounge'],
    },
    stops: [
      {
        order: 1,
        name: { KR: '동해선 태화강역 무장애 맞이방 & 광장 엘리베이터', EN: 'Donghae Line Taehwagang Station Accessible Hub' },
        area: { KR: '남구 산업로 654 (태화강역)', EN: 'Taehwagang Station, Nam-gu' },
        surfaceSpec: { KR: '신축 역사 전면 무장애 단차 0cm 타일', EN: 'Brand-new station with 0cm step-free tiles' },
        elevatorOrRamp: { KR: '승강장 ↔ 맞이방 ↔ 1·2번 출구 저상버스 정류장 직결 엘리베이터', EN: 'Direct elevators from platform to Exit 1 & 2 low-floor bus stops' },
        desc: {
          KR: '부산과 울산을 턱 없이 잇는 관문입니다. 역사 내 장애인 화장실, 전동보장구 급속충전기, 대형 캐리어 보관함이 모두 1층 동선에 모여 있습니다.',
          EN: 'The step-free gateway linking Busan and Ulsan, equipped with rapid chargers, accessible restrooms, and luggage lockers.',
        },
        highlightBadge: { KR: '동해선 1동선 엘리베이터', EN: 'Direct Station Elevator' },
      },
      {
        order: 2,
        name: { KR: '태화강 국가정원 안내센터 & 무장애 전동관람차', EN: 'Taehwagang National Garden Visitor Center & Accessible Tram' },
        area: { KR: '중구 태화강국가정원길 154', EN: 'Taehwagang National Garden, Jung-gu' },
        surfaceSpec: { KR: '전 구간 광폭 평지 산책로 (단차 없음)', EN: 'Wide flat garden promenade (zero steps)' },
        elevatorOrRamp: { KR: '휠체어 리프트 장착 전동관람차 탑승 가능', EN: 'Electric garden tram equipped with wheelchair lift' },
        desc: {
          KR: '계절마다 꽃물결이 일렁이는 초화원과 작약원을 무장애 전동관람차로 시원하게 둘러보고, 쾌적한 아기쉼터에서 휴식을 취합니다.',
          EN: 'Ride the wheelchair-accessible garden tram across vibrant flower meadows and relax at the family nursing lounge.',
        },
        highlightBadge: { KR: '무장애 전동관람차', EN: 'Accessible Garden Tram' },
      },
      {
        order: 3,
        name: { KR: '십리대숲 & 밤이면 별이 내리는 은하수길', EN: 'Simnidaesup Bamboo Forest & Starlight Path' },
        area: { KR: '중구 태화동 십리대숲 중심로', EN: 'Simnidaesup Bamboo Trail' },
        surfaceSpec: { KR: '친환경 경화마사토 포장 (유모차·휠체어 바퀴 빠짐 ZERO)', EN: 'Hardened eco-soil path (zero wheel sinking)' },
        elevatorOrRamp: { KR: '강변 산책로에서 대숲 내부까지 100% 평지 진입', EN: '100% flat entry from riverside into the bamboo grove' },
        desc: {
          KR: '하늘을 가릴 만큼 울창한 대나무 숲 사이로 시원한 강바람이 불어옵니다. 해 질 녘이면 대숲 위로 다채로운 반딧불 조명이 켜져 환상적인 산책을 선사합니다.',
          EN: 'Breathe in cool river breezes through towering bamboo groves that glow with firefly LED lights at dusk.',
        },
        highlightBadge: { KR: '경사 0° 평지 대숲길', EN: '0° Flat Bamboo Trail' },
      },
      {
        order: 4,
        name: { KR: '태화강 국가정원 카페거리 (1층 정원뷰 브런치)', EN: 'Taehwagang Garden Cafe Street (1F Terrace Brunch)' },
        area: { KR: '중구 신기길 국가정원 맞은편', EN: 'Taehwagang Cafe Street' },
        surfaceSpec: { KR: '보도-매장 단차 해소 경사로 완비', EN: 'Street-to-cafe flush entrance ramps' },
        elevatorOrRamp: { KR: '1층 야외 정원 테라스 및 엘리베이터 루프탑 보유 매장 다수', EN: '1F garden terraces & elevator-equipped cafes' },
        desc: {
          KR: '초록빛 대나무 숲을 마주 보는 1층 평지 브런치 카페에서 향긋한 커피와 울산 로컬 디저트를 즐기며 여유로운 오후를 만끽합니다.',
          EN: 'Savor brunch and local desserts at a step-free 1F garden terrace facing the green bamboo forest.',
        },
        highlightBadge: { KR: '유모차·휠체어 환영매장', EN: 'Wheelchair & Stroller Welcome' },
      },
    ],
  },

  'bridge-ganjeolgot': {
    id: 'bridge-ganjeolgot',
    title: {
      KR: '울산대교 골든아워 야경 & 간절곶 해맞이 광장 드라이브 코스',
      EN: 'Ulsan Bridge Golden-Hour Night View & Ganjeolgot Sunrise Drive',
    },
    subtitle: {
      KR: '칙칙한 공장 대신 보석처럼 반짝이는 스마트 산업도시의 노을과 동해안 가장 먼저 해가 뜨는 간절곶 평지 해안광장을 잇는 화사한 감성 드라이브 코스입니다.',
      EN: 'Discover Ulsan’s radiant sunset over the suspension bridge and the vast flat coastal plaza of Ganjeolgot Cape.',
    },
    themeTag: { KR: '화사한 노을·야경·브릿지', EN: 'Radiant Sunset & Bridge' },
    duration: { KR: '오후 ~ 저녁 (약 4시간)', EN: 'Afternoon to Evening (4 hrs)' },
    totalSlope: { KR: '전망대 엘리베이터 직결 · 해안광장 평지 데크', EN: 'Direct observatory elevator · Flat coastal plaza' },
    SteplessGrade: 'STEPLESS S',
    chargerInfo: {
      KR: '울산대교 전망대 1층 로비 및 간절곶 관광안내소 장애인 편의지원',
      EN: 'Accessibility support at Ulsan Bridge Observatory 1F & Ganjeolgot Info Center',
    },
    restroomInfo: {
      KR: '울산대교 전망대 1층 & 간절곶 소망우체통 광장 대형 무장애 화장실 완비',
      EN: 'Spacious accessible restrooms at Bridge Observatory 1F & Wish Postbox Plaza',
    },
    accentTheme: 'coral',
    whaleTip: {
      KR: '울산대교 전망대는 일반 차량은 아래 주차장에 대지만, 장애인 표지 부착 차량 및 보행약자 동반 차량은 전망대 바로 앞 장애인 전용 주차구역까지 올라갈 수 있어요! 엘리베이터를 타고 3층 실내 전망대에 오르면 360도 통유리로 울산의 황금빛 노을이 한눈에 펼쳐집니다.',
      EN: 'Vehicles with accessibility permits or mobility-impaired passengers can drive right up to the Ulsan Bridge Observatory entrance! Take the elevator to the 3F glass observatory for a 360° golden-hour view.',
    },
    tags: {
      KR: ['#울산대교엘리베이터전망대', '#전망대문앞주차가능', '#간절곶소망우체통평지', '#반짝이는야경뷰'],
      EN: ['#BridgeObservatoryElevator', '#DoorstepAccessibleParking', '#GanjeolgotFlatPlaza', '#SparklingNightSkyline'],
    },
    stops: [
      {
        order: 1,
        name: { KR: '간절곶 소망우체통 광장 & 무장애 해안 산책데크', EN: 'Ganjeolgot Wish Postbox Plaza & Coastal Boardwalk' },
        area: { KR: '울주군 서생면 간절곶1길 39-2', EN: 'Ganjeolgot, Ulju-gun' },
        surfaceSpec: { KR: '단차 없는 광폭 해안 석재광장 & 우든데크', EN: 'Step-free coastal stone plaza & wooden deck' },
        elevatorOrRamp: { KR: '장애인 주차장 → 소망우체통 → 등대 잔디광장 전면 평지 연결', EN: 'Flat path from accessible parking to Wish Postbox & lawn plaza' },
        desc: {
          KR: '한반도에서 가장 먼저 아침 해가 떠오르는 희망의 명소입니다. 거대한 노란 소망우체통 앞 평지 광장에서 시원한 동해 바람을 맞으며 기념엽서를 보낼 수 있습니다.',
          EN: 'Stand before the iconic giant yellow Wish Postbox on a wide, completely flat oceanfront plaza.',
        },
        highlightBadge: { KR: '해안 평지 데크로드', EN: 'Flat Coastal Deck' },
      },
      {
        order: 2,
        name: { KR: '서생 해안로 1층 파노라마 오션 라운지', EN: 'Seosaeng Coast 1F Panorama Ocean Lounge' },
        area: { KR: '울주군 서생면 해맞이로', EN: 'Seosaeng Coastal Road' },
        surfaceSpec: { KR: '주차장 직결 1층 무장애 슬로프 & 야외 잔디 데크', EN: 'Parking-connected 1F ramp & outdoor lawn deck' },
        elevatorOrRamp: { KR: '전 층 대형 엘리베이터 및 장애인 화장실 보유 대형 베이커리', EN: 'Large bakery cafe with full elevator & accessible restroom' },
        desc: {
          KR: '바다와 맞닿은 서생 해안도로의 대형 오션뷰 라운지에서 통유리창 너머로 부서지는 하얀 파도를 감상하며 달콤한 휴식을 즐깁니다.',
          EN: 'Relax right by the waves in a spacious coastal cafe featuring elevators and flat oceanfront terraces.',
        },
        highlightBadge: { KR: '전 층 대형 엘리베이터', EN: 'Full-Floor Elevator' },
      },
      {
        order: 3,
        name: { KR: '울산대교 전망대 (골든아워 노을 & 별빛 스카이라인)', EN: 'Ulsan Bridge Observatory (Golden-Hour & Starlight View)' },
        area: { KR: '동구 봉수로 155-1', EN: 'Ulsan Bridge Observatory, Dong-gu' },
        surfaceSpec: { KR: '전망대 앞 전용 주차장 ↔ 1층 입구 무장애 경사로', EN: 'Observatory accessible parking to 1F entrance ramp' },
        elevatorOrRamp: { KR: '1층 로비 ↔ 3층 실내 전망대 ↔ 4층 야외 전망데크 직결 엘리베이터', EN: 'Direct elevator linking 1F lobby, 3F glass observatory & 4F deck' },
        desc: {
          KR: '해 질 무렵 오렌지빛 노을과 함께 울산대교, 태화강, 그리고 반짝이는 산업단지의 불빛이 은하수처럼 켜지는 울산 최고의 야경 하이라이트입니다.',
          EN: 'Watch the sunset paint Ulsan Bridge in warm coral hues before thousands of lights twinkle like a galaxy.',
        },
        highlightBadge: { KR: '교통약자 차량 문앞하차', EN: 'Doorstep Drop-off Allowed' },
      },
    ],
  },

  'petroglyph-gourmet': {
    id: 'petroglyph-gourmet',
    title: {
      KR: '반구대 암각화 고래 역사 & 언양 한우불고기 무장애 미식 코스',
      EN: 'Bangudae Whale Petroglyph History & Eonyang Bulgogi Foodie Course',
    },
    subtitle: {
      KR: '7천 년 전 바위에 새겨진 고래 이야기를 실내 미디어아트로 생생하게 만나고, 단차 없는 1층 명가에서 정통 언양 한우불고기를 맛보는 품격 있는 코스입니다.',
      EN: 'Explore 7,000-year-old whale rock carvings through accessible indoor media art, followed by authentic Eonyang Hanwoo Bulgogi.',
    },
    themeTag: { KR: '세계유산·실내박물관·한우미식', EN: 'Heritage, Museum & Hanwoo' },
    duration: { KR: '반나절 (약 4시간 · KTX울산역 연계)', EN: 'Half Day (4 hrs · Near KTX Ulsan)' },
    totalSlope: { KR: '실내 박물관 완만 경사로 · 식당 1층 단차 0cm', EN: 'Gentle indoor museum ramp · 0cm 1F restaurant' },
    SteplessGrade: 'STEPLESS S',
    chargerInfo: {
      KR: 'KTX 울산역 1층 맞이방 및 울산암각화박물관 안내데스크 지원',
      EN: 'Charging & assistance at KTX Ulsan Station 1F & Petroglyph Museum Desk',
    },
    restroomInfo: {
      KR: '암각화박물관 및 자수정동굴나라·언양불고기 단지 내 장애인 화장실 완비',
      EN: 'Accessible restrooms at Petroglyph Museum & Eonyang Bulgogi Town',
    },
    accentTheme: 'lavender',
    whaleTip: {
      KR: '실제 반구대 암각화 원형 바위 앞까지는 숲길 보행이 길 수 있지만, 바로 입구의 <울산암각화박물관>은 고래 배 모양의 무장애 건축물로 내부 완만한 나선형 경사로와 엘리베이터를 통해 휠체어·유모차로 100% 생생하게 관람할 수 있어요!',
      EN: 'The Ulsan Petroglyph Museum is shaped like a whale and features a smooth indoor spiral ramp and elevator, making 7,000 years of whale history 100% accessible!',
    },
    tags: {
      KR: ['#KTX울산역15분', '#고래모양무장애박물관', '#1층입식언양불고기', '#비오는날도쾌적'],
      EN: ['#15MinFromKTXUlsan', '#WhaleShapedMuseum', '#StepFreeHanwooDining', '#AllWeatherFriendly'],
    },
    stops: [
      {
        order: 1,
        name: { KR: 'KTX 울산역(통도사) 무장애 라운지 & 관광택시 승강장', EN: 'KTX Ulsan Station Accessible Lounge & Tour Taxi' },
        area: { KR: '울주군 삼남읍 울산역로 177', EN: 'KTX Ulsan Station, Ulju-gun' },
        surfaceSpec: { KR: '전 구간 평지 대리석 및 점자·엘리베이터 동선', EN: 'Flat marble concourse with tactile & elevator routing' },
        elevatorOrRamp: { KR: 'KTX 승강장 ↔ 1층 1번 출구 택시·부름콜 승강장 직결 엘리베이터', EN: 'Direct elevator from KTX platform to 1F Exit 1 taxi zone' },
        desc: {
          KR: '전국 어디서나 KTX/SRT로 울산 서부권 여행을 시작하는 중심지입니다. 1층 종합관광안내소에서 무장애 지도를 챙겨 바로 출발합니다.',
          EN: 'Start your western Ulsan journey effortlessly from KTX Ulsan Station’s step-free 1F concourse.',
        },
        highlightBadge: { KR: 'KTX 승강장 직결 엘리베이터', EN: 'KTX Direct Elevator' },
      },
      {
        order: 2,
        name: { KR: '울산암각화박물관 (실감 미디어아트 & 무장애 경사로)', EN: 'Ulsan Petroglyph Museum (Media Art & Spiral Ramp)' },
        area: { KR: '울주군 두동면 반구대안길 254', EN: 'Dudong-myeon, Ulju-gun' },
        surfaceSpec: { KR: '건물 외부 데크 및 실내 무계단 슬로프 전시실', EN: 'Outdoor deck & stair-free indoor ramp gallery' },
        elevatorOrRamp: { KR: '전시관 1층~2층 완만한 무장애 경사로 & 전용 엘리베이터', EN: 'Gentle 1F–2F exhibition ramp & dedicated elevator' },
        desc: {
          KR: '선사시대 사람들이 바위에 새긴 귀신고래, 범고래, 혹등고래를 실물 모형과 3D 입체 영상으로 눈앞에서 감상하는 감동적인 공간입니다.',
          EN: 'Experience prehistoric carvings of gray, killer, and humpback whales through life-sized models and 3D media art.',
        },
        highlightBadge: { KR: '실내 무계단 슬로프 전시', EN: 'Stair-Free Ramp Gallery' },
      },
      {
        order: 3,
        name: { KR: '언양 한우불고기 특구 (단차 0cm 1층 입식 테이블 명가)', EN: 'Eonyang Hanwoo Bulgogi District (Step-Free 1F Dining)' },
        area: { KR: '울주군 언양읍 헌양길 일대', EN: 'Eonyang-eup, Ulju-gun' },
        surfaceSpec: { KR: '주차장 직결 1층 자동문 진입 · 휠체어 진입 입식 테이블', EN: 'Parking-level 1F automatic doors & wheelchair table clearance' },
        elevatorOrRamp: { KR: '입구 경사로 및 식당 내부 장애인 겸용 화장실 완비', EN: 'Entrance ramp & accessible indoor restroom' },
        desc: {
          KR: '신발을 벗거나 턱을 넘을 필요 없는 넓고 쾌적한 1층 홀에서 은은한 참숯 향이 배어든 달콤하고 부드러운 언양 석쇠불고기를 맛봅니다.',
          EN: 'Enjoy charcoal-grilled Eonyang Hanwoo Bulgogi in a spacious 1F dining hall—no steps and no shoe removal required.',
        },
        highlightBadge: { KR: '신발 안 벗는 1층 입식홀', EN: 'No-Step Table Seating' },
      },
    ],
  },
};

export const ULSAN_TRANSIT_HUBS: UlsanStationHub[] = [
  {
    id: 'taehwagang',
    name: { KR: '태화강역', EN: 'Taehwagang Stn.' },
    line: '동해선',
    elevatorExits: { KR: '1·2번 출구 대형 엘리베이터 4기 직결', EN: '4 Large Elevators at Exits 1 & 2' },
    chargerLocation: { KR: '1층 맞이방 역무실 앞 급속충전소', EN: '1F Concourse near Station Office' },
    connectedSpots: { KR: '태화강 국가정원 · 장생포 고래문화특구', EN: 'Taehwagang Garden · Jangsaengpo Whale Zone' },
    travelTimeFromBusan: { KR: '벡스코역에서 44분', EN: '44m from BEXCO' },
    slopeGrade: { KR: '신축 무장애 역사 (단차 0cm)', EN: 'New Zero-Step Hub' },
  },
  {
    id: 'mangyang',
    name: { KR: '망양역', EN: 'Mangyang Stn.' },
    line: '동해선',
    elevatorExits: { KR: '1번 출구 승강장-광장 직결 엘리베이터', EN: 'Platform-to-Plaza Elevator Exit 1' },
    chargerLocation: { KR: '1층 대합실 게이트 옆 전동충전기', EN: '1F Concourse beside Ticket Gate' },
    connectedSpots: { KR: '외고산 옹기마을 · 남창천 평지 산책로', EN: 'Oegosan Onggi Village · Flat River Walk' },
    travelTimeFromBusan: { KR: '기장역에서 22분', EN: '22m from Gijang' },
    slopeGrade: { KR: '평지 출구 직결', EN: 'Flat Plaza Exit' },
  },
  {
    id: 'seosaeng',
    name: { KR: '서생역', EN: 'Seosaeng Stn.' },
    line: '동해선',
    elevatorExits: { KR: '1번 출구 엘리베이터 & 택시 승강장 평지', EN: 'Exit 1 Elevator & Flat Taxi Drop-off' },
    chargerLocation: { KR: '1층 고객대기실 인근 충전 콘센트', EN: '1F Waiting Lounge Charging Point' },
    connectedSpots: { KR: '간절곶 해맞이 광장 · 서생 해안 오션뷰 카페', EN: 'Ganjeolgot Sunrise Plaza · Coastal Cafes' },
    travelTimeFromBusan: { KR: '기장역에서 14분', EN: '14m from Gijang' },
    slopeGrade: { KR: '해안 드라이브 환승 거점', EN: 'Coastal Transit Hub' },
  },
  {
    id: 'deokha',
    name: { KR: '덕하역', EN: 'Deokha Stn.' },
    line: '동해선',
    elevatorExits: { KR: '1·2번 출구 양방향 엘리베이터 완비', EN: 'Elevators on Both Exits 1 & 2' },
    chargerLocation: { KR: '1층 맞이방 장애인 화장실 옆 충전기', EN: '1F Concourse next to Accessible Restroom' },
    connectedSpots: { KR: '울산대공원 무장애 산책로 · 선암호수공원', EN: 'Ulsan Grand Park · Seonam Lake Park' },
    travelTimeFromBusan: { KR: '벡스코역에서 38분', EN: '38m from BEXCO' },
    slopeGrade: { KR: '단차 없는 광폭 보도', EN: 'Step-Free Wide Sidewalk' },
  },
  {
    id: 'ktx-ulsan',
    name: { KR: 'KTX 울산역', EN: 'KTX Ulsan Stn.' },
    line: 'KTX·SRT',
    elevatorExits: { KR: '1번 출구 택시·리무진 승강장 엘리베이터 직결', EN: 'Direct Elevator to Exit 1 Taxi/Bus Zone' },
    chargerLocation: { KR: '1층 종합관광안내소 옆 급속충전소', EN: '1F Tourist Info Center Rapid Charger' },
    connectedSpots: { KR: '울산암각화박물관 · 언양불고기 · 영남알프스', EN: 'Petroglyph Museum · Eonyang Bulgogi' },
    travelTimeFromBusan: { KR: '부산역 KTX 21분', EN: '21m from Busan KTX' },
    slopeGrade: { KR: 'BF 최우수 등급 역사', EN: 'BF Top-Grade Station' },
  },
  {
    id: 'bureum-call',
    name: { KR: '울산 부름콜', EN: 'Bureum-Call Van' },
    line: '무장애환승',
    elevatorExits: { KR: '휠체어 리프트·슬로프 특장차 도어 투 도어', EN: 'Wheelchair Lift & Ramp Van Door-to-Door' },
    chargerLocation: { KR: '콜센터 052-292-8253 (24시간 배차 상담)', EN: '24h Dispatch Center: 052-292-8253' },
    connectedSpots: { KR: '울산 전 권역 명소 · 태화강역 · KTX울산역 즉시 픽업', EN: 'All Ulsan Attractions & Stations Pickup' },
    travelTimeFromBusan: { KR: '동해선 하차 즉시 연계', EN: 'Instant Station Pickup' },
    slopeGrade: { KR: '휠체어 탑승 그대로 이동', EN: 'Ride Seated in Wheelchair' },
  },
];
