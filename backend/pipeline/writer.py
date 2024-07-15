import json
import os

def GovPageJsonFile(data: dict, path='database/public/govpage.json'):
   
    with open(path, "w") as f:
        json.dump([data], f, indent=4)
        print(f"Data written to: {path}")

# Create JavaScript file
def GovPageFile(data: dict, file_name):
    path = f'database/public/{file_name}.js'
    
    with open(path, "w") as f:
        f.write(f'export const data = {json.dumps(data, indent=4)}')
        print(f"Data written to: {path}")
