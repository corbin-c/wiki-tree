importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");
onmessage = function(event) {
		var simulation = d3.forceSimulation(event.data.tree.nodes)
			.force("link", d3.forceLink(event.data.tree.links).id(function(d) { return d.id; }).distance(100))
			.force("charge", d3.forceManyBody().strength(-3000))
			.force("center",  d3.forceCenter(event.data.x_center,event.data.y_center))
			.stop();
		
		for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
			simulation.tick();
		}
		postMessage({nodes: event.data.tree.nodes, links: event.data.tree.links});
}
