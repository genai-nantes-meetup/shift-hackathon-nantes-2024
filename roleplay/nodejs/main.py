from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import base64
from google.cloud import aiplatform
import os
from dotenv import load_dotenv
import json
import google.generativeai as genai

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the .env file
load_dotenv()

PROJECT_ID = os.getenv('PROJECT_ID')
REGION = os.getenv('REGION')
BUCKET_URI = os.getenv('BUCKET_URI')
ENDPOINT_ID = os.getenv('ENDPOINT_ID')

aiplatform.init(project=PROJECT_ID, location=REGION, staging_bucket=BUCKET_URI)
endpoint = aiplatform.Endpoint(f"projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}")

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
gemini_model = genai.GenerativeModel('gemini-pro')

def base64_to_image(image_str):
    image = Image.open(BytesIO(base64.b64decode(image_str)))
    return image

def image_to_base64(image):
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def image_grid(imgs, rows=2, cols=2):
    w, h = imgs[0].size
    grid = Image.new(mode="RGB", size=(cols * w + 10 * cols, rows * h), color=(255, 255, 255))
    for i, img in enumerate(imgs):
        grid.paste(img, box=(i % cols * w + 10 * i, i // cols * h))
    return grid

@app.post("/generate_response")
async def generate_response(request: Request):
    # Load JSON data from the request body
    data = await request.json()

    # Generate prompt using Gemini
    gemini_prompt = f"write the following in English, then Generate a prompt for an image based on the following JSON:\n\n{json.dumps(data, indent=2)}"
    gemini_response = gemini_model.generate_content(gemini_prompt)
    prompt = gemini_response.text

    num_inference_steps = 2
    guidance_scale = 1.0

    instances = [
        {
            "prompt": prompt,
            "num_inference_steps": num_inference_steps,
            "guidance_scale": guidance_scale,
        },
    ]
    response = endpoint.predict(instances=instances)
    images = [base64_to_image(image) for image in response.predictions]
    grid_image = image_grid(images, rows=1)
    base64_image = image_to_base64(grid_image)

    response_text = "Here's an image based on the generated prompt:"

    return {
        "prompt": prompt,
        "response": response_text,
        "image": base64_image
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5700)
