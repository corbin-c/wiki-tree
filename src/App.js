import React, { useState } from "react";
import Splash from "./components/splash.js";
import WikiGraph from "./data-graph/graph.js";
import "./index.css";

function App() {
  const [nodes,setNodes] = useState([]);
  const [edges,setEdges] = useState([]);
  const callback = (type, action, payload) => {
    console.log(type, action, payload);
   if (type === "nodes") {
     if (action === "add") {
       const newNodes = [...nodes, payload];
       setNodes(newNodes);
     } else {
       const newNodes = nodes.filter(e => e !== payload);
     }
   } else if (type === "edges") {
     if (action === "add") {
       const newNodes = [...nodes, payload];
       setNodes(newNodes);
     } else {
       const newNodes = nodes.filter(e => e !== payload);
     }
   }
  };
  const init = (search) => {
    const graph = new WikiGraph(search.lang, callback);
    graph.createNode({
      ns: 0,
      title: search.searchString,
      pageid: false
    });
  }

  return (
    <main className="App">
      <Splash handleInit={ init } visibility={ nodes.length === 0 } />
    </main>
  );
}

export default App;
