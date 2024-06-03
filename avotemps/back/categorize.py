import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models


def generate_prompt(activity):
    return f"""Multi-choice problem: Define the category of the activity?
    Categories:
    - recherche internet
    - email
    - rendez-vous visio
    - téléphone
    - redaction de document
    - utilisation d'un chat genAI
    - presentation de slides
    - visionnage de video
    - visionnage de slides
    - prise de notes avec Notion
    - autre

Please only print the category name without anything else.

    Activity: {activity}
"""

def classify_activity(activity):
    vertexai.init(project="shift-aihack-nantes24-2", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-flash-001",
    )
    response = model.generate_content(
        [generate_prompt(activity)],
         generation_config=generation_config,
         safety_settings=safety_settings
         )
    return response.text

generation_config = {
    "max_output_tokens": 256,
    "temperature": 0.0,
    "top_p": 0.8,
}

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
}
