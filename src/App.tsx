import React, { useState, useMemo } from 'react';
import {
  Accessibility,
  Baby,
  Sparkles,
  Train,
  Car,
  Compass,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  MapPin,
  BatteryCharging,
  HeartHandshake,
  UtensilsCrossed,
  Sun,
  Trees,
  Waves,
  PhoneCall,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
  UserCheck,
  Info,
  Clock,
} from 'lucide-react';
import Header from './components/Header';
import UlsanIllustration from './components/UlsanIllustration';
import {
  CURATION_QUESTIONS,
  ULSAN_COURSES,
  ULSAN_TRANSIT_HUBS,
  Language,
  MobilityMode,
  CurationOption,
} from './data/ulsanCurationData';

export default function App() {
  const [language, setLanguage] = useState<Language>('KR');
  const [activeSection, setActiveSection] = useState<string>('curation-hero');
  const [mobilityMode, setMobilityMode] = useState<MobilityMode>('ALL');

  // Interactive 3-Step Curation States
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: 'wheelchair', // Default selected like user's initial concept ("전동·수동휠체어 시원한 바다 드라이브")
    2: 'vibe_whale',
    3: 'transit_donghae',
  });
  const [showResult, setShowResult] = useState<boolean>(false);

  // Selected Transit Hub in the Donghae Line section
  const [selectedHubId, setSelectedHubId] = useState<string>('taehwagang');
  const [hubFilter, setHubFilter] = useState<'ALL' | '동해선' | 'KTX·SRT' | '무장애환승'>('ALL');

  // Sync mobility mode button with Step 1 selection
  const handleSelectMobilityMode = (mode: MobilityMode) => {
    setMobilityMode(mode);
    if (mode === 'WHEELCHAIR') {
      setAnswers((prev) => ({ ...prev, 1: 'wheelchair' }));
    } else if (mode === 'STROLLER') {
      setAnswers((prev) => ({ ...prev, 1: 'stroller' }));
    } else if (mode === 'SENIOR') {
      setAnswers((prev) => ({ ...prev, 1: 'senior' }));
    }
  };

  // Compute the best-matching course & match score from current answers
  const matchedResult = useMemo(() => {
    const step1Choice = CURATION_QUESTIONS[0].options.find((o) => o.id === answers[1]);
    const step2Choice = CURATION_QUESTIONS[1].options.find((o) => o.id === answers[2]);
    const step3Choice = CURATION_QUESTIONS[2].options.find((o) => o.id === answers[3]);

    // Priority weighting: Step 2 (scenery/theme) & Step 1 (companion/mobility)
    const scores: Record<string, number> = {
      'whale-daewangam': 0,
      'taehwagang-bamboo': 0,
      'bridge-ganjeolgot': 0,
      'petroglyph-gourmet': 0,
    };

    if (step1Choice) scores[step1Choice.matchedCourseId] += 45;
    if (step2Choice) scores[step2Choice.matchedCourseId] += 50;
    if (step3Choice) scores[step3Choice.matchedCourseId] += 25;

    // If on Step 1 only, reflect Step 1's immediate match so live preview responds right away
    let winningId = step1Choice?.matchedCourseId || 'whale-daewangam';
    if (currentStep >= 2 || showResult) {
      winningId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    }

    const course = ULSAN_COURSES[winningId] || ULSAN_COURSES['whale-daewangam'];
    const matchPercent =
      step1Choice?.matchedCourseId === step2Choice?.matchedCourseId ? 99 : 98;

    return {
      course,
      matchPercent,
      step1Choice,
      step2Choice,
      step3Choice,
    };
  }, [answers, currentStep, showResult]);

  const activeQuestion =
    CURATION_QUESTIONS.find((q) => q.step === currentStep) || CURATION_QUESTIONS[0];

  const handleOptionSelect = (step: number, option: CurationOption) => {
    setAnswers((prev) => ({ ...prev, [step]: option.id }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevStep = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    setShowResult(false);
    setCurrentStep(1);
  };

  const handleSelectCourseDirectly = (courseId: string) => {
    // Map courseId back to matching answers so result card displays that course immediately
    const courseToStep1: Record<string, string> = {
      'whale-daewangam': 'wheelchair',
      'taehwagang-bamboo': 'stroller',
      'bridge-ganjeolgot': 'senior',
      'petroglyph-gourmet': 'heritage',
    };
    const courseToStep2: Record<string, string> = {
      'whale-daewangam': 'vibe_whale',
      'taehwagang-bamboo': 'vibe_bamboo',
      'bridge-ganjeolgot': 'vibe_bridge',
      'petroglyph-gourmet': 'vibe_food',
    };
    setAnswers((prev) => ({
      ...prev,
      1: courseToStep1[courseId] || 'wheelchair',
      2: courseToStep2[courseId] || 'vibe_whale',
    }));
    setShowResult(true);
    const el = document.getElementById('curation-hero');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderOptionIcon = (iconName: CurationOption['iconName'], isSelected: boolean) => {
    const cls = `w-5 h-5 ${isSelected ? 'stroke-[2.4]' : 'stroke-[2]'}`;
    switch (iconName) {
      case 'wheelchair':
        return <Accessibility className={cls} />;
      case 'stroller':
        return <Baby className={cls} />;
      case 'senior':
      case 'bridge':
        return <Sun className={cls} />;
      case 'whale':
        return <Waves className={cls} />;
      case 'bamboo':
        return <Trees className={cls} />;
      case 'utensils':
        return <UtensilsCrossed className={cls} />;
      case 'train':
        return <Train className={cls} />;
      case 'taxi':
        return <PhoneCall className={cls} />;
      case 'car':
      default:
        return <Car className={cls} />;
    }
  };

  const getAccentStyles = (accent: 'aqua' | 'sage' | 'coral' | 'lavender', isSelected: boolean) => {
    switch (accent) {
      case 'aqua':
        return {
          card: isSelected
            ? 'bg-[#F0F8FC] border-[#2484B8] ring-2 ring-[#2484B8]/15 shadow-sm'
            : 'bg-white hover:bg-[#F7FBFD] border-[#E5E2DC] hover:border-[#9CCAE3]',
          iconBox: isSelected
            ? 'bg-[#2484B8] text-white'
            : 'bg-[#EAF5FA] text-[#1B6B96]',
          badge: isSelected
            ? 'bg-[#2484B8] text-white'
            : 'bg-[#EAF5FA] text-[#1B6B96]',
          check: 'bg-[#2484B8] border-[#2484B8] text-white',
        };
      case 'sage':
        return {
          card: isSelected
            ? 'bg-[#F4F8EF] border-[#6B853E] ring-2 ring-[#6B853E]/15 shadow-sm'
            : 'bg-white hover:bg-[#F9FBF7] border-[#E5E2DC] hover:border-[#B5C99A]',
          iconBox: isSelected
            ? 'bg-[#6B853E] text-white'
            : 'bg-[#EFF4E6] text-[#5B7332]',
          badge: isSelected
            ? 'bg-[#6B853E] text-white'
            : 'bg-[#EFF4E6] text-[#5B7332]',
          check: 'bg-[#6B853E] border-[#6B853E] text-white',
        };
      case 'coral':
        return {
          card: isSelected
            ? 'bg-[#FEF6F1] border-[#E57A44] ring-2 ring-[#E57A44]/15 shadow-sm'
            : 'bg-white hover:bg-[#FFF9F6] border-[#E5E2DC] hover:border-[#F0B293]',
          iconBox: isSelected
            ? 'bg-[#E57A44] text-white'
            : 'bg-[#FDF1EB] text-[#C85A24]',
          badge: isSelected
            ? 'bg-[#E57A44] text-white'
            : 'bg-[#FDF1EB] text-[#C85A24]',
          check: 'bg-[#E57A44] border-[#E57A44] text-white',
        };
      case 'lavender':
      default:
        return {
          card: isSelected
            ? 'bg-[#F8F5FB] border-[#7C5295] ring-2 ring-[#7C5295]/15 shadow-sm'
            : 'bg-white hover:bg-[#FBF9FD] border-[#E5E2DC] hover:border-[#C8B2D6]',
          iconBox: isSelected
            ? 'bg-[#7C5295] text-white'
            : 'bg-[#F2EBF7] text-[#684080]',
          badge: isSelected
            ? 'bg-[#7C5295] text-white'
            : 'bg-[#F2EBF7] text-[#684080]',
          check: 'bg-[#7C5295] border-[#7C5295] text-white',
        };
    }
  };

  const filteredHubs = ULSAN_TRANSIT_HUBS.filter((hub) => {
    if (hubFilter === 'ALL') return true;
    return hub.line === hubFilter;
  });

  const activeHub =
    ULSAN_TRANSIT_HUBS.find((h) => h.id === selectedHubId) || ULSAN_TRANSIT_HUBS[0];

  // 4 Pastel Theme Cards matching Stepless in Busan's signature section
  const ulsanThemeCards = [
    {
      courseId: 'whale-daewangam',
      illustration: 'whale-sea' as const,
      title: language === 'KR' ? '장생포 고래 & 대왕암 바다' : 'Jangsaengpo Whale & Ocean',
      tag: language === 'KR' ? '단차 0cm 해안데크' : 'ZERO-STEP DECK',
      desc:
        language === 'KR'
          ? '고래생태체험관 해저터널부터 백년 해송 솔바람길까지'
          : 'Underwater dolphin tunnel & pine forest boardwalk.',
      bg: 'bg-[#F2F8FB]',
      border: 'border-[#DCEBF4] hover:border-[#A8D0E6]',
      iconBg: 'bg-[#E2F0F8]',
    },
    {
      courseId: 'taehwagang-bamboo',
      illustration: 'bamboo-garden' as const,
      title: language === 'KR' ? '태화강 국가정원 십리대숲' : 'Taehwagang Bamboo Garden',
      tag: language === 'KR' ? '평지 100% · 전동관람차' : '100% FLAT GARDEN',
      desc:
        language === 'KR'
          ? '바퀴 빠짐 없는 대나무 은하수길과 리버뷰 브런치'
          : 'Firm bamboo trails, accessible tram & riverview cafes.',
      bg: 'bg-[#F4F8F2]',
      border: 'border-[#E0ECDC] hover:border-[#B6D4AD]',
      iconBg: 'bg-[#E5F0E0]',
    },
    {
      courseId: 'bridge-ganjeolgot',
      illustration: 'bridge-night' as const,
      title: language === 'KR' ? '울산대교 노을야경 & 간절곶' : 'Ulsan Bridge Sunset & Cape',
      tag: language === 'KR' ? '엘리베이터 전망대' : 'SUNSET & SKYLINE',
      desc:
        language === 'KR'
          ? '보석처럼 반짝이는 스마트 산업도시 야경과 해맞이 광장'
          : 'Sparkling golden-hour skyline & flat sunrise plaza.',
      bg: 'bg-[#FCF6F2]',
      border: 'border-[#F2E4DA] hover:border-[#E5C2AC]',
      iconBg: 'bg-[#F8EAE0]',
    },
    {
      courseId: 'petroglyph-gourmet',
      illustration: 'heritage' as const,
      title: language === 'KR' ? '반구대 고래역사 & 언양불고기' : 'Whale Heritage & Hanwoo',
      tag: language === 'KR' ? '실내슬로프 · 1층미식' : 'MUSEUM & FOODIE',
      desc:
        language === 'KR'
          ? '고래 모양 무장애 박물관과 턱 없는 1층 한우불고기 명가'
          : 'Whale-shaped ramp museum & step-free Hanwoo dining.',
      bg: 'bg-[#F8F5FA]',
      border: 'border-[#EAE2F0] hover:border-[#CEBBE0]',
      iconBg: 'bg-[#EFE6F5]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#11161B] font-sans pb-16 md:pb-0">
      {/* Sticky Header */}
      <Header
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        language={language}
        toggleLanguage={() => setLanguage((prev) => (prev === 'KR' ? 'EN' : 'KR'))}
        mobilityMode={mobilityMode}
        onSelectMobilityMode={handleSelectMobilityMode}
        onResetQuiz={handleResetQuiz}
      />

      {/* Main Content Container (Identical max-width & rhythm to Stepless in Busan) */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12">
        <main className="space-y-10 sm:space-y-14">
          {/* =========================================================
              1. HERO & INTERACTIVE 3-STEP COURSE CURATION SECTION
             ========================================================= */}
          <section
            id="curation-hero"
            className="relative pt-3 sm:pt-6 pb-4 text-center max-w-3xl mx-auto"
          >
            {/* Subtle Warm Glow Backdrop (Bright Aqua + Warm Apricot + Sage, zero dullness) */}
            <div
              className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 rounded-full opacity-55 blur-3xl -z-10"
              style={{
                background:
                  'radial-gradient(circle at 25% 40%, #DDF0FA 0%, transparent 55%), radial-gradient(circle at 75% 35%, #FCE6D8 0%, transparent 52%), radial-gradient(circle at 50% 80%, #E7F1DA 0%, transparent 55%)',
              }}
            />

            {/* Editorial Ulsan Whale & Bridge Sunrise Illustration */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="w-36 sm:w-44 h-20 sm:h-24 flex items-center justify-center animate-float-slow">
                <UlsanIllustration type="whale-hero" className="w-full h-full" />
              </div>

              {/* Curation Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#DCE8F0] shadow-2xs text-xs font-bold text-[#1B6B96]">
                <span className="w-2 h-2 rounded-full bg-[#8EA85E] animate-pulse" />
                <span>
                  {language === 'KR'
                    ? '울산 아기고래 울리의 AI 무장애 맞춤 큐레이션'
                    : 'Baby Whale Ulli’s AI Step-Free Course Curation'}
                </span>
              </div>
            </div>

            {/* Primary 3-Second Value Headline (Continuing Stepless in Busan's Typography) */}
            <h1 className="text-2xl sm:text-4xl md:text-[44px] font-black font-heading tracking-tight text-[#11161B] leading-[1.18] break-keep mb-2.5">
              {language === 'KR' ? (
                <>
                  나에게 딱 맞는 <span className="text-[#2484B8]">턱 없는 울산</span>{' '}
                  <span className="text-[#6B853E]">여행</span>
                </>
              ) : (
                <>
                  Discover Your Perfect{' '}
                  <span className="text-[#2484B8]">Step-Free Ulsan</span>{' '}
                  <span className="text-[#6B853E]">Journey</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl mx-auto mb-6 sm:mb-7 break-keep">
              {language === 'KR'
                ? '3가지 질문으로 발견하는 푸른 고래의 바다, 십리대숲, 그리고 반짝이는 브릿지 무장애 코스'
                : 'Answer 3 quick questions to match with zero-step whale coasts, bamboo gardens, and sunset bridges.'}
            </p>

            {/* =====================================================
                INTERACTIVE QUIZ CARD OR PERSONALIZED RESULT CARD
               ===================================================== */}
            {!showResult ? (
              <div className="bg-white/95 backdrop-blur-sm border border-[#E5E2DC] rounded-3xl p-4 sm:p-7 md:p-8 text-left shadow-[0_12px_40px_rgba(17,22,27,0.05)] transition-all">
                {/* Step Progress Header & Clickable Step Tabs */}
                <div className="space-y-3 mb-5 sm:mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-[#2484B8] tracking-wider">
                        STEP 0{currentStep}
                      </span>
                      <span className="font-mono text-xs text-slate-400">/ 03</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F4F2EE] text-slate-700 border border-[#E5E2DC]">
                        {activeQuestion.categoryTitle[language]}
                      </span>
                    </div>

                    {/* Step Quick Switcher Pills */}
                    <div className="flex items-center gap-1.5" role="tablist" aria-label="질문 단계 선택">
                      {CURATION_QUESTIONS.map((q) => {
                        const isCurrent = q.step === currentStep;
                        const isDone = Boolean(answers[q.step]);
                        return (
                          <button
                            key={q.step}
                            type="button"
                            onClick={() => setCurrentStep(q.step)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-[#11161B] text-white shadow-2xs'
                                : isDone
                                ? 'bg-[#EAF5FA] text-[#1B6B96] hover:bg-[#DCEFF9]'
                                : 'bg-[#F4F2EE] text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <span>0{q.step}</span>
                            <span className="hidden sm:inline">{q.categoryTitle[language]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Multi-tone Bright Progress Bar */}
                  <div className="w-full h-1.5 bg-[#EFECE6] rounded-full overflow-hidden flex">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${(currentStep / 3) * 100}%`,
                        background:
                          'linear-gradient(90deg, #2484B8 0%, #8EA85E 55%, #E57A44 100%)',
                      }}
                    />
                  </div>
                </div>

                {/* Question Title & Helper */}
                <div className="mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-2xl font-black text-[#11161B] tracking-tight leading-snug break-keep">
                    {activeQuestion.question[language]}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 break-keep">
                    {activeQuestion.helperText[language]}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5 sm:space-y-3" role="radiogroup" aria-label={activeQuestion.question[language]}>
                  {activeQuestion.options.map((option) => {
                    const isSelected = answers[currentStep] === option.id;
                    const styles = getAccentStyles(option.accentColor, isSelected);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleOptionSelect(currentStep, option)}
                        className={`w-full rounded-2xl p-3.5 sm:p-4 border text-left transition-all duration-180 flex items-center gap-3 sm:gap-4 cursor-pointer group ${styles.card}`}
                      >
                        {/* Left Icon Box */}
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${styles.iconBox}`}
                        >
                          {renderOptionIcon(option.iconName, isSelected)}
                        </div>

                        {/* Center Title, Badge & Engineering Spec Subtitle */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="font-extrabold text-sm sm:text-base text-[#11161B] leading-snug break-keep">
                              {option.title[language]}
                            </span>
                            <span
                              className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}
                            >
                              {isSelected
                                ? language === 'KR'
                                  ? `선택됨 · ${option.badge.KR}`
                                  : `Selected · ${option.badge.EN}`
                                : option.badge[language]}
                            </span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed break-keep">
                            {option.subtitle[language]}
                          </p>
                        </div>

                        {/* Right Radio Check Circle */}
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? styles.check
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Real-time AI Course Match Preview Bar (Refined from user's screenshot) */}
                <div className="mt-5 sm:mt-6 p-3 sm:p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E2DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#EAF5FA] text-[#2484B8] shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-slate-600 font-medium">
                      {language === 'KR' ? '실시간 취향 매칭:' : 'Live Course Match:'}
                    </span>
                    <strong className="font-black text-[#1B6B96] underline decoration-[#9CCAE3] underline-offset-4">
                      {matchedResult.course.title[language]}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#EFF4E6] text-[#5B7332] border border-[#D4E3BD]">
                      {matchedResult.matchPercent}% {language === 'KR' ? '일치' : 'Match'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowResult(true)}
                      className="text-xs font-bold text-[#2484B8] hover:text-[#1B6B96] underline underline-offset-2 cursor-pointer"
                    >
                      {language === 'KR' ? '바로 보기' : 'View Now'}
                    </button>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center gap-2.5 w-full sm:w-auto">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-3.5 rounded-full bg-[#F4F2EE] hover:bg-[#E8E4DC] text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{language === 'KR' ? '이전' : 'Back'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 sm:flex-initial min-w-[240px] sm:min-w-[270px] px-7 py-3.5 sm:py-4 rounded-full bg-[#1B6B96] hover:bg-[#145578] text-white font-extrabold text-sm sm:text-base shadow-md shadow-[#1B6B96]/20 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <span>
                        {currentStep < 3
                          ? language === 'KR'
                            ? `다음 질문으로 (0${currentStep + 1} / 03)`
                            : `Next Question (0${currentStep + 1} / 03)`
                          : language === 'KR'
                          ? '나만의 무장애 울산 코스 결과 보기'
                          : 'View My Step-Free Ulsan Course'}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowResult(true)}
                    className="text-xs font-semibold text-slate-500 hover:text-[#11161B] underline underline-offset-4 cursor-pointer transition-colors"
                  >
                    {language === 'KR'
                      ? '질문 건너뛰고 추천 코스 상세 동선 바로 보기 >'
                      : 'Skip questions and view detailed step-free itinerary >'}
                  </button>
                </div>
              </div>
            ) : (
              /* =====================================================
                  PERSONALIZED COURSE CURATION RESULT VIEW
                 ===================================================== */
              <div className="bg-white border-2 border-[#2484B8]/40 rounded-3xl p-5 sm:p-7 md:p-8 text-left shadow-[0_16px_48px_rgba(36,132,184,0.10)] animate-fade-in space-y-6">
                {/* Top Result Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E5E2DC]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#2484B8] text-white text-xs font-extrabold tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {language === 'KR'
                          ? `취향 ${matchedResult.matchPercent}% 일치 추천 코스`
                          : `${matchedResult.matchPercent}% Personalized Match`}
                      </span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#EFF4E6] text-[#5B7332] border border-[#D4E3BD] text-xs font-mono font-bold">
                      {matchedResult.course.SteplessGrade}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FDF1EB] text-[#C85A24] text-xs font-bold">
                      {matchedResult.course.themeTag[language]}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F2EE] hover:bg-[#E6E2D8] text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'KR' ? '질문 다시 선택하기' : 'Retake Quiz'}</span>
                  </button>
                </div>

                {/* Course Title & Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#11161B] tracking-tight leading-snug break-keep">
                    {matchedResult.course.title[language]}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 leading-relaxed break-keep">
                    {matchedResult.course.subtitle[language]}
                  </p>

                  {/* Hashtag Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {matchedResult.course.tags[language].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F3F8FB] text-[#1B6B96] border border-[#DCEBF4]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3 Core Accessibility Spec Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E2DC]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B6B96]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{language === 'KR' ? '소요시간 & 경사도' : 'Duration & Slope'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-[#11161B] mt-1">
                      {matchedResult.course.duration[language]}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {matchedResult.course.totalSlope[language]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E2DC]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B7332]">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>{language === 'KR' ? '전동급속충전 & 대여' : 'Charger & Rental'}</span>
                    </div>
                    <p className="text-xs font-bold text-[#11161B] mt-1 leading-snug break-keep">
                      {matchedResult.course.chargerInfo[language]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E2DC]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#C85A24]">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{language === 'KR' ? '무장애 화장실 & 수유실' : 'Restroom & Nursing'}</span>
                    </div>
                    <p className="text-xs font-bold text-[#11161B] mt-1 leading-snug break-keep">
                      {matchedResult.course.restroomInfo[language]}
                    </p>
                  </div>
                </div>

                {/* Baby Whale Ulli's Local Field Tip */}
                <div className="p-4 rounded-2xl bg-[#EAF5FA]/80 border border-[#C5E3F2] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#C5E3F2] flex items-center justify-center shrink-0">
                    <UlsanIllustration type="whale-sea" className="w-7 h-7" />
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed text-[#11161B]">
                    <span className="font-extrabold text-[#1B6B96] block mb-0.5">
                      {language === 'KR'
                        ? '🐋 울산 아기고래 울리의 무장애 현장 꿀팁'
                        : '🐋 Baby Whale Ulli’s On-Site Accessibility Tip'}
                    </span>
                    <span className="text-slate-700 break-keep">
                      {matchedResult.course.whaleTip[language]}
                    </span>
                  </div>
                </div>

                {/* Step-by-Step Stepless Course Timeline */}
                <div className="space-y-3">
                  <h3 className="text-sm sm:text-base font-black text-[#11161B] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2484B8]" />
                    <span>
                      {language === 'KR'
                        ? '단차 걱정 없는 상세 이동 동선 (STEPLESS TIMELINE)'
                        : 'Step-Free Detailed Route Timeline'}
                    </span>
                  </h3>

                  <div className="space-y-2.5">
                    {matchedResult.course.stops.map((stop) => (
                      <div
                        key={stop.order}
                        className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E2DC] hover:border-[#2484B8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#1B6B96] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            0{stop.order}
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-extrabold text-sm sm:text-base text-[#11161B]">
                                {stop.name[language]}
                              </h4>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EFF4E6] text-[#5B7332]">
                                {stop.highlightBadge[language]}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed break-keep">
                              {stop.desc[language]}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] font-semibold text-slate-500">
                              <span>📍 {stop.area[language]}</span>
                              <span>•</span>
                              <span className="text-[#1B6B96]">🛞 {stop.surfaceSpec[language]}</span>
                              <span>•</span>
                              <span className="text-[#5B7332]">🛗 {stop.elevatorOrRamp[language]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Switch Between Other Ulsan Courses Inside Result */}
                <div className="pt-3 border-t border-[#E5E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">
                    {language === 'KR'
                      ? '다른 울산 무장애 추천 코스도 바로 확인해 보세요:'
                      : 'Compare other curated step-free Ulsan courses:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(ULSAN_COURSES).map((c) => {
                      const isCurrent = c.id === matchedResult.course.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectCourseDirectly(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-[#11161B] text-white'
                              : 'bg-[#F4F2EE] hover:bg-[#E5E2DC] text-slate-700'
                          }`}
                        >
                          {c.themeTag[language]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 3 Core Verification Pillars Below Quiz (Refined from user's initial design) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6B853E]" />
                {language === 'KR' ? '계단 0개 전 구역 실측 완료' : 'Zero-Stair Field Verified'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2484B8]" />
                {language === 'KR' ? '전동휠체어 급속충전 인프라 연계' : 'Rapid Wheelchair Chargers'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E57A44]" />
                {language === 'KR' ? '울산 부름콜 & 동해선 1동선 환승' : 'Donghae Line & Bureum-Call Link'}
              </span>
            </div>
          </section>

          {/* =========================================================
              2. STEPLESS UNIVERSE BRIDGE: DONGHAE LINE & ULSAN HUBS
                 (Matches Stepless in Busan's Compact Station Grid!)
             ========================================================= */}
          <section
            id="donghae-bridge"
            className="space-y-4 pt-8 border-t border-[#E5E2DC] text-left"
            aria-label="동해선 및 울산 무장애 교통 거점"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E2DC] pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#1B6B96] uppercase">
                  <span>BUSAN ↔ ULSAN STEPLESS LINK</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-[#11161B] tracking-tight mt-0.5">
                  {language === 'KR'
                    ? '동해선·KTX 울산 무장애 역 & 엘리베이터 출구'
                    : 'Donghae Line & KTX Ulsan Accessible Station Hubs'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 break-keep">
                  {language === 'KR'
                    ? 'Stepless in Busan(부전·벡스코·기장역)에서 계단 없이 바로 이어지는 울산 관문 역을 눌러보세요.'
                    : 'Tap any Ulsan gateway station connected directly from Busan via the step-free Donghae Line.'}
                </p>
              </div>

              {/* Filter Chips (Identical style to Stepless in Busan) */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0" role="tablist">
                {[
                  { id: 'ALL' as const, label: language === 'KR' ? '전체 거점 (6)' : 'All Hubs (6)' },
                  {
                    id: '동해선' as const,
                    label: language === 'KR' ? '동해선 광역전철' : 'Donghae Line',
                    dot: 'bg-[#003DA5]',
                  },
                  {
                    id: 'KTX·SRT' as const,
                    label: 'KTX · SRT',
                    dot: 'bg-[#E57A44]',
                  },
                  {
                    id: '무장애환승' as const,
                    label: language === 'KR' ? '울산 부름콜' : 'Bureum-Call',
                    dot: 'bg-[#8EA85E]',
                  },
                ].map((tab) => {
                  const isActive = hubFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setHubFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#11161B] text-white shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Station Buttons Grid (Same compact tactile station cards as Stepless in Busan) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 pt-1">
              {filteredHubs.map((hub) => {
                const isSelected = hub.id === selectedHubId;
                const badgeBg =
                  hub.line === '동해선'
                    ? 'bg-[#003DA5]'
                    : hub.line === 'KTX·SRT'
                    ? 'bg-[#E57A44]'
                    : 'bg-[#6B853E]';
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHubId(hub.id)}
                    className={`group flex flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all duration-150 cursor-pointer text-center min-h-[76px] border ${
                      isSelected
                        ? 'bg-[#F0F8FC] border-[#2484B8] shadow-xs -translate-y-0.5'
                        : 'bg-white hover:bg-[#F9F9F7] border-slate-200/90 hover:border-[#2484B8]'
                    }`}
                  >
                    <div
                      className={`font-extrabold text-xs sm:text-sm tracking-tight transition-colors ${
                        isSelected
                          ? 'text-[#1B6B96]'
                          : 'text-[#11161B] group-hover:text-[#2484B8]'
                      }`}
                    >
                      {hub.name[language]}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${badgeBg}`}
                      >
                        {hub.line}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F4F2EE] text-slate-600">
                        {hub.travelTimeFromBusan[language]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Station Hub Detail Banner */}
            <div className="bg-white border border-[#DCEBF4] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#003DA5] text-white text-xs font-bold">
                    {activeHub.line}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#11161B]">
                    {activeHub.name[language]} {language === 'KR' ? '무장애 1동선 가이드' : 'Step-Free Hub Guide'}
                  </h3>
                  <span className="text-xs font-bold text-[#5B7332] bg-[#EFF4E6] px-2 py-0.5 rounded-full">
                    {activeHub.slopeGrade[language]}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1B6B96]">🛗 엘리베이터:</span>
                    <span>{activeHub.elevatorExits[language]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#5B7332]">⚡ 급속충전·배차:</span>
                    <span>{activeHub.chargerLocation[language]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#C85A24]">🐋 직결 명소:</span>
                    <span>{activeHub.connectedSpots[language]}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activeHub.id === 'ktx-ulsan') {
                    handleSelectCourseDirectly('petroglyph-gourmet');
                  } else if (activeHub.id === 'seosaeng') {
                    handleSelectCourseDirectly('bridge-ganjeolgot');
                  } else if (activeHub.id === 'bureum-call') {
                    handleSelectCourseDirectly('whale-daewangam');
                  } else {
                    handleSelectCourseDirectly('taehwagang-bamboo');
                  }
                }}
                className="self-start md:self-center shrink-0 px-4 py-2.5 rounded-xl bg-[#EAF5FA] hover:bg-[#2484B8] text-[#1B6B96] hover:text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>
                  {language === 'KR' ? '이 역 출발 추천코스 보기' : 'View Course from Here'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* =========================================================
              3. 4 PASTEL ACTIVITY EXPLORATION CARDS (울산에서 어디로 떠나볼까?)
                 (Mirrors Stepless in Busan's 4 Pastel Cards)
             ========================================================= */}
          <section
            id="ulsan-themes"
            className="space-y-4 pt-8 border-t border-[#E5E2DC] text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-bold tracking-widest text-[#6B853E] uppercase">
                  {language === 'KR' ? '화사한 울산 4대 무장애 테마' : '4 RADIANT ULSAN THEMES'}
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#11161B] tracking-tight mt-0.5">
                  {language === 'KR' ? '울산에서 어디로 떠나볼까?' : 'Where Shall We Go in Ulsan?'}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'KR'
                  ? '카드를 누르면 해당 테마의 단차 0cm 상세 코스가 상단에 즉시 열립니다.'
                  : 'Click any card to open its detailed zero-step itinerary above.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 pt-1">
              {ulsanThemeCards.map((card) => (
                <button
                  key={card.courseId}
                  type="button"
                  onClick={() => handleSelectCourseDirectly(card.courseId)}
                  className={`${card.bg} border ${card.border} rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group text-left shadow-2xs`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                  >
                    <UlsanIllustration type={card.illustration} className="w-9 h-9" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-extrabold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                      {card.tag}
                    </span>
                    <h3 className="font-black text-[#11161B] text-sm sm:text-[15px] leading-tight break-keep">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 break-keep">
                      {card.desc}
                    </p>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-slate-400 group-hover:text-[#11161B] group-hover:bg-white shadow-2xs transition-all shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* =========================================================
              4. ALL CURATED COURSES COMPARISON GRID
             ========================================================= */}
          <section
            id="all-courses"
            className="space-y-4 pt-8 border-t border-[#E5E2DC] text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h2 className="text-lg sm:text-2xl font-black text-[#11161B] tracking-tight">
                {language === 'KR'
                  ? '한눈에 비교하는 울산 대표 무장애 코스 4선'
                  : 'Compare All 4 Verified Step-Free Ulsan Courses'}
              </h2>
              <span className="text-xs text-slate-500">
                {language === 'KR'
                  ? '울산관광재단 & 한국관광공사 열린관광지 실측 데이터 기준'
                  : 'Based on Ulsan Tourism & KTO Open Tourism field measurements'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {Object.values(ULSAN_COURSES).map((course) => {
                const isSelected = showResult && matchedResult.course.id === course.id;
                return (
                  <div
                    key={course.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#F3F8FB] border-[#2484B8] shadow-sm'
                        : 'bg-white border-[#E5E2DC] hover:border-[#9CCAE3]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#EAF5FA] text-[#1B6B96]">
                          {course.themeTag[language]}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#6B853E]">
                          {course.SteplessGrade}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#11161B] break-keep">
                        {course.title[language]}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed break-keep">
                        {course.subtitle[language]}
                      </p>

                      {/* Mini Stop Chain */}
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        {course.stops.map((st, idx) => (
                          <React.Fragment key={st.order}>
                            <span className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5E2DC]">
                              {st.order}. {st.name[language].split('(')[0].trim()}
                            </span>
                            {idx < course.stops.length - 1 && (
                              <span className="text-slate-400">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E2DC]/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        🛞 {course.totalSlope[language]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectCourseDirectly(course.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#11161B] hover:bg-[#2484B8] text-white text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
                      >
                        <span>
                          {language === 'KR' ? '상세 동선 열기' : 'Open Route'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =========================================================
              5. COMPACT 3-PILLAR ULSAN BARRIER-FREE CORE GUIDE
                 (Matches Stepless in Busan's 3-Pillar Guide)
             ========================================================= */}
          <section
            id="transit-guide"
            className="space-y-3 pt-8 border-t border-[#E5E2DC] text-left"
            aria-label="울산 무장애 여행 핵심 가이드"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h2 className="text-base sm:text-lg font-black text-[#11161B] tracking-tight">
                {language === 'KR'
                  ? '계단 없는 울산여행 핵심 포인트 3가지'
                  : '3 Key Pillars for Step-Free Ulsan Travel'}
              </h2>
              <p className="text-xs text-slate-500 break-keep">
                {language === 'KR'
                  ? '휠체어·유모차·어르신 여행객을 위한 울산 무장애 이동 및 교통약자 지원 기준입니다.'
                  : 'Essential step-free transit and accessibility standards for Ulsan travelers.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
              {/* Pillar 1 */}
              <div className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#2484B8] rounded-2xl p-4 transition-all space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#EAF5FA] text-[#1B6B96] shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#11161B]">
                    {language === 'KR'
                      ? '울산 교통약자 콜택시 부름콜 & 무장애 관광택시'
                      : 'Ulsan Bureum-Call & Accessible Tour Taxi'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-keep">
                  {language === 'KR'
                    ? '휠체어 리프트·슬로프가 장착된 울산 부름콜(052-292-8253)은 타 지역 거주 장애인·교통약자도 사전 등록 후 태화강역·KTX울산역에서 주요 관광지까지 저렴하게 이용할 수 있습니다.'
                    : 'Ulsan Bureum-Call (052-292-8253) offers wheelchair-ramp vans connecting KTX Ulsan & Taehwagang Station to all major spots.'}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#6B853E] rounded-2xl p-4 transition-all space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#EFF4E6] text-[#5B7332] shrink-0">
                    <Accessibility className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#11161B]">
                    {language === 'KR'
                      ? '열린관광지 무장애 데크 & 전동관람차'
                      : 'Open-Tourism Boardwalks & Electric Trams'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-keep">
                  {language === 'KR'
                    ? '태화강 국가정원 휠체어 리프트 전동관람차, 대왕암공원 단차 0cm 해안 우든데크, 장생포 모노레일 전용 엘리베이터 등 바퀴 진동과 계단 걱정을 없앤 검증 동선만 안내합니다.'
                    : 'Enjoy wheelchair-lift garden trams at Taehwagang, zero-step wooden decks at Daewangam, and elevator-linked monorails at Jangsaengpo.'}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white hover:bg-[#FAF9F6] border border-[#E5E2DC] hover:border-[#E57A44] rounded-2xl p-4 transition-all space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#FDF1EB] text-[#C85A24] shrink-0">
                    <Train className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#11161B]">
                    {language === 'KR'
                      ? '부산 ↔ 울산 동해선 무장애 광역환승'
                      : 'Busan ↔ Ulsan Step-Free Donghae Line'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-keep">
                  {language === 'KR'
                    ? '부산 부전·벡스코·오시리아·기장역에서 동해선 전철을 타면 휠체어 전용석과 승강장 안전발판을 통해 울산 서생·망양·태화강역까지 계단 하나 없이 여행이 이어집니다.'
                    : 'Travel seamlessly from Busan’s BEXCO & Gijang stations to Ulsan’s Taehwagang Station on the step-free Donghae Line.'}
                </p>
              </div>
            </div>
          </section>

          {/* =========================================================
              6. VERIFICATION BANNER (Identical DNA to Stepless in Busan)
             ========================================================= */}
          <section id="about-stepless" className="pt-4 border-t border-[#E5E2DC] text-left">
            <div className="bg-[#FAF8F5] border border-[#EBE8E2] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DC] text-[#2484B8] shadow-2xs shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#11161B]">
                    {language === 'KR'
                      ? '스텝리스 울산 (Stepless in Ulsan) 공공데이터 및 현장 실측 안내'
                      : 'Stepless in Ulsan Open Data & On-Site Verification'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 break-keep">
                    {language === 'KR'
                      ? '울산문화관광재단, 한국관광공사 배리어프리 열린관광지 데이터 및 현장 경사도 실사를 기반으로 정기 검증됩니다.'
                      : 'Regularly verified with Ulsan Tourism Organization open data and on-site slope inspections.'}
                  </p>
                </div>
              </div>

              <a
                href="https://stepless.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="self-end sm:self-center shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-[#EFF4E6] border border-[#D4E3BD] text-[#5B7332] font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer no-underline"
              >
                <span>
                  {language === 'KR' ? 'Stepless in Busan 보러가기' : 'Visit Stepless in Busan'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        </main>
      </div>

      {/* =========================================================
          FOOTER (Matches Stepless in Busan's Rounded-Top Warm Footer)
         ========================================================= */}
      <footer className="mt-4 bg-[#EAF5FA]/55 backdrop-blur-md text-slate-700 text-left border-t border-[#C5E3F2] pt-7 pb-12 rounded-t-[2rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-left leading-[0.92]">
                <span className="text-base font-black font-heading tracking-tight text-slate-900">
                  STEPLESS
                </span>
                <span className="text-base font-black font-heading tracking-tight text-[#2484B8]">
                  IN ULSAN
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#5B7332] border border-[#D4E3BD]">
                STEPLESS SERIES #02
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm font-medium break-keep">
              {language === 'KR'
                ? '부산에서 동해선으로 이어지는 계단 없는 여행 세계관. 푸른 고래의 바다와 초록빛 국가정원, 반짝이는 울산의 밤을 누구나 턱 없이 누릴 수 있도록 안내합니다.'
                : 'Continuing the step-free travel universe from Busan to Ulsan’s whale coast, bamboo gardens, and luminous bridges.'}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'KR' ? '울산 무장애 지원 & 연계 기관' : 'Accessibility Partners'}
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-600">
              <li>
                <a
                  href="https://tour.ulsan.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2484B8] hover:underline inline-flex items-center gap-1"
                >
                  <span>울산관광 (Ulsan Tourism)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.whalecity.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2484B8] hover:underline inline-flex items-center gap-1"
                >
                  <span>장생포 고래문화특구</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="font-semibold text-[#1B6B96]">
                  📞 울산 교통약자 부름콜: 052-292-8253
                </span>
              </li>
              <li>
                <a
                  href="https://stepless.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#5B7332] hover:underline inline-flex items-center gap-1"
                >
                  <span>자매 서비스: Stepless in Busan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#2484B8]" />
              <span>{language === 'KR' ? '운영자 정보 및 제보 문의' : 'Operator & Inquiries'}</span>
            </h4>
            <p className="text-xs text-slate-700">
              운영: <strong className="text-slate-900">스텝레스 (Stepless)</strong> · 총괄:{' '}
              <strong className="text-slate-900">플로레르 (Floreur)</strong>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed break-keep">
              {language === 'KR'
                ? '울산 무장애 데크 보수 정보나 새로운 턱 없는 맛집·카페 제보는 언제든 환영합니다.'
                : 'Contact us anytime to report ramp updates or recommend step-free local spots in Ulsan.'}
            </p>
            <div className="pt-1">
              <a
                href="mailto:floreur88@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F8FB] text-slate-800 font-mono text-xs font-bold transition-colors border border-[#C5E3F2] shadow-2xs no-underline"
              >
                <span>📧 floreur88@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#C5E3F2]/80 mt-6 pt-4 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-semibold">
            © 2026 floreur (스텝레스 · Stepless in Ulsan). All rights reserved.
          </span>
          <span className="text-[11px]">
            Data verified with Ulsan Tourism Organization &amp; Korea Open Tourism.
          </span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Matching Stepless in Busan) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex justify-around items-center"
        aria-label="Mobile Bottom Navigation"
      >
        {[
          { id: 'curation-hero', label: language === 'KR' ? '맞춤질문' : 'Quiz', icon: Sparkles },
          { id: 'donghae-bridge', label: language === 'KR' ? '동해선·역' : 'Stations', icon: Train },
          { id: 'ulsan-themes', label: language === 'KR' ? '4대테마' : 'Themes', icon: Compass },
          { id: 'all-courses', label: language === 'KR' ? '전체코스' : 'Courses', icon: Waves },
          { id: 'transit-guide', label: language === 'KR' ? '부름콜팁' : 'Transit', icon: Info },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#2484B8] font-black' : 'text-slate-400 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EAF5FA] text-[#2484B8]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
