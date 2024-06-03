# AVOTEMPS client
Simple script for capturing screen shot during daily activities. It sends the base64 image to an API that perform image to text.
You have two options:
* sending base64 to api
* uploading local image to cloud storage   

Install pillow to grab screen shot
```
pip install pip install pillow
```
## Sending base64 to api
Nothing more needed.

## Uploading local image to cloud storage
This implementation has been made in an hackathon context where you cannot create API KEY for cloud storage, so you have to send an acces token. 
Install gcloud to get an access token.
Create your bucket on the storage.

## Launch the client
To start capturing screenshot:
```
python screenshot.py
```