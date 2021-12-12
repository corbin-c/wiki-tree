import initReducer from "./reducers/init.js";
import workerReducer from "./reducers/worker.js";
import drawerReducer from "./reducers/drawer.js";
import settingsReducer from "./reducers/settings.js";

const initialState = {
  init: {
    start: false,
    lang: navigator.language.split("-")[0] || "en",
    searchString: ""
  },
  drawer: {
    content: {},
    action: {}
  },
  settings: {
    bloom: 0,
    arrows: 0,
    nodeRepulsion: -50,
    curvature: 0
  },
  worker: {
    postMessage: () => {},
    message: {}
  }
}
/*
 * https://github.com/vasturiano/react-force-graph/blob/master/example/click-to-focus/index.html
 * + créer un statut "focus" pour les nodes et les edges adjacents
 * + gérer les duplex / input / output edges
 */
export default function rootReducer(state = initialState, action) {
  if (action.reset) {
    console.warn("RESET");
    state = {...state,
      init: initialState.init,
      settings: initialState.settings,
      drawer: initialState.drawer,
      worker: initialState.worker
    };
  }
  return {
    init: initReducer(state.init, action),
    drawer: drawerReducer(state.drawer, action),
    worker: workerReducer(state.worker, action),
    settings: settingsReducer(state.settings, action)
  }
}
