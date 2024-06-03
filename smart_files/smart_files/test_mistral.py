import os
import sys

from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# Mettre le MISTRAL_API_KEY du groupe 12 dans les secrets (à gauche)
# Le token est trouvable ici : https://deeply-myrtle-f38.notion.site/Notion-Participants-Shift-le-Hackathon-Gen-AI-75e255cc5357457394dfe64094ecf65a
api_key = os.getenv("MISTRAL_API_KEY")
client = MistralClient(api_key=api_key)

model = "mistral-large-latest"

prompt = "What is the best French cheese?"
if len(sys.argv) > 1:
    prompt = sys.argv[1]

chat_response = client.chat(
    model=model,
    messages=[ChatMessage(role="user", content=prompt)],
)

print(chat_response.choices[0].message.content)
