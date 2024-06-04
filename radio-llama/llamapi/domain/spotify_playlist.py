from typing import List

from llamapi.domain.track import Track


class SpotifyPlaylist:
    tracklist: List[Track]

    def __init__(self, url):
        self.url = url
