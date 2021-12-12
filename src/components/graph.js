import { ForceGraph3D } from "react-force-graph";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import WikiAPI from "../wikiApi.js";

let api;

const Graph = (props) => {
  const dispatch = useDispatch();
  const [idle, setIdle] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [highlight, setHighlight] = useState({ nodes: [], edges: [] });

  const worker = useSelector(state => state.worker.entity);
  const message = useSelector(state => state.worker.message);

  const searchString = useSelector(state => state.init.searchString);
  const lang = useSelector(state => state.init.lang);

  const drawerAction = useSelector(state => state.drawer.action);

  const nodeRepulsion = useSelector(state => state.settings.nodeRepulsion);
  const curvature = useSelector(state => state.settings.curvature);
  const bloom = useSelector(state => state.settings.bloom);
  const arrows = useSelector(state => state.settings.arrows);

  const timer = useRef(null);
  const fgRef = useRef();

  const workerDispatch = (options) => {
    worker.postMessage({
      action: "dispatch",
      options
    });
  }

  const workerCallback = (options) => {
    worker.postMessage({
      action: "lookupCallback",
      options
    });
  }

  const createNode = async (title) => {
    const url = api.buildRequest({
      action: "query",
      list: "search",
      srsearch: title,
      srnamespace: 0,
      srlimit: 1
    })[0].url;
    let results = await fetch(url);
    results = await results.json();
    results = results.query.search[0];
    workerDispatch({ type: "nodes/create", payload: {
      id: results.pageid,
      entity: (results.ns === 0) ? "article" : "category",
      name: results.title
    }});
    articlesLookup({
      pageids: [results.pageid]
    },true);
    return;
  }
  const removeNode = (id) => {
    workerDispatch({ type: "nodes/remove", payload: { id }});
  }
  const removeEdge = async (id) => {
    workerDispatch({ type: "edges/unlink", payload: { id }});
    workerDispatch({ type: "edges/remove", payload: { id }});
  }
  const categoriesLookup = (options) => {
    options.action = "query";
    options.list = "categorymembers";
    options.cmlimit = 5;
    options.cmtype = ["page", "subcat"];
    lookup(options, "categoryMembers");
    workerDispatch({ type: "nodes/loaded", payload: { id: options.cmpageid } });
  }
  const articlesLookup = (options, init=false) => {
    options.action = "query";
    const lhOptions = { ...options };
    const plOptions = { ...options };
    const clOptions = { ...options };
    lhOptions.prop = "info";
    lhOptions.generator = "linkshere";
    lhOptions.glhlimit = 500;
    lhOptions.glhnamespace = 0;

    plOptions.gpllimit = 500;
    plOptions.gplnamespace = 0;
    plOptions.generator = "links";
    plOptions.prop = "info";

    clOptions.gcllimit = 500;
    clOptions.generator = "categories";
    clOptions.prop = "info";
    clOptions.gclshow = "!hidden";
  
    /*for (let e of */[
      [clOptions, "categoriesList"],
      [plOptions, "pageLinks"],
      [lhOptions, "linksHere"],
    ]/*) {
      lookup(e[0],e[1]);
    }*/.forEach(e => {
      lookup(e[0],e[1]);
    });
    let ids = options.pageids;
    if (typeof ids !== "object") {
      ids = [ids];
    }
    ids.forEach(id => {
      workerDispatch({ type: "nodes/loaded", payload: { id } });
    });
  }
  const lookup = (options, callback) => {
    const getResults = async (generator, callback, id) => {
      let results = (await generator.next()).value;
      if (typeof results === "undefined") {
        return;
      }
      delete results.redirects;
      results = results[Object.keys(results)[0]];
      workerCallback({ callback, id, results });
      getResults(generator, callback, id);
    }
    api.buildRequest(options).forEach(r => {
      const resultsGenerator = api.fetchAndContinue(r.url);
      getResults(resultsGenerator, callback, r.pageid || r.cmpageid);
    });
  }

  const focusNode = (node) => {
    node = graphData.nodes.find(e => e.id === node.id);
    const distance = 80;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      1500  // ms transition duration
    );
    dispatch({type: "drawer/content", payload: {
      component: node.entity,
      title: node.name,
      id: node.id
    }});
  }

  const nodeHover = (id) => {
    const adjacent = graphData.nodes.find(e => e.id === id).adjacent;
    setHighlight({
      edges: adjacent.map(e => e.edgeId),
      nodes: [...adjacent.map(e => e.id), id]
    });
  }

  useEffect(() => {
// eslint-disable-next-line no-undef
    //~ let z = new SharedArrayBuffer(2048)
    //~ console.error("sab",z);

    const wikiAPI = new WikiAPI(lang); 
    api = wikiAPI;
    createNode(searchString);
    //~ graphWorker.onmessage = (e) => {
      //~ setGraphData(e.data);
    //~ }
  },[]);

  useEffect(() => {
    if (message.state) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        //~ graphWorker.postMessage({
          //~ oldNodes: JSON.stringify(graphData.nodes),
          //~ newState: message.state
        //~ });
        worker.postMessage({
          action: "getGraph",
          options: {
            oldNodes: JSON.stringify(graphData.nodes)
          }
        });
      }, 12);
    } else if (message.graph) {
      setGraphData(message.graph);
    } else if (message.articlesLookup) {
      articlesLookup(message.articlesLookup);
    }
  },[message]);

  useEffect(() => {
    const actionInput = drawerAction;
    if (!actionInput.action) {
      return;
    }
    const action = actionInput.action;
    const options = actionInput.options;
    switch (action) {
      case "addSearch":
        createNode(options.searchString);
        return;
      case "articlesLookup":
        articlesLookup(options);
        return;
      case "removeNode":
        removeNode(options.id);
        return;
      case "focusNode":
        focusNode(options.node);
        return;
      case "categoriesLookup":
        categoriesLookup(options);
        return;
      default:
        return;
    }
  }, [drawerAction]);
  
  useEffect(() => {
    fgRef.current.d3Force("charge").strength(nodeRepulsion);
    if (idle) {
      fgRef.current.d3ReheatSimulation();
    }
  },[nodeRepulsion]);

  return (
    <ForceGraph3D
      onEngineStop={ () => { setIdle(true) } }
      linkOpacity={1}
      linkColor={ (e) => {
          if (highlight.edges.includes(e.id)) {
            return "#fbfbf2ff";
          }
          return "#fbfbf240";
        }
      }
      linkCurvature={ curvature }
      onNodeHover={ (e) => { 
          if (e === null) {
            setHighlight({ nodes: [], edges: []});
            return;
          }
          nodeHover(e.id);
        }
      }
      onNodeClick={ focusNode }
      ref={fgRef}
      nodeColor={ e => {
          if (highlight.nodes.includes(e.id)) {
            return "#fbfbf2";
          }
          return (e.entity === "category") ? "#ea526f":"#1b5299"
        }
      }
      linkDirectionalArrowLength={ arrows }
      linkDirectionalArrowRelPos={1}
      nodeOpacity={ .99 }
      backgroundColor="rgba(0,0,0,0)"
      graphData={ graphData }
    />
  )
  //~ return (<></>)
}

export default Graph;
