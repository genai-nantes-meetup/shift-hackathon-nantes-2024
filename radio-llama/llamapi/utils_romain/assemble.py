import os
import ffmpeg
import json

# data = [
#     {'name': 'Diamond Eyes (Boom-Lay Boom-Lay Boom)', 'artist': 'Shinedown', 'url': 'https://open.spotify.com/track/1PLMK1ui86iHHG3FM1N7ue'},
#     {'name': 'One Last Breath', 'artist': 'Creed', 'url': 'https://open.spotify.com/track/42T2QQv3xgBlpQxaSP7lnK'},
#     {'name': 'Love No More', 'artist': 'Loud Luxury', 'url': 'https://open.spotify.com/track/15fZrZhdK0g1BS9sDeW6sD'},
#     {'name': 'You Give Love A Bad Name', 'artist': 'Bon Jovi', 'url': 'https://open.spotify.com/track/3KYiA4vq6RPO1dE2XROXd8'},
#     #{'name': 'Relationship (feat. Future)', 'artist': 'Young Thug', 'url': 'https://open.spotify.com/track/25oOaleife6E2MIKmFkPvg'}
# ]

# with open("random-secret-game.json", 'r') as f:
#     data = json.load(f)

# Dossier contenant les vidéos de jeu
#video_folder = "assets/"

# Liste des noms de fichiers vidéo de jeu
#video_files = sorted([f for f in os.listdir(video_folder) if f.endswith(".mp4")])

fade_duration = 1

def formatName(fileName):
    # remove extension and replace _ by space
    return fileName.split(".")[0].replace("_", " ")

def generate_radio(ordered_files, output_file):
    # Création de la liste des vidéos de jeu concaténées
    segments = []

    for idx, file_path in enumerate(ordered_files):
        if idx % 2 == 0:
            # here we have animator
            input_asset_audio = (
                ffmpeg.input(file_path)
                .audio
            )
        else:
            # here we have music
            input_asset_audio = (
                ffmpeg.input(file_path, t=10)
                .audio
            )
            # input_asset_audio.fade_out(fade_duration)
            # input_asset_audio.fade_out(fade_duration)

        # input_voice_tracking = (
        #     ffmpeg.input("voice-tracking.wav")
        #     .audio
        # )

        segments.append(input_asset_audio)
        #segments.append(input_voice_tracking)

    ffmpeg.concat(*segments, v=0, a=1).output(output_file).run(overwrite_output=True)
    

# for video in data:
#     name = f"{video['artist']} - {video['name']}.mp3"
#     path = os.path.join(video_folder, name)

#     input_asset_audio = (
#         ffmpeg.input(path, r=25)
#         .audio
#     )

#     input_voice_tracking = (
#         ffmpeg.input("voice-tracking.wav")
#         .audio
#     )

#     segments.append(input_asset_audio)
#     segments.append(input_voice_tracking)


# ffmpeg.concat(*segments, v=0, a=1).output("output.mp4").run(overwrite_output=True)