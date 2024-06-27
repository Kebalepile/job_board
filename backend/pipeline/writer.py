import json
import os

def GovPageJsonFile(data: dict, path='database/public/govpage.json'):
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f, indent=4)

    with open(path, "r+") as f:
        file_data = json.load(f)
        file_data.append(data)
        f.seek(0)
        json.dump(file_data, f, indent=4)
        print(f"Data appended to: {path}")

# Create javaScript file
def GovPageFile(data: dict):
    
    path = f'database/public/{data["title"]}.js'
    with open(path,"w") as f:
        f.write(f'export const data = {json.dumps(data, indent=4)}')
        print(f"data saved to: {path}")

