import { ForceGraph3D } from "react-force-graph";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import WikiAPI from "../wikiApi.js";

let api;

const Graph = (props) => {
  const dispatch = useDispatch();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const searchString = useSelector(state => state.init.searchString);
  const drawerAction = useSelector(state => state.drawer.action);
  const lang = useSelector(state => state.init.lang);
  const nodes = useSelector(state => state.graph.nodes);
  const edges = useSelector(state => state.graph.edges);
  const fgRef = useRef();

  const createNode = async (options) => {
    const {
      ns,
      pageid,
      title
    } = options;
    if (typeof pageid === "undefined") { //this is a "missing" article
      return;
    }
    if (pageid === false) { //this is coming from our search form
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
      createNode(results);
      articlesLookup({
        pageids: [results.pageid]
      },true);
      return;
    }
    dispatch({ type: "nodes/create", payload: {
      id: pageid,
      entity: (ns === 0) ? "article" : "category",
      name: title
    }});
  }
  const createEdge = (options) => {
    const {
      entity,
      input,
      output,
      duplex,
      distance
    } = options;
    dispatch({ type: "edges/create", payload: {
      entity,
      input,
      output,
      duplex,
      distance
    }});
  }
  const removeNode = (id) => {
    nodes.find(e => e.id === id).edges.forEach(e => {
      removeEdge(e);
    });
    dispatch({ type: "nodes/remove", payload: { id }});
  }
  const removeEdge = async (id) => {
    dispatch({ type: "edges/unlink", payload: { id }});
    dispatch({ type: "edges/remove", payload: { id }});
  }
  const categoriesLookup = (options) => {
    const callback = (id, pages) => {
      pages.forEach(async e => {
        if (typeof nodes.find(e => e.id === e.pageid) === "undefined") {
          createNode({
            ns: e.ns,
            pageid: e.pageid,
            title: e.title
          });
        }
        createEdge({
          entity: "taxonomy",
          output: id,
          input: e.pageid,
          duplex: true,
          distance: 3
        });
      });
      //~ const toLookup = pages.filter(e =>
        //~ ((e.ns === 0)
        //~ && (!(nodes[e.pageid] && nodes[e.pageid].loaded))));
      //~ articlesLookup({
        //~ pageids: toLookup.map(e => e.pageid)
      //~ });
    }
    options.action = "query";
    options.list = "categorymembers";
    options.cmlimit = 500;
    options.cmtype = ["page", "subcat"];
    lookup(options, callback);
    dispatch({ type: "nodes/loaded", payload: { id: options.cmpageid } });
  }
  const articlesLookup = (options, init=false) => {
    const callback = (page, linkOptions) => {
      if (typeof page.pageid === "undefined") {
        return;
      }
      if (typeof nodes.find(e => e.id === page.pageid) === "undefined") {
        createNode({
          ns: page.ns,
          pageid: page.pageid,
          title: page.title
        });
      }
      createEdge(linkOptions);
    }
    const lhCallback = (id, links) => {
      console.log("lhCallback");
      Object.values(links).forEach(page => {
        Object.values(page.linkshere).forEach(e => {
          callback(e, {
            entity: "backlink",
            output: id,
            input: e.pageid,
            duplex: false,
            distance: 2
          });
        });
      });
    };
    const plCallback = (id, links) => {
      console.log("plCallback");
      Object.values(links).forEach(e => {
        callback(e, {
          entity: "outlink",
          input: id,
          output: e.pageid,
          duplex: false,
          distance: 2
        });
      });
    };
    const clCallback = (id, categories) => {
      console.log("clCallback");
      Object.values(categories).forEach(e => {
        callback(e, {
          entity: "taxonomy",
          input: id,
          output: e.pageid,
          duplex: true,
          distance: 10
        });
      });
    }
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
      [clOptions, clCallback],
      [plOptions, plCallback],
      [lhOptions, lhCallback],
    ].forEach(e => {
      lookup(e[0],e[1]);
    });
    dispatch({ type: "nodes/loaded", payload: { id: options.pageids } });
  }
  const lookup = (options, callback) => {
    const getResults = async (generator, callback, id) => {
      let results = (await generator.next()).value;
      if (typeof results === "undefined") {
        return;
      }
      delete results.redirects;
      results = results[Object.keys(results)[0]];
      callback(id, results)
    }
    api.buildRequest(options).forEach(r => {
      const resultsGenerator = api.fetchAndContinue(r.url);
      getResults(resultsGenerator, callback, r.pageid || r.cmpageid);
    });
  }

  const focusNode = (node) => {
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
    createNode({
      ns: 0,
      title: searchString,
      pageid: false
    });
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
        createNode({
          ns: 0,
          title: options.searchString,
          pageid: false
        });
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
    setGraphData({
      nodes,
      links: edges.map(e => ({
        id: e.id,
        entity: e.entity,
        source: e.input,
        target: e.output
      }))
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
