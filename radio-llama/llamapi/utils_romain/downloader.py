import subprocess

#url = "https://music.youtube.com/watch?v=6-hRrKFkAQE"
spotify_url = "https://open.spotify.com/track/15ahYSiHAIMxAnujlXVtta"


#subprocess.call(["yt-dlp", url, "-o", f"{output_folder}/{name}.mp3", "-x", "--audio-format", "mp3"])

def download_tracks(tracks, output_folder):
  valid_tracks = []
  for track in tracks:
      spotify_url = track["url"]
      status = subprocess.call(["spotdl", spotify_url, "--output", f"{output_folder}" + "{title}"])
      
      if status == 0:
          track["path"] = f"{output_folder}{track['name']}.mp3"
          valid_tracks.append(track)

  return valid_tracks


# install yt-dlp: python3 -m pip install -U "yt-dlp[default]" 
# github yt-dlp pour plus d'infos: https://github.com/yt-dlp/yt-dlp
# globalement tu peux tout dl avec sauf Spotify. donc pour ça...

# install spotdl: pip install spotdl
# github spotdl: https://github.com/spotDL/spotify-downloader
# J'ai testé avec un son, output le folder et pas le fichier, a par ça semble fonctionner.
# a tester de DL des playlist.

# J'ai vite fais réfléchi au process complet qu'on peut viser pour la démo de demain
# 1. Creation de radio: On rentre nos préferences dans le Front 
# 2. On utilise l'api Spotify pour suggérer une Playlist de musique selon ces critères.
# 3. parmis les données, on retrouvera surement soit une url de playlist, soit une url par musique spotify.
# 4. Avec juste ça on peut enclencher un download de la 20ene de son (environ 1h)
# 5. Pour chaque musique, check la metadata proposée par spotify, sinon venir taper sur music-brainz (enrich-asset.py)
# 6. Avec ces metadata, on peut customiser un prompt / langchain qui prend en input deux metadata de musique, et sort un texte d'animateur pour une transition.
# 7. On envoit ce texte dans ElevenLabs, et on récupère le fichier mp3 de la voix.
# 8. On assemble le tout dans l'ordre, puis on stock ça sur un bucket S3 (clever apparament)
# 9. Enjoy :)

