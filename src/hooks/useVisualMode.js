import { useState } from 'react'

export default function useVisualMode(initial) {

const [mode, setMode] = useState(initial);
const [history, setHistory] = useState([initial]);

const transition = (newMode, replace = false) => {

  if (!replace) {

    setMode(newMode)
    setHistory(history => [...history, newMode])
  } else {

    setHistory(history => [...history.slice(0, -1), newMode])
    setMode(newMode)
  }
  
  // if (replace) {
  //   const newHistory = [...history];
  //   setMode(newHistory[newHistory.length - 1])
  //   setHistory(newHistory.slice(0, -1))
  // }
  
  //   setMode(newMode);
  //   setHistory(history => [...history, newMode]);
}

const back = () => {

  setMode(history.length > 1 ? history[history.length - 2] : history[history.length - 1])

  setHistory(history => history.length > 1 ? history.slice(0, -1) : history)

}

  return {mode, transition, back};
}

