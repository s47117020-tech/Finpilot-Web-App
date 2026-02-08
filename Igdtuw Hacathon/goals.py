import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from trend_genration import generate_trends, generate_habits
# --- CONFIGURATION ---
load_dotenv()
key=os.getenv("KEY")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=key
)

class SmartSpendAI:
    def __init__(self):
        self.planner_file = "prompts/planner_prompt.json"
        self.recalc_file = "prompts/recalibrator_prompt.json"

    def _load_json_file(self, path):
        with open(path, "r") as f:
            return json.load(f)

    def generate_plan(self, user_profile, past_trends):
        """Phase 1: Initial Trend-Aware Planning"""
        config = self._load_json_file(self.planner_file)
        
        # Prepare Data
        user_data = {
            "income": user_profile['income'],
            "rent": user_profile['rent'],
            "essentials": user_profile['essentials'],
            "goals_json": json.dumps(user_profile['goals']),
            "trends_json": json.dumps(past_trends)
        }

        response = client.chat.completions.create(
            model="openrouter/free", # High-reliability auto-routing
            messages=[
                {"role": "system", "content": config["system_prompt"]},
                {"role": "user", "content": config["user_template"].format(**user_data)}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    def recalibrate(self, status, past_week_tx, habits):
        """
        Updated Phase 2: Analyzes week trends and habits 
        to determine the severity of the recalibration.
        """
        config = self._load_json_file(self.recalc_file)
        
        # 1. Self-generate habit insights from the past week
        habits = habits
        
        # 2. Prepare the payload
        recalc_payload = {
            "overage_amount": status['overage'],
            "days_left": status['days_left'],
            "budget_left": status['budget_left'],
            "cheat_count": status['cheat_count'],
            "goal_name": status['goal_name'],
            "past_week_json": json.dumps(past_week_tx),
            "habits_json": json.dumps(habits)
        }
        
        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {"role": "system", "content": config["system_prompt"]},
                {"role": "user", "content": config["user_template"].format(**recalc_payload)}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
# --- EXECUTION / TESTING ---
if __name__ == "__main__":
    ai = SmartSpendAI()

    # 1. MOCK DATA: Profile & Trends
    student_profile = {
        "income": 25000,
        "rent": 10000,
        "essentials": 7000,
        "goals": [
            {"name": "Badminton Racquet", "price": 6000, "months": 2},
            {"name": "Car Downpayment", "price": 150000, "months": 24}
        ]
    }
    # Full dataset of ~100 transactions
    transactions_month = [
    # --- WEEK 1 ---
    {"amount": 18000, "category": "rent", "date": "2026-01-01", "description": "Monthly Rent"},
    {"amount": 500, "category": "bills", "date": "2026-01-01", "description": "Internet Bill"},
    {"amount": 2500, "category": "food", "date": "2026-01-02", "description": "Grocery Haul - BigBasket"},
    {"amount": 199, "category": "entertainment", "date": "2026-01-02", "description": "Spotify Premium"},
    {"amount": 40, "category": "transport", "date": "2026-01-03", "description": "Metro Ticket"},
    {"amount": 350, "category": "food", "date": "2026-01-03", "description": "Coffee with Friends"},
    {"amount": 120, "category": "food", "date": "2026-01-04", "description": "Breakfast at Dhaba"},
    {"amount": 800, "category": "shopping", "date": "2026-01-04", "description": "Home Decor Items"},
    {"amount": 1200, "category": "bills", "date": "2026-01-05", "description": "Electricity Bill"},
    {"amount": 699, "category": "bills", "date": "2026-01-05", "description": "WiFi Bill"},
    {"amount": 85, "category": "food", "date": "2026-01-06", "description": "Chai & Samosa"},
    {"amount": 60, "category": "transport", "date": "2026-01-06", "description": "Auto Rickshaw"},
    {"amount": 150, "category": "transport", "date": "2026-01-07", "description": "Uber Auto"},
    {"amount": 450, "category": "food", "date": "2026-01-07", "description": "Lunch at Canteen"},
    
    # --- WEEK 2 ---
    {"amount": 2200, "category": "shopping", "date": "2026-01-08", "description": "Myntra Sale - Jeans"},
    {"amount": 120, "category": "transport", "date": "2026-01-08", "description": "Metro Card Recharge"},
    {"amount": 300, "category": "food", "date": "2026-01-09", "description": "Evening Snacks"},
    {"amount": 1500, "category": "medical", "date": "2026-01-09", "description": "Dental Checkup"},
    {"amount": 800, "category": "entertainment", "date": "2026-01-10", "description": "Movie Tickets (IMAX)"},
    {"amount": 500, "category": "food", "date": "2026-01-10", "description": "Popcorn & Snacks"},
    {"amount": 200, "category": "transport", "date": "2026-01-11", "description": "Uber to Mall"},
    {"amount": 3500, "category": "shopping", "date": "2026-01-11", "description": "New Sneakers"},
    {"amount": 60, "category": "food", "date": "2026-01-12", "description": "Evening Tea"},
    {"amount": 40, "category": "transport", "date": "2026-01-12", "description": "Bus Ticket"},
    {"amount": 1500, "category": "transport", "date": "2026-01-13", "description": "Petrol Refill"},
    {"amount": 1100, "category": "food", "date": "2026-01-14", "description": "Dinner Date"},
    
    # --- WEEK 3 ---
    {"amount": 50, "category": "food", "date": "2026-01-15", "description": "Chips & Coke"},
    {"amount": 999, "category": "education", "date": "2026-01-15", "description": "Udemy Course"},
    {"amount": 300, "category": "medical", "date": "2026-01-16", "description": "Medicine (Headache)"},
    {"amount": 200, "category": "transport", "date": "2026-01-16", "description": "Uber to Office"},
    {"amount": 90, "category": "food", "date": "2026-01-17", "description": "Maggi Point"},
    {"amount": 499, "category": "entertainment", "date": "2026-01-17", "description": "Netflix Subscription"},
    {"amount": 250, "category": "transport", "date": "2026-01-18", "description": "Rapido Bike"},
    {"amount": 1200, "category": "food", "date": "2026-01-18", "description": "Sunday Brunch"},
    {"amount": 150, "category": "food", "date": "2026-01-19", "description": "Burger King"},
    {"amount": 30, "category": "transport", "date": "2026-01-19", "description": "Shared Auto"},
    {"amount": 400, "category": "shopping", "date": "2026-01-20", "description": "Stationery Items"},
    {"amount": 120, "category": "food", "date": "2026-01-20", "description": "Momos"},
    {"amount": 2000, "category": "investment", "date": "2026-01-21", "description": "SIP Mutual Fund"},
    {"amount": 50, "category": "bills", "date": "2026-01-21", "description": "Mobile Prepaid Plan"},

    # --- WEEK 4 (The filler entries to hit 100) ---
    {"amount": 40, "category": "food", "date": "2026-01-22", "description": "Tea Break"},
    {"amount": 180, "category": "food", "date": "2026-01-22", "description": "Ice Cream"},
    {"amount": 100, "category": "transport", "date": "2026-01-23", "description": "Metro"},
    {"amount": 80, "category": "food", "date": "2026-01-23", "description": "Sandwich"},
    {"amount": 1500, "category": "shopping", "date": "2026-01-24", "description": "Gift for Mom"},
    {"amount": 300, "category": "food", "date": "2026-01-24", "description": "Pizza Slice"},
    {"amount": 200, "category": "transport", "date": "2026-01-25", "description": "Uber Night"},
    {"amount": 600, "category": "entertainment", "date": "2026-01-25", "description": "Bowling"},
    {"amount": 150, "category": "food", "date": "2026-01-26", "description": "Republic Day Sweets"},
    {"amount": 50, "category": "transport", "date": "2026-01-26", "description": "Rickshaw"},
    {"amount": 2000, "category": "bills", "date": "2026-01-27", "description": "Credit Card Payment"},
    {"amount": 120, "category": "food", "date": "2026-01-27", "description": "Dosa"},
    {"amount": 90, "category": "transport", "date": "2026-01-28", "description": "Metro"},
    {"amount": 450, "category": "food", "date": "2026-01-28", "description": "Lunch with Team"},
    {"amount": 300, "category": "medical", "date": "2026-01-29", "description": "Vitamins"},
    {"amount": 60, "category": "food", "date": "2026-01-29", "description": "Juice"},
    {"amount": 1200, "category": "food", "date": "2026-01-30", "description": "End of Month Party"},
    {"amount": 250, "category": "transport", "date": "2026-01-30", "description": "Cab Home"},
    {"amount": 500, "category": "shopping", "date": "2026-01-31", "description": "Books"},
    {"amount": 150, "category": "food", "date": "2026-01-31", "description": "Pastry"},

    # --- FILLERS (Small daily expenses to bulk up count) ---
    {"amount": 20, "category": "food", "date": "2026-01-05", "description": "Water Bottle"},
    {"amount": 30, "category": "food", "date": "2026-01-08", "description": "Chips"},
    {"amount": 50, "category": "transport", "date": "2026-01-10", "description": "Auto"},
    {"amount": 100, "category": "bills", "date": "2026-01-12", "description": "Phone Recharge"},
    {"amount": 25, "category": "food", "date": "2026-01-14", "description": "Candy"},
    {"amount": 200, "category": "entertainment", "date": "2026-01-16", "description": "Game Purchase"},
    {"amount": 80, "category": "food", "date": "2026-01-18", "description": "Fruit Juice"},
    {"amount": 40, "category": "transport", "date": "2026-01-20", "description": "Bus"},
    {"amount": 150, "category": "bills", "date": "2026-01-22", "description": "Subscription"},
    {"amount": 60, "category": "food", "date": "2026-01-24", "description": "Coffee"},
    {"amount": 90, "category": "transport", "date": "2026-01-26", "description": "Auto"},
    {"amount": 300, "category": "shopping", "date": "2026-01-28", "description": "T-shirt"},
    {"amount": 120, "category": "food", "date": "2026-01-29", "description": "Biryani"},
    {"amount": 50, "category": "bills", "date": "2026-01-30", "description": "Data Add-on"},
    {"amount": 10, "category": "charity", "date": "2026-01-31", "description": "Donation"},
    {"amount": 500, "category": "food", "date": "2026-01-15", "description": "Cake for friend"},
    {"amount": 200, "category": "transport", "date": "2026-01-04", "description": "Late night cab"},
    {"amount": 100, "category": "bills", "date": "2026-01-09", "description": "Newspaper bill"},
    {"amount": 70, "category": "food", "date": "2026-01-11", "description": "Street food"},
    {"amount": 800, "category": "shopping", "date": "2026-01-19", "description": "Shoes repair"},
    {"amount": 150, "category": "food", "date": "2026-01-25", "description": "Breakfast"},
    {"amount": 45, "category": "transport", "date": "2026-01-27", "description": "Metro"},
    {"amount": 30, "category": "food", "date": "2026-01-02", "description": "Chocolate"},
    {"amount": 600, "category": "medical", "date": "2026-01-13", "description": "Lab test"},
    {"amount": 250, "category": "entertainment", "date": "2026-01-21", "description": "Concert ticket advance"},
    {"amount": 110, "category": "food", "date": "2026-01-06", "description": "Patties & Coke"},
    {"amount": 900, "category": "bills", "date": "2026-01-29", "description": "Maid salary part"},
    {"amount": 100, "category": "transport", "date": "2026-01-30", "description": "Rapido"},
    {"amount": 55, "category": "food", "date": "2026-01-31", "description": "Lassi"}
    ]

    past_trends = generate_habits(transactions_month) # Simulate past spending trends for January
    weekly_trends = generate_trends(transactions_month[-7:]) # Last 7 transactions as weekly trend
    # 2. RUN PLANNER
    print("\n[STEP 1] Generating Trend-Aware Plan...")
    try:
        plan = ai.generate_plan(student_profile, past_trends)
        print(json.dumps(plan, indent=2))
        
        # Save the daily limit for the recalibration mock
        daily_limit = plan.get('daily_spending_limit', 150)
        discretionary_total = plan.get('monthly_allocation', {}).get('discretionary', 5000)

    except Exception as e:
        print(f"Planning Error: {e}")

    # 3. RUN RECALIBRATOR (User spends ₹500, limit was daily_limit)
    print("\n[STEP 2] User overspent by ₹500 today. Recalibrating...")
    
    mock_recalc_status = {
        "overage": 500,
        "days_left": 15,
        "budget_left": discretionary_total - 500,
        "cheat_count": 2, # Triggering Strict Mode
        "goal_name": "Badminton Racquet"
    }
    try:
        update = ai.recalibrate(mock_recalc_status,habits=past_trends, past_week_tx=weekly_trends)
        print(json.dumps(update, indent=2))
    except Exception as e:
        print(f"Recalibration Error: {e}")