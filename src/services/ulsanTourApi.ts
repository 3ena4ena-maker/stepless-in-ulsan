/**
 * 한국관광공사 (KTO) TourAPI 4.0 (KorService2 / KorWithService2) 연동 서비스
 * - 울산광역시 (areaCode=7) 관광지·문화시설·음식점 공식 썸네일 이미지 및 콘텐츠 연동
 * - 사전 검증된 KTO 공식 이미지(tong.visitkorea.or.kr) 즉시 제공 + 실시간 키워드 API 조회 지원
 */

import { useEffect, useState } from 'react';

const KTO_BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';

// 환경변수 또는 기본 공공데이터포털 TourAPI 인증키 (Stepless 시리즈 공통 키)
const DEFAULT_TOUR_API_KEY =
  'nrg8zMZQXMShTbAqxFHKCuz2Lup%2BV9lQjDh%2BjPhZBHjSUERYLU76V5LqmboOO%2FfIpvWKdtRdPKKGNwJaEyhYgw%3D%3D';

export interface KtoThumbItem {
  contentId: string;
  label: { KR: string; EN: string };
  imageUrl: string;
}

/**
 * 한국관광공사 TourAPI (KorService2 / KorWithService2) 공식 등록 울산 관광지 썸네일 사전 매핑
 */
export const ULSAN_KTO_SPOT_THUMBS: Record<string, KtoThumbItem> = {
  petroglyphMuseum: {
    contentId: '634337',
    label: { KR: '울산암각화박물관', EN: 'Ulsan Petroglyph Museum' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/13/4087613_image2_1.jpg',
  },
  bangudae: {
    contentId: '128184',
    label: { KR: '대곡리 반구대 암각화', EN: 'Bangudae Petroglyphs' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/24/4087624_image2_1.JPG',
  },
  banguseowon: {
    contentId: '1955821',
    label: { KR: '반구서원·집청정', EN: 'Banguseowon & Jipcheongjeong' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/04/3341904_image2_1.jpg',
  },
  dinoFootprints: {
    contentId: '128192',
    label: { KR: '천전리 공룡발자국', EN: 'Dinosaur Footprints' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/42/3049142_image2_1.JPG',
  },
  heonjeonri: {
    contentId: '128191',
    label: { KR: '천전리 명문과 암각화', EN: 'Cheonjeonri Petroglyphs' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/42/4087642_image2_1.jpg',
  },
  whaleMuseum: {
    contentId: '3110778',
    label: { KR: '장생포 고래박물관', EN: 'Jangsaengpo Whale Museum' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/45/3454245_image2_1.jpg',
  },
  whaleEco: {
    contentId: '2754480',
    label: { KR: '고래생태체험관', EN: 'Whale Eco Experience' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/34/3549034_image2_1.jpg',
  },
  whaleVillage: {
    contentId: '2381176',
    label: { KR: '장생포 고래문화마을', EN: 'Whale Culture Village' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource_photo/22/3343922_image2_1.jpg',
  },
  daewangam: {
    contentId: '127515',
    label: { KR: '대왕암공원', EN: 'Daewangam Park' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/16/3583516_image2_1.jpg',
  },
  daewangamPine: {
    contentId: '1394298',
    label: { KR: '대왕암 송림', EN: 'Daewangam Pine Grove' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/48/3341848_image2_1.jpg',
  },
  daewangamBridge: {
    contentId: '2728939',
    label: { KR: '대왕암 출렁다리', EN: 'Daewangam Bridge' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/69/3583469_image2_1.jpg',
  },
  ilsanBeach: {
    contentId: '126091',
    label: { KR: '일산해수욕장', EN: 'Ilsan Beach' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/44/3528444_image2_1.jpg',
  },
  taehwagangGarden: {
    contentId: '2605817',
    label: { KR: '태화강 국가정원·십리대숲', EN: 'Taehwagang National Garden' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/01/3565101_image2_1.jpg',
  },
  taehwagangRiver: {
    contentId: '128201',
    label: { KR: '태화강 둔치', EN: 'Taehwagang Riverside' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/21/3008621_image2_1.jpg',
  },
  taehwaru: {
    contentId: '2502631',
    label: { KR: '태화루', EN: 'Taehwaru Pavilion' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/26/3341926_image2_1.jpg',
  },
  ganjeolgot: {
    contentId: '128022',
    label: { KR: '간절곶', EN: 'Ganjeolgot Cape' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/50/3583350_image2_1.jpg',
  },
  ganjeolgotSunrise: {
    contentId: '141375',
    label: { KR: '간절곶 해맞이광장', EN: 'Ganjeolgot Sunrise Plaza' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/79/3588879_image2_1.jpg',
  },
  ulsanBridge: {
    contentId: '2612976',
    label: { KR: '울산대교 전망대', EN: 'Ulsan Bridge Observatory' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/29/4123229_image2_1.jpg',
  },
  eonyangBulgogi: {
    contentId: '2852552',
    label: { KR: '언양 한우불고기', EN: 'Eonyang Hanwoo Bulgogi' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/49/2852549_image2_1.jpg',
  },
  ganjeolgotSeafood: {
    contentId: '2871364',
    label: { KR: '간절곶·방어진 회센터', EN: 'Coastal Seafood Center' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/57/2871357_image2_1.JPG',
  },
  coastalCafe: {
    contentId: '2848964',
    label: { KR: '시선310 간절곶점', EN: 'Siseon 310 Ganjeolgot Cafe' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/75/2848675_image2_1.jpg',
  },
  ortoCoffee: {
    contentId: '2848946',
    label: { KR: '오르토커피', EN: 'Orto Coffee' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/05/2848705_image2_1.jpg',
  },
  camonsiCafe: {
    contentId: '2845298',
    label: { KR: '카몬시 카페', EN: 'Camonsi Cafe' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/94/2845294_image2_1.jpg',
  },
  lamerPanji: {
    contentId: '2832528',
    label: { KR: '라메르판지 브런치', EN: 'La Mer Panji' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/16/2832516_image2_1.jpg',
  },
  ricopasto: {
    contentId: '2848922',
    label: { KR: '리코파스토 브런치', EN: 'Rico Pasto Brunch' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/34/2848834_image2_1.jpg',
  },
  heyDining: {
    contentId: '2844809',
    label: { KR: '헤이다이닝', EN: 'Hey Dining' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/04/2844804_image2_1.jpg',
  },
  ganjeolgotOctopus: {
    contentId: '2848971',
    label: { KR: '간절곶 돌문어', EN: 'Ganjeolgot Octopus Dining' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/25/2848625_image2_1.jpg',
  },
  papaAndSon: {
    contentId: '2837082',
    label: { KR: '파파앤썬by랑콩뜨레', EN: 'Papa & Son Bakery' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/76/2837076_image2_1.jpg',
  },
  bonMilk: {
    contentId: '2848940',
    label: { KR: '본밀크 디저트', EN: 'BONMILK Dessert' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/34/2848734_image2_1.jpg',
  },
  onggiVillage: {
    contentId: '128208',
    label: { KR: '외고산 옹기마을', EN: 'Oegosan Onggi Village' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/17/3534617_image2_1.jpg',
  },
  ulsanGrandPark: {
    contentId: '127644',
    label: { KR: '울산대공원', EN: 'Ulsan Grand Park' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/24/3072324_image2_1.jpg',
  },
  ulsanZoo: {
    contentId: '2002486',
    label: { KR: '울산대공원 동물원', EN: 'Ulsan Grand Park Zoo' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/07/3510807_image2_1.jpg',
  },
  ulsanMuseum: {
    contentId: '1556541',
    label: { KR: '울산박물관', EN: 'Ulsan Museum' },
    imageUrl: 'https://tong.visitkorea.or.kr/cms/resource/36/3072936_image2_1.jpg',
  },
};

const liveKeywordCache = new Map<string, KtoThumbItem | null>();

/**
 * 실시간 한국관광공사 TourAPI 4.0 (searchKeyword2) 키워드 이미지 검색
 * 새로운 명소/식도락/체험 장소가 추가되었을 때도 자동으로 공식 사진을 불러옵니다.
 */
export async function fetchKtoSpotThumbByKeyword(
  keyword: string,
): Promise<KtoThumbItem | null> {
  const cleanKw = keyword.trim();
  if (!cleanKw) return null;

  if (liveKeywordCache.has(cleanKw)) {
    return liveKeywordCache.get(cleanKw) || null;
  }

  try {
    const url = `${KTO_BASE_URL}/searchKeyword2?serviceKey=${DEFAULT_TOUR_API_KEY}&MobileOS=ETC&MobileApp=SteplessUlsan&_type=json&areaCode=7&numOfRows=5&pageNo=1&keyword=${encodeURIComponent(
      cleanKw,
    )}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const rawItems = data?.response?.body?.items?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const withImage = items.find((it: any) => it?.firstimage || it?.firstimage2);
    if (withImage) {
      const rawUrl = String(withImage.firstimage2 || withImage.firstimage);
      const result: KtoThumbItem = {
        contentId: String(withImage.contentid || ''),
        label: {
          KR: String(withImage.title || cleanKw),
          EN: cleanKw,
        },
        imageUrl: rawUrl.replace(/^http:\/\//i, 'https://'),
      };
      liveKeywordCache.set(cleanKw, result);
      return result;
    }
  } catch {
    // 네트워크 실패 시 조용히 무시
  }

  liveKeywordCache.set(cleanKw, null);
  return null;
}

/**
 * 사전 매핑된 KTO 썸네일이 있으면 즉시 반환하고, 없을 경우 한국관광공사 API를 실시간 호출하는 훅
 */
export function useKtoCourseThumbs(
  presetKeys: string[],
  fallbackKeyword?: string,
): KtoThumbItem[] {
  const presetItems = presetKeys
    .map((k) => ULSAN_KTO_SPOT_THUMBS[k])
    .filter((item): item is KtoThumbItem => Boolean(item));

  const [dynamicItem, setDynamicItem] = useState<KtoThumbItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (presetItems.length === 0 && fallbackKeyword) {
      fetchKtoSpotThumbByKeyword(fallbackKeyword).then((res) => {
        if (!cancelled && res) {
          setDynamicItem(res);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [presetItems.length, fallbackKeyword]);

  if (presetItems.length > 0) return presetItems;
  if (dynamicItem) return [dynamicItem];
  return [];
}
