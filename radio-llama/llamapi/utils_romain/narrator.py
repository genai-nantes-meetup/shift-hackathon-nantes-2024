import requests
import os
from abc import abstractmethod
import time
import json

CHUNK_SIZE = 1024



class TextToSpeech:
    @abstractmethod
    def transform(self, text: str, voice_id: str, save: bool = False):
        raise NotImplementedError


class ElevenLabsTextToSpeech(TextToSpeech):
    def transform(self, text: str, voice_id: str, save: bool = False):
        url = "https://api.elevenlabs.io/v1/text-to-speech/" + voice_id

        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": os.getenv('ELEVENLABS_API_KEY')
        }

        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.71,
                "similarity_boost": 0.87
            }
        }

        timestamp = int(time.time())
        output_path = "elevenlabs_" + str(timestamp) + ".mp3"
        response = requests.post(url, json=data, headers=headers)
        if response.status_code != 200:
            print(response.json())
            return None
        if save:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                    if chunk:
                        f.write(chunk)
        return output_path


from langchain_mistralai import ChatMistralAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser


model = ChatMistralAI(model="mistral-large-latest")

parser = StrOutputParser()

prompts = {
    "transition": HumanMessage(content="""<role>
Tu es un animateur radio chevronné qui anime régulièrement des émissions sur une webradio Jazz.

<objectif>
Ton objectif est d'écrire le contenu d'une intervention de 6 secondes.
Ton objectif est de parlé de la musique qui vient de se finir et de lancer la musique suivante, en l'accompagnant d'une anecdote sur l'artiste ou le morceau.

<ton>
Utilise un ton $tone
Sois $inspiration

Pour écrire le script , suis les étapes ci-dessous :
1 - Réfléchis aux éléments clés à inclure dans ton script selon les objectifs définis
2 - Rédige plusieurs versions du script en t'efforçant de respecter le ton fourni. Évite les formulations monotones ou ennuyeuses.
3 - Peaufine le script jusqu'à obtenir une version finale de 6 qui sonne bien à l'oral et donne envie aux auditeurs d'en savoir plus.
4 - Vérifie que le script final reflète bien le style d'inspiration et le ton fourni, tout en restant fidèle à ta propre voix et ton propre style d'animation.

<tache>
Écris le script final de %duration maximum pour l'intervention radio.

<output_format>
Formate le script au format json avec une clé "script" contenant le texte du script final.

<infos>
Musique précédente :
    $previous_track

Musique suivante :
    $next_track
"""),
    "intro": HumanMessage(content="""<role>
Tu es un animateur radio chevronné qui anime régulièrement des émissions sur une webradio.
</role>

<objectif>
L'objectif est de produire le script pour une introduction mémorables qui fidélisent l'audience.
</objectif>

<ton>
- Utilise un ton $tone
</ton>

<liste_titres>
Voici la liste de titres musicaux avec leurs métadonnées :

$track_list

</liste_titres>

<instructions>

Tu dois utiliser le vocabulaire relatif à la webradio.

Veuillez analyser attentivement cette liste de chansons et leurs métadonnées.

Ensuite, en vous basant sur les éléments analysé précédement, veuillez rédiger un premier jet du script d'introduction engageant pour cette programmation musicale. Le script doit donner envie aux auditeurs de rester à l'écoute.
Mettez en avant les points forts de la sélection.

Ensuite, peaufinez le scripts pour qu'il soit fluide et naturel, et que la durée de chaque script ne dure pas plus de $duration.
Votre scripts doit être écrits selon le ton défini. N'hésitez pas à utiliser des formules accrocheuses et un soupçon d'humour si approprié.
</instructions>

<tache>
Écris le script final de $duration secondes maximum pour l'introduction radio.
</tache>

<output_format>
Formate le script au format json avec une clé "script" contenant le texte du script final.
</output_format>
"""),
    "outro": HumanMessage(content="""<role>
Tu es un animateur radio chevronné qui anime régulièrement des émissions sur une webradio.
</role>

<objectif>
L'objectif est de produire le script pour une extro mémorables qui fidélisent l'audience.
</objectif>

<ton>
- Utilise un ton $tone
</ton>

<liste_titres>
Voici la liste de titres musicaux joué avec leurs métadonnées :

$track_list

</liste_titres>

<instructions>

Tu dois utiliser le vocabulaire relatif à la webradio.

Veuillez analyser attentivement cette liste de chansons et leurs métadonnées.

Ensuite, en vous basant sur les éléments analysé précédement, veuillez rédiger un premier jet du script d'extro engageant pour cette programmation musicale. Le script doit donner envie aux auditeurs d'écouter la prochaine émission.
Mettez en avant les points forts de la programmation musicale, les artistes, les genres musicaux, les anecdotes, les événements à venir, etc.

Ensuite, peaufinez le scripts pour qu'il soit fluide et naturel, et que la durée de chaque script ne dure pas plus de $duration.
Votre scripts doit être écrits selon le ton défini. N'hésitez pas à utiliser des formules accrocheuses et un soupçon d'humour si approprié.
</instructions>

<tache>
Écris le script final de $duration secondes maximum pour l'extro de la radio.
</tache>

<output_format>
Formate le script au format json avec une clé "script" contenant le texte du script final.
</output_format>
""")}

from string import Template

def get_script(type, data, chain=None):
    chain = model or parser
    
    prompt: HumanMessage = prompts[type]
    
    src = Template(prompt.content)
    text = src.substitute(data)

    result = chain.invoke([HumanMessage(content=text)])
    
    print(result)
    
    
    text_to_speech = json.loads(result.content)["script"]
    
    return text_to_speech

voices =  {
    "Male-Calm" : "GK4x7OSjC6JLlDqAZnAE",           # Léo Latti
    "Female-Calm" : "qMfbtjrTDTlGtBy52G6E",         # Emilie Lacroix
    "Male-Pleasant" : "1ns94GwK9YDCJoL6Nglv",       # Nicolas animateur
    "Female-Pleasant" : "qMfbtjrTDTlGtBy52G6E",     # Emilie Lacroix
    "Male-Serious" : "AmMsHJaCw4BtwV3KoUXF",        # Nicolas Petit
    "Female-Serious" : "glDtoWIoIgk38YbycCwG",      # Clara Dupont
    "Male-Confident" : "aQROLel5sQbj1vuIVi6B",      # Nicolas - Narration
    "Female-Confident" : "glDtoWIoIgk38YbycCwG",    # Clara Dupont
}

voice_id_eleven = voices["Male-Pleasant"]

def get_speech(text, voice_id = voice_id_eleven):
    t2s = ElevenLabsTextToSpeech()
    path = t2s.transform(text, voice_id, save=True)
    
    return path


