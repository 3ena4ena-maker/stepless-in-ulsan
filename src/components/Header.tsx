import React from 'react';
import {
  Compass,
  Train,
  Sparkles,
  Map,
  Bus,
  Info,
  Menu,
  X,
  Accessibility,
  ArrowUpRight,
} from 'lucide-react';
import { Language, MobilityMode } from '../data/ulsanCurationData';

interface HeaderProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  language: Language;
  toggleLanguage: () => void;
  mobilityMode: MobilityMode;
  onSelectMobilityMode: (mode: MobilityMode) => void;
  onResetQuiz: () => void;
}

export default function Header({
  activeSection,
  onNavigateSection,
  language,
  toggleLanguage,
  mobilityMode,
  onSelectMobilityMode,
  onResetQuiz,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    {
      id: 'curation-hero',
      label: language === 'KR' ? '성향 맞춤 코스추천' : 'Course Curation',
      icon: Sparkles,
    },
    {
      id: 'donghae-bridge',
      label: language === 'KR' ? '동해선·역사 엘리베이터' : 'Donghae Line & Hubs',
      icon: Train,
    },
    {
      id: 'ulsan-themes',
      label: language === 'KR' ? '울산 4대 무장애 테마' : '4 Ulsan Themes',
      icon: Compass,
    },
    {
      id: 'all-courses',
      label: language === 'KR' ? '전체 추천코스 비교' : 'All Courses',
      icon: Map,
    },
    {
      id: 'transit-guide',
      label: language === 'KR' ? '부름콜·교통 꿀팁' : 'Transit & Tips',
      icon: Bus,
    },
    {
      id: 'about-stepless',
      label: language === 'KR' ? '서비스 검증 안내' : 'Verification',
      icon: Info,
    },
  ];

  const mobilityLabels: Record<MobilityMode, { KR: string; EN: string }> = {
    ALL: { KR: '전체 보행모드', EN: 'All Travelers' },
    WHEELCHAIR: { KR: '휠체어 모드 ON', EN: 'Wheelchair Mode' },
    STROLLER: { KR: '유모차·아이 동반', EN: 'Stroller Mode' },
    SENIOR: { KR: '시니어·최소보행', EN: 'Easy-Walk Mode' },
  };

  const cycleMobilityMode = () => {
    const order: MobilityMode[] = ['ALL', 'WHEELCHAIR', 'STROLLER', 'SENIOR'];
    const nextIdx = (order.indexOf(mobilityMode) + 1) % order.length;
    onSelectMobilityMode(order[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E5E2DC] transition-all">
      {/* Top Universe Bar: Connecting Stepless in Busan <-> Stepless in Ulsan */}
      <div className="bg-[#F4F2EE] border-b border-[#E5E2DC]/80 text-[11px] text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-[#6B853E] bg-[#EFF4E6] border border-[#D7E4C0] px-2 py-0.5 rounded-full text-[10px]">
              STEPLESS UNIVERSE
            </span>
            <span className="text-slate-500 hidden sm:inline">
              {language === 'KR'
                ? '부산에서 동해선 전철로 40분, 계단 없이 이어지는 두 번째 도시'
                : '40 mins from Busan via Donghae Line — Chapter 02 of Step-Free Korea'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://stepless.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-[#6B853E] transition-colors no-underline"
              title="Stepless in Busan 세계관으로 이동"
            >
              <span>STEPLESS IN BUSAN</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-[#2484B8]">STEPLESS IN ULSAN</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar (Matching Stepless in Busan Layout & Typography) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand Logo */}
          <a
            href="#curation-hero"
            onClick={(e) => {
              e.preventDefault();
              onResetQuiz();
              onNavigateSection('curation-hero');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none py-1 no-underline"
            title="STEPLESS IN ULSAN 홈으로 이동"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EAF5FA] border border-[#C5E3F2] flex items-center justify-center text-[#1B6B96] group-hover:bg-[#2484B8] group-hover:text-white transition-all shadow-2xs">
              {/* Minimalist Whale Tail / Wave Emblem */}
              <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
                <path
                  d="M5 18 C5 11 11 8 17 9.5 C21 10.5 23 13 25 10 C25 13.5 23 15.5 21 16.5 C23 17.5 24.5 19 25 21 C22.5 20.2 20.5 18.8 19 17.5 C14.5 19.5 9 19.5 5 18 Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 22.5 H24"
                  stroke="#8EA85E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col text-left leading-[0.92]">
              <span className="text-sm sm:text-base font-black font-heading tracking-tight text-[#11161B] group-hover:text-[#2484B8] transition-colors">
                STEPLESS
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black font-heading tracking-tight text-[#2484B8] group-hover:text-[#11161B] transition-colors">
                  IN ULSAN
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EAF5FA] text-[#1B6B96] border border-[#CBE4F2]">
                  WHALE &amp; ECO
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Global Navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap no-underline ${
                    isActive
                      ? 'text-[#1B6B96] bg-[#EAF5FA] font-bold'
                      : 'text-[#4A5568] hover:text-[#11161B] hover:bg-[#F1EFEC]/70'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${
                      isActive ? 'text-[#2484B8]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Mobility Mode Filter Pill + KR/EN Minimalist Toggle */}
          <div className="hidden md:flex items-center gap-3 border-l border-[#E5E2DC] pl-4">
            <button
              type="button"
              onClick={cycleMobilityMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                mobilityMode === 'ALL'
                  ? 'bg-[#EFF4E6] text-[#5B7332] border-[#D5E4BE] hover:bg-[#E4EED5]'
                  : 'bg-[#1B6B96] text-white border-[#1B6B96] shadow-xs'
              }`}
              title={
                language === 'KR'
                  ? '클릭하여 휠체어·유모차·시니어 맞춤 필터 전환'
                  : 'Click to switch accessibility mode'
              }
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>{mobilityLabels[mobilityMode][language]}</span>
            </button>

            <div className="flex items-center text-xs font-mono tracking-wider select-none">
              <button
                type="button"
                onClick={() => {
                  if (language !== 'KR') toggleLanguage();
                }}
                className={`transition-colors cursor-pointer px-1.5 py-1 ${
                  language === 'KR'
                    ? 'font-bold text-[#2484B8] underline underline-offset-4 decoration-2'
                    : 'text-slate-400 hover:text-[#11161B]'
                }`}
              >
                한국어
              </button>
              <span className="text-slate-300 mx-0.5">|</span>
              <button
                type="button"
                onClick={() => {
                  if (language !== 'EN') toggleLanguage();
                }}
                className={`transition-colors cursor-pointer px-1.5 py-1 ${
                  language === 'EN'
                    ? 'font-bold text-[#2484B8] underline underline-offset-4 decoration-2'
                    : 'text-slate-400 hover:text-[#11161B]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={cycleMobilityMode}
              className="px-2.5 py-1 text-[11px] font-bold text-[#1B6B96] bg-[#EAF5FA] rounded-full border border-[#C5E3F2] flex items-center gap-1"
            >
              <Accessibility className="w-3 h-3" />
              <span>{mobilityLabels[mobilityMode][language]}</span>
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-mono font-semibold text-[#6B853E] bg-[#F1EFEC] rounded-md border border-[#E5E2DC]"
            >
              {language === 'KR' ? 'EN' : '한국어'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#11161B] hover:bg-[#F1EFEC] transition-all flex items-center justify-center cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBFBF9] border-b border-[#E5E2DC] shadow-md animate-fade-in">
          <div className="px-4 pt-3 pb-5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold no-underline ${
                    isActive
                      ? 'bg-[#EAF5FA] text-[#1B6B96] font-bold'
                      : 'text-slate-700 hover:bg-[#F1EFEC]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#2484B8]" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
