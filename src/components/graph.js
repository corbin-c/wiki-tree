import { ForceGraph3D } from "react-force-graph";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import WikiAPI from "../wikiApi.js";

let api;

const Graph = (props) => {
  const mainWorker = props.mainWorker;
  const graphDataWorker = props.graphDataWorker;
  const dispatch = useDispatch();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const searchString = useSelector(state => state.init.searchString);
  const drawerAction = useSelector(state => state.drawer.action);
  const lang = useSelector(state => state.init.lang);
  const nodes = useSelector(state => state.graph.nodes);
  const edges = useSelector(state => state.graph.edges);
  const fgRef = useRef();

  const workerDispatch = (options) => {
    mainWorker.postMessage({
      action: "dispatch",
      options
    });
  }

  const workerCallback = (options) => {
    mainWorker.postMessage({
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
    options.cmlimit = 500;
    options.cmtype = ["page", "subcat"];
    lookup(options, "categoryMembers");
    workerDispatch({ type: "nodes/loaded", payload: { id: options.cmpageid } });
  }
  const articlesLookup = (options, init=false) => {
    options.action = "query";
    const lhOptions = { ...options };
    const plOptions = { ...options };
    const clOptions = { ...options };
    lhOptions.prop = ["linkshere"];
    lhOptions.lhlimit = 500;
    lhOptions.lhnamespace = 0;

    plOptions.gpllimit = 500;
    plOptions.gplnamespace = 0;
    plOptions.generator = "links";
    plOptions.prop = "info";

    clOptions.gcllimit = 500;
    clOptions.generator = "categories";
    clOptions.prop = "info";
    clOptions.gclshow = "!hidden";
  
    [
      [clOptions, "categoriesList"],
      [plOptions, "pageLinks"],
      [lhOptions, "linksHere"],
    ].forEach(e => {
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
      workerCallback({ callback, id, results })
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

  useEffect(() => {
    const wikiAPI = new WikiAPI(lang); 
    api = wikiAPI;
    createNode(searchString);
  },[]);
  
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
    graphDataWorker.onmessage = (e) => {
      setGraphData(e.data);
    }
  }, []);

  useEffect(() => {
    graphDataWorker.postMessage({
      oldNodes: JSON.stringify(graphData.nodes),
      newState: {
        nodes,
        edges
      }
    });
  }, [nodes, edges]);
  
  return (
    <ForceGraph3D
      linkOpacity={0.25}
      linkColor="#fbfbf2"
      onNodeClick={ focusNode }
      ref={fgRef}
      nodeColor={ e => e.entity === "category" ? "#ea526f":"#1b5299" }
      nodeOpacity={ 1 }
      backgroundColor="rgba(0,0,0,0)"
      graphData={ graphData }
    />
  )
  //~ return (<></>)
}

export default Graph;
