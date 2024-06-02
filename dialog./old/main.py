import streamlit as st
import requests

with st.sidebar:
    mistral_api_key = st.text_input("Mistral API Key", key="chatbot_api_key", type="password")
    mistral_api_url = st.text_input("Mistral API URL", value="https://api.mistral.ai/v1/chat/completions")
    "[Get a Mistral API key](https://mistral.ai/account/api-keys)"
    "[View the source code](https://github.com/streamlit/llm-examples/blob/main/Chatbot.py)"
    "[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/streamlit/llm-examples?quickstart=1)"
    custom_preprompt = st.text_input("Custom Pre-prompt")

st.title("💬 Chatbot")

if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant", "content": "How can I help you?"}]

for msg in st.session_state.messages:
    st.chat_message(msg["role"]).write(msg["content"])

if prompt := st.chat_input():
    if not mistral_api_key:
        st.info("Please add your Mistral API key to continue.")
        st.stop()

    headers = {
        "Authorization": f"Bearer {mistral_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mistral-large-2402",  # Replace with the correct model name for Mistral
        "messages": st.session_state.messages + [{"role": "user", "content": prompt}]
    }

    if custom_preprompt:
        payload["messages"].append({"role": "system", "content": custom_preprompt})


    response = requests.post(mistral_api_url, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        msg = data["choices"][0]["message"]["content"]
        st.session_state.messages.append({"role": "user", "content": prompt})
        st.chat_message("user").write(prompt)
        st.session_state.messages.append({"role": "assistant", "content": msg})
        st.chat_message("assistant").write(msg)
    else:
        st.error(f"Error: {response.status_code}, {response.text}")
