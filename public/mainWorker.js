//~ import graphReducer from "./graphReducer.js";
self.importScripts( "./graphReducer.js" );
const state = {
  nodes: {},
  edges: {}
}
const dispatch = (action) => {
  const newState = graphReducer(state, action);
  state.nodes = newState.nodes;
  state.edges = newState.edges;
  postMessage(state);
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
        distance: 3
      });
    });
    //~ const toLookup = pages.filter(e =>
      //~ ((e.ns === 0)
      //~ && (!(nodes[e.pageid] && nodes[e.pageid].loaded))));
    //~ articlesLookup({
      //~ pageids: toLookup.map(e => e.pageid)
    //~ });
  },
  linksHere: (id, links) => {
    console.log("lhCallback");
    Object.values(links).forEach(page => {
      Object.values(page.linkshere).forEach(e => {
        callbacks.generic(e, {
          entity: "backlink",
          output: id,
          input: e.pageid,
          duplex: false,
          distance: 2
        });
      });
    });
  },
  pageLinks: (id, links) => {
    console.log("plCallback");
    Object.values(links).forEach(e => {
      callbacks.generic(e, {
        entity: "outlink",
        input: id,
        output: e.pageid,
        duplex: false,
        distance: 2
      });
    });
  },
  categoriesList: (id, categories) => {
    console.log("clCallback");
    Object.values(categories).forEach(e => {
      callbacks.generic(e, {
        entity: "taxonomy",
        input: id,
        output: e.pageid,
        duplex: true,
        distance: 10
      });
    });
  }
}
onmessage = function(e) {
  const { action, options } = e.data;
  if (action === "dispatch") {
    dispatch({ type: options.type, payload: options.payload});
  } else if (action === "lookupCallback") {
    callbacks[options.callback](options.id, options.results);
  }
}
