onmessage = function(e) {
  const oldNodes = JSON.parse(e.data.oldNodes);
  const {
    nodes,
    edges
  } = e.data.newState;
  let graphNodes = [];
  if (typeof oldNodes !== "undefined" && oldNodes.length > 0) {
    graphNodes = [...oldNodes];        
  }
  graphNodes = graphNodes.filter(node => nodes[node.id]);
  Object.values(nodes).forEach(node => {
    if (!graphNodes.find(e => e.id === node.id)) {
      graphNodes.push(node);
    }
  });
  postMessage({
    nodes: graphNodes,
    links: Object.values(edges).map(e => ({
      id: e.id,
      entity: e.entity,
      source: e.input,
      target: e.output
    }))
  });
}
