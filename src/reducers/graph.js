const graphReducer = (state, action) => {
  const {
    type,
    payload
  } = action;
  if (type === "graph/set") {
    return {
      ...state,
      nodes: payload.nodes,
      edges: payload.edges
    }
  }
  return state;
}

const adjacentNodes = (id, entity) => {
  return (state) => {
    try {
      let edges = state.graph.nodes[id].edges;
      if (entity !== "*") {
      edges = edges.filter(e => 
          state.graph.edges[e].entity === entity);
      }
      let output = [];
      Object.values(state.graph.nodes).forEach(e => {
        if ((typeof e.edges.find(e => edges.includes(e)) !== "undefined")
          && (e.id !== id)) {
          output.push(e);
        }
      });
      return output;
    } catch(e) {
      return [];
    }
  }
}

export { adjacentNodes };
export default graphReducer;
