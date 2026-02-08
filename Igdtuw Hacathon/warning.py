import json
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
key=os.getenv("KEY")
# Initialize the client pointing to OpenRouter
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=key,
)

def check_financial_health(habits, trend, balance):
    # 1. Load your structured prompt configuration
    with open('prompts/prompt_warn.json', 'r') as f:
        config = json.load(f)

    # 2. Format the user prompt with the transaction data
    formatted_user_prompt = config["user_template"].format(
        previous_spending_habits=habits,
        latest_transaction_trend=trend,
        current_bank_balance=balance
    )

    # 3. Call the model via OpenRouter
    response = client.chat.completions.create(
        model="openrouter/free", # High-reliability auto-routing
        messages=[
            {"role": "system", "content": config["system_prompt"]},
            {"role": "user", "content": formatted_user_prompt}
        ],
        response_format={ "type": "json_object" }
    )

    # 4. Parse and return the JSON response
    return json.loads(response.choices[0].message.content)
if __name__ == "__main__":
    # --- Example Usage ---
    student_data = {
        "habits": "Monthly budget of ₹8,000. Usually spends ₹2,500 on mess/food and ₹1,000 on travel.",
        "trend": "Spent ₹1,500 on a concert ticket and ₹400 on premium coffee in the last 24 hours.",
        "balance": 2100
    }

    result = check_financial_health(
        student_data["habits"], 
        student_data["trend"], 
        student_data["balance"]
    )

    print(f"Status: {result['status']}") # 1 (Danger)
    print(f"Warning: {result['reason']}")