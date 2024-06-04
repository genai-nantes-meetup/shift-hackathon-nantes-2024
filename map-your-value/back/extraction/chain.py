from extraction.extract_features_gemini import generate_gemini
from extraction.extract_features_mistral import generate, correct_json


def analyse_company(url: str):
    t = generate(url)
    output = generate_gemini(t)
    output = correct_json(output)
    return output
