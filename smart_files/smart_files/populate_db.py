import json
import os
import sys

from smart_files.embedding_clients import (
    GoogleImageDescriptorClient,
    MistralTextEmbeddingClient,
)
from smart_files.embedding_generator import EmbeddingGenerator
from smart_files.embedding_populator import EmbeddingPopulator


def main():
    # Read JSON input from stdin
    input_data = sys.stdin.read()
    folder_paths = json.loads(input_data)["folder_paths"]

    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
    mistral_embedding_client = MistralTextEmbeddingClient(api_key=MISTRAL_API_KEY)

    google_api_key = os.getenv("GOOGLE_API_KEY")
    google_image_describer_client = GoogleImageDescriptorClient(api_key=google_api_key)

    embedding_generator = EmbeddingGenerator(
        text_embedding_client=mistral_embedding_client,
        image_descriptor_client=google_image_describer_client,
    )
    embedding_generator.generate_embeddings(folder_paths)
    embedding_generator.save_embeddings("all_embeddings.pickle")
    embeddings = embedding_generator.get_embeddings()
    embedding_populator = EmbeddingPopulator()
    embedding_populator.add_embeddings_to_collection(embeddings)
    if os.path.isfile("chroma_local.db.old"):
        os.remove("chroma_local.db.old")


if __name__ == "__main__":
    if os.path.isfile("chroma_local.db.old"):
        os.remove("chroma_local.db.old")
    os.rename("chroma_local.db", "chroma_local.db.old")
    try:
        main()
    except:
        os.rename("chroma_local.db.old", "chroma_local.db")
        raise
