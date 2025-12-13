from google import genai


def get_client(api_key: str):
    return genai.Client(api_key=api_key)


def embed_texts(texts: list[str], client):
    embeddings = []
    for text in texts:
        result = client.models.embed_content(
            model="models/text-embedding-004",
            contents=text
        )
        embeddings.append(result.embeddings[0].values)
    return embeddings


def generate_answer(prompt: str, client):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text
