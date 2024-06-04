import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from extraction.templates import PROMPT_MISTRAL
import json
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import requests


load_dotenv()

## Model init

model = "mistral-large-latest"

client = MistralClient(api_key=os.environ["MISTRAL_KEY"])

## Functions


def get_one_page(url: str) -> str:
    response = requests.get(url)

    soup = BeautifulSoup(response.content, "html.parser")
    text = soup.get_text()
    content = text

    return content


def extract_links(soup, base_url):
    links = set()
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"]
        full_url = urljoin(base_url, href)
        # Filter out external links and same page links
        if urlparse(full_url).netloc == urlparse(base_url).netloc and full_url != base_url:
            links.add(full_url)
    return links


def get_all_pages(url: str) -> str:
    visited = set()
    to_visit = set([url])
    all_text = ""

    while to_visit:
        current_url = to_visit.pop()
        if current_url in visited:
            continue
        visited.add(current_url)

        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        text = soup.get_text()
        clean_text = " ".join(text.split())
        all_text += clean_text + " "

        links = extract_links(soup, url)
        to_visit.update(links - visited)

    return all_text


def generate(url: str, one_page: bool = True) -> str:
    if one_page:
        website = get_one_page(url)
    else:
        website = get_all_pages(url)

    prompt = PROMPT_MISTRAL.format(website)
    messages = [ChatMessage(role="user", content=prompt)]
    chat_response = client.chat(
        model=model,
        # response_format={"type": "json_object"},
        messages=messages,
    )

    response = chat_response.choices[0].message.content
    # response = json.loads(response)
    return response


def correct_json(bad_json: str):
    prompt = f"""please correct the following json: {bad_json} 
            Use the keys:
            
                "Competitor": "",
                "Descriptive_summary": "",
                "Strengths": "",
                "Weaknesses": "",
                "Proximity_score": ,
                "Proximity_Explanation": "",
                "Crunchbase_Link": "",
            
            """
    messages = [ChatMessage(role="user", content=prompt)]

    chat_response = client.chat(
        model=model,
        response_format={"type": "json_object"},
        messages=messages,
    )

    response = chat_response.choices[0].message.content
    return json.loads(response)
