from dataclasses import dataclass

from fastapi.openapi.models import Schema


@dataclass(frozen=False)
class Track:
    track_name: str
    authors: str
    album: str
    label: str
    first_release_date: str
    disambiguation: str
