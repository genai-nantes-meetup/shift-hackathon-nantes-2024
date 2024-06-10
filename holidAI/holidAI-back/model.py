import google.generativeai as genai
import google.ai.generativelanguage as glm
from vertexai.generative_models import (Tool)
import textwrap
import json

import os
from dotenv import load_dotenv

load_dotenv()

add_to_database = glm.FunctionDeclaration(
    name="add_to_database",
    description=textwrap.dedent("""\
        Adds entities to the database.
        """),
    parameters=glm.Schema(
        type=glm.Type.OBJECT,
        properties={
            'trip': glm.Schema(
                type=glm.Type.OBJECT,
                properties={
                    'start_date': glm.Schema(type=glm.Type.STRING),
                    'duration': glm.Schema(type=glm.Type.STRING),
                    'budget_per_person': glm.Schema(type=glm.Type.STRING),
                    'interests': glm.Schema(type=glm.Type.STRING),
                    'travelers': glm.Schema(type=glm.Type.INTEGER),
                }
            ),
            'itinerary': glm.Schema(
                type=glm.Type.ARRAY,
                items=glm.Schema(
                    type=glm.Type.OBJECT,
                    properties={
                        'adventure': glm.Schema(
                            type=glm.Type.OBJECT,
                            properties={
                                'days': glm.Schema(
                                    type=glm.Type.ARRAY,
                                    items=glm.Schema(
                                        type=glm.Type.OBJECT,
                                        properties={
                                            'day': glm.Schema(type=glm.Type.STRING),
                                            'destinations': glm.Schema(
                                                type=glm.Type.ARRAY,
                                                items=glm.Schema(
                                                    type=glm.Type.OBJECT,
                                                    properties={
                                                        'name': glm.Schema(type=glm.Type.STRING),
                                                        'address': glm.Schema(type=glm.Type.STRING),
                                                        'transport': glm.Schema(type=glm.Type.STRING),
                                                        'price': glm.Schema(type=glm.Type.STRING),
                                                        'weather': glm.Schema(type=glm.Type.STRING),
                                                    }
                                                )
                                            )
                                        }
                                    )
                                )
                            }
                        )
                    }
                )
            )
        },
        required=['trip', 'start_date', 'duration', 'budget_per_person', 'interests', 'travelers', 'itinerary', 'adventure', 'days', 'day', 'destinations', 'name', 'address', 'transport', 'price', 'weather']
    )
)

model = model = genai.GenerativeModel(
    model_name='models/gemini-1.5-pro-latest',
    tools=[add_to_database])

class ChatBot:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        self.model = genai.GenerativeModel(model_name='gemini-1.5-flash', system_instruction=["""Hello you are Holly, an AI Travel Assistant.   You speak French.
        If the user asks you for help planning a trip, help them by providing travel ideas based on the information you get from the user. You must know their budget, length of stay, departure date, number of day, number of members for the trip, interests. Always offers adventure choices with each place to visit. You will choose the places in logical order. example: Visit/Restaurants/Activity/Restaurants if the user does not have any information, chooses for him while remaining consistent. 
        In the case where the user does not even know where to go, offers him 3 activities, if the request contains the destination, offers only one adventure. You must put \ before each apostrophe or quotation marks. The number day will be determinate based on the user information.
        
        By talking with the user you will have to obtain information to refine their choices. the expected response format is as follows for 3 adventures lasting 2 days with 3 activities and the <content> should be the name of the Activity (max 15 words) and <Résumé de la réponse> should be summarized in maximum 15 words. .: 
        {
            "response":<Résumé de la réponse>,
            "Aventure 1": {
                "Jour 1":{
                    "Activité 1" : <content>,
                    "Activité 2" : <content>,
                    "Activité 3" : <content>
                },
                "Jour 2":{
                    "Activité 1" : <content>,
                    "Activité 2" : <content>,
                    "Activité 3" : <content>
                }
            },
            "Aventure 2": {
                "Jour 1":{
                    "Activité 1" : <content>,
                    "Activité 2" : <content>,
                    "Activité 3" : <content>
                },
                "Jour 2":{
                    "Activité 1" : <content>,
                    "Activité 2" : <content>,
                    "Activité 3" : <content>
                }
            },
            "Aventure 3": {
                "Jour 1":{
                    "Activité 1" : <content>,
                    "Activité 2" : <content>,
                    "Activité 3" : <content>
                },
                "Jour 2":{
                    "Activité 1" : <content>,
                    "Activité 2" : <content>,
                    "Activité 3" : <content>
                }
            },
            "missing_information" : <A sentence about the missing information>
        }





            """]) # TODO: add instructions about visa and transportation details
        self.chat = None
        self.configure()

    def configure(self):
        genai.configure(api_key=self.api_key)
    
    def initConv(self):
        self.chat = self.model.start_chat(history=[])
    
    def send_message(self, message):
        if not self.chat:
            raise Exception("Chat model is not initialized.")
        response = self.chat.send_message(message)
        return response
    

    
    def get_json(self, message):

        result = model.generate_content(
            f"""
Please complete this diagram with the travel information you obtain from the history. Make an itinerary for each adventure, each adgventure is {message}
""",
    # Force a function call
    tool_config={'function_calling_config': 'ANY'})

        fc = result.candidates[0].content.parts[0].function_call

        return json.dumps(type(fc).to_dict(fc)['args'], indent=4)

