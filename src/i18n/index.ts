import { CourseExtraTranslation, ITINERARY_COURSE_TRANSLATIONS } from './coursesDataItinerary';
import { PET_COURSE_TRANSLATIONS } from './coursesDataPet';
import { REST_COURSE_TRANSLATIONS } from './coursesDataRest';
import {
  COMPANION_TRANSLATIONS,
  DURATION_TRANSLATIONS,
  KTO_THUMB_TRANSLATIONS,
  MAP_PIN_SHORT_TRANSLATIONS,
  SCHEDULE_TRANSLATIONS,
  TASTE_CATEGORY_TRANSLATIONS,
  TASTE_PLACE_TRANSLATIONS,
} from './homeData';
import { LANGUAGE_OPTIONS, Lang } from './types';
import { BADGE_TRANSLATIONS, INFO_LABEL_TRANSLATIONS, UI_TEXT } from './ui';

export { LANGUAGE_OPTIONS, UI_TEXT, BADGE_TRANSLATIONS, INFO_LABEL_TRANSLATIONS, KTO_THUMB_TRANSLATIONS };
export type { Lang };

export const ALL_COURSE_TRANSLATIONS: Record<string, CourseExtraTranslation> = {
  ...ITINERARY_COURSE_TRANSLATIONS,
  ...PET_COURSE_TRANSLATIONS,
  ...REST_COURSE_TRANSLATIONS,
};

export function getTasteCategoryLabel(
  taste: { id: string; KR: string; EN: string },
  lang: Lang,
): string {
  if (lang === 'KR') return taste.KR;
  if (lang === 'EN') return taste.EN;
  return TASTE_CATEGORY_TRANSLATIONS[taste.id]?.[lang] || taste.EN;
}

export function getTastePlaceLabel(
  place: { id: string; KR: string; EN: string },
  lang: Lang,
): string {
  if (lang === 'KR') return place.KR;
  if (lang === 'EN') return place.EN;
  return TASTE_PLACE_TRANSLATIONS[place.id]?.[lang] || place.EN;
}

export function getCompanionLabel(
  item: { id: string; KR: string; EN: string },
  lang: Lang,
): string {
  if (lang === 'KR') return item.KR;
  if (lang === 'EN') return item.EN;
  return COMPANION_TRANSLATIONS[item.id]?.[lang] || item.EN;
}

export function getDurationLabel(
  item: { id: string; KR: string; EN: string },
  lang: Lang,
): string {
  if (lang === 'KR') return item.KR;
  if (lang === 'EN') return item.EN;
  return DURATION_TRANSLATIONS[item.id]?.[lang] || item.EN;
}

export function getCourseTitle(
  course: { id: string; title: { KR: string; EN: string } },
  lang: Lang,
): string {
  if (lang === 'KR') return course.title.KR;
  if (lang === 'EN') return course.title.EN;
  return ALL_COURSE_TRANSLATIONS[course.id]?.title?.[lang] || course.title.EN;
}

export function getCourseDesc(
  course: { id: string; desc: { KR: string; EN: string } },
  lang: Lang,
): string {
  if (lang === 'KR') return course.desc.KR;
  if (lang === 'EN') return course.desc.EN;
  return ALL_COURSE_TRANSLATIONS[course.id]?.desc?.[lang] || course.desc.EN;
}

export function getCourseBadge(
  course: { id: string; badge: { KR: string; EN: string } },
  lang: Lang,
): string {
  if (lang === 'KR') return course.badge.KR;
  if (lang === 'EN') return course.badge.EN;
  const customBadge = ALL_COURSE_TRANSLATIONS[course.id]?.badge?.[lang];
  if (customBadge) return customBadge;
  const mappedBadge = BADGE_TRANSLATIONS[course.badge.KR]?.[lang];
  if (mappedBadge) return mappedBadge;
  return course.badge.EN;
}

export function getCourseShortTab(
  course: {
    id: string;
    shortTab?: { KR: string; EN: string };
    title: { KR: string; EN: string };
  },
  lang: Lang,
): string {
  if (lang === 'KR') return course.shortTab ? course.shortTab.KR : course.title.KR;
  if (lang === 'EN') return course.shortTab ? course.shortTab.EN : course.title.EN;
  return (
    ALL_COURSE_TRANSLATIONS[course.id]?.shortTab?.[lang] ||
    ALL_COURSE_TRANSLATIONS[course.id]?.title?.[lang] ||
    (course.shortTab ? course.shortTab.EN : course.title.EN)
  );
}

export function getCourseStops(
  course: { id: string; stops?: { KR: string[]; EN: string[] } },
  lang: Lang,
): string[] {
  if (!course.stops) return [];
  if (lang === 'KR') return course.stops.KR;
  if (lang === 'EN') return course.stops.EN;
  return ALL_COURSE_TRANSLATIONS[course.id]?.stops?.[lang] || course.stops.EN;
}

export function getCourseProgramInfo(
  course: {
    id: string;
    programInfo?: { label: { KR: string; EN: string }; value: { KR: string; EN: string } }[];
  },
  lang: Lang,
): { key: string; label: string; value: string }[] {
  if (!course.programInfo) return [];
  const extraValues = ALL_COURSE_TRANSLATIONS[course.id]?.programInfoValues;
  return course.programInfo.map((row, idx) => {
    const labelStr =
      lang === 'KR'
        ? row.label.KR
        : lang === 'EN'
        ? row.label.EN
        : INFO_LABEL_TRANSLATIONS[row.label.KR]?.[lang] || row.label.EN;
    const valueStr =
      lang === 'KR'
        ? row.value.KR
        : lang === 'EN'
        ? row.value.EN
        : extraValues?.[idx]?.[lang] || row.value.EN;
    return {
      key: `${row.label.KR}-${idx}`,
      label: labelStr,
      value: valueStr,
    };
  });
}

export function getCourseProgramNote(
  course: { id: string; programNote?: { KR: string; EN: string } },
  lang: Lang,
): string | undefined {
  if (!course.programNote) return undefined;
  if (lang === 'KR') return course.programNote.KR;
  if (lang === 'EN') return course.programNote.EN;
  return ALL_COURSE_TRANSLATIONS[course.id]?.programNote?.[lang] || course.programNote.EN;
}

export function getItineraryStopField(
  courseId: string,
  stop: {
    step: number;
    time: { KR: string; EN: string };
    title: { KR: string; EN: string };
    shortMapName: { KR: string; EN: string };
    desc: { KR: string; EN: string };
    tip: { KR: string; EN: string };
  },
  field: 'time' | 'title' | 'shortMapName' | 'desc' | 'tip',
  lang: Lang,
): string {
  const fallback = stop[field];
  if (lang === 'KR') return fallback.KR;
  if (lang === 'EN') return fallback.EN;
  const stopExtra = ALL_COURSE_TRANSLATIONS[courseId]?.itineraryStops?.[stop.step - 1];
  return stopExtra?.[field]?.[lang] || fallback.EN;
}

export function getMapPinLabel(
  courseId: string,
  coord: { shortKR: string; shortEN: string },
  lang: Lang,
): string {
  if (lang === 'KR') return coord.shortKR;
  if (lang === 'EN') return coord.shortEN;
  return MAP_PIN_SHORT_TRANSLATIONS[courseId]?.[lang] || coord.shortEN;
}

export function getScheduleField(
  item: {
    id: string;
    period: { KR: string; EN: string };
    title: { KR: string; EN: string };
    place: { KR: string; EN: string };
    desc: { KR: string; EN: string };
  },
  field: 'period' | 'title' | 'place' | 'desc',
  lang: Lang,
): string {
  if (lang === 'KR') return item[field].KR;
  if (lang === 'EN') return item[field].EN;
  return SCHEDULE_TRANSLATIONS[item.id]?.[field]?.[lang] || item[field].EN;
}
