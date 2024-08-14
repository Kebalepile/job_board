import os
import json


def rename_images_and_create_json(directory="./database/agency_icons"):
    # List all image files in the directory
    image_files = [f for f in os.listdir(
        directory) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Sort the files to ensure consistent renaming
    image_files.sort()

    # Initialize the list for JSON data
    image_urls = []

    # Rename each image file
    for count, filename in enumerate(image_files, start=1):
        file_extension = os.path.splitext(filename)[1]
        new_name = f"{count}{file_extension}"
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_name)

        os.rename(old_path, new_path)

        # Add the new path to the JSON list
        image_urls.append(f"/assets/agency_icons/{new_name}")

    # Create the JSON file
    json_data = {"imageUrls": image_urls}
    json_path = os.path.join(directory, "imageUrls.json")

    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Renamed {len(image_files)} image files and created imageUrls.json")


# # Define the directory containing the image files
# image_directory = "./database/agency_icons"

# # Run the function
# rename_images_and_create_json(image_directory)
