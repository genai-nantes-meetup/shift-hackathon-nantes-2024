import os
import pickle
from abc import ABC, abstractmethod

import PIL.Image
from langchain_community.document_loaders import PyPDFLoader, TextLoader

from smart_files.embedding_clients import ImageDescriptorClient, TextEmbeddingClient


class FileLoader(ABC):
    def __init__(self, file_path: str):
        self.file_path = file_path

    @abstractmethod
    def load(self):
        pass


# Step 2: Implement specific file loaders
class PDFLoader(FileLoader):
    def load(self):
        loader = PyPDFLoader(self.file_path)
        return loader.load()[0].page_content


# Step 2: Implement specific file loaders
class CustomTextLoader(FileLoader):
    def load(self):
        loader = TextLoader(self.file_path, autodetect_encoding=True)
        return loader.load()[0].page_content


class ImageLoader(FileLoader):
    def load(self):
        return PIL.Image.open(self.file_path)


# Step 3: Create a processor interface
class FileProcessor(ABC):
    @abstractmethod
    def process(self, content, file_path):
        pass


class TextFileProcessor(FileProcessor):
    def __init__(self, text_embedding_client: TextEmbeddingClient):
        self.text_embedding_client = text_embedding_client

    def process(self, content, file_path):
        document_content = f"""
        Ce document est stocké dans mon système de fichiers.

        Voici le chemin absolu du fichier, si il a du sens, donne lui de l'importance, sinon ignore le : `{file_path}`
        Voici le contenu du document :
        ```
          {content}
        ```
        """
        return self.text_embedding_client.generate_embedding(document_content)


class ImageFileProcessor(FileProcessor):
    def __init__(
        self,
        image_descriptor_client: ImageDescriptorClient,
        text_embedding_client: TextEmbeddingClient,
    ):
        self.text_file_processor = TextFileProcessor(text_embedding_client)
        self.image_descriptor_client = image_descriptor_client

    def _create_prompt(self, file_path):
        return f"""
        Voici une image dont le chemin absolu est : `{file_path}`.
        En t'aidant du nom du fichier si il est pertinent, donne-moi une description détaillée de cette image.
        """

    def process(self, image, file_path):
        prompt = self._create_prompt(file_path)
        img_description = self.image_descriptor_client.generate_description(
            image, prompt
        )
        print(f"Description d'image : {img_description}")
        return self.text_file_processor.process(img_description, file_path)


# Step 4: Refactor the EmbeddingGenerator class
class EmbeddingGenerator:
    def __init__(
        self,
        text_embedding_client: TextEmbeddingClient,
        image_descriptor_client: ImageDescriptorClient,
    ):
        self.embeddings: dict = {}
        self.loader_map = {
            ".pdf": (PDFLoader, TextFileProcessor(text_embedding_client)),
            ".txt": (CustomTextLoader, TextFileProcessor(text_embedding_client)),
            ".jpeg": (
                ImageLoader,
                ImageFileProcessor(image_descriptor_client, text_embedding_client),
            ),
            ".jpg": (
                ImageLoader,
                ImageFileProcessor(image_descriptor_client, text_embedding_client),
            ),
            ".png": (
                ImageLoader,
                ImageFileProcessor(image_descriptor_client, text_embedding_client),
            ),
            # Add other file extensions and their corresponding loaders and processors here
        }

    def generate_embeddings(self, folder_paths):
        for folder_path in folder_paths:
            for root, _dirs, files in os.walk(folder_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    filename = os.path.basename(file_path)
                    print(filename)
                    file_extension = os.path.splitext(file_path)[1].lower()
                    loader_class, processor = self.loader_map.get(
                        file_extension, (None, None)
                    )
                    if loader_class and processor:
                        self._process_file(file_path, loader_class, processor)
                    else:
                        print(f"No loader/processor available for {file_extension}")

    def _process_file(self, file_path, loader_class, processor):
        loader = loader_class(file_path)
        content = loader.load()
        embeddings = processor.process(content, file_path)
        self.embeddings[file_path] = embeddings

    def save_embeddings(self, output_file):
        with open(output_file, "wb") as file:
            pickle.dump(self.embeddings, file)

    def get_embeddings(self):
        return self.embeddings


# Example usage:
# text_embedding_client = TextEmbeddingClient()
# generator = EmbeddingGenerator(text_embedding_client)
# generator.generate_embeddings(["/path/to/file.pdf", "/path/to/another_file.docx"])
# generator.save_embeddings("embeddings.pkl")
