/** En l'état :

La ligne suivante permet la sélection d'une scène
dispatch({ type: 'SET_CURRENT_SCENE', payload: newScene });

*/
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';
import AudioRecorder from "@/utils/audio-recorder";
import { transcribeAudio } from "@/utils/transcript";
import { generateContext, generateImage } from "@/utils/mistral";
import { updateWorld } from '@/utils/directus';
import Scene from '@/components/scene';
import generateResponse from '@/utils/gcp';

const batchSize = 3;

export default function EditWorld() {
  const router = useRouter();
  const dispatch = useGlobalDispatch();
  const { currentWorld, currentScene } = useGlobalState();
  const [recording, setRecording] = useState(false);
  const [image, setImage] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [recorder] = useState(new AudioRecorder());

  const startRecording = () => {
    if (!recording) {
      recorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (recording) {
      recorder.stop();
      setRecording(false);
    }
  };


  const saveScene = (scene = {}, index) => {
    if (!currentWorld) return false;
    if (index !== undefined) {
      // update existing one
      currentWorld.scenes[index] = scene;
      dispatch({ type: 'SET_CURRENT_WORLD', payload: currentWorld });
      dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
    } else {
      // add new one
      const newScene = {
        type: "image",
        loading: false,
        index: currentWorld?.scenes?.length || 0,
        name: "",
        place: "",
        actors: [],
        images: [],
        imageb64: [],
        ...scene
      };
      if (currentWorld?.scenes?.length) currentWorld.scenes.push(newScene);
      else currentWorld.scenes = [newScene];
      dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
      return dispatch({ type: 'SET_CURRENT_WORLD', payload: currentWorld });
    }
  };


  const addImageToScene = (index, jsondata, imageb64) => {
    console.log("addImageToScene currentWorld", currentWorld);
    console.log("addImageToScene index, jsondata", index, jsondata);
    currentWorld.scenes[index].image = jsondata;
    currentWorld.scenes[index].imageb64 = imageb64;
    console.log("Dans addImageToScene imageb64", imageb64);
    if (currentWorld.scenes[index].name) currentWorld.scenes[index].loading = false;
    dispatch({ type: 'SET_CURRENT_WORLD', payload: currentWorld });
  };

  // New batch round
  const newBatch = async () => {
    const batch = transcriptions.slice(-batchSize);
    const index = currentWorld?.scenes?.length || 0;
    console.log("newBatch", batch, index);
    // Set rich batch object
    await saveScene({
      transcriptions: batch,
      index,
      name: `Scene #${index}`,
      image: null,
      date: new Date(),
      loading: true
    });
    // Parallelized
    // generateContext({ transcriptions: batch, message: "" })
    //   .then(context => {
    //     console.log("context", context);
    //   })
    //   .catch(console.error);
    generateImage({ transcriptions: batch })
      .then(image => {
        console.log("image", image);
        generateResponse(image)
          .then(response => {
            console.log("response", response);
            const imageb64 = response.result.image;
            addImageToScene(index, image, imageb64);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  recorder.onData = blob => {
    transcribeAudio("", blob)
      .then(d => {
        // Start transcription from audio blob
        setTranscriptions(prev => [...prev, d]);
        console.log("Batch size", transcriptions.length, transcriptions.length % batchSize);
        if (transcriptions.length % batchSize === 0 && transcriptions.length > 0) {
          newBatch();
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    //
  }, []);

  const handleSceneClick = (scene) => {
    // dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
    dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
  };

  return (
    <div className="h-full p-4 relative">
      <div className={`absolute ease-in-out duration-300 justify-center flex flex-col gap-4 top-0 ${recording ? "items-end scale-50 right-0" : "items-center right-1/2 translate-x-1/2"}`}>
        <div className="relative">
          {recording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
          <button
            className="rounded-full text-3xl bg-red-500 cursor-pointer h-20 w-20 hover:scale-110 ease-in-out duration-200 drop-shadow-md hover:drop-shadow-xl"
            onClick={() => {
              if (recording) stopRecording();
              else startRecording();
            }}
          >
            {recording ? <i className="fas fa-microphone-slash text-white" /> : <i className="fas fa-microphone text-white" />}
          </button>
        </div>
        {!recording && <span className="text-gray-500">Démarrer l'enregistrement</span>}
      </div>

      {currentScene && (
        <section className="flex">
          <div className="flex flex-col gap-5 items-center">
            <div className="p-3 rounded-lg">
              {currentScene.place}
            </div>
            {/* <h1 className="text-2xl">{currentScene.name}</h1> */}
            {/* {currentScene.image && (
              <div className="relative" style={{ padding: "2px" }}>
                <div className="rounded-lg bg-cover block absolute" style={{
                  backgroundImage: `url(${currentScene.image})`,
                  opacity: "0.2",
                  top: "-2px",
                  left: "-2px",
                  height: "calc(100% + 4px)",
                  width: "calc(100% + 4px)"
                }} />
                <div className="top-0 left-0 rounded-lg h-full w-full bg-cover block absolute" style={{
                  backgroundImage: `url(${currentScene.image})`,
                  margin: "2px",
                  height: "calc(100% - 4px)",
                  width: "calc(100% - 4px)"
                }} />
              </div>
            )} */}
            <div></div>
            <div></div>
            <div></div>
            <div className="p-3 rounded-lg mt-auto">
              <p> Fin de session : {currentScene.date ? new Date(currentScene.date).toLocaleString() : ''}</p>
              {/* <p>Transcript: {currentScene.transcriptions.join(', \n')}</p>
              <p>Resume: {currentScene.image}</p> */}
              {/* Retour à la ligne nok */}

            </div>
          </div>

        </section>
      )}
      {currentScene && <Scene scene={currentScene} />}

    </div>
  );
}
