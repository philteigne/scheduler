import React from "react";
import {useState} from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]); 

  function transition(newMode){
    setHistory(prev => [...prev, newMode])
  }

  function back() {
    setHistory(prev => prev.length > 1 ? [...prev.slice(0, prev.length - 1)] : [...prev])
  }

  return { mode: history[history.length -1], transition, back };
}