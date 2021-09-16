const graphReducer = (state, action) => {
  const {
    type,
    payload
  } = action;
  switch (type) {
    case "nodes/create":
      if (state.nodes[payload.id]) {
        return state;
      }
      return {
        edges: {...state.edges},
        nodes: {
          ...state.nodes,
          [payload.id]: {
            ...payload,
            edges: [],
          }
        }
      }
    case "edges/create":
      const edgeExists = Object.values(state.edges).find(edge => {
        if (payload.duplex === true) {
          return ((((edge.input === payload.input)
          && (edge.output === payload.output))
            || ((edge.output === payload.input)
              && (edge.input === payload.output)))
          && (edge.entity === payload.entity))
        }
        return ((edge.input === payload.input)
        && (edge.output === payload.output)
        && (edge.entity === payload.entity))
      });
      if (edgeExists) {
        return state;
      }
      const id = Math.max(...Object.keys(state.edges), -1)+1;
      const nodes = {...state.nodes};
      nodes[payload.input] = {
        ...nodes[payload.input],
        edges: [...nodes[payload.input].edges, id]
      };
      nodes[payload.output] = {
        ...nodes[payload.output],
        edges: [...nodes[payload.output].edges, id]
      };
      const newEdge = {
        id,
        entity: payload.entity,
        input: payload.input,
        output: payload.output,
        distance: payload.distance,
        duplex: payload.duplex,
      }
      return {
        ...state,
        nodes,
        edges: {
          ...state.edges,
          [id]: newEdge
        }
      }
    case "nodes/loaded":
      return {
        edges: {...state.edges},
        nodes: {
          ...state.nodes,
          [payload.id]: {
            ...state.nodes[payload.id],
            loaded: true
          }
        }
      }
    case "nodes/remove":
      const rmNodes = {...state.nodes};
      let newState = {...state};
      rmNodes[payload.id].edges.forEach(e => {
        newState = graphReducer(newState, { type: "edges/unlink", payload: {id: e} });
        newState = graphReducer(newState, { type: "edges/remove", payload: {id: e} });
      });
      delete newState.nodes[payload.id];
      return {
        ...newState,
        edges: {...newState.edges},
        nodes: {...newState.nodes}
      }
    case "edges/remove":
      const rmEdges = {...state.edges};
      delete rmEdges[payload.id];
      return {
        ...state,
        edges: rmEdges,
        nodes: {...state.nodes}
      }
    case "edges/unlink":
      const unlinkedNodes = {...state.nodes};
      const edge = state.edges[payload.id];
      const sourceEdges = [...unlinkedNodes[edge.input].edges]
        .filter(e => e !== payload.id);
      const targetEdges = [...unlinkedNodes[edge.output].edges]
        .filter(e => e !== payload.id);
      unlinkedNodes[edge.input] = {
        ...unlinkedNodes[edge.input],
        edges: sourceEdges
      }
      unlinkedNodes[edge.output] = {
        ...unlinkedNodes[edge.output],
        edges: targetEdges
      }
      if (sourceEdges.length === 0) {
        delete unlinkedNodes[edge.input];
      }
      if (targetEdges.length === 0) {
        delete unlinkedNodes[edge.output];
      }
      return {
        ...state,
        nodes: unlinkedNodes,
        edges: {...state.edges}
      }
    default:
      return state;
  }
}
//~ export default graphReducer;
