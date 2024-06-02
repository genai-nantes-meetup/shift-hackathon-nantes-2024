from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document
from langchain.chains import create_retrieval_chain
from langchain_mistralai import MistralAIEmbeddings
import os
from database import init_supabase, fetch_user_info

# fetch user diagnosis to compare to website database and retrieve relevant documents

# Initialize Supabase client
supabase = init_supabase()

# # Fetch user information
user = fetch_user_info(supabase, "1")
# user = ""

diagnosis = user.diagnosis


db_exist = False

def get_definition():
    global key, embeddings, text_splitter

    key = os.getenv("MISTRAL_API_KEY")
    embeddings = MistralAIEmbeddings(model="mistral-embed", api_key=key)

    text_splitter = RecursiveCharacterTextSplitter(
        # Set a really small chunk size, just to show.
        chunk_size=200,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False,
        )

def get_info_documents(web = ""):
    """
    Objectif : récupérer les infos sur un ou des sites internet.
    input : site internet (ici web)
    output : vectordb
    """
    global db_exist, embeddings, text_splitter
    loader = WebBaseLoader(web)
    documents = loader.load()

    docs = text_splitter.split_documents(documents)
    for d in docs:
        d.page_content = f"Source : Cancer du sein, contenu : {d.page_content}"
    
    
    db = FAISS.from_documents(docs, embeddings)
    db.save_local("faiss_index")
    db_exist = True

def retrieve_relevant_documents(query):
    # Dummy implementation for retrieving relevant documents
    # Replace this with actual retrieval logic, e.g., using a search engine or document database
    global db_exist

    get_definition()

    if not db_exist:
        web = "https://fr.wikipedia.org/wiki/Cancer_du_sein"
        get_info_documents(web)
    
    db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    relevant_docs = db.similarity_search(query)

    return relevant_docs

