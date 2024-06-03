import json
import os
import sys

from langchain_community.document_loaders import PyPDFLoader
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage


class FileStorageAssistant:
    def __init__(self, api_key: str, model: str = "mistral-large-latest"):
        self.client = MistralClient(api_key=api_key)
        self.model = model

    def suggest_file_storage(
        self,
        abs_path: str,
        file_name: str,
        page_content: str,
        existing_paths_suggestions: str,
    ) -> dict:
        messages = [
            ChatMessage(
                role="system",
                content=f"""
                Je vais te donner le nom, le chemin, et le contenu d'un fichier que j'aimerais stocker sur mon système de fichiers. Je souhaite que tu proposes un chemin pour stocker ce fichier (il peut rester le même), et un nouveau nom.

                Renvoie un petit objet JSON avec une suggestion de chemin absolu pour stocker ce fichier. Suggère également un nouveau nom qui soit concis.

                L'objet JSON retourné doit suivre ce format :
                {{
                  "absolute_path": "architecture_de_fichier",
                  "new_file_name": "nouveau_nom_de_fichier"
                }}

                {existing_paths_suggestions}
                """,
            ),
            ChatMessage(
                role="user",
                content=f"""
                Le chemin absolu actuel du fichier est : {abs_path}
                Le nom actuel du fichier est : {file_name}
                Le contenu du fichier est le suivant :
                ```
                {page_content}
                ```
                """,
            ),
        ]

        chat_response = self.client.chat(
            temperature=0.0,
            model=self.model,
            response_format={"type": "json_object"},
            messages=messages,
        )

        return chat_response.choices[0].message.content


if __name__ == "__main__":
    api_key = os.getenv("MISTRAL_API_KEY")
    assistant = FileStorageAssistant(api_key)
    # Read JSON object from stdin
    json_data = sys.stdin.read()
    data = json.loads(json_data)

    existing_paths = data.get("existing_paths", None)

    existing_paths_suggestions = (
        f"""
        Voici des exemples de chemins existants sur mon système de fichiers que tu dois réutiliser ou qui doivent servir d'inspiration si les chemins existants ne conviennent pas :
        {existing_paths}
        """
        if existing_paths
        else ""
    )

    abs_path = data.get("abs_path")
    file_name = data.get("file_name")

    file_path = os.path.join(abs_path, file_name)

    loader = PyPDFLoader(file_path)
    documents = loader.load()
    page_content = documents[0].page_content
    response = assistant.suggest_file_storage(
        abs_path, file_name, page_content, existing_paths_suggestions
    )
    print(json.dumps(response))
