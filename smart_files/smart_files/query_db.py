import json
import os
import sys

import chromadb

from smart_files.embedding_clients import MistralTextEmbeddingClient

MIN_NB_TO_RETURN = 5
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
text_embedding_client = MistralTextEmbeddingClient(api_key=MISTRAL_API_KEY)
# Initialize ChromaDB client with local storage
client = chromadb.PersistentClient(path="chroma_local.db")

# Retrieve the collection
collection = client.get_collection(name="my_vector_db")

print("Reading JSON input from stdin...", file=sys.stderr)
json_input = json.loads(sys.stdin.read())

# User prompt
user_prompt = json_input["user_prompt"]

# Convert user prompt to an embedding
query_embedding = text_embedding_client.generate_embedding(user_prompt)

# Search the ChromaDB collection for the nearest neighbors
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=15,  # Number of nearest neighbors to retrieve
)

to_export = []

for result in zip(results["distances"][0], results["metadatas"][0]):
    if len(to_export) > MIN_NB_TO_RETURN and result[0] > 0.6:
        break
    to_export.append({"distance": result[0], "path": result[1]["file_path"]})

print(json.dumps(to_export))
