import json
from openai import OpenAI
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
load_dotenv()
key=os.getenv("KEY")
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=key,
)

def generate_habits(transactions):
    # --- Local Pre-processing ---
    total_spent = sum(t['amount'] for t in transactions)
    categories = {}
    for t in transactions:
        categories[t['category']] = categories.get(t['category'], 0) + t['amount']
    
    # Sort categories by highest spend
    sorted_cats = sorted(categories.items(), key=lambda x: x[1], reverse=True)
    
    # --- AI Narrative ---
    # We ask the AI to turn this data into a 'habit description' for our main predictor
    trend_prompt = f"""
    Summarize these Indian student spending habits for an AI budgeter. 
    Total spent: ₹{total_spent}. 
    Category breakdown: {sorted_cats}.
    Top expenses: {[t['description'] for t in transactions[:5]]}.
    Keep it under 50 words. Focus on frequency and lifestyle.
    """
    
    response = client.chat.completions.create(
        model="openrouter/free", 
        messages=[{"role": "user", "content": trend_prompt}]
    )
    return response.choices[0].message.content

def generate_trends(transactions):
    # Filter for the last 7 days (Mocking based on your 2026-01-31 end date)
    end_date = datetime.strptime("2026-01-31", "%Y-%m-%d")
    start_date = end_date - timedelta(days=7)
    
    weekly_txns = [t for t in transactions if datetime.strptime(t['date'], "%Y-%m-%d") >= start_date]
    
    total_week = sum(t['amount'] for t in weekly_txns)
    # Highlight specific 'impulse' categories like Food and Entertainment
    impulse_spend = sum(t['amount'] for t in weekly_txns if t['category'] in ['food', 'entertainment', 'shopping'])
    
    trend_prompt = f"""
    You are a budget coach. Analyze this week's spending:
    Total: ₹{total_week}
    Impulse Spend (Food/Fun/Shop): ₹{impulse_spend}
    Transaction Count: {len(weekly_txns)}    
    Summarize the 'Weekly Velocity'. If they spent more than ₹3000 on impulse, be extra harsh.
    """
    
    response = client.chat.completions.create(
        model="openrouter/free",
        messages=[{"role": "user", "content": trend_prompt}]
    )
    return response.choices[0].message.content
if __name__ == "__main__":
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

    previous_habits_summary = generate_habits(transactions_month)
    print(f"Generated Habit Summary: {previous_habits_summary}")