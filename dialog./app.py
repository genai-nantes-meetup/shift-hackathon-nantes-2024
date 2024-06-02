import streamlit as st
from utils import initialize_session, display_messages, get_user_input
from api_client import get_response_from_mistral_stream
from rag import retrieve_relevant_documents
from database import init_supabase, fetch_user_info, fetch_additional_context
import asyncio
from dotenv import load_dotenv
import os
from prompt import mega_prompt, limit, next_limit
from streamlit_navigation_bar import st_navbar
from streamlit_modal import Modal

modal = Modal(key="Demo Key",title="test")

class App:
    def __init__(self):
        load_dotenv()
        self.supabase = init_supabase()
        self.user = fetch_user_info(self.supabase, "1")
        if 'page' not in st.session_state:
            st.session_state['page'] = 'chat'
        self.pages = {
            "login": self.show_login,
            "unboarding": self.show_unboarding,
            "unboarding_home": self.show_unboarding_home,
            "unboarding_who": self.show_unboarding_who,
            "unboarding_call": self.show_unboarding_call,
            "unboarding_feeling": self.show_unboarding_feeling,
            "unboarding_how": self.show_unboarding_how,
            "unboarding_sum": self.show_unboarding_sum,
            "chat": self.show_chat,
            "dashboard": self.show_dashboard,
            "Déconnexion": self.show_logout
        }
    

    def run(self):
        st_navbar(["dialog", "dashboard", "déconnexion"])
        # self.show_sidebar()
        self.pages[st.session_state['page']]()

    def authenticate(self, username, password):
        if len(username) > 2: #TODO il faut un nom de user plus long que 3 char
            st.session_state['authenticated'] = True
            st.session_state['page'] = 'unboarding'
            st.rerun()
        else:
            st.error("Identifiant ou mot de passe incorrect")

    def show_sidebar(self):
        with st.sidebar:
            st.title(":compass: Navigation")
            page = st.selectbox("Choisir une page", list(self.pages.keys()))
            if st.button("Go"):
                st.session_state['page'] = page
                st.rerun()

    def show_login(self):
        st.title(":smile: Login")
        with st.form(key='login_form'):
            username = st.text_input("Identifiant")
            password = st.text_input("Mot de passe", type="password")
            submit_button = st.form_submit_button("Se connecter")
            st.write('mot de passe oublié')
        if submit_button:
            self.authenticate(username, password)

    def show_unboarding(self):
        if False: #TODO si l'unboarding à déjà été fait 
            self.show_chat() #rediriger sur le chat ou le dashboard
        else:
            st.title(":rocket: Unboarding")
            self.show_unboarding_home()

    def show_unboarding_home(self):
        st.title(f"Bienvenue {self.user.first_name} !")
        st.image("https://images.prismic.io/merovahealth/8fe1c9f2-79e0-4031-9e5e-57c26ae197f6_merova-rendszer-illustration.png?auto=compress,format", use_column_width=True)
        st.write(f"C'est votre première connexion, vous êtes suivie par Dr. {self.user.doctor_name}.")
        st.write("Vous allez répondre à quelques questions pour créer votre espace personnalisé.")
        col1, col2 = st.columns(2)
        with col2:
            if st.button("c'est parti !", key="home_continue"):
                st.session_state['page'] = 'unboarding_who'
                st.rerun()
        with col1:
            if st.button("retour", key="home_back"):
                st.session_state['page'] = 'unboarding'
                st.rerun()

    def show_unboarding_who(self):
        st.title("Ce diagnostic vous concerne ou une personne dans votre entourage ? ")
        st.write("Qui êtes-vous ? Veuillez répondre aux questions suivantes pour mieux vous connaître.")
        col1form1, col2form = st.columns(2)
        with col1form1:
            st.image("https://images.prismic.io/merovahealth/8fe1c9f2-79e0-4031-9e5e-57c26ae197f6_merova-rendszer-illustration.png?auto=compress,format", use_column_width=True)
        with col2form:
            st.button("Je suis concerné(e) par le diagnostic")
            if st.button("Pour un de mes enfants") : self.user.settings_who = 'enfant'
            if st.button("Pour un membre de ma famille") : self.user.settings_who = 'famille'
            entourage = st.button("Pour une personne de mon entourage")
            if entourage : self.user.settings_who = st.text_input("Qui?")
        col1, col2 = st.columns(2)
        with col2:
            if st.button("Suivant", key="home_continue"):
                st.session_state['page'] = 'unboarding_call'
                st.rerun()
        with col1:
            if st.button("retour", key="home_back"):
                st.session_state['page'] = 'unboarding_home'
                st.rerun()

        self.user = update_user_info(supabase, self.user)

    def show_unboarding_call(self):
        st.title("Comment souhaitez-vous être appelé ?")
        self.user.settings_pseudo = st.text_input("Entrer un prénom", self.user.first_name, key="prenom")
        self.user = update_user_info(self.supabase, self.user)
        col1, col2 = st.columns(2)
        with col2:
            if st.button("Suivant", key="home_continue"):
                st.session_state['page'] = 'unboarding_feeling'
                st.rerun()
        with col1:
            if st.button("retour", key="home_back"):
                st.session_state['page'] = 'unboarding_who'
                st.rerun()

    def show_unboarding_feeling(self):
        st.title("Comment vous sentez-vous aujourd'hui ?")

        if st.button(":grin: Je me sens très bien") : self.user.settings_mood = 'Je me sens très bien'
        if st.button(":slightly_smiling_face: Plutôt bien") : self.user.settings_mood = 'Plutôt bien'
        if st.button(":neutral_face: Pas mal") : self.user.settings_mood = 'Pas mal'
        if st.button(":slightly_frowning_face: Pas très bien") : self.user.settings_mood = 'Pas très bien'
        if st.button(":weary: Je ne me sens pas bien du tout") : self.user.settings_mood = 'Je ne me sens pas bien du tout'

        col1, col2 = st.columns(2)
        with col2:
            if st.button("Suivant", key="home_continue"):
                st.session_state['page'] = 'unboarding_how'
                st.rerun()
        with col1:
            if st.button("retour", key="home_back"):
                st.session_state['page'] = 'unboarding_call'
                st.rerun()

    def show_unboarding_how(self):
        st.title("Comment souhaiteriez-vous être accompagné(e) suite à votre diagnostic ?")

        souhaits = ""

        # Définir les options disponibles
        if st.checkbox("Avoir plus d'informations sur ma maladie") : souhaits += "Avoir plus d'informations sur ma maladie, "
        if st.checkbox("Retrouver des conseils pour adapter mon quotidien") : souhaits += "Retrouver des conseils pour adapter mon quotidien, "
        if st.checkbox("Maîtriser mon stress et mon anxiété") : souhaits += "Maîtriser mon stress et mon anxiété, "
        if st.checkbox("Connaître les effets secondaires du traitement") : souhaits += "Connaître les effets secondaires du traitement, "
            
            
        # Ajouter une option pour les autres souhaits
        autres_souhaits = st.checkbox("Autre(s) souhait(s)")
        autre_souhait_text = ""
        if autres_souhaits : souhaits += st.text_input("Entrer un autre souhait")

        col1, col2 = st.columns(2)
        with col1:
            if st.button("retour", key="how_back"):
                st.session_state['page'] = 'unboarding_feeling'
                st.rerun()
        with col2:
            if st.button("Suivant", key="how_continue"):
                # Enregistrer les sélections dans le DTO
                self.user.settings_how = souhaits
                st.session_state['page'] = 'unboarding_sum'
                st.rerun()

    def show_unboarding_sum(self):
        st.title("Suite à vos réponses au questionnaire, nous comprenons l'importance de ces informations et nous sommes là pour vous accompagner avec le plus grand soin")
        col1, col2 = st.columns(2)

        self.user = update_user_info(self.supabase, self.user)
        
        with col2:
            if st.button("Suivant", key="home_continue"):
                st.session_state['page'] = 'dashboard'
                st.rerun()
        with col1:
            if st.button("retour", key="home_back"):
                st.session_state['page'] = 'unboarding_how'
                st.rerun()

    def show_chat(self):
        mistral_api_key = os.getenv("MISTRAL_API_KEY")
        mistral_api_url = "https://api.mistral.ai/v1/chat/completions"
        custom_preprompt = ""
        # st.title("💬 dIAlog.")
        initialize_session()
        display_messages()
        prompt = get_user_input()
    

         
        if prompt:
                st.session_state.messages.append({"role": "user", "content": prompt})
                st.chat_message("user").write(prompt)

                if not mistral_api_key:
                    st.info("Please add your Mistral API key to continue.")
                    st.stop()

                # Retrieve relevant documents (RAG)
                # relevant_docs = retrieve_relevant_documents(prompt)
                #TODO: relevant docs RAG must be defined by user info, not by prompt | PERFORMANCE ISSUE
                relevant_docs = ""
                
                # Fetch additional context from Supabase
                additional_context = fetch_additional_context(self.supabase, prompt)

                # Combine retrieved documents and additional context into the prompt
                combined_prompt = f"{limit}\n\n{mega_prompt}\n\n{additional_context}\n\n{relevant_docs}\n\n{prompt}\n\n{next_limit}\n\n"

                placeholder = st.empty()  # Create an empty placeholder for dynamic updates

                # Run the asynchronous function using Streamlit's asyncio support
                response_content = asyncio.run(self.run_async_generator(
                    mistral_api_key, mistral_api_url, st.session_state.messages, combined_prompt, custom_preprompt, placeholder
                ))
                st.session_state.messages.append({"role": "assistant", "content": response_content})

    async def run_async_generator(self, api_key, api_url, messages, combined_prompt, custom_preprompt, placeholder):
        response_content = ""
        async for chunk in get_response_from_mistral_stream(api_key, api_url, messages, combined_prompt, custom_preprompt):
            response_content += chunk
            placeholder.write(response_content)  # Update the placeholder with the latest content
        return response_content

    def show_dashboard(self):
        st.title(":sunglasses: Dashboard")
        st.write("Dashboard content goes here...")

    def show_logout(self):
        st.title(":cry: Logout")
        st.write("Logout page")

if __name__ == "__main__":
    app = App()
    app.run()
