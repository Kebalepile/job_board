import json
import os

def GovPageJsonFile(data: dict, path='database/public/govpage.json'):
   
    with open(path, "w") as f:
        json.dump([data], f, indent=4)
        print(f"Data written to: {path}")

# Create JSON file
def GovPageFile(data: dict, file_name):
    path = f'database/public/{file_name}.json'
    
    with open(path, "w") as f:
        f.write(json.dumps(data, indent=4))
        print(f"Data written to: {path}")
