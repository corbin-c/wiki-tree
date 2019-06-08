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
	var duration = 500;
	var node = svg_nodes.selectAll("g").data(event.data.nodes, function(d) { return d.name });

	node.exit().transition().duration(2*duration/3)
		.style("opacity",0)
		.remove();

	node.select("circle").style("opacity", 1).transition().duration(duration)
		.attr("cy", function(d) { return d.y })
		.attr("cx", function(d) { return d.x })
		.attr("r",  function(d) { return d.size })

	node.select("text")
		.transition().duration(duration)
		.attr("x", function(d) { return d.x - this.getComputedTextLength() / 2} )
		.attr("y", function(d) { return d.y - d.size-5})
		.style("opacity", 1)

	nu = node.enter().append("g")
		.attr("id",  function(d) { return "id"+d.id })
		.attr("x", function(d) { return d.x })
		.attr("y", function(d) { return d.y })
		.on("click", function(d) { console.log(d.name); tree.nodes[d.name].load((d.type == '14')?"categorymembers":"categories");})

	nu.append("text")
		.text(function(d) {	return d.name; })
			.attr("x", function(d) { return d.x - this.getComputedTextLength() / 2} )
			.attr("y", function(d) { return d.y +10})
			.style("opacity",0).transition().delay(duration).duration(duration).style("opacity", 1)
	
	nu.append("circle")
		.attr("cx", function(d) {
			if ((typeof d.parent !== 'undefined') && (document.getElementById("id"+d.parent) !== 'null'))
			{
				return document.getElementById("id"+d.parent).getElementsByTagName("circle")[0].getAttribute("cx");
			}
			else
			{
				return d.x;
			}
			})
		.attr("cy", function(d) {
			if ((typeof d.parent !== 'undefined') && (document.getElementById("id"+d.parent) !== 'null'))
			{
				return document.getElementById("id"+d.parent).getElementsByTagName("circle")[0].getAttribute("cy");
			}
			else
			{
				return d.y;
			}
			})
		.attr("r",  function(d) { return d.size })
		.style("opacity",0)
		.attr("stroke-width", 2.5)
		.attr("stroke", function(d) { return (d.type==0) ? "white":"black"; })
		.attr("fill", function(d) { return (d.type==0) ? "black":"white"; })
		.style("opacity", 1)

	nu.append("title")
		.text(function(d) { return d.name; })
	
	bi = node.merge(nu)
	bi.select("text")
  		.text(function(d) {	return d.name})
   	bi.select("title")
   		.text(function(d) {	return d.name})
   	
   	link = svg_links.selectAll("line").data(event.data.links, function(d) { return d.source.name+"-"+d.target.name; })
	link.exit().transition().duration(duration/3).style("opacity",0).remove();
	link.enter().append("line")
		.attr("x1", function(d) {
			if ((typeof d.parent !== 'undefined') && (document.getElementById("id"+d.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cx");
			}
			else
			{
				return d.target.x;
			}
			})
			.attr("y1", function(d) {
			if ((typeof d.parent !== 'undefined') && (document.getElementById("id"+d.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cy");
			}
			else
			{
				return d.target.y;
			}
			})
		.attr("x2", function(d) {
			if ((typeof d.parent !== 'undefined') && (document.getElementById("id"+d.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cx");
			}
			else
			{
				return d.target.x;
			}
			})
		.attr("y2", function(d) {
			if ((typeof d.parent !== 'undefined') && (document.getElementById("id"+d.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cy");
			}
			else
			{
				return d.target.y;
			}
			})	
		.attr("stroke", "black")
		.attr("stroke-width", 2.5)
		.attr("stroke-opacity", 1)
	link.transition().duration(duration)
		.attr("x1", function(d) { return d.source.x })
		.attr("x2", function(d) { return d.target.x })
		.attr("y1", function(d) { return d.source.y })
		.attr("y2", function(d) { return d.target.y })
		.attr("stroke-width", 2.5)
			
};
// CONSTRUCT NEW TREE
tree = new Tree();

// BELOW TREE IS FED WITH USER INPUT
document.getElementById("submit").addEventListener("click", function(e){
	//console.log(document.getElementById("str_search").value)
	document.querySelector("form").setAttribute("style","display: none;");
	document.querySelector("svg").setAttribute("style","display: block;");
	tree.new_node(capital_letter(document.getElementById("str_search").value))
	tree.load_nodes("categories");
})

function capital_letter(str) 
{
	str = str.split(" ");
	for (var i=0,x=str.length;i<x;i++) {str[i]=str[i][0].toUpperCase()+str[i].substr(1);}
	return str.join(" ");
}
function incr_wait(i,t,rand=false)
{
	t = (rand) ? Math.floor(t+2*t*Math.random()):t;
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve(i+1);
		},t)
	})
}
