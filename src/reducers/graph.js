const graphReducer = (state, action) => {
  const {
    type,
    payload
  } = action;
  const findItem = (state, id) => {
    return state.find(item => item.id === id);
  }
  const findIndex = (state, id) => {
    return state.findIndex(item => item.id === id);
  }
  switch (type) {
    case "nodes/create":
      if (findItem(state.nodes, payload.id)) {
        return state;
      }
      return {
        edges: [...state.edges],
        nodes: [
          ...state.nodes,
          {
            ...payload,
            edges: [],
          }
        ]
      }
    case "edges/create":
      const edgeExists = state.edges.find(edge => {
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
      const id = Math.max(...state.edges.map(e => e.id), -1)+1;
      const nodes = [...state.nodes];
      nodes[findIndex(state.nodes, payload.input)] = {
        ...nodes[findIndex(state.nodes, payload.input)],
        edges: [...nodes[findIndex(state.nodes, payload.input)].edges, id]
      };
      nodes[findIndex(state.nodes, payload.output)] = {
        ...nodes[findIndex(state.nodes, payload.output)],
        edges: [...nodes[findIndex(state.nodes, payload.output)].edges, id]
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
        edges: [
          ...state.edges,
          newEdge
        ]
      }
    case "nodes/remove":
      return {
        ...state,
        edges: [...state.edges],
        nodes: [...state.nodes].filter(node => node.id !== payload.id)
      }
    case "edges/remove":
      return {
        ...state,
        nodes: [...state.nodes],
        edges: [...state.edges].filter(edge => edge.id !== payload.id)
      }
    case "edges/unlink":
      const unlinkedNodes = [...state.nodes];
      const edge = findItem(state.edges, payload.id);
      const sourceEdges = [...unlinkedNodes[findIndex(unlinkedNodes, edge.input)].edges]
        .filter(e => e !== payload.id);
      const targetEdges = [...unlinkedNodes[findIndex(unlinkedNodes, edge.output)].edges]
        .filter(e => e !== payload.id);
      unlinkedNodes[findIndex(unlinkedNodes, edge.input)] = {
        ...unlinkedNodes[findIndex(unlinkedNodes, edge.input)],
        edges: sourceEdges
      }
      unlinkedNodes[findIndex(unlinkedNodes, edge.output)] = {
        ...unlinkedNodes[findIndex(unlinkedNodes, edge.output)],
        edges: targetEdges
      }
      return {
        ...state,
        nodes: unlinkedNodes.filter(e => e.edges.length > 0),
        edges: [...state.edges]
      }
    default:
      return state;
  }
}
export default graphReducer;
