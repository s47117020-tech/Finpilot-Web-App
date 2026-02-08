import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api, WrappedSummary } from '@/services/api';
import { WrappedCard } from '@/components/wrapped/WrappedCard';
import { ConfettiCanvas } from '@/components/wrapped/ConfettiCanvas';
import { shareWrapped } from '@/components/wrapped/shareUtils';
import {
  IntroCard,
  IncomeExpenseCard,
  TopCategoriesCard,
  TransactionStatsCard,
  BiggestTransactionCard,
  MonthlyTimelineCard,
  GoalsCard,
  FunFactsCard,
  OutroCard,
} from '@/components/wrapped/WrappedSlides';
import { ChevronLeft, ChevronRight, Home, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CARD_GRADIENTS = [
  'bg-gradient-to-br from-[#0f2009] via-[#1a3a12] to-[#0d1f08]',       // Intro
  'bg-gradient-to-br from-[#1a2e14] via-[#2e4f21] to-[#1a3a1a]',       // Income/Expense
  'bg-gradient-to-br from-[#162010] via-[#243d1a] to-[#0f1a0b]',       // Top Categories
  'bg-gradient-to-br from-[#1a2a20] via-[#1e3a2a] to-[#0f2018]',       // Stats
  'bg-gradient-to-br from-[#2a1f0a] via-[#3a2e12] to-[#1a150a]',       // Biggest Transaction (warm)
  'bg-gradient-to-br from-[#0f2020] via-[#1a3535] to-[#0d1a1a]',       // Timeline
  'bg-gradient-to-br from-[#1a1a2e] via-[#212150] to-[#0f0f20]',       // Goals (deep)
  'bg-gradient-to-br from-[#2a1a2a] via-[#3a1e3a] to-[#1a0f1a]',       // Fun Facts
  'bg-gradient-to-br from-[#0f2009] via-[#2e4f21] to-[#1a3a12]',       // Outro
];

export default function Wrapped() {
  const { year: yearParam } = useParams<{ year?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear() - 1;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [showConfetti, setShowConfetti] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['wrapped', user?.user_id, year],
    queryFn: () => api.wrapped.getSummary(user!.user_id, year),
    enabled: !!user?.user_id,
    staleTime: 5 * 60 * 1000,
  });

  const totalSlides = 9;

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection('right');
      setCurrentSlide((s) => s + 1);
    }
  }, [currentSlide]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection('left');
      setCurrentSlide((s) => s - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'Escape') {
        navigate('/dashboard');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, navigate]);

  // Touch/swipe support
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  // Confetti on last slide
  useEffect(() => {
    if (currentSlide === totalSlides - 1 && data && data.total_savings > 0) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [currentSlide, data]);

  // Confetti on goals slide if goals completed
  useEffect(() => {
    if (currentSlide === 6 && data && data.goals_summary.completed > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, data]);

  const handleShare = async () => {
    if (!data) return;
    await shareWrapped(data);
    toast.success('Stats copied to clipboard! 📋');
  };

  const getCardDirection = (slideIndex: number): 'enter-left' | 'enter-right' | 'active' | 'exit-left' | 'exit-right' => {
    if (slideIndex === currentSlide) return 'active';
    if (slideIndex < currentSlide) return direction === 'right' ? 'exit-left' : 'exit-right';
    return direction === 'right' ? 'enter-right' : 'enter-left';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#a0f1bd]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#a0f1bd] animate-spin" />
          </div>
          <p className="text-[#a0f1bd]/80 text-lg font-display">Crunching your numbers...</p>
          <p className="text-white/40 text-sm">Preparing your {year} Budget Wrapped</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a1a0a] flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <span className="text-6xl block">📊</span>
          <h2 className="text-2xl font-bold text-white font-display">No Data Yet</h2>
          <p className="text-white/60">
            {error
              ? 'We couldn\'t load your year-end summary. Please try again.'
              : `No financial data found for ${year}. Start tracking your finances to see your wrapped!`}
          </p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-[#2e4f21] hover:bg-[#3a6b2a] text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const slides = [
    <IntroCard data={data} isActive={currentSlide === 0} />,
    <IncomeExpenseCard data={data} isActive={currentSlide === 1} />,
    <TopCategoriesCard data={data} isActive={currentSlide === 2} />,
    <TransactionStatsCard data={data} isActive={currentSlide === 3} />,
    <BiggestTransactionCard data={data} isActive={currentSlide === 4} />,
    <MonthlyTimelineCard data={data} isActive={currentSlide === 5} />,
    <GoalsCard data={data} isActive={currentSlide === 6} />,
    <FunFactsCard data={data} isActive={currentSlide === 7} />,
    <OutroCard data={data} isActive={currentSlide === 8} />,
  ];

  return (
    <div className="fixed inset-0 bg-[#0a1a0a] overflow-hidden select-none">
      <ConfettiCanvas active={showConfetti} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 'right' : 'left');
                setCurrentSlide(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-6 h-2 bg-[#a0f1bd]'
                  : i < currentSlide
                  ? 'w-2 h-2 bg-[#a0f1bd]/50'
                  : 'w-2 h-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Slide area */}
      <div className="relative w-full h-full" onClick={goNext}>
        {slides.map((slide, i) => (
          <WrappedCard
            key={i}
            isActive={i === currentSlide}
            direction={getCardDirection(i)}
            gradient={CARD_GRADIENTS[i]}
          >
            {slide}
          </WrappedCard>
        ))}
      </div>

      {/* Navigation arrows (desktop) */}
      <div className="hidden md:flex absolute bottom-8 left-0 right-0 z-40 items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          disabled={currentSlide === 0}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-20 w-12 h-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <span className="text-white/40 text-sm font-display min-w-[60px] text-center">
          {currentSlide + 1} / {totalSlides}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          disabled={currentSlide === totalSlides - 1}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-20 w-12 h-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
