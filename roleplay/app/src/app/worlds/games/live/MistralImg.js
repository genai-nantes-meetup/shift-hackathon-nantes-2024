// nUIqldErbGUwC6Nrf5mlvJ5kYyCHjdFZ
import React, { useState, useEffect, useRef } from 'react';
import MistralClient from '@mistralai/mistralai';
import 'tailwindcss/tailwind.css';

const MistralImg = ({ transcripts }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const apiKey = "nUIqldErbGUwC6Nrf5mlvJ5kYyCHjdFZ";
  const hasFetchedRef = useRef(false);


  const getImgMistral = async () => {
    const client = new MistralClient(apiKey);

    // Construit le message de chat en combinant les transcripts
    const message = `
    Contexte: Jeu de rôle type Pathfinder.
    Voici le transcript de l'audio:
    ${transcripts.join('\n')}.
    
    Réponse courte JSON. N'invente rien. Réponse en français. Les éléments doivent décrits avec détail. Ne dit rien de plus.
    format json:
    Reponse: (
        each_acteurs : acteurs[];
        scene: (actions_memorables, informations_importantes);
        each_lieu: lieu[];
        );
    acteur : (nom, PJ_PNJ);
    lieu: (nom_lieu, interieur_exterieur, jour_nuit, elements_decoratifs[], elements_ambiance[]);
    `;

    setLoading(true);

    try {
      // const chatResponse = await client.chat({
      //   model: 'open-mixtral-8x7b',
      //   response_format: { type: 'json_object' },
      //   messages: [{ role: 'user', content: message }],
      // });
      const chatResponse = 'Bonjour';
      const responseContent = 'Bonjour';
      // const responseContent = chatResponse.choices[0].message.content;
      let formattedResponse;
      try {
        formattedResponse = JSON.stringify(JSON.parse(responseContent), null, 2);
      } catch (e) {
        formattedResponse = responseContent;
      }

      setResponse(formattedResponse);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the response.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current && transcripts.length > 0) {
      getImgMistral();
      hasFetchedRef.current = true;
    }
  }, [transcripts]);

  return (
    <div className="container mx-auto mt-5 p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mt-4">Transcriptions Batch:</h2>
      {/* <ul className="list-none p-0">
        {transcripts.map((transcript, index) => (
          <li key={index} className="bg-gray-800 p-2 my-2 rounded shadow whitespace-pre-wrap">
            {transcript}
          </li>
        ))}
      </ul> */}
      <div className="mt-4">
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <pre className="bg-gray-800 text-white p-3 border rounded whitespace-pre-wrap">{response}</pre>
        )}
      </div>
    </div>
  );
};

export default MistralImg;

