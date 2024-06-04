import MistralClient from '@mistralai/mistralai';

const apiKey = "nUIqldErbGUwC6Nrf5mlvJ5kYyCHjdFZ";
const model = "open-mixtral-8x7b";

const requestChatClient = async ({ messages, schema }) => {
  const client = new MistralClient(apiKey);
  const chatResponse = await client.chat({
    model,
    response_format: { 'type': 'json_object', schema: schema || {} },
    messages: messages || []
  });

  return chatResponse.choices[0].message.content;
};

export const generateContext = ({ transcriptions, message }) =>
  new Promise (async (resolve, reject) => {
    requestChatClient([{
      role: 'user',
      content: `
      Contexte: Jeu de rôle type Pathfinder.
      Voici le transcript de l'audio:
      ${transcriptions}.

      Donne des renseignements à partir du message suivant: ${message}.
      Réponse en français.`
    }])
      .then(resolve)
      .catch(reject);
  });

  export const generateImage = ({ transcriptions }) =>
    new Promise (async (resolve, reject) => {
      requestChatClient({
        messages: [{
            "role": "system",
            "content": "You are an assistant that speak only French. The following message is a voice transcription for a game session of Pathfinder's Role play game. Extract actors, scene and place details from it and answer in JSON.",
        }, {
          role: 'user',
          content: `
          ${transcriptions.join('\n')}.
          `
        }],
        schema: {
          type: "object",
          properties: {
            actors: {
              type: "string",
              description: "Liste de toutes les personnes présentes dans la description"
            },
            scene: {
              type: "string",
              description: "Contient toutes les actions mémorables et les informations importantes"
            },
            place: {
              type: "string",
              description: "Le lieu identifié où se situe la scène ainsi que la description précise des éléments décoratifs et des éléments ambiants"
            }
          },
          required: ["actors", "scene", "place"]
        }
      })
        .then(resolve)
        .catch(reject);
    });
