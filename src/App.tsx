import React, { useState, useRef } from 'react';

type Lang = 'KR' | 'EN';

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
  const [selectedTasteIds, setSelectedTasteIds] = useState<string[]>([]);
  const [selectedCompanionIds, setSelectedCompanionIds] = useState<string[]>([]);
  const [selectedDurationId, setSelectedDurationId] = useState<string>('');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [showCourse, setShowCourse] = useState<boolean>(false);
  const [courseStops, setCourseStops] = useState<PlaceItem[]>([]);
  const [courseRenderKey, setCourseRenderKey] = useState<number>(0);

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

  // Build localized course title dynamically so toggling KR/EN also updates the open course title
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

  return (
    <>
      <header className="top">
        <a
          href="/"
          className="stepless-logo"
          title={lang === 'KR' ? 'STEPLESS IN ULSAN 홈으로 이동' : 'Go to STEPLESS IN ULSAN Home'}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>STEPLESS</span>
          <span>IN ULSAN</span>
        </a>

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
