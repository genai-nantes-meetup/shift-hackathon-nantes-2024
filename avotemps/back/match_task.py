import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models




def generate_prompt(task):
    return f"""
Multi-choice problem: Using only the following tasks:
Tasks:
    1. Présentation générale d'Avostemps
    2. Démonstration video du produit
    3. Présentation produit d'Avostemps
    4. Questions / réponses avec le connecteur notion en démo

    Please only print the task without anything else that best match with this activity:

    {task}


"""

def identify_task(task):
    vertexai.init(project="shift-aihack-nantes24-2", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-flash-001",
    )
    response = model.generate_content(
        [generate_prompt(task)],
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
