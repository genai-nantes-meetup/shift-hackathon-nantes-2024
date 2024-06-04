from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import LLMChain

from langchain.prompts import PromptTemplate
from langchain.chains import SequentialChain

from datetime import datetime
import json

from dotenv import load_dotenv
from . import file

import glob

load_dotenv("./.env")

model="mixtral-8x7b-32768" #GROQAPI
# model="llama3-70b-8192"

class ProcessChunk():
    def __init__(self,file_path_input=None,file_path_output="data/resume/", mode='production', input_string=None):
        self.file_path_input=file_path_input
        self.file_path_output=file_path_output

        self.mode = mode

        if input_string=="":
            print(f"Error input_string='{input_string}'.")
        else:
            self.input_string = input_string
            # print(f"file_path_input: '{file_path_input}', file_path_output: '{file_path_output}'")
            self.import_chunks()

            self.audio_resume=[]
            for chunk in self.audio_chunks:
                try:
                    timestamp=datetime.timestamp(datetime.now())
                    # print(f"timestamp: {timestamp}")
                    json_output={'timestamp' :timestamp}
                    json_output['filename']=chunk[0]

                    resume= self.process_chunk(chunk[1])
                    resume=resume.replace("MJ","Maitre du Jeu")
                    json_output['resume']=resume
                    print(f"resume: {resume}")
                    with open(self.file_path_output+str(timestamp)+".json", "w") as outfile:
                        json.dump(json_output, outfile)
                        if self.mode == 'debug':
                            file.move_file("data/audio_input_to_process/","data/audio_input_processed/",chunk[0])
                except Exception as e:
                    print(f"Error processing chunk {chunk[0]}: {e}")
        pass

    def import_chunks(self):
        self.audio_chunks=[]
        if self.mode == 'debug':
            # All files and directories ending with .txt and that don't begin with a dot:
            liste_chunks=glob.glob("./"+self.file_path_input+"*.txt")
            for chunk in liste_chunks:
                filename= chunk.split("\\")[-1]
                self.audio_chunks.append((filename, open(chunk, "r",encoding='utf-8').read()))
        elif self.input_string is not None:
                    self.audio_chunks.append(("input_string.txt", self.input_string))   
        else:
            raise ValueError("Invalid mode or input_string not provided")
        pass

    def process_chunk(self,chunk):
        template ="""
        Contexte: Jeu de rôle type Donjon et Dragon (DnD 3.5).
        Résume la situation suivante pour renseigner le maitre du jeu à partir d'un audio. Précise si des sorts ou compétences spécifiques ont été utilisées. Voici le transcript de l'audio:
        {audio_chunk}

        Réponse courte JSON. N'invente rien. Réponse en français. Les éléments doivent décrits avec détail.
        
        format json:
        Reponse: (
            each_acteurs : acteurs[];
            scene: (actions_memorables, informations_importantes);
            each_lieu: lieu[];
            );
        acteur : (nom, PJ_PNJ);
        lieu: (nom_lieu, interieur_exterieur, jour_nuit, elements_decoratifs[], elements_ambiance[]);
        """
        #Réponse au format json (lieu, actions_memorables, informations_importantes):
        prompt = PromptTemplate(
            input_variables=["audio_chunk"],
            template = template                      
        )

        synthese = LLMChain(
            llm=ChatGroq(temperature=0, model=model,response_format={"type": "json_object"}),# response_format={"type": "json_object", "schema": Resume.model_json_schema()}),
            prompt=prompt,
            output_key="transcript_resume", 
        )


        overall_chain = SequentialChain(
            chains=[synthese],
            input_variables=["audio_chunk"],
            output_variables=["transcript_resume"],
            verbose=False
        )

        return overall_chain(chunk)['transcript_resume']