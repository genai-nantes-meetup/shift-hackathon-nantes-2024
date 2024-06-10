import React, { useState, useEffect, useRef } from "react";
import Input from "./Input";
import Bubble from "./Bubble";
import useChatBotApi from "../services/useChat";


const Form = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [data, setData] = useState(null);
  const [compteur, setCompteur] = useState(0);
  const [fileResponse, setFileResponse] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize loading as true
  const {error, sendText, sendFile } = useChatBotApi(
    setData,
    setFileResponse
  );

  const conversationRef = useRef(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    if (data) {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        console.log("test");
        if (data.includes("{")) {
          let validData
          try {
          const test = data.split('```')[1].replace("json","")
          console.log(test);
           validData = JSON.parse(test);
            
          } catch (error) {
            console.log('error : ', error)
          }
          
          console.log('compteur : ', compteur)
          console.log('compteur : ', prompt)
          if (!validData) {
            
          
          if(compteur < 3) {
            sendText(`Refais moi la réponse avec le bon format Json. Avec seulement le json, je te donne le format exact : 
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
            `);
            setCompteur(compteur +1);
            parsedData = 'fail';
          } else {
            parsedData = "Mince, il y a eu un problème sur l'organisation du voyage. 🤕 Fournissez nous plus d'informations !";
          }
        } else {
          parsedData = validData
        }
        } else {
          parsedData = data;
        }      
      }

      setConversation((prev) => [
        ...prev,
        {
          text: parsedData,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false,
        },
      ]);
      setData("");
      setPrompt("");
      setLoading(false); // Set loading to false once the data is processed
    }
  }, [data]);

  useEffect(() => {
    if (fileResponse) {
      let parsedData;
      try {
        parsedData = JSON.parse(fileResponse);
      } catch (error) {
        console.log(error);
        parsedData =
          "Mince, il y a eu un problème sur l'organisation du voyage. 🤕 Fournis-nous plus d'informations, s'il te plaît !";
      }

      setConversation((prev) => [
        ...prev,
        {
          text: parsedData,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false,
        },
      ]);
      setFileResponse("");
      setFile(null);
      setPrompt("");
      setLoading(false); // Set loading to false once the file response is processed
    }
  }, [fileResponse]);

  const handleSubmit = async (e, selectedFile) => {
    e.preventDefault();

    if (prompt && !selectedFile) {
      setConversation((prev) => [
        ...prev,
        {
          text: prompt,
          timestamp: new Date().toLocaleTimeString(),
          isUser: true,
        },
      ]);
      setPrompt("");
      setLoading(true); // Set loading to true when sending text
      await sendText(prompt);
    } else if (!prompt && selectedFile) {
      setConversation((prev) => [
        ...prev,
        {
          text: "Fichier transmis. ✅",
          timestamp: new Date().toLocaleTimeString(),
          isUser: true,
        },
      ]);
      setLoading(true); // Set loading to true when sending files
      await sendFile(file);
    }
  };
  
  return (
    <div
      className="flex flex-1 flex-col h-full mb-4 max-w-2xl bg-primary text-white rounded-2xl border-primary-purple shadow-md relative mr-10 overflow-hidden px-4"
      style={{
        boxShadow: "0 0 50px 0 rgba(255, 255, 255, 0.2)",
        border: "0.5px solid",
        borderColor: "#696FFF",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1/20 bg-gradient-to-b from-black to-transparent h-10 rounded-2xl pt-10"></div>
      <div
        className="flex-grow flex flex-col items-center p-4 space-y-4 overflow-y-auto scroll-smooth"
        ref={conversationRef}
      >
        <div className="w-full space-y-4">
          <div className="pt-8 pb-2 lg:flex hidden">
            <h1 className="text-4xl font-semibold font-montserrat px-4 leading-10">
              👋 Hello, raconte moi le voyage de tes rêves
            </h1>
          </div>
          <Bubble key={-1} text="" timestamp="" isUser={false} />
          {conversation.map((conv, index) => (
            <Bubble
              key={index}
              text={conv.text}
              timestamp={conv.timestamp}
              isUser={conv.isUser}
            />
            ))}

            {loading && (
            <div className="w-full flex justify-start py-4">
              <div className="loader"></div> {/* Add your spinner styling here */}
            </div>
            )}
          </div>
      </div>
      { conversation.map((conv) => {
         return Object.keys(conv.text)
        .filter(
            (key) =>
            key.startsWith("Aventure") && Object.values(conv.text[key]).length > 0
          )
          .map((adventure) => ({
              name: adventure,
              days: conv.text[adventure],
          }))
          .filter((adventure) => Object.values(adventure.days).length > 0)
          .filter((adventure) => Object.values(adventure.days["Jour 1"]).length > 0)
          .filter((adventure) => adventure.days["Jour 1"]["Activité 1"].trim() !== "");
      }) ?
            <div className="ml-3">
            <button type="submit" className="mx-2 my-2 px-4 py-2 rounded-lg border border-primary-purple hover:bg-primary-purple/50">
       Export PDF
          </button>
          <button type="submit" className="mx-2 my-2 px-4 py-2 rounded-lg border bg-primary-purple hover:bg-primary-purple/50">
       Export Carte
          </button>
            </div> : null
      }
      <Input
        prompt={prompt}
        setPrompt={setPrompt}
        file={file}
        setFile={setFile}
        handleSubmit={handleSubmit}
      />
      <style jsx>
        {`
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #343943;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-track {
            background-color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default Form;
