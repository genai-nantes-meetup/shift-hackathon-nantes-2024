import base64
from flask import request
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models
import copy
import requests
import functions_framework
from flask import jsonify
import categorize
import match_task

vertexai.init(project="shift-aihack-nantes24-2", location="us-central1")
model = GenerativeModel(
    "gemini-1.5-pro-001",
)

generation_config = {
    "max_output_tokens": 8192,
    "temperature": 0.0,
    "top_p": 0.95,
}

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
}

# DB
tasks = 'TASK: aucune'

def identify_task(img):
    global tasks
    image = Part.from_data(mime_type="image/png",
                   data=base64.b64decode(img))
    summary = "Jusqu'à présent l'utilisateur a travaillé sur les taches suivantes, séparée par des marquers TASK:"
    responses = model.generate_content([summary,
                                        tasks,
                                        image, """Décrit en 15 mots ce que fait la personne qui travaille sur cet écran."""],
      generation_config=generation_config,
      safety_settings=safety_settings,
      stream=True,
      )
    response = '\n'.join([response.text for response in responses])
    tasks += '\nTASK:' + response
    return response

def log_screen(request):
    content = request.json
    res = identify_task(content["image"])
    task_type = categorize.classify_activity(res)
    topic = match_task.identify_task(res)
    headers = {
        'Content-Type': 'application/json'
    }
    data = {'topic': topic,
            'task_type': task_type,
            'task': res,
            'customer': 'pierre'
            }
    requests.post('https://n8n.etiennedouillard.fr/webhook/notion', data=data)
    return data

def get_activities(request):
    # no more used
    return jsonify([])
