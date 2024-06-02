import streamlit as st
from database import init_supabase, fetch_user_info, fetch_additional_context, update_user_info

# Initialize Supabase client
supabase = init_supabase()

# # Fetch user information
user = fetch_user_info(supabase, "1")

def initialize_session():
    if "messages" not in st.session_state:
        st.session_state["messages"] = [{"role": "assistant", "content": 
                                         f"""
                                        
                                         {user.first_name},

 Bienvenue sur votre safe space, comment puis-je vous aider aujourd'hui ?

Vous êtes accompagné par {user.doctor_name}. Cela dit, tous les échanges que nous aurons resteront confidentiels.

Je suis un compagnon spécialisé dans les données relatives à {user.diagnosis}. Mon objectif est de pouvoir échanger avec vous comme vous le souhaitez.

Voici quelques domaines sur lesquels vous pouvez me questionner : 

* Informations sur {user.diagnosis} et ses symptômes

* Gestion des traitements et des effets secondaires

* Stratégies pour gérer le stress et les émotions

* Conseils pour maintenir une bonne qualité de vie quotidienne

* Soutien pour parler de votre maladie à vos proches

Vous pouvez interagir avec moi via les canaux suivants :
Voix
Texte
Image

Je suis ici pour vous aider et m'adapter à vos besoins médicaux et personnels. N'hésitez pas à poser des questions ou à exprimer vos préoccupations.
                                     """    }]

def display_messages():
    for msg in st.session_state.messages:
        st.chat_message(msg["role"]).write(msg["content"])

def get_user_input():
    return st.chat_input()
