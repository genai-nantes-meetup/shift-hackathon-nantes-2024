// nUIqldErbGUwC6Nrf5mlvJ5kYyCHjdFZ
import React, { useState } from 'react';
import MistralClient from '@mistralai/mistralai';

const MistralComponent = ({ parentVariable }) => {
  const [content, setContent] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = "nUIqldErbGUwC6Nrf5mlvJ5kYyCHjdFZ";

  const getBestFrenchMeal = async () => {
    const client = new MistralClient(apiKey);

    // Construit le message de chat en combinant le parentVariable et la question saisie
    const message = `
    Contexte: Jeu de rôle type Pathfinder.
    Voici le transcript de l'audio:
    ${parentVariable}.

    Donne des renseignements à partir du message suivant: ${content}.
    Réponse en français.`;

    // Réponse courte JSON. N'invente rien. Réponse en français. Les éléments doivent décrits avec détail. Ne dit rien de plus.
    // format json:
    // Reponse: (
    //     each_acteurs : acteurs[];
    //     scene: (actions_memorables, informations_importantes);
    //     each_lieu: lieu[];
    //     );
    // acteur : (nom, PJ_PNJ);
    // lieu: (nom_lieu, interieur_exterieur, jour_nuit, elements_decoratifs[], elements_ambiance[]);
    // `;



    setLoading(true);

    try {
      const chatResponse = await client.chat({
        model: 'open-mixtral-8x7b',
        response_format: { 'type': 'json_object' },
        messages: [{ role: 'user', content: message }],
      });

      const responseContent = chatResponse.choices[0].message.content;
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

  return (
    <div className="container mx-auto mt-5 p-4 bg-gray-900 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Mistral Chat</h1>
      <form onSubmit={(e) => { e.preventDefault(); getBestFrenchMeal(); }}>
        <div className="flex items-center mb-3">
          <input
            type="text"
            className="flex-grow form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 mr-2"
            id="userMessage"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600" disabled={loading}>
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Envoie'
            )}
          </button>
        </div>
      </form>
      <h2 className="text-xl font-semibold mt-4">Response:</h2>
      <pre className="bg-gray-800 text-white p-3 border rounded whitespace-pre-wrap">{response}</pre>
    </div>
  );
};

export default MistralComponent;
