import json

from dependency_injector.wiring import inject
from fastapi import APIRouter, Depends, status
from starlette.datastructures import URL

from llamapi.domain.track import Track

router = APIRouter()


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    response_model=int,
)
@inject
def upload_playlist(
        playlist_url: URL,
):
    tracklist = []
    with open('filename.json', 'r') as file:
        playlist = json.load(file)
        for track in playlist:
            tracklist.append(
                Track(
                    track_name=track["track_name"],
                    authors=track["authors"],
                    album=track["album"],
                    label=track["label"],
                    first_release_date=track["first_release_date"],
                    disambiguation=track["disambiguation"],
                )
            )
            track.get_music_brainz_metatadata()

    return len(tracklist)
