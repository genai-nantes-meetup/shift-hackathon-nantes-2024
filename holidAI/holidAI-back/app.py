from flask import Flask, request, jsonify
from model import ChatBot
from flask_cors import CORS, cross_origin
import google.generativeai as genai
import os
app = Flask(__name__)
CORS(app) 


chatbot = ChatBot()
chatbot.initConv()

@app.route('/map', methods=['GET'])
@cross_origin()
def map():
    msg = ""
    for i in range(len(chatbot.chat.history)):
        msg += chatbot.chat.history[i].parts[0].text + " "

    response = chatbot.get_json(
        msg
    )
    return response

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    response = chatbot.send_message(data['content'])
    print(response._result.candidates[0].content.parts)
    return response._result.candidates[0].content.parts[0].text

@app.route('/chat/file', methods=['POST'])
def upload_file():
  if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
  
  current_directory = os.getcwd()

  file = request.files['file']
  if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
  
  file.save(os.path.join(current_directory , file.filename))

  direcory = os.path.join(current_directory , file.filename)
  sample_file = genai.upload_file(path = direcory , display_name ="voyage" )
  print(sample_file)
  if os.path.exists(direcory):
    os.remove(direcory)
  response = chatbot.model.generate_content(["Ask questions about the travel the user want to make taking into account the image , only speak in french" , sample_file])
  chatbot.chat.history.append({
    "role":"user" ,
    "parts":[{"text":response.text}]})
  return (response.text)
  

@app.route('/summarize', methods=['GET']) 
def summarize():

  msg = ""
  msg += chatbot.chat.history[len(chatbot.chat.history)].parts[0].text + " "

  response = chatbot.get_json(
      msg
    )
  map_response = response
  
  summary_response = chatbot.send_message(f"Please summarize JSON the following itinerary: {map_response}") 
 
  summary_text = summary_response._result.candidates[0].content.parts[0].text
  summarized_response = { "summary": summary_text, "details": map_response } 
  return jsonify(summarized_response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)