import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Splash from "./components/splash.js";
import Drawer from "./components/drawer.js";
import ToolBar from "./components/toolbar.js";
import Graph from "./components/graph.js";
import "./index.css";
const worker = new Worker("/mainWorker.js");

function App() {
  const init = useSelector(state => state.init);
  const dispatch = useDispatch();

  useEffect(() => {
    if (init.start === true) {
      worker.postMessage({
        action: "dispatch",
        options: { type: "reset" }
      });
    }
  },[init.start])
  
  useEffect(() => {
    dispatch({ type: "worker/entity", payload: worker });
    worker.onmessage = (e) => {
      dispatch({ type: "worker/message", payload: e.data });
    };
  },[]);
  
  return (
    <main className="App">
      <Splash />
      {
        ((init.start === true)
          && (init.lang !== "")
          && (init.searchString !== ""))
          && (
        <>
          <Graph />
          <ToolBar />
        </>
        )
      }
      <Drawer />
    </main>
  );
}

export default App;
