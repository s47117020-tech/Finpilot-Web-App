import { useCountUp } from '@/hooks/useCountUp';
import { WrappedSummary } from '@/services/api';
import { Sparkles } from 'lucide-react';

export function IntroCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  return (
    <div className="space-y-6">
      <div className={`transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Sparkles className="w-12 h-12 text-[#a0f1bd] mx-auto mb-4 animate-pulse" />
      </div>
      <div className={`transition-all duration-1000 delay-400 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-sm font-medium tracking-widest uppercase">Your Year in Finance</p>
      </div>
      <div className={`transition-all duration-1000 delay-600 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-5xl md:text-7xl font-bold text-white font-display">
          {data.year}
        </h1>
      </div>
      <div className={`transition-all duration-1000 delay-800 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-xl text-white/80">
          Hey <span className="text-[#a0f1bd] font-semibold">{data.user_name}</span>! 👋
        </p>
        <p className="text-white/60 mt-2">Let&apos;s see how your finances shaped up this year</p>
      </div>
      <div className={`transition-all duration-1000 delay-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-white/40 text-sm mt-8 animate-bounce">Tap to continue →</p>
      </div>
    </div>
  );
}

export function IncomeExpenseCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const income = useCountUp(data.total_income, 2000, isActive);
  const expenses = useCountUp(data.total_expenses, 2000, isActive);
  const savings = useCountUp(data.total_savings, 2500, isActive);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">The Big Picture</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Your Money Flow 💸</h2>
      </div>

      <div className="space-y-6">
        {/* Income */}
        <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-white/60 text-sm">Total Income</p>
            <p className="text-3xl font-bold text-[#a0f1bd] font-display">{formatCurrency(income)}</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#a0f1bd] rounded-full transition-all duration-2000 ease-out"
                style={{ width: isActive ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className={`transition-all duration-700 delay-600 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-white/60 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold text-red-400 font-display">{formatCurrency(expenses)}</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full transition-all duration-2000 ease-out"
                style={{
                  width: isActive ? `${Math.min((data.total_expenses / data.total_income) * 100, 100)}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className={`transition-all duration-700 delay-800 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-[#a0f1bd]/10 rounded-2xl p-5 border border-[#a0f1bd]/30">
            <p className="text-[#a0f1bd]/80 text-sm">Total Saved 🎉</p>
            <p className={`text-3xl font-bold font-display ${data.total_savings >= 0 ? 'text-[#a0f1bd]' : 'text-red-400'}`}>
              {formatCurrency(savings)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopCategoriesCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const categoryColors = ['#a0f1bd', '#f59e0b', '#3b82f6', '#ec4899', '#10b981'];

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Where It Went</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Top Spending 🏆</h2>
      </div>

      <div className="space-y-4">
        {data.top_categories.slice(0, 5).map((cat, i) => (
          <div
            key={cat.category}
            className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
            style={{ transitionDelay: `${300 + i * 150}ms` }}
          >
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="text-left">
                    <p className="text-white font-semibold capitalize">{cat.category}</p>
                    <p className="text-white/50 text-xs">{formatCurrency(cat.amount)}</p>
                  </div>
                </div>
                <span className="text-lg font-bold font-display" style={{ color: categoryColors[i] || '#a0f1bd' }}>
                  {cat.percentage}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1500 ease-out"
                  style={{
                    width: isActive ? `${cat.percentage}%` : '0%',
                    backgroundColor: categoryColors[i] || '#a0f1bd',
                    transitionDelay: `${500 + i * 150}ms`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionStatsCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const totalTxns = useCountUp(data.total_transactions, 1500, isActive);
  const avgMonthly = useCountUp(data.average_monthly_spending, 2000, isActive);
  const dailyAvg = useCountUp(data.daily_average_spend, 2000, isActive);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">By The Numbers</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Your Stats 📊</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`bg-white/5 rounded-2xl p-5 border border-white/10 col-span-2 transition-all duration-700 delay-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <p className="text-white/60 text-sm">Total Transactions</p>
          <p className="text-4xl font-bold text-[#a0f1bd] font-display">{totalTxns}</p>
          <p className="text-white/40 text-xs mt-1">~{data.transactions_per_month} per month</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Avg Monthly</p>
          <p className="text-lg font-bold text-white font-display">{formatCurrency(avgMonthly)}</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Daily Average</p>
          <p className="text-lg font-bold text-white font-display">{formatCurrency(dailyAvg)}</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-900 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Busiest Day</p>
          <p className="text-lg font-bold text-[#f59e0b] font-display">{data.top_spending_day_of_week}</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-1100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Consistent In</p>
          <p className="text-lg font-bold text-[#a0f1bd] font-display capitalize">{data.most_consistent_category}</p>
        </div>
      </div>
    </div>
  );
}

export function BiggestTransactionCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const bigTxn = data.biggest_transaction;
  const amount = useCountUp(bigTxn?.amount || 0, 2000, isActive);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  if (!bigTxn) return <p className="text-white/60">No notable transactions this year</p>;

  return (
    <div className="space-y-8 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Biggest Splurge</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">That One Purchase 😱</h2>
      </div>

      <div className={`transition-all duration-1000 delay-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/10 to-transparent" />
          <div className="relative z-10">
            <p className="text-6xl md:text-7xl font-bold text-[#f59e0b] font-display mb-4">
              {formatCurrency(amount)}
            </p>
            <p className="text-white/80 text-lg capitalize">{bigTxn.category}</p>
            {bigTxn.description && (
              <p className="text-white/50 text-sm mt-1">{bigTxn.description}</p>
            )}
            <p className="text-white/40 text-xs mt-3">{bigTxn.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MonthlyTimelineCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const maxExpense = Math.max(...data.monthly_data.map((m) => m.expenses), 1);

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getMonthLabel = (monthStr: string) => {
    const parts = monthStr.split('-');
    const idx = parseInt(parts[1], 10) - 1;
    return MONTH_NAMES[idx] || monthStr;
  };

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Month By Month</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Spending Timeline 📈</h2>
      </div>

      <div className="flex items-end gap-1.5 h-48 px-2">
        {data.monthly_data.map((m, i) => {
          const height = (m.expenses / maxExpense) * 100;
          const isHighest = m.month === data.highest_spending_month;
          return (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${isHighest ? 'bg-[#f59e0b]' : 'bg-[#a0f1bd]/60'}`}
                style={{
                  height: isActive ? `${Math.max(height, 4)}%` : '0%',
                  transitionDelay: `${300 + i * 80}ms`,
                }}
              />
              <span className="text-[10px] text-white/50">{getMonthLabel(m.month)}</span>
            </div>
          );
        })}
      </div>

      <div className={`transition-all duration-700 delay-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f59e0b]/10 rounded-xl p-3 border border-[#f59e0b]/20 text-left">
            <p className="text-[#f59e0b]/80 text-xs">Peak Spending</p>
            <p className="text-[#f59e0b] font-bold font-display">{getMonthLabel(data.highest_spending_month)}</p>
          </div>
          <div className="bg-[#a0f1bd]/10 rounded-xl p-3 border border-[#a0f1bd]/20 text-left">
            <p className="text-[#a0f1bd]/80 text-xs">Best Savings</p>
            <p className="text-[#a0f1bd] font-bold font-display">{getMonthLabel(data.most_savings_month)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoalsCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const gs = data.goals_summary;
  const completedCount = useCountUp(gs.completed, 1500, isActive);
  const totalSaved = useCountUp(gs.total_saved, 2000, isActive);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const completionRate = gs.total_goals > 0 ? (gs.completed / gs.total_goals) * 100 : 0;

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Goals Review</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">
          {gs.completed > 0 ? 'Dream Chaser! 🎯' : 'Setting The Stage 🎯'}
        </h2>
      </div>

      {gs.total_goals > 0 ? (
        <>
          <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-5xl font-bold text-[#a0f1bd] font-display">{completedCount}</span>
                <span className="text-white/50 text-xl">/ {gs.total_goals}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">goals completed</p>
              
              {/* Circular progress indicator */}
              <div className="mt-4 flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="#a0f1bd" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={isActive ? `${2 * Math.PI * 42 * (1 - completionRate / 100)}` : `${2 * Math.PI * 42}`}
                      className="transition-all duration-2000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white font-display">{Math.round(completionRate)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-[#a0f1bd]/10 rounded-xl p-4 border border-[#a0f1bd]/20">
              <p className="text-[#a0f1bd]/80 text-sm">Total Saved Towards Goals</p>
              <p className="text-2xl font-bold text-[#a0f1bd] font-display">{formatCurrency(totalSaved)}</p>
              <p className="text-white/40 text-xs mt-1">of {formatCurrency(gs.total_target)} target</p>
            </div>
          </div>
        </>
      ) : (
        <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <p className="text-6xl mb-4">🌱</p>
            <p className="text-white/80 text-lg">No goals set this year</p>
            <p className="text-white/50 text-sm mt-2">
              {new Date().getFullYear() + 1} could be your year! Start setting savings goals to track your progress.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FunFactsCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Did You Know?</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Fun Facts 🎉</h2>
      </div>

      <div className="space-y-4">
        {data.fun_comparisons.map((fact, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${400 + i * 200}ms` }}
          >
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-left">
              <p className="text-white/90 text-base leading-relaxed">{fact}</p>
            </div>
          </div>
        ))}

        {data.total_savings > 0 && (
          <div className={`transition-all duration-700 delay-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-[#a0f1bd]/10 rounded-xl p-5 border border-[#a0f1bd]/30">
              <p className="text-[#a0f1bd] text-base leading-relaxed">
                🌟 Great job saving this year! You&apos;re building a strong financial future.
              </p>
            </div>
          </div>
        )}

        {data.total_savings < 0 && (
          <div className={`transition-all duration-700 delay-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-[#f59e0b]/10 rounded-xl p-5 border border-[#f59e0b]/30">
              <p className="text-[#f59e0b] text-base leading-relaxed">
                💡 Tip: Try the 50/30/20 rule next year — 50% needs, 30% wants, 20% savings!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function OutroCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const getMessage = () => {
    if (data.total_savings >= data.total_income * 0.2) {
      return { emoji: '🏆', text: 'You\'re a Savings Champion!', sub: 'You saved over 20% of your income. Incredible discipline!' };
    }
    if (data.total_savings > 0) {
      return { emoji: '⭐', text: 'On The Right Track!', sub: 'Every rupee saved counts. Keep building your future!' };
    }
    return { emoji: '💪', text: 'A Fresh Start Awaits!', sub: 'Every new year is a chance to reset. You\'ve got this!' };
  };

  const msg = getMessage();

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <span className="text-7xl block">{msg.emoji}</span>
      </div>
      <div className={`transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display">{msg.text}</h2>
        <p className="text-white/60 mt-2">{msg.sub}</p>
      </div>

      <div className={`transition-all duration-700 delay-800 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Income</span>
            <span className="text-[#a0f1bd] font-bold font-display">{formatCurrency(data.total_income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Spent</span>
            <span className="text-red-400 font-bold font-display">{formatCurrency(data.total_expenses)}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between">
            <span className="text-white/80 text-sm font-medium">Net Savings</span>
            <span className={`font-bold font-display ${data.total_savings >= 0 ? 'text-[#a0f1bd]' : 'text-red-400'}`}>
              {formatCurrency(data.total_savings)}
            </span>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-700 delay-1100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-white/60 text-sm">
          Here&apos;s to an even better {data.year + 1}! 🚀
        </p>
        <p className="text-[#a0f1bd]/60 text-xs mt-4">
          Made with ❤️ by FinPilot
        </p>
      </div>
    </div>
  );
}
