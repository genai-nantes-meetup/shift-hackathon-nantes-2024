from PIL import ImageGrab
import time
import base64
import requests
import json
from google.cloud import storage
import os
import subprocess
from requests.utils import quote

def getFileName():
    t = time.localtime()
    timestamp = time.strftime('%b-%d-%Y_%H%M%S', t)
    return "screenshot_" + timestamp + '.png'
    
def feedModel(save_path='screenshot.png'):
    while (True):
        screen_filename = getFileName()
        screenshot = ImageGrab.grab()
        screenshot.save(screen_filename)
        time.sleep(5)
        # option1: send base64 image to API
        sendScreenShot(screen_filename)
        # option 2: upload the image to Google Storage
        # url = upload_image(screen_filename, screen_filename)

def sendScreenShot(filename):
    with open(filename, 'rb') as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

    # Create the JSON payload
    payload = json.dumps({'image': encoded_image})

    # URL of the endpoint
    url = 'https://europe-west1-shift-aihack-nantes24-2.cloudfunctions.net/log_activity'

    # Set the headers
    headers = {
        'Content-Type': 'application/json'
    }

    # Send the POST request
    response = requests.post(url, headers=headers, data=payload, timeout=70)

    # Print the response
    print(response.status_code)
    print(response.text)

    res = requests.get('https://europe-west1-shift-aihack-nantes24-2.cloudfunctions.net/get_activities')
    print(response.status_code)

def getDestinationBlob(destination_blob_name):
    destination_blob_name = 'screenshot/' + destination_blob_name
    return quote(destination_blob_name, safe='')

def upload_image(file_path, destination_blob_name):
    accesskey = subprocess.getoutput(['gcloud', 'auth', 'print-access-token'])
    bucket_name = 'gcf-sources-538945831678-europe-west1'
    encoded_destination_blob_name = getDestinationBlob(destination_blob_name)
    
    url = f"https://storage.googleapis.com/upload/storage/v1/b/{bucket_name}/o?uploadType=media&name={encoded_destination_blob_name}"
    headers = {
        "Authorization": f"Bearer {accesskey}",
        "Content-Type": "image/png"
    }

    with open(file_path, 'rb') as image_file:
        response = requests.post(url, headers=headers, data=image_file)
    data = json.loads(response.text)
    if response.status_code == 200:
        print("File uploaded successfully.")
        return data.get('mediaLink')
    
    else:
        print(f"Failed to upload file. Status code: {response.status_code}")
        print(response.text)
   
feedModel()
