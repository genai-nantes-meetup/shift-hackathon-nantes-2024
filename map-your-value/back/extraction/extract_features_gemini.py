import vertexai
from vertexai.generative_models import GenerativeModel, Tool
import vertexai.preview.generative_models as generative_models
from extraction.templates import PROMPT_GEMINI
import requests
from bs4 import BeautifulSoup


from dotenv import load_dotenv

load_dotenv()

## Init
vertexai.init(project="shift-aihack-nantes24-1", location="us-central1")
tools = [
    Tool.from_google_search_retrieval(
        google_search_retrieval=generative_models.grounding.GoogleSearchRetrieval(disable_attribution=False)
    ),
]
model = GenerativeModel(
    "gemini-1.5-pro-001",
    tools=tools,
)

## Functions


def get_one_page(url: str) -> str:
    ##pure beautiful soup
    response = requests.get(url)

    soup = BeautifulSoup(response.content, "html.parser")
    text = soup.get_text()
    content = text
    return content


def generate_gemini(paragraph: str):
    prompt = PROMPT_GEMINI.format(paragraph)
    response = model.generate_content(
        [prompt],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=False,
    )

    return response.text


### Config
generation_config = {
    "max_output_tokens": 8192,
    "temperature": 0,
    "top_p": 1.0,
}

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_NONE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_NONE,
}
