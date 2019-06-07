importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");

onmessage = function(event) {
	var center = {x:event.data.width/2,y:event.data.height/2}
	var simulation = d3.forceSimulation(event.data.tree.nodes)
		.force("link", d3.forceLink(event.data.tree.links).id(function(d) { return d.id; }).distance(40))
		.force("charge", d3.forceManyBody().strength(-300))
		.force("center",  d3.forceCenter(center.x, center.y))
		.stop();
	
	for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
		simulation.tick();
	}
postMessage({nodes: event.data.tree.nodes, links: event.data.tree.links});
}
