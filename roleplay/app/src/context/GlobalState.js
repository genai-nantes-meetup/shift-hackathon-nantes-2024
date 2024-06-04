"use client";

// context/GlobalState.js
import { createContext, useReducer, useContext } from 'react';
import { updateWorld } from '@/utils/directus';

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

const initialState = {
  user: null,
  token: null,
  // Ajoutez d'autres états globaux ici
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SCENE':
      return {
        ...state,
        currentScene: action.payload,
      };
    case 'SET_CURRENT_WORLD':
      console.log("SET_CURRENT_WORLD", action.payload);
      updateWorld(action.payload);
      return {
        ...state,
        currentWorld: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    // Ajoutez d'autres cas ici
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
