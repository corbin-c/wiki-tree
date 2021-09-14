import graphReducer from "./reducers/graph.js";
import initReducer from "./reducers/init.js";
import drawerReducer from "./reducers/drawer.js";

const initialState = {
  graph: {
    nodes: [],
    edges: []
  },
  init: {
    lang: "",
    searchString: ""
  },
  drawer: {
    content: {},
    action: {}
  },
}
/*
 * https://github.com/vasturiano/react-force-graph/blob/master/example/click-to-focus/index.html
 * + créer un statut "focus" pour les nodes et les edges adjacents
 * + gérer les duplex / input / output edges
 */
export default function rootReducer(state = initialState, action) {
  if (action.reset) {
    state = {...state,
      graph: initialState.graph,
      init: initialState.init,
      drawer: initialState.drawer
    };
  }
  return {
    graph: graphReducer(state.graph, action),
    init: initReducer(state.init, action),
    drawer: drawerReducer(state.drawer, action)
  }
}
