import requests 
import random
import time

API_BASE_URL = "http://127.0.0.1:8000"

def get_equipment_list():
    response = requests.get(f"{API_BASE_URL}/equipment")
    return response.json()

def generate_next_value(current_value, min_expected, max_expected):
    drift = random.uniform(-2,2)
    new_value = current_value + drift

    if random.random() < 0.1:
        new_value = random.uniform(max_expected * 1.1, max_expected * 1.3)

    return round(new_value, 2)

def simulate():
    equipment_list = get_equipment_list()

    if not equipment_list:
        print("No equipment found. Add some equipment first")
        return
    
    current_values = {
        eq["id"]: (eq["min_expected"] + eq["max_expected"]) / 2 for eq in equipment_list

    }

    print(f"Simulating readings for {len(equipment_list)} piece(s) of equipment. Press Ctrl+C to stop.")

    while True:
        for eq in equipment_list:
            eq_id = eq["id"]
            new_value = generate_next_value(
                current_values[eq_id], eq["min_expected"],eq["max_expected"]
            )
            current_values[eq_id] = new_value

            requests.post(
                f"{API_BASE_URL}/equipment/{eq_id}/readings",
                json={"value": new_value, "unit":"psi"},
            )
            print(f"{eq['name']}:{new_value}")

        time.sleep(3)

if __name__ == "__main__":
    simulate()