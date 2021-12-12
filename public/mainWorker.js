//~ import graphReducer from "./graphReducer.js";
self.importScripts( "./graphReducer.js" );
const state = {
  nodes: {},
  edges: {}
}
let mainTimer;
let lastTime = 0;
const getVal = (node) => {
  return node
    .edges.reduce((a,b) => {
      return a+1/state.edges[b].distance
    },1)/Object.keys(state.nodes).length
}
const search = (searchString) => {
  const results = Object.values(state.nodes)
    .filter(node => node.name.toLowerCase()
      .includes(searchString.toLowerCase())
    )
    .sort((a,b) => a.name.localeCompare(b.name));
  postMessage({search: results});
}
const graphMaker = (oldNodes="[]") => {
  oldNodes = JSON.parse(oldNodes);
  oldNodes = oldNodes.filter(node => state.nodes[node.id]);
  Object.values(state.nodes).forEach(node => {
    const findNode = oldNodes.find(e => e.id === node.id);
    if (!findNode) {
      oldNodes.push(
        {...node,
          val: getVal(node)
        });
    } else {
      findNode.adjacent = node.adjacent;
      findNode.val = getVal(node);
    }
  });
  postMessage({graph: {
    nodes: oldNodes,
    links: Object.values(state.edges)
  }});
}
const dispatch = (action) => {
  const newState = graphReducer(state, action);
  state.nodes = newState.nodes;
  state.edges = newState.edges;
  clearTimeout(mainTimer);
  let time = (new Date()).getTime();
  if (time - lastTime > 33) {
    console.log("postmessage - delay bypass");
    lastTime = time;
    postMessage({ state });
    return;
  }
  mainTimer = setTimeout(() => {
    lastTime = time;
    //~ postMessage({ state: "ready" });
    postMessage({ state });
  }, 12);
}
const createNode = async (options) => {
  const {
    ns,
    pageid,
    title
  } = options;
  if (typeof pageid === "undefined") { //this is a "missing" article
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
const callbacks = {
  generic: (page, linkOptions) => {
    if (typeof page.pageid === "undefined") {
      return;
    }
    if (typeof state.nodes[page.pageid] === "undefined") {
      if (page.title === "List of Foundation series characters") {
        console.log(page);
      }
      createNode({
        ns: page.ns,
        pageid: page.pageid,
        title: page.title
      });
    }
    createEdge(linkOptions);
  },
  categoryMembers: (id, pages) => {
    console.log("cmCallback");
    pages.forEach(async e => {
      callbacks.generic(e, {
        entity: "taxonomy",
        output: id,
        input: e.pageid,
        duplex: true,
        distance: 4
      });
    });
    const toLookup = pages.filter(e =>
      ((e.ns === 0)
      && (!(state.nodes[e.pageid] && state.nodes[e.pageid].loaded))));
    postMessage({articlesLookup:{
      pageids: toLookup.map(e => e.pageid)
    }});
  },
  linksHere: (id, links) => {
    for (page of Object.values(links)) {
    //~ Object.values(links).forEach(page => {
      callbacks.generic(page, {
        entity: "backlink",
        output: id,
        input: page.pageid,
        duplex: false,
        distance: 1
      });
    }//);
  },
  pageLinks: (id, links) => {
    console.log("plCallback");
    for (page of Object.values(links)) {
    //~ Object.values(links).forEach(page => {
      callbacks.generic(page, {
        entity: "outlink",
        input: id,
        output: page.pageid,
        duplex: false,
        distance: 2
      });
    }//);
  },
  categoriesList: (id, categories) => {
    console.log("clCallback");
    for (page of Object.values(categories)) {
    //~ Object.values(categories).forEach(page => {
      callbacks.generic(page, {
        entity: "taxonomy",
        input: id,
        output: page.pageid,
        duplex: true,
        distance: 10
      });
    }//);
  }
}
onmessage = function(e) {
  const { action, options } = e.data;
  if (action === "dispatch") {
    dispatch({ type: options.type, payload: options.payload});
  } else if (action === "lookupCallback") {
    callbacks[options.callback](options.id, options.results);
  } else if (action === "getNode") {
    postMessage({node:state.nodes[options.id]});
  } else if (action === "getGraph") {
    graphMaker(options.oldNodes);
  } else if (action === "search") {
    search(options.searchString);
  }
}
