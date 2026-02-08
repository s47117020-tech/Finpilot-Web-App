from pydantic import BaseModel
from typing import List, Optional, Dict


class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
    icon: str = ""


class MonthlyData(BaseModel):
    month: str  # "YYYY-MM"
    income: float
    expenses: float
    savings: float


class BiggestTransaction(BaseModel):
    amount: float
    category: str
    date: str
    description: str


class GoalSummary(BaseModel):
    total_goals: int
    completed: int
    missed: int
    total_saved: float
    total_target: float


class WrappedSummaryResponse(BaseModel):
    year: int
    user_name: str

    # Core financials
    total_income: float
    total_expenses: float
    total_savings: float
    net_worth_change: float

    # Transaction stats
    total_transactions: int
    average_monthly_spending: float

    # Category insights
    top_categories: List[CategoryBreakdown]
    most_consistent_category: str

    # Notable transactions
    biggest_transaction: Optional[BiggestTransaction]

    # Monthly breakdown
    monthly_data: List[MonthlyData]
    highest_spending_month: str
    most_savings_month: str

    # Goals
    goals_summary: GoalSummary

    # Fun stats
    daily_average_spend: float
    transactions_per_month: float
    top_spending_day_of_week: str
    fun_comparisons: List[str]
