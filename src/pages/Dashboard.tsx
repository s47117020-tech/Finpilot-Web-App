import { useBudget } from '@/hooks/useBudget';
import { useAuth } from '@/contexts/AuthContext';
import { SalaryInput } from '@/components/dashboard/SalaryInput';
import { BudgetChart } from '@/components/dashboard/BudgetChart';
import { GoalsSection } from '@/components/dashboard/GoalsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DollarSign, PieChart, Target, LogOut, Wallet, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    salary,
    categories,
    transactions,
    goals,
    predictBudget,
    addTransaction,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    totalBudget,
    totalSpent,
    totalRemaining,
    isLoading,
  } = useBudget();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#1a1a1a] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#2e4f21]">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">FinPilot</h1>
                <p className="text-xs text-gray-300">Your Smart Budget Assistant</p>
              </div>
            </div>
            
            {salary > 0 && (
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-300">Monthly Budget</p>
                  <p className="font-display font-bold text-white">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="h-8 w-px bg-gray-600" />
                <div className="text-right">
                  <p className="text-xs text-gray-300">Remaining</p>
                  <p className="font-display font-bold text-[#a0f1bd]">{formatCurrency(totalRemaining)}</p>
                </div>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Budget Wrapped Banner */}
      <div
        className="bg-gradient-to-r from-[#2e4f21] via-[#1a3a12] to-[#2e4f21] border-b border-[#a0f1bd]/20 cursor-pointer hover:brightness-110 transition-all"
        onClick={() => navigate('/wrapped')}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-[#a0f1bd] animate-pulse" />
          <span className="text-sm text-white/90 font-medium">
            ✨ Your <span className="text-[#a0f1bd] font-bold">{new Date().getFullYear() - 1} Budget Wrapped</span> is ready!
          </span>
          <span className="text-xs text-[#a0f1bd]/80 hidden sm:inline">View your year in review →</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 bg-white">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold mb-2 text-[#2e4f21]">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-gray-600">
            {salary > 0 
              ? "Here's an overview of your budget and goals"
              : "Let's start by setting up your monthly budget"
            }
          </p>
        </div>

        {/* Tabs for different dashboards */}
        <Tabs defaultValue="salary" className="space-y-6">
          <TabsList className="bg-gray-100 border border-gray-200 p-1 h-auto">
            <TabsTrigger 
              value="salary" 
              className="data-[state=active]:bg-[#2e4f21] data-[state=active]:text-white font-medium px-6 py-3"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Salary & Budget
            </TabsTrigger>
            <TabsTrigger 
              value="management"
              className="data-[state=active]:bg-[#2e4f21] data-[state=active]:text-white font-medium px-6 py-3"
            >
              <PieChart className="w-4 h-4 mr-2" />
              Management
            </TabsTrigger>
            <TabsTrigger 
              value="goals"
              className="data-[state=active]:bg-[#2e4f21] data-[state=active]:text-white font-medium px-6 py-3"
            >
              <Target className="w-4 h-4 mr-2" />
              Goals
            </TabsTrigger>
          </TabsList>

          {/* Dashboard 1: Salary Input */}
          <TabsContent value="salary" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <SalaryInput 
                onPredictBudget={predictBudget}
                salary={salary}
                categories={categories}
              />
            </div>
          </TabsContent>

          {/* Dashboard 2: Budget Management */}
          <TabsContent value="management" className="animate-fade-in">
            <BudgetChart 
              categories={categories}
              transactions={transactions}
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              totalRemaining={totalRemaining}
              onAddTransaction={addTransaction}
            />
          </TabsContent>

          {/* Dashboard 3: Goals */}
          <TabsContent value="goals" className="animate-fade-in">
            <GoalsSection 
              goals={goals}
              onAddGoal={addGoal}
              onUpdateGoalProgress={updateGoalProgress}
              onDeleteGoal={deleteGoal}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
