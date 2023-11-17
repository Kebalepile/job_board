import json

# CREATE json file
def GovPageJsonFile(data: dict):
    path = f'database/public/{data["title"]}.json'
    with open(path,"w") as f:
        json.dump(data,f, indent=4)
        print(f"data saved to: {path}")

# Create javaScript file
def GovPageFile(data: dict):
    
    path = f'database/public/{data["title"]}.js'
    with open(path,"w") as f:
        f.write(f'export const data = {json.dumps(data, indent=4)}')
        print(f"data saved to: {path}")

