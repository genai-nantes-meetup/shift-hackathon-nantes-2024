import os
import requests

# Replace with your client ID and client secret
client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

# Set the headers for the request
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

# Set the payload for the request
data = {
    "grant_type": "client_credentials",
    "client_id": client_id,
    "client_secret": client_secret
}

# Make the request to obtain the access token
response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)


access_token = None

# Check if the request was successful
if response.status_code == 200:
    # Extract the access token from the response
    access_token = response.json()["access_token"]
    print(f"Access Token: {access_token}")
else:
    print("Failed to obtain access token")
    exit(1)



# Get recommendantion
spotify_url = "https://api.spotify.com/v1/recommendations"


def get_recommendations(genre):
    parameters = {
        "limit": 3,
        "seed_genres": genre, ## stringify list sperated by comma
    }
    # Make the request to the Spotify API
    response = requests.get(spotify_url, headers={"Authorization": f"Bearer {access_token}"}, params=parameters)

    recommendations = None
    # Check if the request was successful
    if response.status_code == 200:
        # Extract the recommendations from the response
        recommendations = response.json()
        # Process the recommendations as needed
        # ...
    else:
        print("Failed to retrieve recommendations")
        return None

    tracks = []
    # get data from recommendantions
    for track in recommendations["tracks"]:
        tracks.append({
            "name": track["name"],
            "artist": track["artists"][0]["name"],
            "url": track["external_urls"]["spotify"],
        })
    
    return tracks
