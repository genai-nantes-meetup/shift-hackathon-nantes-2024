import httpx
import json
from dotenv import load_dotenv

load_dotenv()

async def get_response_from_mistral_stream(api_key, api_url, messages, prompt, preprompt):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistral-large-2402",
        "messages": messages + [{"role": "user", "content": prompt}] + [{"role": "system", "content": preprompt}],
        "stream": True  # Enable streaming
    }
    if preprompt:
        payload["messages"].append({"role": "system", "content": preprompt})

    timeout = httpx.Timeout(10.0, read=60.0)  # Adjust the read timeout as necessary

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", api_url, headers=headers, json=payload) as response:
            buffer = ""
            async for chunk in response.aiter_text():
                buffer += chunk
                # Split by new lines to handle cases where multiple JSON objects are received in one chunk
                for line in buffer.split('\n'):
                    if line.startswith("data: "):
                        line = line[6:]  # Remove the "data: " prefix
                        try:
                            data = json.loads(line)
                            if "choices" in data:
                                for choice in data["choices"]:
                                    if "delta" in choice and "content" in choice["delta"]:
                                        chunk_content = choice["delta"]["content"]
                                        yield chunk_content
                            buffer = ""  # Clear buffer after processing
                        except json.JSONDecodeError:
                            # Accumulate buffer if JSON is incomplete
                            continue
