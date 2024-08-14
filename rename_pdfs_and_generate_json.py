import os
import json


def rename_pdfs_and_create_json(directory="./database/pdfs"):
    # List all PDF files in the directory
    pdf_files = [f for f in os.listdir(directory) if f.endswith('.pdf')]

    # Sort the files to ensure consistent renaming
    pdf_files.sort()

    # Initialize the list for JSON data
    pdf_urls = []

    # Rename each PDF file
    for count, filename in enumerate(pdf_files, start=1):
        new_name = f"{count}.pdf"
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_name)

        os.rename(old_path, new_path)

        # Add the new path to the JSON list
        pdf_urls.append(f"/assets/pdfs/{new_name}")

    # Create the JSON file
    json_data = {"pdfUrls": pdf_urls}
    json_path = os.path.join(directory, "pdfUrls.json")

    with open(json_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    print(f"Renamed {len(pdf_files)} PDF files and created pdfUrls.json")

# # Define the directory containing the PDF files
# pdf_directory = "./database/pdfs"

# # Run the function
# rename_pdfs_and_create_json(pdf_directory)
