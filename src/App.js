import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Splash from "./components/splash.js";
import Drawer from "./components/drawer.js";
import ToolBar from "./components/toolbar.js";
import Graph from "./components/graph.js";
import "./index.css";
const worker = new Worker("/mainWorker.js", { type: "module" });
const graphDataWorker = new Worker("/graphDataWorker.js");

function App() {
  const searchString = useSelector(state => state.init.searchString);
  const lang = useSelector(state => state.init.lang);
  const dispatch = useDispatch();
  useEffect(() => {
    worker.onmessage = (e) => {
      const graphState = e.data;
      dispatch({type: "graph/set", payload: graphState});
    }
  },[]);
  return (
    <main className="App">
      <Splash />
      {
        (lang !== "" && searchString !== "") && (
        <>
          <Graph mainWorker={worker} graphDataWorker={graphDataWorker} />
          <ToolBar />
        </>
        )
      }
      <Drawer />
    </main>
  );
}

export default App;
