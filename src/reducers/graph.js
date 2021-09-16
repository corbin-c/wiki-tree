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
      const edges = state.graph.nodes[id].edges
        .filter(e => 
          state.graph.edges[e].entity === entity);
      let output = [];
      Object.values(state.graph.nodes).forEach(e => {
        if (e.edges.find(e => edges.includes(e))
          && (e.id !== id)) {
          output.push(e);
        }
      });
      return output;
    } catch {
      return [];
    }
  }
}

export { adjacentNodes };
export default graphReducer;
