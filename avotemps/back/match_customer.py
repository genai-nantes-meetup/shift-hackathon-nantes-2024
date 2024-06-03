import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models




def generate_prompt(task):
    return f"""
The lawyer is working with two customers. There are a list of tasks to do for each customer.
Below is the detail of the customer and the tasks:

Client : Laura Dubois, Responsable des Ressources Humaines de l'entreprise Olive&Tome

1. Rencontrer Laura Dubois pour comprendre la nature des conflits, le nombre de cas, les personnes impliquées et les mesures déjà prises par l'entreprise. (Prise de notes sur carnet, ordinateur portable)
2. Consulter les documents internes d'Olive&Tome relatifs aux cas de harcèlement pour analyser la situation.
3. Fournir des conseils juridiques à Laura Dubois sur les obligations légales d'Olive&Tome en matière de prévention et de traitement du harcèlement au travail via un rapport écrit (Microsoft Word).
4. Assister Laura Dubois dans la mise en place d'une procédure d'enquête interne en respectant les droits de la défense et le principe de confidentialité (rédaction de courriers, audition des parties).
5. Proposer des solutions amiables pour résoudre les conflits en collaboration avec les parties concernées.
6. Préparer et assister Olive&Tome dans le cadre d'une éventuelle procédure judiciaire (Conseil de prud’hommes) si nécessaire (constitution de dossiers, rédaction d’argumentaires).
7. Former et conseiller Laura Dubois sur les bonnes pratiques pour prévenir le harcèlement au travail et mettre en place une politique de prévention efficace (supports de formation, présentations PowerPoint).

Client : Sophie Martin (deuxième série de tâches)

8. S'entretenir avec Sophie Martin pour comprendre la nature des conflits, les personnes impliquées, et l'impact sur l'entreprise (prise de notes - Evernote, carnet).
9. Analyser la situation et identifier les sources de conflits (consultation de documents internes, organigramme - Microsoft Word, Google Docs).
10. Rechercher des solutions juridiques et explorer les options de résolution amiable (recherche sur Légifrance - Code du travail - jurisprudence).
11. Organiser des sessions de médiation individuelles et/ou collectives avec les employés concernés (réservation salle de réunion, envoi d'invitations - Outlook Calendar, Google Calendar).
12. Faciliter le dialogue, aider les parties à identifier leurs besoins et à trouver des solutions mutuellement acceptables (techniques de communication non violente, écoute active).
13. Rédiger des accords de médiation formalisant les engagements pris par chaque partie (Microsoft Word, Google Docs, DocuSign).
14. Assurer un suivi régulier auprès de Sophie Martin et des employés concernés pour s'assurer de la bonne application des accords (échanges d'emails, appels téléphoniques).
15. Orientrer Sophie Martin vers des professionnels spécialisés (psychologue du travail, coach) pour un accompagnement complémentaire si nécessaire

Please only print the task without anything else that best match with this task: {task}
"""

def identify_task(task):
    vertexai.init(project="shift-aihack-nantes24-2", location="us-central1")
    model = GenerativeModel(
        "gemini-1.5-flash-001",
    )
    response = model.generate_content(
        [generate_prompt(task)],
         generation_config=generation_config,
         safety_settings=safety_settings
         )
    return response.text

generation_config = {
    "max_output_tokens": 256,
    "temperature": 0.2,
    "top_p": 0.8,
}

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}
