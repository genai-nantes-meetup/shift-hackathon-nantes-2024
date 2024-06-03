from abc import ABC, abstractmethod

from google.generativeai import GenerationConfig, GenerativeModel, configure
from google.generativeai.types import HarmBlockThreshold, HarmCategory
from mistralai.client import MistralClient


class ImageDescriptorClient(ABC):
    @abstractmethod
    def generate_description(self, img_file_path):
        """
        Abstract method to fetch the description for the given input image.

        Args:
        img_file_path (str): The path to the input image.

        Returns:
        list: The description for the input image.
        """
        pass


class TextEmbeddingClient(ABC):
    @abstractmethod
    def generate_embedding(self, input_text):
        """
        Abstract method to fetch the text embedding for the given input text.

        Args:
        input_text (str): The text for which the embedding will be generated.

        Returns:
        list: The embedding vector for the input text.
        """
        pass


class MistralTextEmbeddingClient(TextEmbeddingClient):
    def __init__(self, api_key):
        """Initialize the MistralClient with the provided API key."""
        self.mistral_client = MistralClient(api_key=api_key)

    def generate_embedding(self, input_text):
        """
        Fetch the text embedding for the given input text using the MistralClient.

        Args:
        input_text (str): The text for which the embedding will be generated.

        Returns:
        list: The embedding vector for the input text.
        """
        embeddings_batch_response = self.mistral_client.embeddings(
            model="mistral-embed", input=input_text
        )
        return embeddings_batch_response.data[0].embedding


class GoogleImageDescriptorClient(ImageDescriptorClient):
    def __init__(self, api_key):
        self.api_key = api_key
        configure(api_key=self.api_key)
        self.model = GenerativeModel("models/gemini-1.5-flash-001")
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        }

    def generate_description(self, prompt, image):
        result = self.model.generate_content(
            [prompt, image],
            safety_settings=self.safety_settings,
            stream=False,
            generation_config=GenerationConfig(temperature=0, max_output_tokens=1024),
        )
        return result.candidates[0].content.parts[0].text
