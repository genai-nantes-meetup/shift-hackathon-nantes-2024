from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import threading
import time
import pyaudio
import wave
import os
from dotenv import load_dotenv
from io import BytesIO
import requests

from utils import processing



app = FastAPI()

# Ajout du middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permettre toutes les origines, à ajuster selon vos besoins
    allow_credentials=True,
    allow_methods=["*"],  # Permettre toutes les méthodes HTTP
    allow_headers=["*"],  # Permettre tous les en-têtes
)

DEBUG = False

# Paramètres de l'enregistrement audio
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1024

# Durée de l'enregistrement avant la transcription
RECORD_SECONDS = 15
if DEBUG:
    RECORD_SECONDS = 5

# Contexte pour aider la transcription
CONTEXT_PROMPT = "Enregistrement d une partie de jeu de role de type Dongeon et Dragons."
CUSTOM_VOCABULARY = ["MJ", "prompt", "contexte"]

class Transcriptor:
    def __init__(self, context_prompt=CONTEXT_PROMPT, custom_vocabulary=CUSTOM_VOCABULARY):
        # Initialisation de PyAudio
        self.audio = pyaudio.PyAudio()

        # Contexte pour aider la transcription
        self.context_prompt = context_prompt
        self.custom_vocabulary = custom_vocabulary

        # Charger le fichier .env
        load_dotenv()

        # Variable de classe contenant la transcription complète
        self.transcription = ""
        # Variable de classe contenant la dernière transcription
        self.last_transcription = ""
        # Variable de classe permettant de savoir si l'enregistrement est actif
        self.active = False

        # Variable de classe avec les threads en cours
        self.threads = []

    def get_transcription(self):
        return self.transcription

    def get_last_transcription(self):
        return self.last_transcription

    # Fonction pour enregistrer un segment audio et le fournir en sortie
    def __record_segment(self):
        stream = self.audio.open(format=FORMAT, channels=CHANNELS,
                                 rate=RATE, input=True,
                                 frames_per_buffer=CHUNK)
        frames = []

        for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)
            # Ajout d'un arrêt en cas de is_active passé à False
            if not self.active:
                break

        # Création d'un fichier WAV en mémoire
        output = BytesIO()
        wf = wave.open(output, 'wb')
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(self.audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))
        wf.close()

        stream.stop_stream()
        stream.close()

        # Repositionner le curseur au début du fichier BytesIO
        output.seek(0)
        
        return output

    def start(self):
        def transcribe_thread(audio_segment):
            # Ajout du thread dans la liste des threads en cours
            self.threads.append(threading.current_thread())

            transcription = self.__transcribe(audio_segment)
            self.transcription += transcription
            self.last_transcription = transcription
            if DEBUG:
                print("DEBUG ----" + transcription)
                processing.ProcessChunk(input_string=transcription)

            # Suppression du thread de la liste des threads en cours
            self.threads.remove(threading.current_thread())

        def main_thread():
            # Ajout du thread dans la liste des threads en cours
            self.threads.append(threading.current_thread())

            while self.active:
                conversation = self.__record_segment()
                threading.Thread(target=transcribe_thread, args=(conversation,)).start()
            
            # Suppression du thread de la liste des threads en cours
            self.threads.remove(threading.current_thread())

        self.active = True
        threading.Thread(target=main_thread, args=()).start()

    def stop(self):
        # Arrêt de l'enregistrement
        self.active = False

        # Attente de la fin des threads en cours
        while len(self.threads) > 0:
            time.sleep(1)

    def __make_request(self, url, headers, method="GET", data=None, files=None):
        try:
            if method == "POST":
                response = requests.post(url, headers=headers, json=data, files=files)
            else:
                response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de la requête : {e}")
            return None

    def transcribe_from_file(self, file_path):
        with open(file_path, "rb") as audio_file:
            audio_content = audio_file.read()
            return self.__transcribe(audio_content)

    def __transcribe(self, audio_content):
        headers = {
            "x-gladia-key": os.getenv("GLADIA_API_KEY"),
            "accept": "application/json",
        }

        files = [("audio", ("conversation.wav", audio_content, "audio/wav"))]

        upload_response = self.__make_request(
            "https://api.gladia.io/v2/upload/", headers, "POST", files=files
        )
        if not upload_response:
            return "Erreur lors de l'upload de l'audio."

        audio_url = upload_response.get("audio_url")
        if not audio_url:
            return "Erreur : URL de l'audio non trouvée."

        data = {
            "audio_url": audio_url,
            "context_prompt": self.context_prompt,
            "custom_vocabulary": self.custom_vocabulary,
            "diarization": True,
            "diarization_config": {
                "number_of_speakers": 3,
                "min_speakers": 1,
                "max_speakers": 4
                },
            }

        headers["Content-Type"] = "application/json"

        post_response = self.__make_request(
            "https://api.gladia.io/v2/transcription/", headers, "POST", data=data
        )
        if not post_response:
            return "Erreur lors de la transcription."

        result_url = post_response.get("result_url")
        if not result_url:
            return "Erreur : URL du résultat non trouvée."

        while True:
            poll_response = self.__make_request(result_url, headers)
            if not poll_response:
                return "Erreur lors du polling du résultat."

            if poll_response.get("status") == "done":
                break
            elif poll_response.get("status") == "error":
                print("Une erreur est survenue")
                return poll_response.get("message")
            time.sleep(1)

        result = poll_response.get("result")
        if DEBUG:
            self.debug_result = result
        transcription = self.get_dialog_from_json(result)
        return transcription


    def get_dialog_from_json(self, response):
        dialog = "- "
        utterances = response.get("transcription").get("utterances")
        speaker = 0
        for utterance in utterances:
            # Retour à la ligne si changement de speaker
            if utterance.get("speaker") != speaker:
                dialog += "\n- "
                speaker = utterance.get("speaker")
            # Ajout de l'utterance à la chaîne de dialogue
            dialog += utterance.get("text") + " "
        # Retour à la ligne pour terminer la chaîne de dialogue
        dialog += "\n"
        return dialog

transcriptor = Transcriptor()

@app.post("/start")
async def start_recording(background_tasks: BackgroundTasks):
    background_tasks.add_task(transcriptor.start)
    return {"message": "Enregistrement démarré"}

@app.post("/stop")
async def stop_recording(background_tasks: BackgroundTasks):
    background_tasks.add_task(transcriptor.stop)
    return {"message": "Enregistrement arrêté"}

@app.get("/transcription")
async def get_transcription():
    transcription = transcriptor.get_transcription()
    return {"transcription": transcription}

@app.get("/last_transcription")
async def get_last_transcription():
    last_transcription = transcriptor.get_last_transcription()
    return {"last_transcription": last_transcription}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
