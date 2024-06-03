import json
import os

data_folder = "data"
file_paths = []

for root, dirs, files in os.walk(data_folder):
  for file in files:
    file_path = os.path.abspath(os.path.join(root, file))
    file_paths.append(file_path)

json_data = json.dumps({"file_paths": file_paths}, indent=4)

with open("file_paths.json", "w") as json_file:
  json_file.write(json_data)
