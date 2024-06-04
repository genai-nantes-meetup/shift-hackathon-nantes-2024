from mistralai.client import MistralClient
from sklearn.metrics.pairwise import euclidean_distances

model = "mistral-large-latest"

#TODO API KEY
client = MistralClient(api_key="")

def get_text_embedding(input):
    embeddings_batch_response = client.embeddings(
        model="mistral-embed",
        input=[input]
    )
    return embeddings_batch_response.data[0].embedding

def calculate_similarity(sentence1, sentence2):
    embedding1 = get_text_embedding(sentence1)
    embedding2 = get_text_embedding(sentence2)
    distance = euclidean_distances([embedding1], [embedding2])
    return distance[0][0]

#exemple d'appel
sentence1 = "A home without a cat — and a well-fed, well-petted and properly revered cat — may be a perfect home, perhaps, but how can it prove title?"
sentence2 = "I think books are like people, in the sense that they'll turn up in your life when you most need them"
similarity_score = calculate_similarity(sentence1, sentence2)
print(f"Distance between sentences: {similarity_score}")
