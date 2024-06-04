import requests
import urllib

api_url = "https://musicbrainz.org/ws/2/"

resources = [
    "area",
    "artist",
    "event",
    "genre",
    "instrument",
    "label",
    "place",
    "recording",
    "release",
    "release-group",
    "series",
    "work",
    "url"
]


def do_request(resource, query):
    params = {
        "query": "name:"+query,
        "fmt": "json"
    }
    url = api_url + resource + "?" + "&".join(f"{key}={value}" for key, value in params.items())
    print(url)
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code)
        return None
    

for resource in resources:
    print(do_request("artist", "WRLD - Skumfuk"))
    exit()