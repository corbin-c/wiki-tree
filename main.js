// D3 JS INIT
function zoom_actions(){g.attr("transform", d3.event.transform)}

var svg = d3.select("svg")
var g = svg.append("g").attr("class", "everything");
var svg_links = g.append("g").attr("class", "links")
var svg_nodes = g.append("g").attr("class", "nodes")
var force_graph = new Worker('worker.force.js');
var zoom_handler = d3.zoom().on("zoom", zoom_actions);
zoom_handler(svg);  

force_graph.onmessage = function (event) {
// HERE IS WHERE ACTUAL GRAPH IS DRAWN
	var duration = 100;
	link = svg_links.selectAll("line").data(event.data.links, function(d) { return d.source.name+"-"+d.target.name; })
	link.exit().transition().duration(duration/3).style("opacity",0).remove();
	link.transition().duration(duration)
		.attr("x1", function(d) { return d.source.x })
		.attr("x2", function(d) { return d.target.x })
		.attr("y1", function(d) { return d.source.y })
		.attr("y2", function(d) { return d.target.y })
		.attr("stroke-width", 1)
	link.enter().append("line")
		.attr("x1", function(d) { return d.source.x })
		.attr("x2", function(d) { return d.target.x })
		.attr("y1", function(d) { return d.source.y })
		.attr("y2", function(d) { return d.target.y })
		.attr("stroke", "black")
		.attr("stroke-width", 1.5)
		.attr("stroke-opacity", "1")
			
	var node = svg_nodes.selectAll("g").data(event.data.nodes, function(d) { return d.name });

	node.exit().transition().duration(2*duration/3)
		.style("opacity",0)
		.remove();

	node.select("circle").style("opacity", 1).transition().duration(duration)
		.attr("cy", function(d) { return d.y })
		.attr("cx", function(d) { return d.x })
		.attr("r",  5)

	node.select("text")
		.transition().duration(duration)
		.attr("x", function(d) { return d.x - this.getComputedTextLength() / 2} )
		.attr("y", function(d) { return d.y + 10})
		.style("opacity", 1)

	nu = node.enter().append("g")
		.attr("id",  function(d) { return "id"+d.name })
		.attr("x", function(d) { return d.x })
		.attr("y", function(d) { return d.y })

	nu.append("text")
		.text(function(d) {	return d.name; })
			.attr("x", function(d) { return d.x - this.getComputedTextLength() / 2} )
			.attr("y", function(d) { return d.y +10})
			.style("opacity",0).transition().delay(duration).duration(duration).style("opacity", 1)
	
	nu.append("circle")
		.attr("cx", function(d) { if ((typeof d.parent !== 'undefined') && (typeof d.parent !== 'boolean')) { if (typeof positions[d.parent] === 'undefined') { xorigin = d3.select("#id"+d.parent).attr("x") } else { xorigin = positions[d.parent][0] } } else { xorigin = d.x } return xorigin })
		.attr("cy", function(d) { if ((typeof d.parent !== 'undefined') && (typeof d.parent !== 'boolean')) { if (typeof positions[d.parent] === 'undefined') { xorigin = d3.select("#id"+d.parent).attr("y") } else { xorigin = positions[d.parent][1] } } else { xorigin = d.y } return xorigin })
		.attr("r", 5)
		.style("opacity",0)
		.attr("stroke", "white")
		.attr("cx", function(d) { return d.x })
		.attr("cy", function(d) { return d.y })
		.style("opacity", 1)

	nu.append("title")
		.text(function(d) { return d.name; })
	
	bi = node.merge(nu)
	bi.select("text")
  		.text(function(d) {	return d.name})
   	bi.select("title")
   		.text(function(d) {	return d.name})
};
// CONSTRUCT NEW TREE
tree = new Tree();

// BELOW TREE IS FED WITH USER INPUT
document.getElementById("submit").addEventListener("click", function(e){
	console.log(document.getElementById("str_search").value)		
	tree.new_node(capital_letter(document.getElementById("str_search").value))
	tree.load_nodes("categories");
})

function capital_letter(str) 
{
	str = str.split(" ");
	for (var i=0,x=str.length;i<x;i++) {str[i]=str[i][0].toUpperCase()+str[i].substr(1);}
	return str.join(" ");
}
