import re
import json
import fitz  # PyMuPDF
from PIL import Image
import pytesseract

def clean_text(text):
    """
    Clean the input text by removing extra whitespaces, tabs, newlines, and non-ASCII characters.
    
    Args:
        text (str): Input text to be cleaned.
    
    Returns:
        str: Cleaned text.
    """
    cleaned_text = re.sub(r'\s+', ' ', text)  # Remove extra whitespaces, tabs, and newlines
    cleaned_text = cleaned_text.encode('ascii', 'ignore').decode()  # Remove non-ASCII characters
    return cleaned_text.strip()

def extract_json(text):
    """
    Extract JSON format from the input text.
    
    Args:
        text (str): Input text containing JSON-like substrings.
    
    Returns:
        list: List of JSON objects extracted from the text.
    """
    json_strings = re.findall(r'{[^{}]*(?:[^{}]*{[^{}]*})*[^{}]*}', text)  # TODO: optimize.
    extracted_json = []
    for json_string in json_strings:
        try:
            extracted_json.append(json.loads(json_string))  # Try to load each JSON-like substring
        except json.JSONDecodeError:
            pass
    return extracted_json

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'png', 'jpg', 'jpeg'}

def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text()
    return text

def extract_text_from_image(file):
    image = Image.open(file.stream)
    text = pytesseract.image_to_string(image)
    return text