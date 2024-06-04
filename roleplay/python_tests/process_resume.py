from utils import processing

# input_test=open("./data/audio_input_processed/Contourner_le_pont.m4a.txt", "r",encoding='utf-8').read()
db=processing.ProcessChunk(file_path_input="data/audio_input_to_process/", file_path_output="data/resume/",mode='debug')

# db=processing.ProcessChunk(input_string=input_test)
