import { Lang, LocalizedText } from './types';

export interface UiDictionary {
  // Header & Navigation
  logoTitle: string;
  mainNavAria: string;
  navHome: string;
  navCourses: string;
  navSchedule: string;
  langButtonAria: string;

  // Home: How to Get to Ulsan from Busan
  howSectionAria: string;
  howTitle: string;
  howSubtitle: string;
  ktxDoodleAria: string;
  ktxBadge: string;
  ktxName: string;
  ktxDesc: string;
  ktxTip: string;
  donghaeDoodleAria: string;
  donghaeBadge: string;
  donghaeName: string;
  donghaeDesc: string;
  donghaeTip: string;
  busDoodleAria: string;
  busBadge: string;
  busName: string;
  busDesc: string;
  busTip: string;

  // Home: Hero Course Builder
  whaleAria: string;
  heroTitle: string;
  tasteGroupAria: string;
  companionGroupAria: string;
  durationGroupAria: string;
  buildCourseBtn: string;
  pickAgainBtn: string;
  customCourseSuffix: string;

  // Courses Tab
  coursesTitle: string;
  courseCatAria: string;
  catItinerary: string;
  catStamp: string;
  catPet: string;
  catGourmet: string;
  catAttraction: string;
  catExperience: string;

  // Pet City Banner
  petCityBanner: string;

  // Sub-category Tabs
  subAll: string;
  petSubAria: string;
  petSubWalk: string;
  petSubPark: string;
  petSubActivity: string;
  petSubDining: string;

  gourmetSubAria: string;
  gourmetSubCafe: string;
  gourmetSubBrunch: string;
  gourmetSubRestaurant: string;
  gourmetSubDessert: string;

  attractionSubAria: string;
  attractionSubNature: string;
  attractionSubCoast: string;
  attractionSubHeritage: string;
  attractionSubView: string;

  experienceSubAria: string;
  experienceSubTour: string;
  experienceSubWorkshop: string;
  experienceSubMuseum: string;
  experienceSubActivity: string;

  // Illustrated Map & Bucket List
  mapLegendAria: string;
  mapSvgSuffix: string;
  bucketInstruction: string;
  bucketCheckAria: (name: string) => string;
  bannerSubPet: string;
  bannerSubGourmet: string;
  bannerSubExperience: string;
  bannerSubAttraction: string;
  bannerSubItinerary: string;

  // Itinerary Course Cards & Route Map Page
  viewRouteMapCta: string;
  backToCourseList: string;
  quickSwitchCourseAria: string;
  courseRouteMapAria: (title: string) => string;
  courseChecklistTitle: string;
  courseChecklistSub: string;
  stopCheckAria: (title: string) => string;

  // Map External Links & KTO Photos
  naverMapBtn: string;
  googleMapBtn: string;
  ktoPhotoSingleAria: string;
  ktoPhotoMultiAria: string;

  // Live KTO Pet Fallback
  ktoLivePetBadge: string;
  ktoLivePetDesc: (addr: string) => string;
  ktoLivePetPolicy: string;

  // Schedule Tab
  scheduleTitle: string;
  scheduleSubtitle: string;
  scheduleSeasonAria: string;
  seasonAllEvents: string;
  seasonYearRound: string;
  seasonSpring: string;
  seasonSummer: string;
  seasonAutumn: string;
  seasonWinter: string;

  // Document Titles
  docTitleHome: string;
  docTitleSchedule: string;
  docTitleItinerary: string;
  docTitleStamp: string;
  docTitlePet: string;
  docTitleGourmet: string;
  docTitleAttraction: string;
  docTitleExperience: string;

  // Footer
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerContact: string;
}

export const UI_TEXT: Record<Lang, UiDictionary> = {
  KR: {
    logoTitle: 'STEPLESS IN ULSAN 홈으로 이동',
    mainNavAria: '대표 메뉴 탭',
    navHome: '홈',
    navCourses: '추천 여행코스',
    navSchedule: '울산 주요일정표',
    langButtonAria: '언어 선택 메뉴 열기',

    howSectionAria: '부산에서 울산으로 오는 3가지 방법',
    howTitle: '부산에서 울산, 어떻게 올까요?',
    howSubtitle: '출발지와 여행 코스에 맞춰 가장 편한 방법을 골라보세요!',
    ktxDoodleAria: 'KTX 고속열차 일러스트',
    ktxBadge: '부산역 → 울산역 (약 20분)',
    ktxName: 'KTX 타고 울산역 하차',
    ktxDesc: '부산역에서 KTX를 타면 슈웅~ 눈 깜짝할 새 울산역에 도착해요!',
    ktxTip: '반구대 암각화 · 언양불고기 갈 때 딱!',
    donghaeDoodleAria: '동해선 전철 일러스트',
    donghaeBadge: '부전·센텀·기장 → 태화강역',
    donghaeName: '동해선 타고 태화강역 하차',
    donghaeDesc: '교통카드 찍고 동해선 전철 타면 울산 중심 태화강역에서 바로 내려요!',
    donghaeTip: '태화강 국가정원 · 장생포 · 대왕암 갈 때 최고!',
    busDoodleAria: '노포역 버스 일러스트',
    busBadge: '부산 노포역 → 울산',
    busName: '노포역에서 버스 타고 오기',
    busDesc: '부산 1호선 노포역 종합버스터미널에서 버스를 타고 편하게 올 수 있어요!',
    busTip: '배차 간격이 짧아 언제든 부릉부릉 출발!',

    whaleAria: '결 고래',
    heroTitle: '어떤 울산 여행을 원해요?',
    tasteGroupAria: '취향 10가지',
    companionGroupAria: '누구와',
    durationGroupAria: '일정 시간',
    buildCourseBtn: '내 코스 만들기',
    pickAgainBtn: '다시 고르기',
    customCourseSuffix: '울산 코스',

    coursesTitle: '울산 추천 여행코스',
    courseCatAria: '추천 여행코스 카테고리',
    catItinerary: '일정별 코스',
    catStamp: '울산 스탬프 투어',
    catPet: '반려동물',
    catGourmet: '식도락',
    catAttraction: '명소',
    catExperience: '체험',

    petCityBanner:
      '울산광역시는 문화체육관광부와 한국관광공사가 선정한 전국 최초의 광역\u00A0지자체 ‘반려동물\u00A0친화관광도시’입니다.',

    subAll: '전체',
    petSubAria: '반려동물 세부 카테고리',
    petSubWalk: '산책명소',
    petSubPark: '펫파크·놀이터',
    petSubActivity: '이색체험',
    petSubDining: '동반카페·식당',

    gourmetSubAria: '식도락 세부 카테고리',
    gourmetSubCafe: '카페',
    gourmetSubBrunch: '브런치',
    gourmetSubRestaurant: '음식점',
    gourmetSubDessert: '디저트',

    attractionSubAria: '명소 세부 카테고리',
    attractionSubNature: '자연·정원',
    attractionSubCoast: '해안·일출',
    attractionSubHeritage: '역사·문화유산',
    attractionSubView: '전망·야경',

    experienceSubAria: '체험 세부 카테고리',
    experienceSubTour: '투어',
    experienceSubWorkshop: '공방',
    experienceSubMuseum: '미술관박물관',
    experienceSubActivity: '체험',

    mapLegendAria: '카테고리별 번호 색상 안내',
    mapSvgSuffix: '일러스트 지도',
    bucketInstruction:
      '장소를 누르면 지도 위치와 상세 정보·네이버/구글 지도가 바로 표시됩니다.',
    bucketCheckAria: (name) => `${name} 버킷리스트 체크`,
    bannerSubPet: '반려동물 친화관광도시 울산 버킷리스트',
    bannerSubGourmet: '울산 식도락 & 감성 카페 버킷리스트',
    bannerSubExperience: '울산 투어 · 공방 · 박물관 버킷리스트',
    bannerSubAttraction: '울산 대표 명소 버킷리스트',
    bannerSubItinerary: '울산 여행 버킷리스트',

    viewRouteMapCta: '🗺️ 지도 동선 보기 →',
    backToCourseList: '← 일정별 코스 목록',
    quickSwitchCourseAria: '코스 빠른 전환',
    courseRouteMapAria: (title) => `${title} 지도 동선`,
    courseChecklistTitle: '코스 순서별 경유지 체크리스트',
    courseChecklistSub:
      '경유지를 누르면 지도 위 번호 위치와 상세 사진·지도 링크가 바로 표시됩니다.',
    stopCheckAria: (title) => `${title} 방문 체크`,

    naverMapBtn: '네이버 지도',
    googleMapBtn: '구글 맵',
    ktoPhotoSingleAria: '한국관광공사 TourAPI 관광지 사진',
    ktoPhotoMultiAria: '한국관광공사 TourAPI 관광지 사진 모음',

    ktoLivePetBadge: '반려동물 · 한국관광공사 공식 등록',
    ktoLivePetDesc: (addr) =>
      `${addr}에 위치한 한국관광공사 반려동물 동반여행 공식 등록 장소입니다.`,
    ktoLivePetPolicy: '한국관광공사 반려동물 동반여행 서비스 공식 등록 (목줄·배변봉투 지참)',

    scheduleTitle: '울산 주요일정표',
    scheduleSubtitle:
      '계절별 울산 대표 축제와 연중 상시 야간개장·크루즈 일정을 확인하세요.',
    scheduleSeasonAria: '일정 계절별 보기',
    seasonAllEvents: '전체 일정',
    seasonYearRound: '연중 상시',
    seasonSpring: '봄 (5월)',
    seasonSummer: '여름 (7~8월)',
    seasonAutumn: '가을 (9~10월)',
    seasonWinter: '겨울·해맞이',

    docTitleHome: '울산 여행 코스 추천 | STEPLESS IN ULSAN',
    docTitleSchedule: '울산 주요일정표 & 축제 안내 | STEPLESS IN ULSAN',
    docTitleItinerary: '울산 일정별 추천 여행코스 | STEPLESS IN ULSAN',
    docTitleStamp: '울산 스탬프 투어 | STEPLESS IN ULSAN',
    docTitlePet: '울산 반려동물 친화관광도시 추천 여행코스 | STEPLESS IN ULSAN',
    docTitleGourmet: '울산 식도락 추천 여행코스 | STEPLESS IN ULSAN',
    docTitleAttraction: '울산 대표 명소 추천 여행코스 | STEPLESS IN ULSAN',
    docTitleExperience: '울산 체험·문화 추천 여행코스 | STEPLESS IN ULSAN',

    footerAbout: '서비스 소개',
    footerPrivacy: '개인정보처리방침',
    footerTerms: '이용약관',
    footerContact: '문의',
  },

  EN: {
    logoTitle: 'Go to STEPLESS IN ULSAN Home',
    mainNavAria: 'Main Navigation Tabs',
    navHome: 'Home',
    navCourses: 'Recommended Courses',
    navSchedule: 'Ulsan Schedule',
    langButtonAria: 'Choose Language',

    howSectionAria: '3 Ways to Get to Ulsan from Busan',
    howTitle: 'How to Get to Ulsan from Busan?',
    howSubtitle: 'Pick the easiest way to hop over from Busan to Ulsan!',
    ktxDoodleAria: 'KTX High-Speed Train Illustration',
    ktxBadge: 'Busan Stn. → Ulsan Stn. (20m)',
    ktxName: 'KTX to Ulsan Station',
    ktxDesc: 'Hop on the KTX at Busan Station and arrive at Ulsan Station in just 20 minutes!',
    ktxTip: 'Best for Bangudae Petroglyphs & Eonyang Bulgogi',
    donghaeDoodleAria: 'Donghae Line Metro Illustration',
    donghaeBadge: 'Bujeon / BEXCO → Taehwagang Stn.',
    donghaeName: 'Donghae Line to Taehwagang',
    donghaeDesc: 'Tap your transit card on the Donghae Line and step right into downtown Ulsan!',
    donghaeTip: 'Best for National Garden, Jangsaengpo & Daewangam',
    busDoodleAria: 'Nopo Express Bus Illustration',
    busBadge: 'Busan Nopo Stn. → Ulsan',
    busName: 'Express Bus from Nopo Stn.',
    busDesc: 'Catch a comfortable bus directly from Busan Line 1 Nopo Station Terminal!',
    busTip: 'Frequent departures for easy, flexible trips',

    whaleAria: 'Gyeol Whale',
    heroTitle: 'What kind of Ulsan trip do you want?',
    tasteGroupAria: '10 Travel Vibes',
    companionGroupAria: 'Companion',
    durationGroupAria: 'Trip Duration',
    buildCourseBtn: 'Build My Course',
    pickAgainBtn: 'Pick Again',
    customCourseSuffix: 'Ulsan Course',

    coursesTitle: 'Recommended Ulsan Courses',
    courseCatAria: 'Course Categories',
    catItinerary: 'By Itinerary',
    catStamp: 'Ulsan Stamp Tour',
    catPet: 'Pet-Friendly',
    catGourmet: 'Gourmet',
    catAttraction: 'Attractions',
    catExperience: 'Experiences',

    petCityBanner:
      'Ulsan Metropolitan City is Korea’s first metropolitan government designated as a “Pet-Friendly\u00A0Tourism\u00A0City” by the MCST and KTO.',

    subAll: 'All',
    petSubAria: 'Pet-Friendly Sub-categories',
    petSubWalk: 'Scenic Walks',
    petSubPark: 'Pet Parks',
    petSubActivity: 'Activities',
    petSubDining: 'Pet Cafes & Dining',

    gourmetSubAria: 'Gourmet Sub-categories',
    gourmetSubCafe: 'Cafes',
    gourmetSubBrunch: 'Brunch',
    gourmetSubRestaurant: 'Restaurants',
    gourmetSubDessert: 'Desserts',

    attractionSubAria: 'Attraction Sub-categories',
    attractionSubNature: 'Nature & Garden',
    attractionSubCoast: 'Coast & Sunrise',
    attractionSubHeritage: 'Heritage',
    attractionSubView: 'View & Nightscape',

    experienceSubAria: 'Experience Sub-categories',
    experienceSubTour: 'Tours',
    experienceSubWorkshop: 'Workshops',
    experienceSubMuseum: 'Museums & Art',
    experienceSubActivity: 'Activities',

    mapLegendAria: 'Pin Color Legend by Category',
    mapSvgSuffix: 'Illustrated Map',
    bucketInstruction:
      'Tap any place to highlight its map pin and view details & map links.',
    bucketCheckAria: (name) => `Check ${name}`,
    bannerSubPet: 'Pet-Friendly Ulsan Bucket List',
    bannerSubGourmet: 'Ulsan Foodie & Cafe Bucket List',
    bannerSubExperience: 'Ulsan Tours & Museums Bucket List',
    bannerSubAttraction: 'Ulsan Top Attractions Bucket List',
    bannerSubItinerary: 'Ulsan Travel Bucket List',

    viewRouteMapCta: '🗺️ View Route Map →',
    backToCourseList: '← All Courses',
    quickSwitchCourseAria: 'Quick Course Switcher',
    courseRouteMapAria: (title) => `${title} Route Map`,
    courseChecklistTitle: 'Course Route Checklist',
    courseChecklistSub:
      'Tap any stop to highlight its location on the map and view photos & map links.',
    stopCheckAria: (title) => `Check off ${title}`,

    naverMapBtn: 'Naver Map',
    googleMapBtn: 'Google Maps',
    ktoPhotoSingleAria: 'Korea Tourism Organization TourAPI Photo',
    ktoPhotoMultiAria: 'Korea Tourism Organization TourAPI Photos',

    ktoLivePetBadge: 'Pet-Friendly · KTO Official',
    ktoLivePetDesc: (addr) =>
      `An official KTO Pet-Friendly registered destination located at ${addr}.`,
    ktoLivePetPolicy: 'Official KTO Pet-Friendly destination (leash & waste bags required)',

    scheduleTitle: 'Ulsan Major Schedule & Festivals',
    scheduleSubtitle:
      'Explore Ulsan’s seasonal festivals, night illuminations, and whale cruise schedules.',
    scheduleSeasonAria: 'Schedule Seasons',
    seasonAllEvents: 'All Events',
    seasonYearRound: 'Year-Round',
    seasonSpring: 'Spring (May)',
    seasonSummer: 'Summer (Jul–Aug)',
    seasonAutumn: 'Autumn (Sep–Oct)',
    seasonWinter: 'Winter & Sunrise',

    docTitleHome: 'Ulsan Travel Course Guide | STEPLESS IN ULSAN',
    docTitleSchedule: 'Ulsan Major Schedule & Festivals | STEPLESS IN ULSAN',
    docTitleItinerary: 'Ulsan Itinerary Courses | STEPLESS IN ULSAN',
    docTitleStamp: 'Ulsan Stamp Tour | STEPLESS IN ULSAN',
    docTitlePet: 'Ulsan Pet-Friendly Tourism City Courses | STEPLESS IN ULSAN',
    docTitleGourmet: 'Ulsan Gourmet & Foodie Courses | STEPLESS IN ULSAN',
    docTitleAttraction: 'Ulsan Top Attractions | STEPLESS IN ULSAN',
    docTitleExperience: 'Ulsan Experiences & Museums | STEPLESS IN ULSAN',

    footerAbout: 'About',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms',
    footerContact: 'Contact',
  },

  JA: {
    logoTitle: 'STEPLESS IN ULSAN ホームへ移動',
    mainNavAria: 'メインナビゲーション',
    navHome: 'ホーム',
    navCourses: 'おすすめコース',
    navSchedule: '蔚山イベントカレンダー',
    langButtonAria: '言語を選択',

    howSectionAria: '釜山から蔚山へのアクセス方法3選',
    howTitle: '釜山から蔚山へ、どうやって行く？',
    howSubtitle: '出発地や旅のルートに合わせて、いちばん便利な移動方法を選びましょう！',
    ktxDoodleAria: 'KTX高速鉄道のイラスト',
    ktxBadge: '釜山駅 → 蔚山駅（約20分）',
    ktxName: 'KTXで蔚山駅へ',
    ktxDesc: '釜山駅からKTXに乗れば、あっという間の約20分で蔚山駅に到着します！',
    ktxTip: '盤亀台岩刻画・彦陽プルコギ方面へ行くならこれ！',
    donghaeDoodleAria: '東海線電車のイラスト',
    donghaeBadge: '釜田・センタム・機張 → 太和江駅',
    donghaeName: '東海線で太和江駅へ',
    donghaeDesc: '交通系ICカードでそのまま乗車！蔚山中心部の太和江駅まで1本でアクセスできます。',
    donghaeTip: '太和江国家庭園・長生浦・大王岩公園へ行くなら最適！',
    busDoodleAria: '老圃駅バスのイラスト',
    busBadge: '釜山・老圃駅 → 蔚山',
    busName: '老圃駅から高速・市外バス',
    busDesc: '釜山地下鉄1号線の老圃駅バスターミナルから、ゆったり座って移動できます！',
    busTip: '運行本数が多いので、思い立ったらいつでも出発OK！',

    whaleAria: 'キョルクジラ',
    heroTitle: 'どんな蔚山旅をしてみたいですか？',
    tasteGroupAria: '10の旅のテーマ',
    companionGroupAria: '誰と一緒に',
    durationGroupAria: '旅行の期間',
    buildCourseBtn: 'マイコースを作る',
    pickAgainBtn: 'もう一度選ぶ',
    customCourseSuffix: '蔚山旅コース',

    coursesTitle: '蔚山おすすめ旅行コース',
    courseCatAria: 'おすすめコースのカテゴリー',
    catItinerary: 'モデルコース',
    catStamp: '蔚山スタンプツアー',
    catPet: 'ペット同伴',
    catGourmet: 'グルメ・カフェ',
    catAttraction: '名所・絶景',
    catExperience: '体験・ミュージアム',

    petCityBanner:
      '蔚山広域市は文化体育観光部と韓国観光公社に選定された韓国初の広域自治体「ペットフレンドリー観光都市」です。',

    subAll: 'すべて',
    petSubAria: 'ペット同伴サブカテゴリー',
    petSubWalk: 'お散歩スポット',
    petSubPark: 'ドッグラン・公園',
    petSubActivity: 'ユニーク体験',
    petSubDining: '同伴カフェ・食事',

    gourmetSubAria: 'グルメサブカテゴリー',
    gourmetSubCafe: 'カフェ',
    gourmetSubBrunch: 'ブランチ',
    gourmetSubRestaurant: 'レストラン・食堂',
    gourmetSubDessert: 'スイーツ・ベーカリー',

    attractionSubAria: '名所サブカテゴリー',
    attractionSubNature: '自然・庭園',
    attractionSubCoast: '海岸・日の出',
    attractionSubHeritage: '歴史・文化遺産',
    attractionSubView: '展望・夜景',

    experienceSubAria: '体験サブカテゴリー',
    experienceSubTour: 'ツアー',
    experienceSubWorkshop: '工房体験',
    experienceSubMuseum: '美術館・博物館',
    experienceSubActivity: 'アクティビティ',

    mapLegendAria: 'カテゴリー別ピン色ガイド',
    mapSvgSuffix: 'イラストマップ',
    bucketInstruction:
      'スポットをタップすると、地図上の位置と詳細情報・NAVER/Googleマップが表示されます。',
    bucketCheckAria: (name) => `${name}をバケットリストにチェック`,
    bannerSubPet: 'ペットフレンドリー都市・蔚山バケットリスト',
    bannerSubGourmet: '蔚山グルメ＆絶景カフェ バケットリスト',
    bannerSubExperience: '蔚山ツアー・工房・博物館バケットリスト',
    bannerSubAttraction: '蔚山を代表する名所バケットリスト',
    bannerSubItinerary: '蔚山旅行バケットリスト',

    viewRouteMapCta: '🗺️ ルートマップを見る →',
    backToCourseList: '← モデルコース一覧へ',
    quickSwitchCourseAria: 'コース切り替え',
    courseRouteMapAria: (title) => `${title} ルートマップ`,
    courseChecklistTitle: 'コース順スポット・チェックリスト',
    courseChecklistSub:
      '立ち寄りスポットをタップすると、地図上の番号と写真・地図リンクが表示されます。',
    stopCheckAria: (title) => `${title}の訪問チェック`,

    naverMapBtn: 'NAVERマップ',
    googleMapBtn: 'Googleマップ',
    ktoPhotoSingleAria: '韓国観光公社 TourAPI 観光地写真',
    ktoPhotoMultiAria: '韓国観光公社 TourAPI 観光地フォトギャラリー',

    ktoLivePetBadge: 'ペット同伴 · 韓国観光公社公式登録',
    ktoLivePetDesc: (addr) =>
      `${addr}にある韓国観光公社「ペット同伴旅行」公式登録スポットです。`,
    ktoLivePetPolicy: '韓国観光公社ペット同伴旅行公式登録（リード・マナー袋必須）',

    scheduleTitle: '蔚山イベント＆祭りカレンダー',
    scheduleSubtitle:
      '季節ごとの蔚山を代表するお祭りや、通年楽しめる夜間ライトアップ・クルーズ情報をチェックしましょう。',
    scheduleSeasonAria: '季節別イベントフィルター',
    seasonAllEvents: 'すべて',
    seasonYearRound: '通年開催',
    seasonSpring: '春（5月）',
    seasonSummer: '夏（7〜8月）',
    seasonAutumn: '秋（9〜10月）',
    seasonWinter: '冬・初日の出',

    docTitleHome: '蔚山バリアフリー旅行ガイド | STEPLESS IN ULSAN',
    docTitleSchedule: '蔚山イベント＆祭りカレンダー | STEPLESS IN ULSAN',
    docTitleItinerary: '蔚山おすすめモデルコース | STEPLESS IN ULSAN',
    docTitleStamp: '蔚山スタンプツアー | STEPLESS IN ULSAN',
    docTitlePet: '蔚山ペット同伴おすすめ旅行コース | STEPLESS IN ULSAN',
    docTitleGourmet: '蔚山グルメ＆カフェおすすめコース | STEPLESS IN ULSAN',
    docTitleAttraction: '蔚山おすすめ名所＆絶景スポット | STEPLESS IN ULSAN',
    docTitleExperience: '蔚山体験・博物館おすすめガイド | STEPLESS IN ULSAN',

    footerAbout: 'サービス紹介',
    footerPrivacy: 'プライバシーポリシー',
    footerTerms: '利用規約',
    footerContact: 'お問い合わせ',
  },

  ZH: {
    logoTitle: '返回 STEPLESS IN ULSAN 首页',
    mainNavAria: '主导航菜单',
    navHome: '首页',
    navCourses: '推荐旅行路线',
    navSchedule: '蔚山节庆日程',
    langButtonAria: '选择语言',

    howSectionAria: '从釜山前往蔚山的3种方式',
    howTitle: '从釜山怎么去蔚山最方便？',
    howSubtitle: '根据您的出发地和旅行路线，挑选最轻松的交通方式吧！',
    ktxDoodleAria: 'KTX高速列车插画',
    ktxBadge: '釜山站 → 蔚山站（约20分钟）',
    ktxName: '搭乘KTX至蔚山站',
    ktxDesc: '在釜山站乘坐KTX高铁，一眨眼的功夫（约20分钟）就能直达蔚山站！',
    ktxTip: '前往盘龟台岩刻画、彦阳烤肉特区最推荐！',
    donghaeDoodleAria: '东海线轻轨插画',
    donghaeBadge: '釜田·Centum·机张 → 太和江站',
    donghaeName: '搭乘东海线至太和江站',
    donghaeDesc: '刷交通卡即可搭乘东海线电铁，一站直达蔚山市中心的太和江站！',
    donghaeTip: '游览太和江国家庭园、长生浦鲸鱼村、大王岩最方便！',
    busDoodleAria: '老圃站巴士插画',
    busBadge: '釜山老圃站 → 蔚山',
    busName: '从老圃站搭乘城际巴士',
    busDesc: '在釜山地铁1号线老圃站综合巴士客运站乘车，一路舒适直达蔚山！',
    busTip: '发车班次密集，随时都能轻松出发！',

    whaleAria: 'Gyeol小鲸鱼',
    heroTitle: '想要开启怎样的蔚山之旅？',
    tasteGroupAria: '10种旅行偏好',
    companionGroupAria: '同行旅伴',
    durationGroupAria: '行程时长',
    buildCourseBtn: '生成专属路线',
    pickAgainBtn: '重新选择',
    customCourseSuffix: '蔚山路线',

    coursesTitle: '蔚山精选旅行路线',
    courseCatAria: '推荐路线分类',
    catItinerary: '主题路线',
    catStamp: '蔚山集章之旅',
    catPet: '宠物友好',
    catGourmet: '美食探店',
    catAttraction: '必游景点',
    catExperience: '文化体验',

    petCityBanner:
      '蔚山广域市是韩国文化体育观光部与韩国观光公社评定的韩国首个广域级“宠物友好旅游城市”。',

    subAll: '全部',
    petSubAria: '宠物友好子分类',
    petSubWalk: '遛宠步道',
    petSubPark: '宠物乐园',
    petSubActivity: '特色体验',
    petSubDining: '宠物友好餐厅/咖啡厅',

    gourmetSubAria: '美食子分类',
    gourmetSubCafe: '海景咖啡厅',
    gourmetSubBrunch: '早午餐',
    gourmetSubRestaurant: '地道美食',
    gourmetSubDessert: '甜点烘焙',

    attractionSubAria: '景点子分类',
    attractionSubNature: '自然与庭园',
    attractionSubCoast: '海岸与日出',
    attractionSubHeritage: '历史与遗产',
    attractionSubView: '观景与夜景',

    experienceSubAria: '体验子分类',
    experienceSubTour: '导览游',
    experienceSubWorkshop: '手作工坊',
    experienceSubMuseum: '博物馆与美术馆',
    experienceSubActivity: '互动体验',

    mapLegendAria: '分类编号颜色图例',
    mapSvgSuffix: '手绘插画地图',
    bucketInstruction:
      '点击任意地点，即可在地图上高亮显示位置，并查看详细介绍与Naver/Google地图导航。',
    bucketCheckAria: (name) => `打卡 ${name}`,
    bannerSubPet: '宠物友好旅游城市·蔚山打卡清单',
    bannerSubGourmet: '蔚山美食与海景咖啡厅打卡清单',
    bannerSubExperience: '蔚山导览·工坊·博物馆打卡清单',
    bannerSubAttraction: '蔚山代表性必游景点打卡清单',
    bannerSubItinerary: '蔚山旅行打卡清单',

    viewRouteMapCta: '🗺️ 查看路线地图 →',
    backToCourseList: '← 返回主题路线列表',
    quickSwitchCourseAria: '快速切换路线',
    courseRouteMapAria: (title) => `${title} 路线地图`,
    courseChecklistTitle: '路线途经站点打卡清单',
    courseChecklistSub:
      '点击任意站点，即可在上方地图查看对应编号位置、实景照片与地图导航链接。',
    stopCheckAria: (title) => `打卡站点 ${title}`,

    naverMapBtn: 'Naver 地图',
    googleMapBtn: 'Google 地图',
    ktoPhotoSingleAria: '韩国观光公社 TourAPI 景点实拍图',
    ktoPhotoMultiAria: '韩国观光公社 TourAPI 景点实拍图集',

    ktoLivePetBadge: '宠物友好 · 韩国观光公社官方认证',
    ktoLivePetDesc: (addr) =>
      `位于${addr}的韩国观光公社宠物伴侣旅行官方认证地点。`,
    ktoLivePetPolicy: '韩国观光公社宠物友好认证地点（请佩戴牵引绳并自备拾便袋）',

    scheduleTitle: '蔚山主要节庆与活动日程',
    scheduleSubtitle:
      '一览蔚山四季代表性庆典、竹林星光夜游及鲸鱼出海游轮时刻表。',
    scheduleSeasonAria: '按季节筛选日程',
    seasonAllEvents: '全部活动',
    seasonYearRound: '全年常设',
    seasonSpring: '春季（5月）',
    seasonSummer: '夏季（7~8月）',
    seasonAutumn: '秋季（9~10月）',
    seasonWinter: '冬季·迎日出',

    docTitleHome: '蔚山无障碍旅行路线指南 | STEPLESS IN ULSAN',
    docTitleSchedule: '蔚山主要节庆与活动日程 | STEPLESS IN ULSAN',
    docTitleItinerary: '蔚山主题推荐旅行路线 | STEPLESS IN ULSAN',
    docTitleStamp: '蔚山集章之旅 | STEPLESS IN ULSAN',
    docTitlePet: '蔚山宠物友好旅游城市推荐路线 | STEPLESS IN ULSAN',
    docTitleGourmet: '蔚山美食与海景咖啡推荐 | STEPLESS IN ULSAN',
    docTitleAttraction: '蔚山必游景点推荐 | STEPLESS IN ULSAN',
    docTitleExperience: '蔚山文化体验与博物馆指南 | STEPLESS IN ULSAN',

    footerAbout: '关于我们',
    footerPrivacy: '隐私政策',
    footerTerms: '服务条款',
    footerContact: '联系我们',
  },

  ES: {
    logoTitle: 'Ir al inicio de STEPLESS IN ULSAN',
    mainNavAria: 'Navegación principal',
    navHome: 'Inicio',
    navCourses: 'Rutas Recomendadas',
    navSchedule: 'Agenda y Festivales',
    langButtonAria: 'Seleccionar idioma',

    howSectionAria: '3 formas de llegar a Ulsan desde釜山 (Busan)',
    howTitle: '¿Cómo llegar a Ulsan desde Busan?',
    howSubtitle: '¡Elige la opción más cómoda según tu punto de partida y tu ruta de viaje!',
    ktxDoodleAria: 'Ilustración del tren de alta velocidad KTX',
    ktxBadge: 'Est. Busan → Est. Ulsan (20 min)',
    ktxName: 'Tren KTX hasta la Estación de Ulsan',
    ktxDesc: '¡Toma el tren de alta velocidad KTX en la Estación de Busan y llega a Ulsan en solo 20 minutos!',
    ktxTip: '¡Ideal para visitar los Petroglifos de Bangudae y probar el Bulgogi de Eonyang!',
    donghaeDoodleAria: 'Ilustración del metro Línea Donghae',
    donghaeBadge: 'Bujeon · Centum · Gijang → Est. Taehwagang',
    donghaeName: 'Línea Donghae hasta Taehwagang',
    donghaeDesc: '¡Usa tu tarjeta de transporte en el tren metropolitano Donghae y baja directo en el corazón de Ulsan!',
    donghaeTip: '¡Perfecto para ir al Jardín Nacional Taehwagang, Jangsaengpo y Daewangam!',
    busDoodleAria: 'Ilustración de autobús desde Nopo',
    busBadge: 'Est. Nopo (Busan) → Ulsan',
    busName: 'Autobús directo desde Nopo',
    busDesc: '¡Viaja cómodamente en autobús interurbano desde la terminal de la estación Nopo (Línea 1 de Busan)!',
    busTip: 'Salidas muy frecuentes para viajar sin horarios complicados.',

    whaleAria: 'Ballena Gyeol',
    heroTitle: '¿Qué tipo de viaje por Ulsan te apetece?',
    tasteGroupAria: '10 estilos de viaje',
    companionGroupAria: 'Con quién viajas',
    durationGroupAria: 'Duración del viaje',
    buildCourseBtn: 'Crear mi ruta',
    pickAgainBtn: 'Elegir de nuevo',
    customCourseSuffix: 'Ruta por Ulsan',

    coursesTitle: 'Rutas Recomendadas en Ulsan',
    courseCatAria: 'Categorías de rutas',
    catItinerary: 'Rutas por Día',
    catStamp: 'Tour de Sellos Ulsan',
    catPet: 'Con Mascotas',
    catGourmet: 'Gastronomía',
    catAttraction: 'Lugares Clave',
    catExperience: 'Experiencias',

    petCityBanner:
      'La Ciudad Metropolitana de Ulsan es la primera metrópoli de Corea designada oficialmente como «Ciudad Turística Pet-Friendly» por el Ministerio de Cultura y la OTC.',

    subAll: 'Todo',
    petSubAria: 'Subcategorías para mascotas',
    petSubWalk: 'Paseos y Parques',
    petSubPark: 'Parques Caninos',
    petSubActivity: 'Actividades',
    petSubDining: 'Cafés y Restaurantes',

    gourmetSubAria: 'Subcategorías de gastronomía',
    gourmetSubCafe: 'Cafeterías',
    gourmetSubBrunch: 'Brunch',
    gourmetSubRestaurant: 'Restaurantes',
    gourmetSubDessert: 'Postres',

    attractionSubAria: 'Subcategorías de lugares clave',
    attractionSubNature: 'Naturaleza y Jardines',
    attractionSubCoast: 'Costa y Amanecer',
    attractionSubHeritage: 'Historia y Patrimonio',
    attractionSubView: 'Miradores y Noche',

    experienceSubAria: 'Subcategorías de experiencias',
    experienceSubTour: 'Tours Guiados',
    experienceSubWorkshop: 'Talleres',
    experienceSubMuseum: 'Museos y Arte',
    experienceSubActivity: 'Actividades',

    mapLegendAria: 'Leyenda de colores por categoría',
    mapSvgSuffix: 'Mapa ilustrado',
    bucketInstruction:
      'Toca cualquier lugar para resaltarlo en el mapa y ver sus detalles y enlaces a Naver/Google Maps.',
    bucketCheckAria: (name) => `Marcar ${name} en mi lista`,
    bannerSubPet: 'Lista de deseos Pet-Friendly en Ulsan',
    bannerSubGourmet: 'Lista gastronómica y de cafés en Ulsan',
    bannerSubExperience: 'Lista de tours, talleres y museos en Ulsan',
    bannerSubAttraction: 'Lista de lugares imprescindibles en Ulsan',
    bannerSubItinerary: 'Lista de viaje por Ulsan',

    viewRouteMapCta: '🗺️ Ver mapa del recorrido →',
    backToCourseList: '← Todas las rutas',
    quickSwitchCourseAria: 'Cambio rápido de ruta',
    courseRouteMapAria: (title) => `Mapa del recorrido: ${title}`,
    courseChecklistTitle: 'Lista de paradas del recorrido',
    courseChecklistSub:
      'Toca cualquier parada para ver su ubicación en el mapa, fotos y enlaces de navegación.',
    stopCheckAria: (title) => `Marcar parada ${title}`,

    naverMapBtn: 'Naver Map',
    googleMapBtn: 'Google Maps',
    ktoPhotoSingleAria: 'Fotografía oficial de la Organización de Turismo de Corea',
    ktoPhotoMultiAria: 'Galería oficial de la Organización de Turismo de Corea',

    ktoLivePetBadge: 'Pet-Friendly · Oficial KTO',
    ktoLivePetDesc: (addr) =>
      `Destino Pet-Friendly registrado oficialmente por la Organización de Turismo de Corea en ${addr}.`,
    ktoLivePetPolicy: 'Certificado por KTO Pet Tour (uso obligatorio de correa y bolsas higiénicas)',

    scheduleTitle: 'Agenda y Festivales de Ulsan',
    scheduleSubtitle:
      'Consulta los festivales estacionales más emblemáticos de Ulsan, paseos nocturnos iluminados y cruceros de avistamiento.',
    scheduleSeasonAria: 'Filtrar eventos por estación',
    seasonAllEvents: 'Todos',
    seasonYearRound: 'Todo el año',
    seasonSpring: 'Primavera (Mayo)',
    seasonSummer: 'Verano (Jul–Ago)',
    seasonAutumn: 'Otoño (Sep–Oct)',
    seasonWinter: 'Invierno y Año Nuevo',

    docTitleHome: 'Guía de Viaje sin Barreras en Ulsan | STEPLESS IN ULSAN',
    docTitleSchedule: 'Agenda y Festivales de Ulsan | STEPLESS IN ULSAN',
    docTitleItinerary: 'Rutas Recomendadas por Ulsan | STEPLESS IN ULSAN',
    docTitleStamp: 'Tour de Sellos Ulsan | STEPLESS IN ULSAN',
    docTitlePet: 'Ulsan con Mascotas: Rutas Pet-Friendly | STEPLESS IN ULSAN',
    docTitleGourmet: 'Ruta Gastronómica y Cafés de Ulsan | STEPLESS IN ULSAN',
    docTitleAttraction: 'Lugares Imprescindibles de Ulsan | STEPLESS IN ULSAN',
    docTitleExperience: 'Experiencias y Museos en Ulsan | STEPLESS IN ULSAN',

    footerAbout: 'Acerca de',
    footerPrivacy: 'Privacidad',
    footerTerms: 'Términos',
    footerContact: 'Contacto',
  },

  FR: {
    logoTitle: 'Retour à l’accueil STEPLESS IN ULSAN',
    mainNavAria: 'Navigation principale',
    navHome: 'Accueil',
    navCourses: 'Itinéraires Conseillés',
    navSchedule: 'Agenda & Festivals',
    langButtonAria: 'Choisir la langue',

    howSectionAria: '3 façons de rejoindre Ulsan depuis Busan',
    howTitle: 'Comment venir à Ulsan depuis Busan ?',
    howSubtitle: 'Choisissez le moyen de transport le plus pratique selon votre point de départ et votre programme !',
    ktxDoodleAria: 'Illustration du TGV coréen KTX',
    ktxBadge: 'Gare de Busan → Gare d’Ulsan (20 min)',
    ktxName: 'En KTX jusqu’à la gare d’Ulsan',
    ktxDesc: 'Prenez le train à grande vitesse KTX à la gare de Busan et rejoignez Ulsan en seulement 20 minutes !',
    ktxTip: 'Idéal pour les pétroglyphes de Bangudae et le bulgogi d’Eonyang !',
    donghaeDoodleAria: 'Illustration du train de la ligne Donghae',
    donghaeBadge: 'Bujeon · Centum · Gijang → Gare de Taehwagang',
    donghaeName: 'Ligne Donghae jusqu’à Taehwagang',
    donghaeDesc: 'Validez votre carte de transport sur la ligne Donghae et descendez directement au cœur d’Ulsan !',
    donghaeTip: 'Parfait pour le Jardin national de Taehwagang, Jangsaengpo et Daewangam !',
    busDoodleAria: 'Illustration du bus express depuis Nopo',
    busBadge: 'Busan Nopo → Ulsan',
    busName: 'Bus express depuis la station Nopo',
    busDesc: 'Montez à bord d’un bus confortable depuis le terminal de Nopo (ligne 1 du métro de Busan) !',
    busTip: 'Départs très fréquents pour partir à tout moment sans contrainte.',

    whaleAria: 'Baleine Gyeol',
    heroTitle: 'Quel voyage à Ulsan vous ferait plaisir ?',
    tasteGroupAria: '10 envies de voyage',
    companionGroupAria: 'Avec qui',
    durationGroupAria: 'Durée du séjour',
    buildCourseBtn: 'Créer mon parcours',
    pickAgainBtn: 'Recommencer',
    customCourseSuffix: 'Parcours à Ulsan',

    coursesTitle: 'Nos Parcours Conseillés à Ulsan',
    courseCatAria: 'Catégories de parcours',
    catItinerary: 'Circuits Clés',
    catStamp: 'Tour des Tampons',
    catPet: 'Avec son Chien',
    catGourmet: 'Gastronomie',
    catAttraction: 'Incontournables',
    catExperience: 'Expériences',

    petCityBanner:
      'La ville métropolitaine d’Ulsan est la toute première métropole de Corée labellisée « Ville Touristique Pet-Friendly » par le ministère de la Culture et l’OTN.',

    subAll: 'Tout voir',
    petSubAria: 'Sous-catégories animaux de compagnie',
    petSubWalk: 'Balades & Parcs',
    petSubPark: 'Parcs Canins',
    petSubActivity: 'Activités Insolites',
    petSubDining: 'Cafés & Restos',

    gourmetSubAria: 'Sous-catégories gastronomie',
    gourmetSubCafe: 'Cafés Vue Mer',
    gourmetSubBrunch: 'Brunch',
    gourmetSubRestaurant: 'Restaurants',
    gourmetSubDessert: 'Pâtisseries',

    attractionSubAria: 'Sous-catégories sites incontournables',
    attractionSubNature: 'Nature & Jardins',
    attractionSubCoast: 'Littoral & Lever du soleil',
    attractionSubHeritage: 'Histoire & Patrimoine',
    attractionSubView: 'Panoramas & Nuit',

    experienceSubAria: 'Sous-catégories expériences',
    experienceSubTour: 'Visites',
    experienceSubWorkshop: 'Ateliers d’Art',
    experienceSubMuseum: 'Musées',
    experienceSubActivity: 'Activités',

    mapLegendAria: 'Légende des couleurs par catégorie',
    mapSvgSuffix: 'Carte illustrée',
    bucketInstruction:
      'Touchez un lieu pour l’afficher sur la carte et consulter sa fiche détaillée ainsi que les liens Naver/Google Maps.',
    bucketCheckAria: (name) => `Cocher ${name} dans mes envies`,
    bannerSubPet: 'Carnet d’envies Pet-Friendly à Ulsan',
    bannerSubGourmet: 'Carnet gourmand & cafés d’Ulsan',
    bannerSubExperience: 'Carnet de visites, ateliers & musées à Ulsan',
    bannerSubAttraction: 'Carnet des lieux incontournables d’Ulsan',
    bannerSubItinerary: 'Carnet de voyage à Ulsan',

    viewRouteMapCta: '🗺️ Voir le tracé sur la carte →',
    backToCourseList: '← Tous les circuits',
    quickSwitchCourseAria: 'Changement rapide de circuit',
    courseRouteMapAria: (title) => `Carte de l’itinéraire : ${title}`,
    courseChecklistTitle: 'Étapes du parcours pas à pas',
    courseChecklistSub:
      'Touchez une étape pour la localiser sur la carte et afficher ses photos et liens d’itinéraire.',
    stopCheckAria: (title) => `Cocher l’étape ${title}`,

    naverMapBtn: 'Naver Map',
    googleMapBtn: 'Google Maps',
    ktoPhotoSingleAria: 'Photo officielle de l’Office National du Tourisme Coréen',
    ktoPhotoMultiAria: 'Galerie photo de l’Office National du Tourisme Coréen',

    ktoLivePetBadge: 'Pet-Friendly · Certifié KTO',
    ktoLivePetDesc: (addr) =>
      `Adresse officiellement référencée « Voyage avec animaux » par l’Office du Tourisme Coréen à ${addr}.`,
    ktoLivePetPolicy: 'Lieu certifié KTO Pet Tour (laisse et sacs à déjections indispensables)',

    scheduleTitle: 'Grand Agenda & Festivals d’Ulsan',
    scheduleSubtitle:
      'Découvrez les grands festivals saisonniers d’Ulsan, les promenades nocturnes illuminées et les horaires des croisières.',
    scheduleSeasonAria: 'Filtrer par saison',
    seasonAllEvents: 'Tout l’agenda',
    seasonYearRound: 'Toute l’année',
    seasonSpring: 'Printemps (Mai)',
    seasonSummer: 'Été (Juil.–Août)',
    seasonAutumn: 'Automne (Sept.–Oct.)',
    seasonWinter: 'Hiver & Nouvel An',

    docTitleHome: 'Guide d’Ulsan Accessible à Tous | STEPLESS IN ULSAN',
    docTitleSchedule: 'Agenda & Festivals d’Ulsan | STEPLESS IN ULSAN',
    docTitleItinerary: 'Circuits Conseillés à Ulsan | STEPLESS IN ULSAN',
    docTitleStamp: 'Tour des Tampons d’Ulsan | STEPLESS IN ULSAN',
    docTitlePet: 'Voyager à Ulsan avec son Chien | STEPLESS IN ULSAN',
    docTitleGourmet: 'Bonnes Adresses & Cafés à Ulsan | STEPLESS IN ULSAN',
    docTitleAttraction: 'Sites Incontournables d’Ulsan | STEPLESS IN ULSAN',
    docTitleExperience: 'Expériences & Musées à Ulsan | STEPLESS IN ULSAN',

    footerAbout: 'À propos',
    footerPrivacy: 'Confidentialité',
    footerTerms: 'Conditions',
    footerContact: 'Contact',
  },

  DE: {
    logoTitle: 'Zur STEPLESS IN ULSAN Startseite',
    mainNavAria: 'Hauptnavigation',
    navHome: 'Start',
    navCourses: 'Empfohlene Routen',
    navSchedule: 'Festivals & Termine',
    langButtonAria: 'Sprache wählen',

    howSectionAria: '3 Wege von Busan nach Ulsan',
    howTitle: 'Wie kommt man von Busan nach Ulsan?',
    howSubtitle: 'Wähle je nach Startpunkt und Reiseroute die bequemste Verbindung!',
    ktxDoodleAria: 'KTX-Hochgeschwindigkeitszug Illustration',
    ktxBadge: 'Bhf. Busan → Bhf. Ulsan (ca. 20 Min.)',
    ktxName: 'Mit dem KTX zum Bahnhof Ulsan',
    ktxDesc: 'Steig am Bahnhof Busan in den KTX und erreiche Ulsan im Handumdrehen in nur 20 Minuten!',
    ktxTip: 'Perfekt für die Felsbilder von Bangudae & Eonyang-Bulgogi!',
    donghaeDoodleAria: 'Donghae-Linie S-Bahn Illustration',
    donghaeBadge: 'Bujeon · Centum · Gijang → Bhf. Taehwagang',
    donghaeName: 'Mit der Donghae-Linie nach Taehwagang',
    donghaeDesc: 'Einfach mit der ÖPNV-Karte in die Donghae-Linie einsteigen und mitten im Zentrum von Ulsan aussteigen!',
    donghaeTip: 'Ideal für den Nationalgarten Taehwagang, Jangsaengpo & Daewangam!',
    busDoodleAria: 'Expressbus ab Nopo Illustration',
    busBadge: 'Busan Bhf. Nopo → Ulsan',
    busName: 'Mit dem Fernbus ab Bahnhof Nopo',
    busDesc: 'Vom zentralen Busterminal an der U-Bahn-Station Nopo (Linie 1) fährst du ganz entspannt direkt nach Ulsan!',
    busTip: 'Kurze Taktzeiten – jederzeit flexibel losfahren!',

    whaleAria: 'Wal Gyeol',
    heroTitle: 'Welche Art von Ulsan-Reise wünschst du dir?',
    tasteGroupAria: '10 Reisethemen',
    companionGroupAria: 'Mit wem',
    durationGroupAria: 'Reisedauer',
    buildCourseBtn: 'Meine Route erstellen',
    pickAgainBtn: 'Neu wählen',
    customCourseSuffix: 'Ulsan-Route',

    coursesTitle: 'Empfohlene Reiserouten in Ulsan',
    courseCatAria: 'Routenkategorien',
    catItinerary: 'Tagestouren',
    catStamp: 'Ulsan Stempeltour',
    catPet: 'Mit Hund',
    catGourmet: 'Kulinarik & Cafés',
    catAttraction: 'Sehenswürdigkeiten',
    catExperience: 'Erlebnisse & Museen',

    petCityBanner:
      'Die Metropolstadt Ulsan wurde vom Kulturministerium und der Koreanischen Zentrale für Tourismus als erste Großstadt Koreas zur „Haustierfreundlichen Tourismusstadt“ ernannt.',

    subAll: 'Alle',
    petSubAria: 'Unterkategorien für Reisen mit Hund',
    petSubWalk: 'Spazierwege',
    petSubPark: 'Hundeparks',
    petSubActivity: 'Erlebnisse',
    petSubDining: 'Cafés & Restaurants',

    gourmetSubAria: 'Kulinarik-Unterkategorien',
    gourmetSubCafe: 'Cafés',
    gourmetSubBrunch: 'Brunch',
    gourmetSubRestaurant: 'Restaurants',
    gourmetSubDessert: 'Desserts & Bäckerei',

    attractionSubAria: 'Sehenswürdigkeiten-Unterkategorien',
    attractionSubNature: 'Natur & Gärten',
    attractionSubCoast: 'Küste & Sonnenaufgang',
    attractionSubHeritage: 'Geschichte & Kulturerbe',
    attractionSubView: 'Aussicht & Nachtblick',

    experienceSubAria: 'Erlebnis-Unterkategorien',
    experienceSubTour: 'Touren',
    experienceSubWorkshop: 'Workshops',
    experienceSubMuseum: 'Museen & Kunst',
    experienceSubActivity: 'Aktivitäten',

    mapLegendAria: 'Farblegende nach Kategorie',
    mapSvgSuffix: 'Illustrierte Karte',
    bucketInstruction:
      'Tippe auf einen Ort, um ihn auf der Karte hervorzuheben und Details sowie Naver-/Google-Maps-Links anzuzeigen.',
    bucketCheckAria: (name) => `${name} auf der Bucket-List abhaken`,
    bannerSubPet: 'Hundefreundliches Ulsan – Bucket-List',
    bannerSubGourmet: 'Ulsan Food & Café Bucket-List',
    bannerSubExperience: 'Ulsan Touren, Workshops & Museen Bucket-List',
    bannerSubAttraction: 'Ulsans Top-Sehenswürdigkeiten Bucket-List',
    bannerSubItinerary: 'Ulsan Reise-Bucket-List',

    viewRouteMapCta: '🗺️ Routenkarte ansehen →',
    backToCourseList: '← Alle Tagestouren',
    quickSwitchCourseAria: 'Schnellwechsel zwischen Routen',
    courseRouteMapAria: (title) => `Routenkarte: ${title}`,
    courseChecklistTitle: 'Routen-Checkliste nach Stationen',
    courseChecklistSub:
      'Tippe auf eine Station, um die Nummer auf der Karte, Fotos und Kartenlinks direkt anzuzeigen.',
    stopCheckAria: (title) => `Station ${title} abhaken`,

    naverMapBtn: 'Naver Map',
    googleMapBtn: 'Google Maps',
    ktoPhotoSingleAria: 'Offizielles Tourismusfoto der KTO',
    ktoPhotoMultiAria: 'Offizielle Tourismusfotos der KTO',

    ktoLivePetBadge: 'Hundefreundlich · Offiziell KTO',
    ktoLivePetDesc: (addr) =>
      `Ein offiziell von der Koreanischen Zentrale für Tourismus registrierter haustierfreundlicher Ort in ${addr}.`,
    ktoLivePetPolicy: 'Offizieller KTO-Pet-Tour-Ort (Leinenpflicht & Kotbeutel mitführen)',

    scheduleTitle: 'Festivals & Veranstaltungskalender Ulsan',
    scheduleSubtitle:
      'Entdecke Ulsans schönste Jahreszeiten-Festivals, abendliche Lichterwege im Bambuswald und Walbeobachtungsfahrten.',
    scheduleSeasonAria: 'Veranstaltungen nach Jahreszeit filtern',
    seasonAllEvents: 'Alle Termine',
    seasonYearRound: 'Ganzjährig',
    seasonSpring: 'Frühling (Mai)',
    seasonSummer: 'Sommer (Juli–Aug.)',
    seasonAutumn: 'Herbst (Sept.–Okt.)',
    seasonWinter: 'Winter & Neujahr',

    docTitleHome: 'Barrierefreier Reiseführer Ulsan | STEPLESS IN ULSAN',
    docTitleSchedule: 'Festivals & Veranstaltungskalender Ulsan | STEPLESS IN ULSAN',
    docTitleItinerary: 'Empfohlene Tagestouren in Ulsan | STEPLESS IN ULSAN',
    docTitleStamp: 'Ulsan Stempeltour | STEPLESS IN ULSAN',
    docTitlePet: 'Ulsan mit Hund: Haustierfreundliche Routen | STEPLESS IN ULSAN',
    docTitleGourmet: 'Kulinarik & Meerblick-Cafés in Ulsan | STEPLESS IN ULSAN',
    docTitleAttraction: 'Top-Sehenswürdigkeiten in Ulsan | STEPLESS IN ULSAN',
    docTitleExperience: 'Erlebnisse & Museen in Ulsan | STEPLESS IN ULSAN',

    footerAbout: 'Über uns',
    footerPrivacy: 'Datenschutz',
    footerTerms: 'Nutzungsbedingungen',
    footerContact: 'Kontakt',
  },
};

export const INFO_LABEL_TRANSLATIONS: Record<string, LocalizedText> = {
  위치: {
    KR: '위치',
    EN: 'Location',
    JA: '所在地',
    ZH: '位置',
    ES: 'Ubicación',
    FR: 'Adresse',
    DE: 'Standort',
  },
  동반안내: {
    KR: '동반안내',
    EN: 'Pet Policy',
    JA: '同伴案内',
    ZH: '携宠须知',
    ES: 'Normas para mascotas',
    FR: 'Conditions animaux',
    DE: 'Hunde-Info',
  },
  산책특징: {
    KR: '산책특징',
    EN: 'Highlights',
    JA: '散歩のポイント',
    ZH: '步道特色',
    ES: 'Características del paseo',
    FR: 'Atouts balade',
    DE: 'Weg-Highlights',
  },
  운영시간: {
    KR: '운영시간',
    EN: 'Hours',
    JA: '営業時間',
    ZH: '营业时间',
    ES: 'Horario',
    FR: 'Horaires',
    DE: 'Öffnungszeiten',
  },
  주요시설: {
    KR: '주요시설',
    EN: 'Facilities',
    JA: '主な施設',
    ZH: '主要设施',
    ES: 'Instalaciones',
    FR: 'Équipements',
    DE: 'Ausstattung',
  },
  체험내용: {
    KR: '체험내용',
    EN: 'Program',
    JA: '体験内容',
    ZH: '体验项目',
    ES: 'Actividades',
    FR: 'Programme',
    DE: 'Programm',
  },
  예약안내: {
    KR: '예약안내',
    EN: 'Booking',
    JA: '予約案内',
    ZH: '预约说明',
    ES: 'Reservas',
    FR: 'Réservation',
    DE: 'Reservierung',
  },
  특징: {
    KR: '특징',
    EN: 'Highlights',
    JA: '特徴・魅力',
    ZH: '特色亮点',
    ES: 'Puntos destacados',
    FR: 'Points forts',
    DE: 'Besonderheiten',
  },
  대표메뉴: {
    KR: '대표메뉴',
    EN: 'Signature Menu',
    JA: '看板メニュー',
    ZH: '招牌菜品',
    ES: 'Platos estrella',
    FR: 'Spécialités',
    DE: 'Empfehlungen',
  },
  대표디저트: {
    KR: '대표디저트',
    EN: 'Signature Desserts',
    JA: '人気スイーツ',
    ZH: '招牌甜点',
    ES: 'Postres estrella',
    FR: 'Pâtisseries phares',
    DE: 'Beliebte Desserts',
  },
  주요볼거리: {
    KR: '주요볼거리',
    EN: 'Highlights',
    JA: '見どころ',
    ZH: '主要看点',
    ES: 'Atractivos principales',
    FR: 'À ne pas manquer',
    DE: 'Sehenswertes',
  },
  운영일정: {
    KR: '운영일정',
    EN: 'Schedule',
    JA: '運営スケジュール',
    ZH: '运营日程',
    ES: 'Calendario y horario',
    FR: 'Calendrier & horaires',
    DE: 'Termine & Zeiten',
  },
  답사내용: {
    KR: '답사내용',
    EN: 'Content',
    JA: '探訪コース内容',
    ZH: '探访内容',
    ES: 'Contenido del recorrido',
    FR: 'Contenu de la visite',
    DE: 'Führungsinhalt',
  },
  교육장소: {
    KR: '교육장소',
    EN: 'Venue',
    JA: '集合・実施場所',
    ZH: '集合与活动地点',
    ES: 'Punto de encuentro',
    FR: 'Lieu de départ',
    DE: 'Treffpunkt & Ort',
  },
  참가대상: {
    KR: '참가대상',
    EN: 'Eligibility',
    JA: '参加対象・定員',
    ZH: '参与对象与人数',
    ES: 'Destinatarios y cupo',
    FR: 'Public & capacité',
    DE: 'Teilnahme & Gruppengröße',
  },
  참가비: {
    KR: '참가비',
    EN: 'Fee',
    JA: '参加費',
    ZH: '参与费用',
    ES: 'Precio',
    FR: 'Tarif',
    DE: 'Teilnahmegebühr',
  },
  신청기간: {
    KR: '신청기간',
    EN: 'Application',
    JA: '申込期間',
    ZH: '报名时间',
    ES: 'Plazo de inscripción',
    FR: 'Période d’inscription',
    DE: 'Anmeldezeitraum',
  },
  신청방법: {
    KR: '신청방법',
    EN: 'Booking',
    JA: '申込方法',
    ZH: '报名方式',
    ES: 'Cómo reservar',
    FR: 'Modalités d’inscription',
    DE: 'Anmeldung',
  },
  투어포인트: {
    KR: '투어포인트',
    EN: 'Highlights',
    JA: 'ツアーの魅力',
    ZH: '游览亮点',
    ES: 'Puntos clave del tour',
    FR: 'Temps forts de la visite',
    DE: 'Tour-Highlights',
  },
  공방내용: {
    KR: '공방내용',
    EN: 'Workshop',
    JA: '体験プログラム',
    ZH: '工坊体验内容',
    ES: 'Actividades del taller',
    FR: 'Atelier créatif',
    DE: 'Workshop-Angebot',
  },
  관람안내: {
    KR: '관람안내',
    EN: 'Visitor Info',
    JA: '観覧案内',
    ZH: '参观指南',
    ES: 'Información de visita',
    FR: 'Infos pratiques',
    DE: 'Besucherinfos',
  },
  이용안내: {
    KR: '이용안내',
    EN: 'Visitor Info',
    JA: '利用案内',
    ZH: '开放指南',
    ES: 'Información de acceso',
    FR: 'Informations d’accès',
    DE: 'Besucherhinweise',
  },
};

export const BADGE_TRANSLATIONS: Record<string, LocalizedText> = {
  '반려동물 · 산책명소': {
    KR: '반려동물 · 산책명소',
    EN: 'Pet-Friendly · Walk & Park',
    JA: 'ペット同伴 · お散歩スポット',
    ZH: '宠物友好 · 遛宠步道',
    ES: 'Con Mascotas · Paseo y Parque',
    FR: 'Avec son Chien · Balade & Parc',
    DE: 'Mit Hund · Spazierweg & Park',
  },
  '반려동물 · 펫파크·놀이터': {
    KR: '반려동물 · 펫파크·놀이터',
    EN: 'Pet-Friendly · Pet Park',
    JA: 'ペット同伴 · ドッグラン・公園',
    ZH: '宠物友好 · 宠物乐园',
    ES: 'Con Mascotas · Parque Canino',
    FR: 'Avec son Chien · Parc Canin',
    DE: 'Mit Hund · Hundepark',
  },
  '반려동물 · 이색체험': {
    KR: '반려동물 · 이색체험',
    EN: 'Pet-Friendly · Activity',
    JA: 'ペット同伴 · ユニーク体験',
    ZH: '宠物友好 · 特色体验',
    ES: 'Con Mascotas · Actividad',
    FR: 'Avec son Chien · Activité Insolite',
    DE: 'Mit Hund · Besonderes Erlebnis',
  },
  '반려동물 · 동반카페·식당': {
    KR: '반려동물 · 동반카페·식당',
    EN: 'Pet-Friendly · Dining & Cafe',
    JA: 'ペット同伴 · カフェ＆レストラン',
    ZH: '宠物友好 · 餐厅与咖啡厅',
    ES: 'Con Mascotas · Café y Restaurante',
    FR: 'Avec son Chien · Café & Restaurant',
    DE: 'Mit Hund · Café & Restaurant',
  },
  '식도락 · 카페': {
    KR: '식도락 · 카페',
    EN: 'Gourmet · Cafe',
    JA: 'グルメ · カフェ',
    ZH: '美食 · 咖啡厅',
    ES: 'Gastronomía · Cafetería',
    FR: 'Gastronomie · Café',
    DE: 'Kulinarik · Café',
  },
  '식도락 · 브런치': {
    KR: '식도락 · 브런치',
    EN: 'Gourmet · Brunch',
    JA: 'グルメ · ブランチ',
    ZH: '美食 · 早午餐',
    ES: 'Gastronomía · Brunch',
    FR: 'Gastronomie · Brunch',
    DE: 'Kulinarik · Brunch',
  },
  '식도락 · 음식점': {
    KR: '식도락 · 음식점',
    EN: 'Gourmet · Restaurant',
    JA: 'グルメ · レストラン・食堂',
    ZH: '美食 · 地道餐厅',
    ES: 'Gastronomía · Restaurante',
    FR: 'Gastronomie · Restaurant',
    DE: 'Kulinarik · Restaurant',
  },
  '식도락 · 디저트': {
    KR: '식도락 · 디저트',
    EN: 'Gourmet · Dessert',
    JA: 'グルメ · スイーツ・ベーカリー',
    ZH: '美食 · 甜点与烘焙',
    ES: 'Gastronomía · Postres',
    FR: 'Gastronomie · Pâtisserie',
    DE: 'Kulinarik · Dessert & Bäckerei',
  },
  '명소 · 자연·정원': {
    KR: '명소 · 자연·정원',
    EN: 'Attraction · Nature & Garden',
    JA: '名所 · 自然・庭園',
    ZH: '必游景点 · 自然与庭园',
    ES: 'Lugar Clave · Naturaleza y Jardín',
    FR: 'Incontournable · Nature & Jardin',
    DE: 'Sehenswürdigkeit · Natur & Garten',
  },
  '명소 · 해안·일출': {
    KR: '명소 · 해안·일출',
    EN: 'Attraction · Coast & Sunrise',
    JA: '名所 · 海岸・日の出',
    ZH: '必游景点 · 海岸与日出',
    ES: 'Lugar Clave · Costa y Amanecer',
    FR: 'Incontournable · Littoral & Lever du soleil',
    DE: 'Sehenswürdigkeit · Küste & Sonnenaufgang',
  },
  '명소 · 역사·문화유산': {
    KR: '명소 · 역사·문화유산',
    EN: 'Attraction · Heritage',
    JA: '名所 · 歴史・文化遺産',
    ZH: '必游景点 · 历史与文化遗产',
    ES: 'Lugar Clave · Historia y Patrimonio',
    FR: 'Incontournable · Histoire & Patrimoine',
    DE: 'Sehenswürdigkeit · Geschichte & Kulturerbe',
  },
  '명소 · 전망·야경': {
    KR: '명소 · 전망·야경',
    EN: 'Attraction · View & Nightscape',
    JA: '名所 · 展望・夜景',
    ZH: '必游景点 · 观景与夜景',
    ES: 'Lugar Clave · Mirador y Vista Nocturna',
    FR: 'Incontournable · Panorama & Vue de nuit',
    DE: 'Sehenswürdigkeit · Aussicht & Nachtblick',
  },
  '체험 · 투어': {
    KR: '체험 · 투어',
    EN: 'Experience · Tour',
    JA: '体験 · ツアー',
    ZH: '文化体验 · 导览游',
    ES: 'Experiencia · Tour Guiado',
    FR: 'Expérience · Visite Guidée',
    DE: 'Erlebnis · Führung & Tour',
  },
  '체험 · 공방': {
    KR: '체험 · 공방',
    EN: 'Experience · Workshop',
    JA: '体験 · 工房',
    ZH: '文化体验 · 手作工坊',
    ES: 'Experiencia · Taller Artesanal',
    FR: 'Expérience · Atelier d’Artisanat',
    DE: 'Erlebnis · Handwerks-Workshop',
  },
  '체험 · 미술관박물관': {
    KR: '체험 · 미술관박물관',
    EN: 'Experience · Museum & Art',
    JA: '体験 · 美術館・博物館',
    ZH: '文化体验 · 博物馆与美术馆',
    ES: 'Experiencia · Museo y Arte',
    FR: 'Expérience · Musée & Art',
    DE: 'Erlebnis · Museum & Kunst',
  },
  '체험 · 체험': {
    KR: '체험 · 체험',
    EN: 'Experience · Activity',
    JA: '体験 · アクティビティ',
    ZH: '文化体验 · 互动体验',
    ES: 'Experiencia · Actividad',
    FR: 'Expérience · Activité',
    DE: 'Erlebnis · Aktivität',
  },
};
