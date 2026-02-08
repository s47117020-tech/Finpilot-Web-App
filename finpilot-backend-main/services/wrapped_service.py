from database import db
from collections import defaultdict
from datetime import datetime

CATEGORY_ICONS = {
    "rent": "🏠",
    "food": "🍕",
    "transport": "🚗",
    "entertainment": "🎬",
    "misc": "📦",
    "savings": "💰",
    "shopping": "🛍️",
    "health": "💊",
    "utilities": "⚡",
}

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Fun comparison templates
FUN_COMPARISONS = [
    ("food", 250, "cups of chai ☕"),
    ("food", 500, "plates of biryani 🍛"),
    ("transport", 30, "auto rides 🛺"),
    ("transport", 150, "Uber rides 🚖"),
    ("entertainment", 200, "movie tickets 🎬"),
    ("entertainment", 500, "Netflix subscriptions 📺"),
    ("shopping", 1000, "new t-shirts 👕"),
    ("rent", 5000, "coworking day passes 💼"),
]


def get_wrapped_summary(user_id: str, year: int):
    """Generate a year-end wrapped summary for a user."""
    year_str = str(year)

    # ── 1. Fetch all transactions for the year ──
    txns_ref = db.collection("transactions").where("user_id", "==", user_id).stream()
    
    all_transactions = []
    for doc in txns_ref:
        t = doc.to_dict()
        t["id"] = doc.id
        if t.get("date", "").startswith(year_str):
            all_transactions.append(t)

    # ── 2. Fetch all salaries for the year ──
    salaries_ref = db.collection("salaries").where("user_id", "==", user_id).stream()
    monthly_income = {}
    for doc in salaries_ref:
        s = doc.to_dict()
        month = s.get("month", "")
        if month.startswith(year_str):
            monthly_income[month] = s.get("amount", 0)

    # ── 3. Fetch goals ──
    goals_ref = db.collection("savings_goals").where("user_id", "==", user_id).stream()
    goals = []
    for doc in goals_ref:
        g = doc.to_dict()
        g["id"] = doc.id
        goals.append(g)

    # ── 4. Fetch user name ──
    users_ref = db.collection("users").where("user_id", "==", user_id).limit(1).stream()
    user_name = "User"
    for doc in users_ref:
        u = doc.to_dict()
        user_name = u.get("name", "User")

    # ── 5. Process transactions ──
    total_income = 0.0
    total_expenses = 0.0
    category_spending = defaultdict(float)
    category_count = defaultdict(int)
    monthly_expenses = defaultdict(float)
    monthly_savings_map = defaultdict(float)
    day_of_week_spending = defaultdict(float)
    biggest_txn = None

    for t in all_transactions:
        amount = t.get("amount", 0)
        txn_type = t.get("type", "")
        category = t.get("category", "misc")
        date_str = t.get("date", "")

        if txn_type == "credit":
            total_income += amount
        elif txn_type == "debit":
            total_expenses += amount
            category_spending[category] += amount
            category_count[category] += 1
            
            # Month grouping
            month_key = date_str[:7] if len(date_str) >= 7 else "unknown"
            monthly_expenses[month_key] += amount

            # Day of week
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                day_of_week_spending[dt.weekday()] += amount
            except (ValueError, TypeError):
                pass
            
            # Biggest transaction
            if biggest_txn is None or amount > biggest_txn["amount"]:
                biggest_txn = {
                    "amount": amount,
                    "category": category,
                    "date": date_str,
                    "description": t.get("description", ""),
                }

    # Salary-based income
    salary_total = sum(monthly_income.values())
    if salary_total > total_income:
        total_income = salary_total

    total_savings = total_income - total_expenses

    # ── 6. Build top categories ──
    sorted_cats = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
    top_categories = []
    for cat, amt in sorted_cats[:5]:
        pct = (amt / total_expenses * 100) if total_expenses > 0 else 0
        top_categories.append({
            "category": cat,
            "amount": round(amt, 2),
            "percentage": round(pct, 1),
            "icon": CATEGORY_ICONS.get(cat, "📊"),
        })

    # Most consistent category (most transactions)
    most_consistent = max(category_count, key=category_count.get) if category_count else "none"

    # ── 7. Monthly data ──
    all_months = set()
    for m in monthly_expenses:
        all_months.add(m)
    for m in monthly_income:
        all_months.add(m)
    
    monthly_data = []
    for month in sorted(all_months):
        inc = monthly_income.get(month, 0)
        exp = monthly_expenses.get(month, 0)
        monthly_data.append({
            "month": month,
            "income": round(inc, 2),
            "expenses": round(exp, 2),
            "savings": round(inc - exp, 2),
        })

    # Highest spending month
    highest_spending_month = max(monthly_expenses, key=monthly_expenses.get) if monthly_expenses else f"{year}-01"
    
    # Most savings month
    monthly_savings_calc = {}
    for m in all_months:
        inc = monthly_income.get(m, 0)
        exp = monthly_expenses.get(m, 0)
        monthly_savings_calc[m] = inc - exp
    most_savings_month = max(monthly_savings_calc, key=monthly_savings_calc.get) if monthly_savings_calc else f"{year}-01"

    # ── 8. Goals summary ──
    total_goals = len(goals)
    completed_goals = 0
    total_saved_goals = 0.0
    total_target_goals = 0.0
    for g in goals:
        target = g.get("target_amount", 0)
        current = g.get("current_amount", 0)
        total_target_goals += target
        total_saved_goals += current
        if current >= target and target > 0:
            completed_goals += 1

    goals_summary = {
        "total_goals": total_goals,
        "completed": completed_goals,
        "missed": total_goals - completed_goals,
        "total_saved": round(total_saved_goals, 2),
        "total_target": round(total_target_goals, 2),
    }

    # ── 9. Fun stats ──
    num_months = len(monthly_data) if monthly_data else 1
    avg_monthly = total_expenses / num_months if num_months > 0 else 0
    daily_avg = total_expenses / 365
    txn_per_month = len(all_transactions) / num_months if num_months > 0 else 0

    # Top spending day of week
    top_day_idx = max(day_of_week_spending, key=day_of_week_spending.get) if day_of_week_spending else 0
    top_spending_day = DAY_NAMES[top_day_idx] if isinstance(top_day_idx, int) and top_day_idx < 7 else "Monday"

    # Fun comparisons
    fun_comparisons = []
    for comp_cat, unit_price, label in FUN_COMPARISONS:
        if comp_cat in category_spending and category_spending[comp_cat] > 0:
            count = int(category_spending[comp_cat] / unit_price)
            if count > 0:
                fun_comparisons.append(
                    f"You spent the equivalent of {count} {label} on {comp_cat}!"
                )
    
    if not fun_comparisons:
        if total_expenses > 0:
            chai_count = int(total_expenses / 250)
            fun_comparisons.append(f"Your total spending equals {chai_count} cups of chai ☕")

    return {
        "year": year,
        "user_name": user_name,
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "total_savings": round(total_savings, 2),
        "net_worth_change": round(total_savings, 2),
        "total_transactions": len(all_transactions),
        "average_monthly_spending": round(avg_monthly, 2),
        "top_categories": top_categories,
        "most_consistent_category": most_consistent,
        "biggest_transaction": biggest_txn,
        "monthly_data": monthly_data,
        "highest_spending_month": highest_spending_month,
        "most_savings_month": most_savings_month,
        "goals_summary": goals_summary,
        "daily_average_spend": round(daily_avg, 2),
        "transactions_per_month": round(txn_per_month, 1),
        "top_spending_day_of_week": top_spending_day,
        "fun_comparisons": fun_comparisons,
    }
