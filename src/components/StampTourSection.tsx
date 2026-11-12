import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lang, UI_TEXT } from '../i18n';
import {
  supabase,
  isSupabaseConfigured,
  supabaseUrl,
  supabasePublishableKey,
} from '../lib/supabase';

export type StampEmblemType = 'book_lamp' | 'coffee_cup' | 'dining_cloche' | 'wave_bakery';

export interface StampReviewItem {
  id: string;
  userId?: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface StampAuthUser {
  id: string;
  displayName: string;
  provider: 'kakao' | 'google' | 'demo';
}

interface PendingReviewPayload {
  placeId: string;
  author: string;
  rating: number;
  comment: string;
}

interface StampPlaceItem {
  id: string;
  isLive3D: boolean;
  space3dUrl?: string;
  emblem: StampEmblemType;
  inkColor: string;
  stampTilt: number;
  mapQuery: string;
  // Coordinates on /ulsan-illustrated-map.jpg (800 x 600)
  x: number;
  y: number;
  dotX: number;
  dotY: number;
  shortName: Record<Lang, string>;
  categoryTag: Record<Lang, string>;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  address: Record<Lang, string>;
  stampLabel: string;
}

const STAMP_PLACES: StampPlaceItem[] = [
  {
    id: 'stamp-dokja-bookstore',
    isLive3D: true,
    space3dUrl: 'https://djsj.pages.dev/',
    emblem: 'book_lamp',
    inkColor: '#C84B31',
    stampTilt: -7,
    mapQuery: '울산 남구 삼호로11번길 38-1 독자서점',
    x: 205,
    y: 306,
    dotX: 342,
    dotY: 336,
    stampLabel: 'DOKJA · BOOK',
    shortName: {
      KR: '독자서점',
      EN: 'Dokja Books',
      JA: '読者書店',
      ZH: '读者书店',
      ES: 'Librería Dokja',
      FR: 'Librairie Dokja',
      DE: 'Dokja Buchladen',
    },
    categoryTag: {
      KR: '독립서점 · 가죽공방',
      EN: 'Indie Bookstore & Leather',
      JA: '独立書店・革工房',
      ZH: '独立书店·皮具工坊',
      ES: 'Librería Independiente',
      FR: 'Librairie & Atelier Cuir',
      DE: 'Buchhandlung & Lederatelier',
    },
    title: {
      KR: '독자서점 & 가죽공방 딤프치',
      EN: 'Dokja Bookstore & Dimpchi Leather Studio',
      JA: '読者書店 ＆ 革工房ディムプチ',
      ZH: '读者书店 & Dimpchi皮具工坊',
      ES: 'Librería Dokja y Taller de Cuero Dimpchi',
      FR: 'Librairie Dokja & Atelier Dimpchi',
      DE: 'Buchhandlung Dokja & Lederatelier Dimpchi',
    },
    desc: {
      KR: '무거천 궁거랑 산책길 골목에 자리한 아늑한 독립서점 겸 수제 가죽공방입니다.',
      EN: 'A cozy indie bookstore and handcrafted leather studio tucked beside the Mugeocheon stream trail.',
      JA: '無去川の散策路近くの路地に佇む、温かな独立書店兼ハンドメイド革工房です。',
      ZH: '坐落于无去川散步小巷里的温馨独立书店兼手作皮具工坊。',
      ES: 'Una acogedora librería independiente y taller artesanal de cuero junto al paseo de Mugeocheon.',
      FR: 'Une librairie indépendante chaleureuse et atelier de maroquinerie près de la promenade Mugeocheon.',
      DE: 'Eine gemütliche unabhängige Buchhandlung mit handgefertigtem Lederatelier nahe dem Mugeocheon-Weg.',
    },
    address: {
      KR: '울산 남구 삼호로11번길 38-1, 1층',
      EN: '38-1 Samho-ro 11beon-gil, Nam-gu, Ulsan (1F)',
      JA: '蔚山広域市 南区 三湖路11番ギル 38-1 (1F)',
      ZH: '蔚山广域市 南区 三湖路11番街 38-1 (1层)',
      ES: '38-1 Samho-ro 11beon-gil, Nam-gu, Ulsan (1F)',
      FR: '38-1 Samho-ro 11beon-gil, Nam-gu, Ulsan (RDC)',
      DE: '38-1 Samho-ro 11beon-gil, Nam-gu, Ulsan (EG)',
    },
  },
  {
    id: 'stamp-ocean-roastery',
    isLive3D: false,
    emblem: 'coffee_cup',
    inkColor: '#2E6F65',
    stampTilt: 6,
    mapQuery: '울산 울주군 서생면 간절곶1길',
    x: 492,
    y: 526,
    dotX: 542,
    dotY: 458,
    stampLabel: 'CAFE · ROAST',
    shortName: {
      KR: '간절곶 로스터리',
      EN: 'Cape Roastery',
      JA: '艮絶串カフェ',
      ZH: '艮绝串咖啡',
      ES: 'Café Ganjeolgot',
      FR: 'Café Ganjeolgot',
      DE: 'Kap-Rösterei',
    },
    categoryTag: {
      KR: '오션뷰 카페 · 오픈 예정',
      EN: 'Ocean Cafe · Coming Soon',
      JA: '海カフェ・公開予定',
      ZH: '海景咖啡·即将上线',
      ES: 'Café con Vistas · Próximamente',
      FR: 'Café Vue Mer · Bientôt',
      DE: 'Meerblick-Café · Demnächst',
    },
    title: {
      KR: '간절곶 오션뷰 로스터리 카페 (오픈 예정)',
      EN: 'Ganjeolgot Ocean Roastery Cafe (Coming Soon)',
      JA: '艮絶串オーシャンビュー・ロースタリー（公開予定）',
      ZH: '艮绝串海景烘焙咖啡馆（即将上线）',
      ES: 'Tostaduría con Vista al Mar en Ganjeolgot (Próximamente)',
      FR: 'Torréfaction Vue Mer à Ganjeolgot (Prochainement)',
      DE: 'Kaffeerösterei am Kap Ganjeolgot (Demnächst)',
    },
    desc: {
      KR: '탁 트인 동해 수평선과 하얀 등대가 한눈에 들어오는 해안 로스터리 카페입니다.',
      EN: 'A coastal roastery cafe overlooking the open East Sea horizon and white lighthouse.',
      JA: '開けた東海の水平線と白い灯台が一望できる海辺のロースタリーカフェです。',
      ZH: '将辽阔东海天际线与白色灯塔尽收眼底的海岸烘焙咖啡馆。',
      ES: 'Una cafetería tostaduría frente al mar con vistas al horizonte del Mar del Este y su faro blanco.',
      FR: 'Un café-torréfaction côtier offrant une vue dégagée sur la mer de l’Est et son phare blanc.',
      DE: 'Eine Küsten-Kaffeerösterei mit freiem Blick auf den Ostmeer-Horizont und den weißen Leuchtturm.',
    },
    address: {
      KR: '울산 울주군 서생면 간절곶1길 일원',
      EN: 'Ganjeolgot 1-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
      JA: '蔚山広域市 蔚州郡 西生面 艮絶串1ギル 一帯',
      ZH: '蔚山广域市 蔚州郡 西生面 艮绝串1街 一带',
      ES: 'Ganjeolgot 1-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
      FR: 'Ganjeolgot 1-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
      DE: 'Ganjeolgot 1-gil, Seosaeng-myeon, Ulju-gun, Ulsan',
    },
  },
  {
    id: 'stamp-garden-dining',
    isLive3D: false,
    emblem: 'dining_cloche',
    inkColor: '#B56325',
    stampTilt: -5,
    mapQuery: '울산 중구 태화강국가정원길',
    x: 365,
    y: 422,
    dotX: 400,
    dotY: 322,
    stampLabel: 'LOCAL · TABLE',
    shortName: {
      KR: '태화강 다이닝',
      EN: 'Garden Dining',
      JA: '太和江ダイニング',
      ZH: '太和江餐厅',
      ES: 'Restaurante Jardín',
      FR: 'Table du Jardin',
      DE: 'Garten-Bistro',
    },
    categoryTag: {
      KR: '로컬 레스토랑 · 오픈 예정',
      EN: 'Local Dining · Coming Soon',
      JA: 'レストラン・公開予定',
      ZH: '特色餐厅·即将上线',
      ES: 'Restaurante · Próximamente',
      FR: 'Restaurant · Bientôt',
      DE: 'Restaurant · Demnächst',
    },
    title: {
      KR: '태화강 정원 브런치 & 다이닝 (오픈 예정)',
      EN: 'Taehwagang Garden Brunch & Dining (Coming Soon)',
      JA: '太和江ガーデン・ブランチ＆ダイニング（公開予定）',
      ZH: '太和江庭园早午餐餐厅（即将上线）',
      ES: 'Brunch y Restaurante del Jardín Taehwagang (Próximamente)',
      FR: 'Brunch & Table du Jardin Taehwagang (Prochainement)',
      DE: 'Brunch & Dining am Nationalgarten Taehwagang (Demnächst)',
    },
    desc: {
      KR: '십리대숲 산책 후 여유롭게 들르기 좋은 정원 뷰 로컬 브런치 다이닝입니다.',
      EN: 'A relaxing garden-view local brunch and dining spot right beside the Simnidaesup Bamboo Forest.',
      JA: '十里竹林の散策後にゆったり立ち寄れる、ガーデンビューのローカルブランチダイニングです。',
      ZH: '漫步十里竹林后适合悠闲小坐的庭园景观早午餐餐厅。',
      ES: 'Un relajante espacio de brunch y cocina local con vistas al jardín junto al Bosque de Bambú.',
      FR: 'Une table brunch locale avec vue sur le jardin, idéale après une balade dans la bambouseraie.',
      DE: 'Ein entspanntes Brunch-Restaurant mit Gartenblick direkt am Bambuswald Simnidaesup.',
    },
    address: {
      KR: '울산 중구 태화강국가정원길 일원',
      EN: 'Taehwagang National Garden-gil, Jung-gu, Ulsan',
      JA: '蔚山広域市 中区 太和江国家庭園ギル 一帯',
      ZH: '蔚山广域市 中区 太和江国家庭园路 一带',
      ES: 'Taehwagang National Garden-gil, Jung-gu, Ulsan',
      FR: 'Taehwagang National Garden-gil, Jung-gu, Ulsan',
      DE: 'Taehwagang National Garden-gil, Jung-gu, Ulsan',
    },
  },
  {
    id: 'stamp-coast-bakery',
    isLive3D: false,
    emblem: 'wave_bakery',
    inkColor: '#366396',
    stampTilt: 5,
    mapQuery: '울산 동구 등대로 대왕암공원',
    x: 598,
    y: 168,
    dotX: 645,
    dotY: 235,
    stampLabel: 'WAVE · BAKE',
    shortName: {
      KR: '대왕암 베이커리',
      EN: 'Seaside Bakery',
      JA: '大王岩ベーカリー',
      ZH: '大王岩烘焙坊',
      ES: 'Panadería Costera',
      FR: 'Boulangerie Mer',
      DE: 'Küstenbäckerei',
    },
    categoryTag: {
      KR: '해변 디저트 · 오픈 예정',
      EN: 'Seaside Bakery · Coming Soon',
      JA: '海辺スイーツ・公開予定',
      ZH: '海畔烘焙·即将上线',
      ES: 'Repostería · Próximamente',
      FR: 'Pâtisserie · Bientôt',
      DE: 'Bäckerei · Demnächst',
    },
    title: {
      KR: '대왕암 솔숲 해변 베이커리 (오픈 예정)',
      EN: 'Daewangam Pine Coast Bakery (Coming Soon)',
      JA: '大王岩・松林ビーチベーカリー（公開予定）',
      ZH: '大王岩松林海畔烘焙坊（即将上线）',
      ES: 'Panadería Costera del Pinar de Daewangam (Próximamente)',
      FR: 'Boulangerie Côtière des Pins de Daewangam (Prochainement)',
      DE: 'Küstenbäckerei am Kiefernwald Daewangam (Demnächst)',
    },
    desc: {
      KR: '백년 해송 숲길과 에메랄드빛 동해 바다가 만나는 해변 베이커리 카페입니다.',
      EN: 'A seaside bakery cafe where century-old pine forest trails meet emerald East Sea waves.',
      JA: '百年の海松林とエメラルド色の東海が出会う海辺のベーカリーカフェです。',
      ZH: '百年海松林道与碧蓝东海交汇的海畔烘焙咖啡厅。',
      ES: 'Una panadería costera donde el centenario bosque de pinos se une al mar esmeralda.',
      FR: 'Une boulangerie-café en bord de mer où la pinède centenaire rejoint les vagues émeraude.',
      DE: 'Ein Küsten-Bäckereicafé, wo hundertjähriger Kiefernwald auf das smaragdgrüne Meer trifft.',
    },
    address: {
      KR: '울산 동구 등대로 일원',
      EN: 'Deungdae-ro, Dong-gu, Ulsan',
      JA: '蔚山広域市 東区 灯台路 一帯',
      ZH: '蔚山广域市 东区 灯塔路 一带',
      ES: 'Deungdae-ro, Dong-gu, Ulsan',
      FR: 'Deungdae-ro, Dong-gu, Ulsan',
      DE: 'Deungdae-ro, Dong-gu, Ulsan',
    },
  },
];

interface StampUiCopy {
  subtitle: string;
  progressAutoStampNote: string;
  kongPopText: string;
  enterSpaceBtn: string;
  comingSoonBtn: string;
  stampBtn: string;
  stampedBtn: string;
  reviewTitle: string;
  nicknamePlaceholder: string;
  commentPlaceholder: string;
  submitReviewBtn: string;
  emptyReviewText: string;
  modalOpenNewTab: string;
  modalClose: string;
  modalStampedNotice: string;
  loginMiniBtn: string;
  logoutMiniBtn: string;
  deleteReviewBtn: string;
  authModalTitle: string;
  authModalDesc: string;
  kakaoLoginBtn: string;
  googleLoginBtn: string;
  demoModeNotice: string;
  demoLoginBtn: string;
}

const STAMP_UI: Record<Lang, StampUiCopy> = {
  KR: {
    subtitle: '울산의 매력적인 공간을 미리 경험하고 직접 찾아가는 스탬프 투어!',
    progressAutoStampNote: '실제로 방문하고 리뷰나 별점을 남기면 스탬프가 자동 제공됩니다.',
    kongPopText: '콩!',
    enterSpaceBtn: '공간 입장하기',
    comingSoonBtn: '오픈 준비 중',
    stampBtn: '스탬프 찍기',
    stampedBtn: '스탬프 완료',
    reviewTitle: '방문자 별점 & 한줄리뷰',
    nicknamePlaceholder: '닉네임 (예: 울산산책러)',
    commentPlaceholder: '실제 방문 후 한줄 감상을 남겨주세요! (별점만 등록 가능)',
    submitReviewBtn: '별점·리뷰 등록',
    emptyReviewText: '첫 번째 별점과 한줄리뷰의 주인공이 되어 보세요!',
    modalOpenNewTab: '새 탭으로 크게 열기',
    modalClose: '닫기',
    modalStampedNotice: '방문 인증 완료! 스탬프가 콩 찍혔어요.',
    loginMiniBtn: '간편 로그인',
    logoutMiniBtn: '로그아웃',
    deleteReviewBtn: '삭제',
    authModalTitle: '3초 간편 가입하고 스탬프 받기',
    authModalDesc:
      '로그인하면 작성하신 별점·리뷰가 바로 등록되고, 모바일과 PC 어디서나 내 스탬프첩이 그대로 유지됩니다.',
    kakaoLoginBtn: '카카오로 3초 만에 시작하기',
    googleLoginBtn: 'Google로 계속하기',
    demoModeNotice:
      '현재 Supabase 키(.env) 연결 전 미리보기 상태입니다. 키 연결 시 실제 카카오·Google 로그인이 작동합니다.',
    demoLoginBtn: '미리보기 체험 로그인으로 테스트하기',
  },
  EN: {
    subtitle: 'Preview Ulsan’s charming spaces first, then visit them in person on this stamp tour!',
    progressAutoStampNote:
      'Visit in person and leave a star rating or review to automatically receive your stamp.',
    kongPopText: 'STAMP!',
    enterSpaceBtn: 'Enter Space',
    comingSoonBtn: 'Coming Soon',
    stampBtn: 'Get Stamp',
    stampedBtn: 'Stamped',
    reviewTitle: 'Ratings & One-Line Reviews',
    nicknamePlaceholder: 'Nickname',
    commentPlaceholder: 'Leave a quick one-line impression (or submit rating only)!',
    submitReviewBtn: 'Save Rating',
    emptyReviewText: 'Be the first to leave a star rating and one-line review!',
    modalOpenNewTab: 'Open Full Tab',
    modalClose: 'Close',
    modalStampedNotice: 'Visit verified! Your ink stamp has been pressed.',
    loginMiniBtn: 'Sign in',
    logoutMiniBtn: 'Sign out',
    deleteReviewBtn: 'Delete',
    authModalTitle: 'Sign in in 3 seconds & save your stamp',
    authModalDesc:
      'Sign in once to post your rating or review right away and keep your stamp book synced across mobile and PC.',
    kakaoLoginBtn: 'Continue with Kakao',
    googleLoginBtn: 'Continue with Google',
    demoModeNotice:
      'Preview mode before connecting Supabase keys (.env). Real Kakao & Google OAuth activates once keys are set.',
    demoLoginBtn: 'Test with Preview Sign-In',
  },
  JA: {
    subtitle: '蔚山の魅力的な空間をひと足先に体験し、実際に足を運ぶスタンプツアー！',
    progressAutoStampNote:
      '実際に訪問して星評価や一行レビューを残すと、スタンプが自動で押されます。',
    kongPopText: 'ポン！',
    enterSpaceBtn: '空間に入る',
    comingSoonBtn: '準備中',
    stampBtn: 'スタンプを押す',
    stampedBtn: 'スタンプ済み',
    reviewTitle: '星評価＆一行レビュー',
    nicknamePlaceholder: 'ニックネーム',
    commentPlaceholder: '訪問後の感想をひとこと残してください！（星評価のみも可）',
    submitReviewBtn: '評価を登録',
    emptyReviewText: '最初の星評価と一行レビューを残してみましょう！',
    modalOpenNewTab: '新しいタブで開く',
    modalClose: '閉じる',
    modalStampedNotice: '訪問完了！インクスタンプが押されました。',
    loginMiniBtn: '簡単ログイン',
    logoutMiniBtn: 'ログアウト',
    deleteReviewBtn: '削除',
    authModalTitle: '3秒ログインでスタンプを保存',
    authModalDesc:
      'ログインすると評価・レビューがすぐ登録され、スマホとPCどちらでもスタンプ帳が同期されます。',
    kakaoLoginBtn: 'カカオで3秒スタート',
    googleLoginBtn: 'Googleで続ける',
    demoModeNotice: 'Supabaseキー（.env）接続前のプレビュー状態です。',
    demoLoginBtn: 'プレビュー体験ログインで試す',
  },
  ZH: {
    subtitle: '抢先体验蔚山魅力空间、再亲自前往探访的集章之旅！',
    progressAutoStampNote: '实地探访并留下星级评分或评价后，将自动为您盖上印章。',
    kongPopText: '盖章！',
    enterSpaceBtn: '进入空间',
    comingSoonBtn: '筹备中',
    stampBtn: '盖上印章',
    stampedBtn: '已盖章',
    reviewTitle: '星级评分 & 一句话评价',
    nicknamePlaceholder: '昵称',
    commentPlaceholder: '写下实地探访后的一句话感想吧！（也可仅提交星级）',
    submitReviewBtn: '提交评分',
    emptyReviewText: '快来留下第一条星级评分与一句话评价吧！',
    modalOpenNewTab: '新标签页打开',
    modalClose: '关闭',
    modalStampedNotice: '探访打卡完成！已为您盖上专属印章。',
    loginMiniBtn: '快捷登录',
    logoutMiniBtn: '退出',
    deleteReviewBtn: '删除',
    authModalTitle: '3秒快捷登录并领取印章',
    authModalDesc: '登录后即可立即发布您的评分与评价，并在手机与电脑端同步保存您的集章册。',
    kakaoLoginBtn: '使用 Kakao 快速开始',
    googleLoginBtn: '使用 Google 继续',
    demoModeNotice: '当前为连接 Supabase 密钥（.env）前的预览模式。',
    demoLoginBtn: '使用预览体验登录测试',
  },
  ES: {
    subtitle: '¡Descubre primero los espacios con encanto de Ulsan y visítalos en persona en este tour de sellos!',
    progressAutoStampNote:
      'Visita el lugar en persona y deja una valoración o reseña para recibir tu sello automáticamente.',
    kongPopText: '¡SELLO!',
    enterSpaceBtn: 'Entrar al espacio',
    comingSoonBtn: 'Próximamente',
    stampBtn: 'Estampar sello',
    stampedBtn: 'Sellado',
    reviewTitle: 'Valoración y reseñas breves',
    nicknamePlaceholder: 'Apodo',
    commentPlaceholder: '¡Deja tu impresión en una línea (o envía solo estrellas)!',
    submitReviewBtn: 'Guardar',
    emptyReviewText: '¡Sé la primera persona en dejar tu valoración!',
    modalOpenNewTab: 'Abrir en pestaña nueva',
    modalClose: 'Cerrar',
    modalStampedNotice: '¡Visita completada! Se ha estampado tu sello.',
    loginMiniBtn: 'Iniciar sesión',
    logoutMiniBtn: 'Salir',
    deleteReviewBtn: 'Borrar',
    authModalTitle: 'Inicia sesión en 3 segundos y guarda tu sello',
    authModalDesc:
      'Al iniciar sesión se publicará tu valoración al instante y tus sellos se sincronizarán en móvil y PC.',
    kakaoLoginBtn: 'Continuar con Kakao',
    googleLoginBtn: 'Continuar con Google',
    demoModeNotice: 'Modo de vista previa antes de conectar las claves de Supabase (.env).',
    demoLoginBtn: 'Probar con inicio de sesión de muestra',
  },
  FR: {
    subtitle: 'Découvrez en avant-première les lieux pleins de charme d’Ulsan avant de les visiter sur place !',
    progressAutoStampNote:
      'Visitez le lieu en personne et laissez une note ou un avis pour recevoir automatiquement votre tampon.',
    kongPopText: 'TAMPON !',
    enterSpaceBtn: 'Entrer dans l’espace',
    comingSoonBtn: 'Bientôt',
    stampBtn: 'Tamponner',
    stampedBtn: 'Tamponné',
    reviewTitle: 'Notes & avis en une ligne',
    nicknamePlaceholder: 'Pseudo',
    commentPlaceholder: 'Partagez votre impression en une phrase (ou note seule) !',
    submitReviewBtn: 'Publier',
    emptyReviewText: 'Soyez le premier à laisser une note et un avis !',
    modalOpenNewTab: 'Nouvel onglet',
    modalClose: 'Fermer',
    modalStampedNotice: 'Visite validée ! Votre tampon est apposé.',
    loginMiniBtn: 'Connexion',
    logoutMiniBtn: 'Déconnexion',
    deleteReviewBtn: 'Supprimer',
    authModalTitle: 'Connexion en 3 secondes pour garder votre tampon',
    authModalDesc:
      'Connectez-vous pour publier immédiatement votre note et synchroniser votre carnet de tampons sur mobile et PC.',
    kakaoLoginBtn: 'Continuer avec Kakao',
    googleLoginBtn: 'Continuer avec Google',
    demoModeNotice: 'Mode aperçu avant la configuration des clés Supabase (.env).',
    demoLoginBtn: 'Tester en mode aperçu',
  },
  DE: {
    subtitle: 'Erlebe Ulsans charmante Orte vorab und besuche sie anschließend vor Ort bei dieser Stempeltour!',
    progressAutoStampNote:
      'Besuche den Ort persönlich und hinterlasse eine Sternebewertung oder Rezension, um deinen Stempel automatisch zu erhalten.',
    kongPopText: 'KONG!',
    enterSpaceBtn: 'Raum betreten',
    comingSoonBtn: 'Demnächst',
    stampBtn: 'Stempeln',
    stampedBtn: 'Gestempelt',
    reviewTitle: 'Sterne & Ein-Satz-Bewertungen',
    nicknamePlaceholder: 'Nickname',
    commentPlaceholder: 'Hinterlasse deinen Eindruck in einem Satz (oder nur Sterne)!',
    submitReviewBtn: 'Speichern',
    emptyReviewText: 'Schreibe als Erste*r eine Bewertung!',
    modalOpenNewTab: 'Neuer Tab',
    modalClose: 'Schließen',
    modalStampedNotice: 'Besuch bestätigt! Dein Tintenstempel wurde gestempelt.',
    loginMiniBtn: 'Anmelden',
    logoutMiniBtn: 'Abmelden',
    deleteReviewBtn: 'Löschen',
    authModalTitle: 'In 3 Sekunden anmelden & Stempel sichern',
    authModalDesc:
      'Melde dich kurz an, um deine Bewertung sofort zu speichern und dein Stempelheft auf Smartphone und PC zu synchronisieren.',
    kakaoLoginBtn: 'Weiter mit Kakao',
    googleLoginBtn: 'Weiter mit Google',
    demoModeNotice: 'Vorschaumodus vor dem Verbinden der Supabase-Schlüssel (.env).',
    demoLoginBtn: 'Mit Vorschau-Anmeldung testen',
  },
};

const INITIAL_REVIEWS: Record<string, StampReviewItem[]> = {
  'stamp-dokja-bookstore': [
    {
      id: 'rev-1',
      author: '무거천산책러',
      rating: 5,
      comment: '3D 창가 자리에 앉아서 노을 보며 책 펼치니까 진짜 동네 책방에 와 있는 기분이에요!',
      date: '2026.11',
    },
    {
      id: 'rev-2',
      author: '고래여행자',
      rating: 5,
      comment: '버섯 램프랑 가죽 작업대 디테일이 너무 귀여워요. 숨은 소품 5개 다 찾고 갑니다!',
      date: '2026.11',
    },
  ],
  'stamp-ocean-roastery': [
    {
      id: 'rev-3',
      author: '바다러버',
      rating: 5,
      comment: '커피잔 라인 스탬프 너무 예뻐요! 간절곶 3D 카페도 빨리 열렸으면 좋겠어요.',
      date: '2026.11',
    },
  ],
};

/**
 * Pure monoline ink-stamp SVG emblem (clean minimal strokes only)
 */
function InkStampEmblem({
  type,
  size = 28,
}: {
  type: StampEmblemType;
  size?: number;
}) {
  if (type === 'book_lamp') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18.5 12.5 C18.5 7.8 28.5 7.8 28.5 12.5 Z" />
        <path d="M22.3 12.5 L21.8 16.5 M24.7 12.5 L25.2 16.5" />
        <path d="M23.5 5.2 V6.6 M17.5 6.8 L18.6 7.8 M29.5 6.8 L28.4 7.8" strokeWidth="1.4" />
        <path d="M18 19.2 C14.8 17.4 10.2 17.4 6.8 18.8 V28.4 C10.2 27 14.8 27 18 28.8" />
        <path d="M18 19.2 C21.2 17.4 25.8 17.4 29.2 18.8 V28.4 C25.8 27 21.2 27 18 28.8" />
        <path d="M18 19.2 V28.8" />
        <path d="M9.6 21.8 H14.8 M9.6 24.4 H14.2" strokeWidth="1.35" />
      </svg>
    );
  }

  if (type === 'coffee_cup') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.2 12.2 C13.2 10.2 15.4 8.6 14.4 6.6" strokeWidth="1.5" />
        <path d="M19.8 11.8 C18.8 9.8 21 8.2 20 6.2" strokeWidth="1.5" />
        <path d="M9.5 15.2 H24.5 V20.5 C24.5 24.6 21.2 27.2 17 27.2 C12.8 27.2 9.5 24.6 9.5 20.5 Z" />
        <path d="M24.5 16.8 H26.6 C28.4 16.8 29.5 18 29.5 19.7 C29.5 21.4 28.3 22.6 26.5 22.6 H24.2" />
        <path d="M7.2 29.5 H26.8" />
      </svg>
    );
  }

  if (type === 'dining_cloche') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="9.2" r="1.8" />
        <path d="M8.2 22.5 C8.2 15.8 12.5 11.2 18 11.2 C23.5 11.2 27.8 15.8 27.8 22.5" />
        <path d="M6.2 22.5 H29.8" />
        <path d="M9.5 25.8 H26.5" />
        <path d="M13.5 16.5 C14.8 14.8 16.5 14.2 18.2 14" strokeWidth="1.35" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.5 19.5 C9.2 14.2 13.2 10.2 18 10.2 C22.8 10.2 26.8 14.2 25.5 19.5" />
      <path d="M14.2 10.8 L15.5 18.5 M21.8 10.8 L20.5 18.5" strokeWidth="1.45" />
      <path d="M8.2 19.5 C11.5 17.5 24.5 17.5 27.8 19.5" />
      <path d="M7.5 24.2 C10.2 22.4 12.8 26 15.5 24.2 C18.2 22.4 20.8 26 23.5 24.2 C25.5 22.9 27.2 24.8 28.5 24.2" />
      <path
        d="M9.5 28.2 C12.2 26.6 14.8 29.8 17.5 28.2 C20.2 26.6 22.8 29.8 25.5 28.2"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function InkStampSeal({
  emblem,
  inkColor,
  tilt = -6,
  microLabel,
  justStamped,
  kongText,
  size = 'md',
}: {
  emblem: StampEmblemType;
  inkColor: string;
  tilt?: number;
  microLabel?: string;
  justStamped?: boolean;
  kongText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const iconPx = size === 'lg' ? 32 : size === 'sm' ? 22 : size === 'xs' ? 19 : 27;
  return (
    <div
      className={`ink-stamp-seal size-${size} ${justStamped ? 'just-stamped' : ''}`}
      style={
        {
          color: inkColor,
          '--stamp-tilt': `${tilt}deg`,
          '--ink-color': inkColor,
        } as React.CSSProperties
      }
    >
      {justStamped && <span className="ink-ripple-ring" aria-hidden="true" />}
      {justStamped && kongText && (
        <span className="ink-kong-pop" aria-hidden="true">
          {kongText}
        </span>
      )}
      <div className="ink-stamp-inner">
        <InkStampEmblem type={emblem} size={iconPx} />
        {size !== 'xs' && microLabel && (
          <span className="ink-stamp-micro">{microLabel}</span>
        )}
      </div>
    </div>
  );
}

function Cube3DLineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.4 L17 6.4 V13.6 L10 17.6 L3 13.6 V6.4 Z" />
      <path d="M3 6.4 L10 10.4 L17 6.4 M10 10.4 V17.6" />
    </svg>
  );
}

function StampPressLineIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.5 5.2 C7.5 3.4 12.5 3.4 12.5 5.2 C12.5 7 11.2 8.2 11.2 10.5 H8.8 C8.8 8.2 7.5 7 7.5 5.2 Z" />
      <path d="M4.5 13.2 H15.5 V15.5 H4.5 Z" />
      <path d="M3.5 17.6 H16.5" />
    </svg>
  );
}

function PinMonoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 17.5 C10 17.5 15.5 12.2 15.5 8 A5.5 5.5 0 0 0 4.5 8 C4.5 12.2 10 17.5 10 17.5 Z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  );
}

function StarMonoIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="10,2.5 12.3,7.2 17.5,7.9 13.7,11.6 14.6,16.8 10,14.3 5.4,16.8 6.3,11.6 2.5,7.9 7.7,7.2" />
    </svg>
  );
}

function KakaoBubbleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 3C5.58 3 2 5.82 2 9.3c0 2.24 1.48 4.2 3.72 5.32l-.76 2.86a.35.35 0 0 0 .53.39l3.33-2.21c.39.05.78.08 1.18.08 4.42 0 8-2.82 8-6.34S14.42 3 10 3Z" />
    </svg>
  );
}

function GoogleMarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17.6 10.2c0-.57-.05-1.12-.15-1.65H10v3.12h4.26a3.64 3.64 0 0 1-1.58 2.39v1.98h2.56c1.5-1.38 2.36-3.42 2.36-5.84Z"
        fill="#4285F4"
      />
      <path
        d="M10 18c2.14 0 3.93-.71 5.24-1.92l-2.56-1.98c-.71.48-1.62.76-2.68.76-2.06 0-3.81-1.39-4.43-3.26H2.93v2.05A7.99 7.99 0 0 0 10 18Z"
        fill="#34A853"
      />
      <path
        d="M5.57 11.6A4.8 4.8 0 0 1 5.32 10c0-.56.1-1.1.25-1.6V6.35H2.93A8 8 0 0 0 2 10c0 1.29.31 2.51.93 3.65l2.64-2.05Z"
        fill="#FBBC05"
      />
      <path
        d="M10 5.14c1.16 0 2.21.4 3.03 1.18l2.27-2.27C13.93 2.77 12.14 2 10 2a7.99 7.99 0 0 0-7.07 4.35l2.64 2.05c.62-1.87 2.37-3.26 4.43-3.26Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Space3DPreviewArt({ place }: { place: StampPlaceItem }) {
  if (place.id === 'stamp-dokja-bookstore') {
    return (
      <svg className="stamp-scene-svg" viewBox="0 0 320 200" role="img" aria-label={place.title.KR}>
        <defs>
          <linearGradient id="dokjaSunset" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B2B5C" />
            <stop offset="45%" stopColor="#B8536A" />
            <stop offset="82%" stopColor="#EA8A47" />
            <stop offset="100%" stopColor="#F5B452" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="#593520" />
        <rect x="18" y="18" width="198" height="122" rx="6" fill="url(#dokjaSunset)" stroke="#3D2214" strokeWidth="5" />
        <ellipse cx="64" cy="96" rx="30" ry="26" fill="#2F3B28" />
        <ellipse cx="142" cy="94" rx="33" ry="28" fill="#2A3523" />
        <rect x="44" y="108" width="136" height="30" fill="#3B251B" opacity="0.82" />
        <rect x="56" y="114" width="9" height="11" fill="#F2D17B" opacity="0.85" />
        <rect x="74" y="114" width="9" height="11" fill="#F2D17B" opacity="0.85" />
        <rect x="122" y="114" width="9" height="11" fill="#F2D17B" opacity="0.85" />
        <line x1="102" y1="74" x2="102" y2="136" stroke="#231710" strokeWidth="3" />
        <circle cx="102" cy="73" r="5" fill="#FFF0B8" />
        <path d="M168 18 L216 18 L216 142 L186 142 C182 102 175 62 168 18 Z" fill="#EAE0D0" opacity="0.92" />
        <rect x="232" y="24" width="72" height="126" rx="3" fill="#704227" stroke="#3D2214" strokeWidth="2.5" />
        <line x1="234" y1="62" x2="302" y2="62" stroke="#3D2214" strokeWidth="3" />
        <line x1="234" y1="100" x2="302" y2="100" stroke="#3D2214" strokeWidth="3" />
        <rect x="241" y="38" width="8" height="22" fill="#D96B43" />
        <rect x="251" y="41" width="7" height="19" fill="#E8C067" />
        <rect x="260" y="36" width="9" height="24" fill="#6DA695" />
        <rect x="272" y="40" width="8" height="20" fill="#FAF1DF" />
        <rect x="243" y="75" width="9" height="23" fill="#8C9E6E" />
        <rect x="254" y="78" width="8" height="20" fill="#E07A5F" />
        <rect x="265" y="73" width="10" height="25" fill="#F2CC8F" />
        <polygon points="0,148 320,148 320,200 0,200" fill="#C9732B" />
        <rect x="220" y="132" width="16" height="26" rx="4" fill="#D14B1F" />
        <path d="M198 134 C198 104 258 104 258 134 Z" fill="#F08A24" />
        <rect x="66" y="156" width="118" height="32" rx="5" fill="#FCF8F0" stroke="#3D2214" strokeWidth="1.8" />
        <line x1="125" y1="158" x2="125" y2="186" stroke="#D5CBB8" strokeWidth="1.6" />
        <line x1="78" y1="166" x2="114" y2="166" stroke="#9C8F7E" strokeWidth="1.6" />
        <line x1="78" y1="174" x2="108" y2="174" stroke="#9C8F7E" strokeWidth="1.6" />
        <line x1="136" y1="166" x2="172" y2="166" stroke="#9C8F7E" strokeWidth="1.6" />
        <line x1="136" y1="174" x2="166" y2="174" stroke="#9C8F7E" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg className="stamp-scene-svg upcoming" viewBox="0 0 320 200" role="img" aria-label={place.title.KR}>
      <rect width="320" height="200" fill="#F3ECE0" />
      <path
        d="M0 152 H320 M40 152 L0 200 M100 152 L75 200 M160 152 V200 M220 152 L245 200 M280 152 L320 200"
        stroke="#D8CBB6"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <rect
        x="24"
        y="22"
        width="272"
        height="116"
        rx="10"
        fill="#FAF6EE"
        stroke="#C9B9A2"
        strokeWidth="1.6"
        strokeDasharray="5 4"
      />
      <g transform="translate(132, 46)" style={{ color: place.inkColor }}>
        <InkStampEmblem type={place.emblem} size={56} />
      </g>
      <text
        x="160"
        y="124"
        textAnchor="middle"
        fontFamily="Gowun Dodum, serif"
        fontSize="12.5"
        fontWeight="700"
        fill="#7C6D5D"
      >
        3D SPACE COMING SOON
      </text>
    </svg>
  );
}

interface StampTourSectionProps {
  lang: Lang;
  whaleMascot: React.ReactNode;
}

export function StampTourSection({ lang, whaleMascot }: StampTourSectionProps) {
  const ui = STAMP_UI[lang];
  const globalUi = UI_TEXT[lang];

  const [authUser, setAuthUser] = useState<StampAuthUser | null>(() => {
    if (isSupabaseConfigured) return null;
    try {
      const demo = localStorage.getItem('stepless_ulsan_demo_user_v1');
      return demo ? JSON.parse(demo) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
  const [authInfoMsg, setAuthInfoMsg] = useState<string | null>(null);
  const [magicEmail, setMagicEmail] = useState<string>('');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);

  const [stampedIds, setStampedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stepless_ulsan_stamps_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [justStampedId, setJustStampedId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(STAMP_PLACES[0].id);
  const [hoveredMapId, setHoveredMapId] = useState<string | null>(null);
  const [active3dPlace, setActive3dPlace] = useState<StampPlaceItem | null>(null);
  const [nudgeReviewForm, setNudgeReviewForm] = useState<boolean>(false);

  const [reviewsByPlace, setReviewsByPlace] = useState<Record<string, StampReviewItem[]>>(() => {
    try {
      const saved = localStorage.getItem('stepless_ulsan_stamp_reviews_v1');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [draftRating, setDraftRating] = useState<number>(5);
  const [draftAuthor, setDraftAuthor] = useState<string>('');
  const [draftComment, setDraftComment] = useState<string>('');

  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFlushedRef = useRef<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('stepless_ulsan_stamps_v2', JSON.stringify(stampedIds));
    } catch {
      // ignore storage quota errors
    }
  }, [stampedIds]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem(
          'stepless_ulsan_stamp_reviews_v1',
          JSON.stringify(reviewsByPlace),
        );
      } catch {
        // ignore storage quota errors
      }
    }
  }, [reviewsByPlace]);

  useEffect(() => {
    if (authUser && !draftAuthor.trim()) {
      setDraftAuthor(authUser.displayName);
    }
  }, [authUser, draftAuthor]);

  // 별점이나 리뷰 등록 시 스탬프 자동 지급 ("콩!" 애니메이션)
  const awardStamp = useCallback((placeId: string) => {
    setStampedIds((prev) => (prev.includes(placeId) ? prev : [...prev, placeId]));
    setJustStampedId(null);
    requestAnimationFrame(() => {
      setJustStampedId(placeId);
    });
  }, []);

  // 실제 별점·한줄리뷰 저장 및 스탬프 지급 처리 (Supabase 연동 또는 미리보기 모드)
  const persistReviewAndStamp = useCallback(
    async (user: StampAuthUser, payload: PendingReviewPayload) => {
      const defaultAuthor =
        user.displayName ||
        (lang === 'KR' ? '울산여행자' : lang === 'JA' ? '旅人' : lang === 'ZH' ? '旅行者' : 'Traveler');
      const finalAuthor = payload.author.trim() || defaultAuthor;

      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;

      if (supabase && user.provider !== 'demo') {
        const { data: inserted } = await supabase
          .from('stamp_reviews')
          .insert({
            place_id: payload.placeId,
            user_id: user.id,
            author_name: finalAuthor,
            rating: payload.rating,
            comment: payload.comment,
          })
          .select('id, user_id, author_name, rating, comment, created_at')
          .single();

        await supabase
          .from('user_stamps')
          .upsert(
            { user_id: user.id, place_id: payload.placeId },
            { onConflict: 'user_id,place_id' },
          );

        const createdDate = inserted?.created_at ? new Date(inserted.created_at) : now;
        const formattedDate = `${createdDate.getFullYear()}.${String(
          createdDate.getMonth() + 1,
        ).padStart(2, '0')}`;

        const newItem: StampReviewItem = {
          id: inserted?.id || `rev-${Date.now()}`,
          userId: user.id,
          author: inserted?.author_name || finalAuthor,
          rating: inserted?.rating ?? payload.rating,
          comment: inserted?.comment ?? payload.comment,
          date: formattedDate,
        };

        setReviewsByPlace((prev) => ({
          ...prev,
          [payload.placeId]: [newItem, ...(prev[payload.placeId] || [])],
        }));
      } else {
        const newItem: StampReviewItem = {
          id: `rev-${Date.now()}`,
          userId: user.id,
          author: finalAuthor,
          rating: payload.rating,
          comment: payload.comment,
          date: dateStr,
        };

        setReviewsByPlace((prev) => ({
          ...prev,
          [payload.placeId]: [newItem, ...(prev[payload.placeId] || [])],
        }));
      }

      setDraftComment('');
      setSelectedPlaceId(payload.placeId);
      awardStamp(payload.placeId);
    },
    [awardStamp, lang],
  );

  // Supabase 세션 감지 + 전체 방문자 리뷰 로드 + OAuth 복귀 직후 작성 중이던 리뷰 자동 등록
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const extractUser = (rawUser: {
      id: string;
      email?: string;
      app_metadata?: Record<string, unknown>;
      user_metadata?: Record<string, unknown>;
    }): StampAuthUser => {
      const meta = rawUser.user_metadata || {};
      const nameCandidate =
        (meta.full_name as string) ||
        (meta.name as string) ||
        (meta.nickname as string) ||
        (meta.user_name as string) ||
        (meta.preferred_username as string) ||
        rawUser.email?.split('@')[0] ||
        '울산여행자';
      const prov =
        rawUser.app_metadata?.provider === 'kakao' ? 'kakao' : 'google';
      return {
        id: rawUser.id,
        displayName: nameCandidate.slice(0, 16),
        provider: prov,
      };
    };

    const fetchPublicReviews = async () => {
      const { data, error } = await client
        .from('stamp_reviews')
        .select('id, place_id, user_id, author_name, rating, comment, created_at')
        .order('created_at', { ascending: false });

      if (error || !data) return;

      const grouped: Record<string, StampReviewItem[]> = {
        ...INITIAL_REVIEWS,
      };
      for (const place of STAMP_PLACES) {
        grouped[place.id] = [...(INITIAL_REVIEWS[place.id] || [])];
      }

      const dbGrouped: Record<string, StampReviewItem[]> = {};
      for (const row of data) {
        const dt = new Date(row.created_at);
        const dStr = `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}`;
        const item: StampReviewItem = {
          id: row.id,
          userId: row.user_id,
          author: row.author_name,
          rating: row.rating,
          comment: row.comment || '',
          date: dStr,
        };
        if (!dbGrouped[row.place_id]) dbGrouped[row.place_id] = [];
        dbGrouped[row.place_id].push(item);
      }

      for (const key of Object.keys(dbGrouped)) {
        grouped[key] = [...dbGrouped[key], ...(grouped[key] || [])];
      }
      setReviewsByPlace(grouped);
    };

    const syncUserStampsAndPending = async (mappedUser: StampAuthUser) => {
      const { data: stampRows } = await client
        .from('user_stamps')
        .select('place_id')
        .eq('user_id', mappedUser.id);

      if (stampRows) {
        setStampedIds(stampRows.map((r) => r.place_id));
      }

      // 소셜 로그인 직후 대기 중이던 별점·리뷰 자동 등록 + 스탬프 지급
      if (!pendingFlushedRef.current) {
        const rawPending = sessionStorage.getItem('stepless_pending_review_v1');
        if (rawPending) {
          pendingFlushedRef.current = true;
          sessionStorage.removeItem('stepless_pending_review_v1');
          try {
            const parsed: PendingReviewPayload = JSON.parse(rawPending);
            await persistReviewAndStamp(mappedUser, parsed);
          } catch {
            // ignore malformed session data
          }
        }
      }
    };

    // 소셜 프로바이더 미활성화 안내 처리 (OAuth 리다이렉트 복귀 시)
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const errDesc =
      searchParams.get('error_description') || hashParams.get('error_description') || '';
    if (errDesc) {
      window.history.replaceState({}, '', window.location.pathname);
      setIsAuthModalOpen(true);
      if (errDesc.toLowerCase().includes('provider is not enabled')) {
        setAuthErrorMsg(
          lang === 'KR'
            ? 'Supabase 대시보드(Authentication → Providers)에서 카카오·Google 로그인을 활성화해 주세요.'
            : 'Please enable Kakao / Google in Supabase Dashboard (Authentication → Providers).',
        );
      } else {
        setAuthErrorMsg(errDesc);
      }
    }

    fetchPublicReviews();

    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mapped = extractUser(session.user);
        setAuthUser(mapped);
        syncUserStampsAndPending(mapped);
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mapped = extractUser(session.user);
        setAuthUser(mapped);
        syncUserStampsAndPending(mapped);
      } else {
        setAuthUser(null);
        setStampedIds([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [persistReviewAndStamp]);

  const handleOAuthLogin = async (provider: 'kakao' | 'google') => {
    setAuthErrorMsg(null);
    setAuthInfoMsg(null);
    if (!supabase) return;

    // 이동 전 프로바이더 활성화 여부 사전 확인 (흰색 400 JSON 에러 페이지 방지)
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: supabasePublishableKey },
      });
      if (res.ok) {
        const settings = await res.json();
        if (!settings?.external?.[provider]) {
          const provLabel = provider === 'kakao' ? '카카오' : 'Google';
          setAuthErrorMsg(
            lang === 'KR'
              ? `아직 Supabase 대시보드(Authentication → Providers)에 ${provLabel} 앱 키가 등록되지 않았습니다. 앱 키 등록 전까지는 아래 이메일 간편 로그인을 바로 사용하실 수 있어요!`
              : `${provLabel} login is not enabled in Supabase Dashboard yet. You can sign in right away via email below!`,
          );
          return;
        }
      }
    } catch {
      // 네트워크 오류 시 기본 OAuth 호출로 진행
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/courses/stamp`,
        ...(provider === 'kakao'
          ? { queryParams: { scope: 'profile_nickname' } }
          : {}),
      },
    });
    if (error) {
      setAuthErrorMsg(error.message);
    }
  };

  const handleEmailMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMsg(null);
    setAuthInfoMsg(null);
    const trimmed = magicEmail.trim();
    if (!trimmed || !supabase) return;

    setIsSendingOtp(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/courses/stamp`,
      },
    });
    setIsSendingOtp(false);

    if (error) {
      setAuthErrorMsg(error.message);
    } else {
      setAuthInfoMsg(
        lang === 'KR'
          ? '입력하신 이메일로 1초 로그인 링크를 보냈어요! 메일함에서 링크를 누르면 바로 로그인됩니다.'
          : 'Sent a magic login link to your email! Click the link in your inbox to finish signing in.',
      );
    }
  };

  // Supabase 키 연결 전 로컬 미리보기에서 전체 흐름을 테스트할 수 있는 체험 로그인
  const handleDemoPreviewLogin = async () => {
    const demoName =
      draftAuthor.trim() ||
      (lang === 'KR' ? '울산산책러' : lang === 'JA' ? '蔚山旅人' : 'Traveler');
    const demoUser: StampAuthUser = {
      id: 'demo-local-user',
      displayName: demoName,
      provider: 'demo',
    };
    setAuthUser(demoUser);
    try {
      localStorage.setItem('stepless_ulsan_demo_user_v1', JSON.stringify(demoUser));
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);

    const rawPending = sessionStorage.getItem('stepless_pending_review_v1');
    if (rawPending) {
      sessionStorage.removeItem('stepless_pending_review_v1');
      try {
        const parsed: PendingReviewPayload = JSON.parse(rawPending);
        await persistReviewAndStamp(demoUser, parsed);
      } catch {
        // ignore
      }
    }
  };

  const handleSignOut = async () => {
    if (supabase && authUser?.provider !== 'demo') {
      await supabase.auth.signOut();
    } else {
      setAuthUser(null);
      try {
        localStorage.removeItem('stepless_ulsan_demo_user_v1');
      } catch {
        // ignore
      }
    }
  };

  const handleDeleteReview = async (placeId: string, reviewId: string) => {
    if (supabase && authUser && authUser.provider !== 'demo') {
      await supabase
        .from('stamp_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', authUser.id);
    }
    setReviewsByPlace((prev) => ({
      ...prev,
      [placeId]: (prev[placeId] || []).filter((r) => r.id !== reviewId),
    }));
  };

  // 도장칸 또는 '스탬프 찍기' 버튼 클릭 시: 미스탬프 상태면 별점·리뷰 작성창으로 안내, 완료 상태면 콩! 모션 재생
  const handleStampSlotOrBtnClick = (placeId: string) => {
    setSelectedPlaceId(placeId);
    if (stampedIds.includes(placeId)) {
      setJustStampedId(null);
      requestAnimationFrame(() => {
        setJustStampedId(placeId);
      });
      return;
    }
    setNudgeReviewForm(false);
    setTimeout(() => {
      showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setNudgeReviewForm(true);
      commentInputRef.current?.focus({ preventScroll: true });
    }, 60);
    setTimeout(() => {
      setNudgeReviewForm(false);
    }, 1300);
  };

  const handleOpen3dSpace = (place: StampPlaceItem) => {
    if (!place.isLive3D || !place.space3dUrl) return;
    setActive3dPlace(place);
  };

  const handleSelectOnMap = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setTimeout(() => {
      showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  };

  const handleAddReview = async (placeId: string, e: React.FormEvent) => {
    e.preventDefault();
    const payload: PendingReviewPayload = {
      placeId,
      author: draftAuthor.trim(),
      rating: draftRating,
      comment: draftComment.trim(),
    };

    // 비로그인 상태면 작성한 내용을 임시 저장하고 3초 소셜 간편 가입·로그인 모달 오픈!
    if (!authUser) {
      try {
        sessionStorage.setItem('stepless_pending_review_v1', JSON.stringify(payload));
      } catch {
        // ignore
      }
      setIsAuthModalOpen(true);
      return;
    }

    await persistReviewAndStamp(authUser, payload);
  };

  const getRatingSummary = (placeId: string) => {
    const list = reviewsByPlace[placeId] || [];
    if (list.length === 0) return { avg: '5.0', count: 0 };
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return {
      avg: (sum / list.length).toFixed(1),
      count: list.length,
    };
  };

  const renderReviewBoard = (place: StampPlaceItem) => {
    const list = reviewsByPlace[place.id] || [];
    return (
      <div className="stamp-review-board">
        <div className="stamp-review-head">
          <div className="stamp-review-head-left">
            <h4 className="stamp-review-title">{ui.reviewTitle}</h4>
            <span className="stamp-review-avg">
              <StarMonoIcon filled={true} />
              <strong>{getRatingSummary(place.id).avg}</strong>
              <span className="stamp-review-cnt">({list.length})</span>
            </span>
          </div>

          {authUser ? (
            <span className="stamp-auth-user-pill">
              <strong>{authUser.displayName}</strong>
              <button
                type="button"
                className="stamp-auth-logout-btn"
                onClick={handleSignOut}
              >
                {ui.logoutMiniBtn}
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="stamp-auth-login-chip"
              onClick={() => setIsAuthModalOpen(true)}
            >
              {ui.loginMiniBtn}
            </button>
          )}
        </div>

        <form
          className={`stamp-review-form ${nudgeReviewForm ? 'nudge' : ''}`}
          onSubmit={(e) => handleAddReview(place.id, e)}
        >
          <div className="stamp-review-form-top">
            <div className="stamp-star-picker" role="radiogroup" aria-label="별점 선택">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`stamp-star-btn ${star <= draftRating ? 'on' : ''}`}
                  onClick={() => setDraftRating(star)}
                  aria-label={`${star}점`}
                >
                  <StarMonoIcon filled={star <= draftRating} />
                </button>
              ))}
              <span className="stamp-star-score">{draftRating}.0</span>
            </div>
            <input
              type="text"
              className="stamp-input-author"
              maxLength={16}
              placeholder={ui.nicknamePlaceholder}
              value={draftAuthor}
              onChange={(e) => setDraftAuthor(e.target.value)}
            />
          </div>
          <div className="stamp-review-form-bottom">
            <input
              ref={commentInputRef}
              type="text"
              className="stamp-input-comment"
              maxLength={90}
              placeholder={ui.commentPlaceholder}
              value={draftComment}
              onChange={(e) => setDraftComment(e.target.value)}
            />
            <button type="submit" className="stamp-review-submit">
              {ui.submitReviewBtn}
            </button>
          </div>
        </form>

        {list.length === 0 ? (
          <p className="stamp-review-empty">{ui.emptyReviewText}</p>
        ) : (
          <ul className="stamp-review-list">
            {list.map((rev) => (
              <li key={rev.id} className="stamp-review-item">
                <div
                  className="stamp-review-meta"
                  style={!rev.comment ? { marginBottom: 0 } : undefined}
                >
                  <strong className="stamp-rev-author">{rev.author}</strong>
                  <span className="stamp-rev-stars" aria-label={`${rev.rating} / 5`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <StarMonoIcon key={idx} filled={idx < rev.rating} />
                    ))}
                  </span>
                  <span className="stamp-rev-date">{rev.date}</span>
                  {authUser && rev.userId === authUser.id && (
                    <button
                      type="button"
                      className="stamp-rev-del-btn"
                      onClick={() => handleDeleteReview(place.id, rev.id)}
                    >
                      {ui.deleteReviewBtn}
                    </button>
                  )}
                </div>
                {rev.comment && <p className="stamp-rev-comment">{rev.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const totalCount = STAMP_PLACES.length;
  const collectedCount = stampedIds.length;
  const progressPercent = Math.round((collectedCount / totalCount) * 100);
  const selectedPlace =
    STAMP_PLACES.find((p) => p.id === selectedPlaceId) || STAMP_PLACES[0];
  const isSelectedStamped = stampedIds.includes(selectedPlace.id);

  return (
    <div className="stamp-tour-wrap">
      {/* 서브 문구 */}
      <p className="stamp-tour-lead">{ui.subtitle}</p>

      {/* ========================================================
          상단 1: 울산 스탬프 투어 일러스트 지도
         ======================================================== */}
      <div className="ulsan-map-poster stamp-map-poster">
        <div className="ulsan-map-canvas-wrap">
          <svg
            className="ulsan-map-svg"
            viewBox="0 0 800 600"
            role="img"
            aria-label="Ulsan Stamp Tour Map"
          >
            <image
              href="/ulsan-illustrated-map.jpg"
              x="0"
              y="0"
              width="800"
              height="600"
              preserveAspectRatio="xMidYMid slice"
            />

            {STAMP_PLACES.map((place) => {
              const isActive =
                place.id === selectedPlaceId || place.id === hoveredMapId;
              const hasLeader =
                Math.hypot(place.x - place.dotX, place.y - place.dotY) > 12;

              return (
                <g key={`stamp-leader-${place.id}`} style={{ pointerEvents: 'none' }}>
                  {hasLeader && (
                    <>
                      <line
                        x1={place.dotX}
                        y1={place.dotY}
                        x2={place.x}
                        y2={place.y}
                        stroke="#FAF1DF"
                        strokeWidth={isActive ? '4.8' : '3.4'}
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                      <line
                        x1={place.dotX}
                        y1={place.dotY}
                        x2={place.x}
                        y2={place.y}
                        stroke={place.inkColor}
                        strokeWidth={isActive ? '2.4' : '1.7'}
                        strokeDasharray="3.5 3.5"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                  <circle
                    cx={place.dotX}
                    cy={place.dotY}
                    r={isActive ? '7' : '5.2'}
                    fill="#FAF1DF"
                    stroke={place.inkColor}
                    strokeWidth="2.2"
                  />
                  <circle
                    cx={place.dotX}
                    cy={place.dotY}
                    r={isActive ? '3.5' : '2.5'}
                    fill={place.inkColor}
                  />
                </g>
              );
            })}

            {STAMP_PLACES.map((place, idx) => {
              const isSelected = place.id === selectedPlaceId;
              const isHovered = place.id === hoveredMapId;
              const isActive = isSelected || isHovered;
              const isStamped = stampedIds.includes(place.id);

              return (
                <g
                  key={place.id}
                  className={`ulsan-map-pin ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectOnMap(place.id)}
                  onMouseEnter={() => setHoveredMapId(place.id)}
                  onMouseLeave={() => setHoveredMapId(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {isActive && (
                    <circle
                      cx={place.x}
                      cy={place.y}
                      r="19.5"
                      fill={place.inkColor}
                      opacity="0.28"
                    />
                  )}

                  <text
                    x={place.x + 16.5}
                    y={place.y + 4.8}
                    textAnchor="start"
                    fontFamily="Gowun Dodum, serif"
                    fontSize={isActive ? '15' : '13.5'}
                    fontWeight="700"
                    fill={isActive ? place.inkColor : '#3A2A1E'}
                    stroke="#FAF1DF"
                    strokeWidth="5.5"
                    strokeLinejoin="round"
                    style={{ paintOrder: 'stroke fill' }}
                  >
                    {place.shortName[lang]}
                  </text>

                  <circle
                    cx={place.x}
                    cy={place.y}
                    r={isActive ? '14.5' : '12.8'}
                    fill="#FAF1DF"
                  />

                  {isStamped ? (
                    <>
                      <circle
                        cx={place.x}
                        cy={place.y}
                        r={isActive ? '12.6' : '11.2'}
                        fill={place.inkColor}
                        stroke="#3A2A1E"
                        strokeWidth="1.8"
                      />
                      <circle
                        cx={place.x}
                        cy={place.y}
                        r={isActive ? '9.8' : '8.5'}
                        fill="none"
                        stroke="rgba(255, 253, 249, 0.65)"
                        strokeWidth="1"
                        strokeDasharray="2 1.5"
                      />
                      <text
                        x={place.x}
                        y={place.y + 4.2}
                        textAnchor="middle"
                        fontFamily="Gowun Dodum, serif"
                        fontSize="11.5"
                        fontWeight="800"
                        fill="#FFFDF9"
                      >
                        {idx + 1}
                      </text>
                      <circle
                        cx={place.x + 9.5}
                        cy={place.y - 9.5}
                        r="5.6"
                        fill="#FAF1DF"
                        stroke={place.inkColor}
                        strokeWidth="1.6"
                      />
                      <path
                        d={`M${place.x + 7.1} ${place.y - 9.5} l1.7 1.8 l3.1 -3.3`}
                        fill="none"
                        stroke={place.inkColor}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : (
                    <>
                      <circle
                        cx={place.x}
                        cy={place.y}
                        r={isActive ? '12.2' : '10.8'}
                        fill="#FFFDF9"
                        stroke={place.inkColor}
                        strokeWidth="2"
                        strokeDasharray="3 2.2"
                      />
                      <text
                        x={place.x}
                        y={place.y + 4}
                        textAnchor="middle"
                        fontFamily="Gowun Dodum, serif"
                        fontSize="11.5"
                        fontWeight="800"
                        fill={place.inkColor}
                      >
                        {idx + 1}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================
          지도 아래: 고래(위 0/4 카운트) 옆 컴팩트 스탬프 진행 바 & 자동 제공 안내
         ======================================================== */}
      <div className="stamp-progress-block">
        <div className="stamp-passport-header">
          <div className="stamp-whale-col">
            <span className="stamp-whale-count">
              {collectedCount}/{totalCount}
            </span>
            {whaleMascot}
          </div>

          <div className="stamp-progress-col">
            <div
              className="stamp-progress-track"
              role="progressbar"
              aria-valuenow={collectedCount}
              aria-valuemin={0}
              aria-valuemax={totalCount}
            >
              <div
                className="stamp-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="stamp-slots-row">
              {STAMP_PLACES.map((place) => {
                const isStamped = stampedIds.includes(place.id);
                const isJustStamped = justStampedId === place.id;
                return (
                  <button
                    key={place.id}
                    type="button"
                    className={`stamp-slot-circle mini ${isStamped ? 'stamped' : 'empty'}`}
                    onClick={() => handleStampSlotOrBtnClick(place.id)}
                    aria-label={place.shortName[lang]}
                    title={place.shortName[lang]}
                  >
                    {isStamped && (
                      <InkStampSeal
                        emblem={place.emblem}
                        inkColor={place.inkColor}
                        tilt={place.stampTilt}
                        justStamped={isJustStamped}
                        kongText={ui.kongPopText}
                        size="xs"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="stamp-progress-note">{ui.progressAutoStampNote}</p>
      </div>

      {/* ========================================================
          중단 (확정 B안): 좌측 공간 정보(한줄 설명 + 주소·네이버지도 + 입장·스탬프 버튼)
                           / 우측 방문자 별점 & 한줄리뷰 + 하단 스탬프북 그리드
         ======================================================== */}
      <div className="stamp-portal-layout" ref={showcaseRef}>
        <div className="stamp-portal-showcase">
          <div className="stamp-portal-left">
            <div className="stamp-portal-media">
              <Space3DPreviewArt place={selectedPlace} />
              <div className="stamp-portal-seal-float">
                <button
                  type="button"
                  className={`stamp-slot-circle lg ${
                    isSelectedStamped ? 'stamped' : 'empty'
                  }`}
                  onClick={() => handleStampSlotOrBtnClick(selectedPlace.id)}
                  title={ui.stampBtn}
                >
                  {isSelectedStamped ? (
                    <InkStampSeal
                      emblem={selectedPlace.emblem}
                      inkColor={selectedPlace.inkColor}
                      tilt={selectedPlace.stampTilt}
                      microLabel={selectedPlace.stampLabel}
                      justStamped={justStampedId === selectedPlace.id}
                      kongText={ui.kongPopText}
                      size="lg"
                    />
                  ) : (
                    <span className="stamp-stub-empty-inner">
                      <InkStampEmblem type={selectedPlace.emblem} size={28} />
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="stamp-portal-info">
              <span className="stamp-cat-tag">{selectedPlace.categoryTag[lang]}</span>
              <h3 className="stamp-place-title">{selectedPlace.title[lang]}</h3>

              {/* 1줄 깔끔한 설명 */}
              <p className="stamp-place-desc">{selectedPlace.desc[lang]}</p>

              {/* 주소 + 네이버 지도 표시 줄 */}
              <div className="stamp-address-row">
                <span className="stamp-address-text">
                  <PinMonoIcon />
                  <span>{selectedPlace.address[lang]}</span>
                </span>
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(
                    selectedPlace.mapQuery,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-btn naver compact"
                >
                  <span className="map-badge-dot naver-dot" aria-hidden="true">
                    N
                  </span>
                  <span>{globalUi.naverMapBtn}</span>
                </a>
              </div>

              {/* 그다음 줄: 공간 입장하기 버튼 / 스탬프 찍기 버튼 */}
              <div className="stamp-cta-row">
                {selectedPlace.isLive3D ? (
                  <button
                    type="button"
                    className="stamp-primary-3d-btn"
                    onClick={() => handleOpen3dSpace(selectedPlace)}
                  >
                    <Cube3DLineIcon />
                    <span>{ui.enterSpaceBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="stamp-primary-3d-btn disabled"
                    disabled
                  >
                    <Cube3DLineIcon />
                    <span>{ui.comingSoonBtn}</span>
                  </button>
                )}

                <button
                  type="button"
                  className={`stamp-secondary-btn ${isSelectedStamped ? 'done' : ''}`}
                  onClick={() => handleStampSlotOrBtnClick(selectedPlace.id)}
                >
                  <StampPressLineIcon />
                  <span>{isSelectedStamped ? ui.stampedBtn : ui.stampBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 우측: 방문자 별점 & 한줄리뷰 그대로 유지 */}
          <div className="stamp-portal-right">
            {renderReviewBoard(selectedPlace)}
          </div>
        </div>

        {/* 하단 2열 스탬프북 그리드 */}
        <div className="stamp-grid-book">
          <div className="stamp-visa-grid">
            {STAMP_PLACES.map((place) => {
              const isStamped = stampedIds.includes(place.id);
              const isJustStamped = justStampedId === place.id;
              const isCurrent = selectedPlaceId === place.id;
              const ratingInfo = getRatingSummary(place.id);
              const latestReview = (reviewsByPlace[place.id] || []).find(
                (r) => r.comment.trim().length > 0,
              );

              return (
                <div
                  key={place.id}
                  className={`stamp-visa-card ${isCurrent ? 'active' : ''}`}
                  onClick={() => setSelectedPlaceId(place.id)}
                >
                  <div className="stamp-visa-top">
                    <div>
                      <h4 className="stamp-visa-title">{place.shortName[lang]}</h4>
                      <span className="stamp-rating-pill">
                        <StarMonoIcon filled={true} />
                        <strong>{ratingInfo.avg}</strong>
                        <span>({ratingInfo.count})</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`stamp-slot-circle ${
                        isStamped ? 'stamped' : 'empty'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStampSlotOrBtnClick(place.id);
                      }}
                      aria-label={place.shortName[lang]}
                    >
                      {isStamped ? (
                        <InkStampSeal
                          emblem={place.emblem}
                          inkColor={place.inkColor}
                          tilt={place.stampTilt}
                          microLabel={place.stampLabel}
                          justStamped={isJustStamped}
                          kongText={ui.kongPopText}
                          size="md"
                        />
                      ) : (
                        <span className="stamp-stub-empty-inner">
                          <InkStampEmblem type={place.emblem} size={22} />
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="stamp-visa-cat">{place.categoryTag[lang]}</p>
                  {latestReview && (
                    <p className="stamp-visa-quote">“{latestReview.comment}”</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          3D 공간 인라인 모달 뷰어 (독자서점 https://djsj.pages.dev/ 등)
         ======================================================== */}
      {active3dPlace && active3dPlace.space3dUrl && (
        <div
          className="stamp-3d-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={active3dPlace.title[lang]}
          onClick={() => setActive3dPlace(null)}
        >
          <div
            className="stamp-3d-modal-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stamp-3d-modal-bar">
              <div className="stamp-3d-modal-title-group">
                <Cube3DLineIcon />
                <strong>{active3dPlace.title[lang]}</strong>
                {stampedIds.includes(active3dPlace.id) && (
                  <span className="stamp-3d-stamped-pill">
                    {ui.modalStampedNotice}
                  </span>
                )}
              </div>
              <div className="stamp-3d-modal-actions">
                <a
                  href={active3dPlace.space3dUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stamp-3d-ext-link"
                >
                  {ui.modalOpenNewTab} ↗
                </a>
                <button
                  type="button"
                  className="stamp-3d-close-btn"
                  onClick={() => setActive3dPlace(null)}
                >
                  {ui.modalClose} ✕
                </button>
              </div>
            </div>
            <iframe
              src={active3dPlace.space3dUrl}
              title={active3dPlace.title[lang]}
              className="stamp-3d-iframe"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}

      {/* ========================================================
          3초 소셜 간편 가입·로그인 미니 모달 (카카오 + Google)
         ======================================================== */}
      {isAuthModalOpen && (
        <div
          className="stamp-auth-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={ui.authModalTitle}
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="stamp-auth-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stamp-auth-modal-top">
              <span className="stamp-auth-icon-badge" aria-hidden="true">
                <StampPressLineIcon />
              </span>
              <button
                type="button"
                className="stamp-auth-close-x"
                onClick={() => setIsAuthModalOpen(false)}
                aria-label={ui.modalClose}
              >
                ✕
              </button>
            </div>

            <h3 className="stamp-auth-modal-title">{ui.authModalTitle}</h3>
            <p className="stamp-auth-modal-desc">{ui.authModalDesc}</p>

            <div className="stamp-auth-btn-stack">
              <button
                type="button"
                className="stamp-oauth-btn kakao"
                onClick={() =>
                  isSupabaseConfigured
                    ? handleOAuthLogin('kakao')
                    : handleDemoPreviewLogin()
                }
              >
                <KakaoBubbleIcon />
                <span>{ui.kakaoLoginBtn}</span>
              </button>

              <button
                type="button"
                className="stamp-oauth-btn google"
                onClick={() =>
                  isSupabaseConfigured
                    ? handleOAuthLogin('google')
                    : handleDemoPreviewLogin()
                }
              >
                <GoogleMarkIcon />
                <span>{ui.googleLoginBtn}</span>
              </button>
            </div>

            {authErrorMsg && (
              <p className="stamp-auth-error">{authErrorMsg}</p>
            )}

            {authInfoMsg && (
              <p className="stamp-auth-info">{authInfoMsg}</p>
            )}

            {isSupabaseConfigured && (
              <form className="stamp-auth-email-form" onSubmit={handleEmailMagicLink}>
                <p className="stamp-auth-email-label">
                  {lang === 'KR'
                    ? '또는 별도 설정 없이 이메일로 바로 시작하기'
                    : 'Or sign in instantly via Email link'}
                </p>
                <div className="stamp-auth-email-row">
                  <input
                    type="email"
                    required
                    className="stamp-auth-email-input"
                    placeholder="you@example.com"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="stamp-auth-email-btn"
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp
                      ? '...'
                      : lang === 'KR'
                        ? '링크 받기'
                        : 'Send Link'}
                  </button>
                </div>
              </form>
            )}

            {!isSupabaseConfigured && (
              <div className="stamp-auth-demo-box">
                <p className="stamp-auth-demo-note">{ui.demoModeNotice}</p>
                <button
                  type="button"
                  className="stamp-auth-demo-btn"
                  onClick={handleDemoPreviewLogin}
                >
                  {ui.demoLoginBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
