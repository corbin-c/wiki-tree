// D3 JS INIT
function zoom_actions(){
	var transform = d3.event.transform;
	zoom = transform;
	g.attr("transform", transform)
}
var svg = d3.select("svg")
var g = svg.append("g").attr("class", "everything");
var h = g.append("g").attr("class", "main_container");;
var svg_nodes2 = h.append("g").attr("class", "backnodes")
var svg_links = h.append("g").attr("class", "links")
var svg_nodes = h.append("g").attr("class", "nodes")
var f_x = 0;
var f_y = 0;
var zoom = {};
var display_state = {state:0,id:0};
var force_graph = new Worker('worker.force.js');
var zoom_handler = d3.zoom().on("zoom", zoom_actions);
//zoom_handler(svg);
svg.call(zoom_handler)
document.querySelector("#info_tile").addEventListener("click",function (e) {document.querySelector("#focus_text").remove();document.querySelector("#info_tile").classList.remove("visible");display_state.state = 0;} )
// CONSTRUCT NEW TREE
tree = new Tree();
force_graph.onmessage = function (event) {
	delete tree.pending_ops[event.data.id]
	if (Object.keys(tree.pending_ops).length >= 1)
	{
		tree.graph(true,false);
		tree.pending_ops = {};
	}
	d3_graph(event);
};
// BELOW TREE IS FED WITH USER INPUT
document.getElementById("submit").addEventListener("click", async function(e){
	//console.log(document.getElementById("str_search").value)
	document.querySelector("form").setAttribute("style","opacity: 0;");
	document.querySelector("svg").setAttribute("style","visibility:hidden; display: block;");
	document.querySelector("#foot_menu").setAttribute("style","display: flex;");
	tree.new_node(capital_letter(document.getElementById("str_search").value))
	labels = document.getElementById("foot_menu").querySelectorAll("label")
	for (i in [...labels])
	{
		labels[i].addEventListener("click", function (e) { e.target.nextSibling.classList.toggle("visible"); })
	}
	document.getElementById("k_factor").addEventListener("change", function(e){
		tree.graph(true,true,Number(e.target.value))
	})
	svg.call(zoom_handler.transform, d3.zoomIdentity
		.translate(-Number(document.querySelector("svg").getBoundingClientRect().width)*200,-Number(document.querySelector("svg").getBoundingClientRect().height)*200)
		.scale(400)
		);
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
function d3_graph(event)
{
	// HERE IS WHERE ACTUAL GRAPH IS DRAWN
	var duration = 220;
	/*if (document.querySelector("#id"+tree.focal_point+" circle") !== null)
	{
		f_x = document.querySelector("#id"+tree.focal_point+" circle").getAttribute("cx");
		f_y = document.querySelector("#id"+tree.focal_point+" circle").getAttribute("cy");
		x=Number(document.querySelector("svg").getBoundingClientRect().width)/2
		y=Number(document.querySelector("svg").getBoundingClientRect().height)/2
		console.log(x,f_x,f_x-x)
		h.transition().duration(duration)
			.attr("transform", function () { return "translate("+(x-f_x)+","+(y-f_y)+")"; })
	}*/
	var node2 = svg_nodes2.selectAll("g").data(event.data.nodes, function(d) { return d.name });
	var node = svg_nodes.selectAll("g").data(event.data.nodes, function(d) { return d.name });

	node.exit().transition().duration(duration)
		.style("opacity",0)
		.remove();

	node.select("circle").transition().duration(duration)
		.attr("cy", function(d) { return d.y })
		.attr("cx", function(d) { return d.x })
		.attr("r",  function(d) { return d.size })
		
	node2.exit().transition().duration(duration)
		.style("opacity",0)
		.remove();

	node2.select("circle").transition().duration(duration)
		.attr("cy", function(d) { return d.y })
		.attr("cx", function(d) { return d.x })
		.attr("r",  function(d) { return d.size+4 })

	node.select("text")
		.transition().duration(duration)
		.attr("x", function(d) { return d.x - d.name.length*7.25 } )
		.attr("y", function(d) { return d.y - d.size-5})

	nu = node.enter().append("g")
		.attr("id",  function(d) { return "id"+d.id })
		.attr("x", function(d) { return d.x })
		.attr("y", function(d) { return d.y })
		.on("click", function(d) {
			console.log(d.name);
			display(d);
			})
	nu2 = node2.enter().append("g")
		.attr("id",  function(d) { return "id2"+d.id })
		.attr("x", function(d) { return d.x })
		.attr("y", function(d) { return d.y })


	nu.append("circle")
		.attr("cx", function(d) {
			if (d.id == 1)
			{
				svg.transition().duration(1000)
					.call(zoom_handler.transform, d3.zoomIdentity
					.scale(1)
					.translate(0,0)
					)
					.attr("style","background-color:white;visibility:visible; display: block;");
				document.querySelector("form").setAttribute("style","display:none;");
			}
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
		.attr("r", function(d) {return d.size;})
		.attr("stroke-width", 2)
		.attr("class", function(d) { return "t"+d.type; })
		.transition().duration(duration)
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })


	nu.append("text")
		.text(function(d) {	return d.name; })
			.attr("x", function(d) { return d.x - d.name.length*7.25 } )
			.attr("y", function(d) { return d.y - d.size-5})
	
			
	nu.append("title")
		.text(function(d) { return d.name; })
		
	nu2.append("circle")
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
		.attr("r",  function(d) { return d.size + 4 })
		.attr("stroke-width", 0)
		.attr("class", "bt")
		.transition().duration(duration)
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })

	nu2.append("title")
		.text(function(d) { return d.name; })
			
	bi = node.merge(nu)
	bi.select("text")
		.text(function(d) {	return d.name})
	bi.select("title")
		.text(function(d) {	return d.name})
	
	bi2 = node.merge(nu2)
	bi2.select("text")
		.text(function(d) {	return d.name})
	bi2.select("title")
		.text(function(d) {	return d.name})
	
	link = svg_links.selectAll("line").data(event.data.links, function(d) { return d.source.name+"-"+d.target.name; })
	link.exit().transition().duration(duration).style("opacity",0).remove();
	link.enter().append("line")
		.attr("x1", function(d) { 
			if ((typeof d.target.parent !== 'undefined') && (document.getElementById("id"+d.target.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cx");
			}
			else
			{
				return d.source.x;
			}
			})
			.attr("y1", function(d) {
			if ((typeof d.target.parent !== 'undefined') && (document.getElementById("id"+d.target.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cy");
			}
			else
			{
				return d.source.y;
			}
			})
		.attr("x2", function(d) {
			if ((typeof d.target.parent !== 'undefined') && (document.getElementById("id"+d.target.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cx");
			}
			else
			{
				return d.source.x;
			}
			})
		.attr("y2", function(d) {
			if ((typeof d.target.parent !== 'undefined') && (document.getElementById("id"+d.target.parent) !== 'null'))
			{
				return document.getElementById("id"+d.target.parent).getElementsByTagName("circle")[0].getAttribute("cy");
			}
			else
			{
				return d.source.y;
			}
			})
		.attr("id", function(d) { return "id"+d.id })	
		.attr("stroke", "black")
		.attr("stroke-width", 3)
		.transition().duration(duration)
			.attr("x1", function(d) { return d.source.x })
			.attr("x2", function(d) { return d.target.x })
			.attr("y1", function(d) { return d.source.y })
			.attr("y2", function(d) { return d.target.y })
		
	link.transition().duration(duration)
		.attr("x1", function(d) { return d.source.x })
		.attr("x2", function(d) { return d.target.x })
		.attr("y1", function(d) { return d.source.y })
		.attr("y2", function(d) { return d.target.y })
		.attr("stroke-width", 3)
}
function infobox(content,id)
{
	if (display_state.id == id)
	{ 
		var abstract = document.createElement("article");
		document.querySelector("#info_tile").append(abstract);
		abstract.innerHTML += content;
	}
}
function multimedia(imageinfo)
{
	if (imageinfo.mime.split("/")[0] == "image")
	{
		return "<p><img src='"+imageinfo.url+"' /></p>"
	}
	else if (imageinfo.mime == "application/ogg")
	{
		return "<audio src='"+imageinfo.url+"'></audio>"
	}
	else
	{
		return "<a href='"+imageinfo.descriptionurl+"'>"+imageinfo.url+"</a>";
	}
}
function display(node)
{
	//tree.nodes[node.name].load((node.type == '14')?"categorymembers":"categories");
	if (display_state.state == 0)
	{
		var cloned = document.querySelector("#id"+node.id+" text").cloneNode(true)
		try
		{
			document.querySelector(".track").classList.remove("track");
		}
		catch
		{
			{}
		}
		cloned.setAttribute("id","focus_text")
		document.querySelector(".main_container").append(cloned)
		display_state.state = 1;
		display_state.id = node.id;
	}
	else if (display_state.state == 1)
	{
		if (display_state.id != node.id)
		{
			document.querySelector("#focus_text").remove();
			display_state.state = 0;
			display(node)
		}
		else
		{
			document.querySelector("#info_tile").classList.add("visible");
			display_state.state = 2;
			document.querySelector("#info_tile").innerHTML = "<h3>"+node.name+"</h3>";
			tree.nodes[node.name].load("abstract");
			//tree.nodes[node.name].load((node.type == '14')?"categorymembers":"categories");
		}
	}
	else
	{
		if (display_state.id == node.id)
		{
			document.querySelector("#focus_text").remove();
			document.querySelector("#info_tile").classList.remove("visible");
			document.querySelector("#id"+node.id+" text").classList.add("track");
			tree.nodes[node.name].load((node.type == '14')?"categorymembers":"categories");
			display_state.state = 0;
		}
		else
		{
			document.querySelector("#focus_text").remove();
			document.querySelector("#info_tile").classList.remove("visible");
			display_state.state = 0;
			display(node)
		}
	}
	/*links = tree.focus(node.name);
	//g.attr("style", function() { return "transform-origin: "+document.querySelector("#id"+tree.focal_point+" circle").getAttribute("cx")+" "+document.querySelector("#id"+tree.focal_point+" circle").getAttribute("cy")+" 0;";});
	svg_nodes.selectAll("g").attr("class","")
	svg_links.selectAll("line").attr("class","")
	for (i in links)
	{
		try
		{
			document.getElementById("id"+i).classList.add("highlight"+links[i]);
		}
		catch
		{
			console.log("id"+i)
		}
	}*/
}
