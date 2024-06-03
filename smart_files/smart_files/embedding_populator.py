import hashlib

import chromadb
import numpy as np


class EmbeddingPopulator:
    def __init__(self, db_path="chroma_local.db"):
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(name="my_vector_db")

    def add_embeddings_to_collection(self, embeddings):
        embeddings_list = []
        metadata_list = []
        ids_list = []

        for file_path, embeddings in embeddings.items():
            print(f"Embeddings for file {file_path}:")
            array_embeddings = np.array(embeddings).reshape(1, -1)
            print(array_embeddings)

            embeddings_list.append(array_embeddings[0].tolist())
            metadata_list.append({"file_path": file_path})
            ids_list.append(hashlib.md5(file_path.encode()).hexdigest())

        self.collection.add(
            embeddings=embeddings_list, metadatas=metadata_list, ids=ids_list
        )
        print("All embeddings and metadata have been added to the ChromaDB collection.")
