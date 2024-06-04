const gladiaKey = "c5e95c51-c819-417a-96e5-c6b805fab962";
const uploadUrl = "https://api.gladia.io/v2/upload/";
const transcriptionUrl = "https://api.gladia.io/v2/transcription/";

const headers = { 'x-gladia-key': gladiaKey, 'accept': 'application/json' };

async function pollForResult(resultUrl) {
  while (true) {
    const pollResponse = await fetch(resultUrl, { method: "GET", headers }
    ).then((res) => res.json());

    if (pollResponse.status === "done") {
      const dialog = getDialogFromJson(pollResponse.result);
      console.log(dialog);
      return dialog;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

function getDialogFromJson(response) {
  let dialog = "- ";
  const utterances = response.transcription.utterances;
  let speaker = 0;

  utterances.forEach(utterance => {
      // Retour à la ligne si changement de speaker
      if (utterance.speaker !== speaker) {
          dialog += "\n- ";
          speaker = utterance.speaker;
      }
      // Ajout de l'utterance à la chaîne de dialogue
      dialog += utterance.text + " ";
  });

  // Retour à la ligne pour terminer la chaîne de dialogue
  dialog += "\n";
  return dialog;
}

export const transcribeAudio = (context = "", audioBlob = null) =>
  new Promise (async (resolve, reject) => {
    // Step 1: Upload the audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, 'conversation.wav');

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: formData
    }).then(res => res.json());

    if (!uploadResponse?.audio_url) {
      return "Erreur lors de l'upload de l'audio.";
    }

    // Step 2: Request transcription
    const transcriptionResponse = await fetch(transcriptionUrl, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: uploadResponse.audio_url,
        context_prompt: context || "Enregistrement d une partie de jeu de role de type Dongeon et Dragons.",
        custom_vocabulary: ["MJ", "prompt", "contexte"],
        diarization: true,
        diarization_config: {
          number_of_speakers: 3,
          min_speakers: 1,
          max_speakers: 4
        }
      })
    }).then(res => res.json());

    if (!transcriptionResponse?.result_url) reject(new Error("Erreur lors de la transcription."));
    else {
      // Step 3: Poll for the transcription result
      // Define headers
      const result = await pollForResult(transcriptionResponse.result_url);
      resolve(result); // Assuming result contains the transcription text
    }
  });
