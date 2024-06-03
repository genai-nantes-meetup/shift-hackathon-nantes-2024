import os
import rumps
import base64
import time
import json
import requests
from PIL import ImageGrab


class TimeTrackerApp(rumps.App):
    def __init__(self):
        super(TimeTrackerApp, self).__init__('TT')
        self.icon = 'images/icon.png'
        self.isRunning = False
        self.menu = ["Running", "Settings"]

    @rumps.clicked('Running')
    def start(self, sender):
        sender.state = not sender.state
        self.isRunning = sender.state

    @rumps.clicked("Settings")
    def sets(self, _):
        rumps.alert("Develop during Shift - Gen AI Hackathon - Nantes 2024")

    def getFileName(self):
        t = time.localtime()
        timestamp = time.strftime('%b-%d-%Y_%H%M%S', t)
        return "/tmp/screenshot_" + timestamp + '.png'

    def sendScreenShot(self, filename):
        with open(filename, 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
        os.remove(filename)

        # Create the JSON payload
        payload = json.dumps({'image': encoded_image})

        # URL of the endpoint
        url = 'https://europe-west1-shift-aihack-nantes24-2.cloudfunctions.net/log_activity'

        # Set the headers
        headers = {
            'Content-Type': 'application/json'
        }

        # Send the POST request
        requests.post(url, headers=headers, data=payload, timeout=70)
        requests.get('https://europe-west1-shift-aihack-nantes24-2.cloudfunctions.net/get_activities')

    @rumps.timer(5)
    def process(self, _):
        if self.isRunning:
            screen_filename = self.getFileName()
            # Capture the screen
            screenshot = ImageGrab.grab()
            # Save the screenshot
            screenshot.save(screen_filename)
            self.sendScreenShot(screen_filename)


if __name__ == '__main__':
    app = TimeTrackerApp()
    app.run()