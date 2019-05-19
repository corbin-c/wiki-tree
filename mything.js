function zoom_actions(){
    g.attr("transform", d3.event.transform)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;



var svg = d3.select("svg")
	.attr("width", x)
	.attr("height", y)
    width = +svg.attr("width"),
    height = +svg.attr("height");
var color = d3.scaleOrdinal(["#31486C","#F4CB2A","#768FA5","#CBC9BC"]);
svg.append("circle").attr("color", function() { color(0); }).attr("color", function() { color(1); }).attr("color", function() { color(2); }).attr("color", function() { color(3); }).remove()
var nodes_data =  []
var links_data = []
var status = 0;
var lang = document.getElementById("lang").value;
var duration = 800
d3.select(window).on('resize', function() {
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	svg
	.attr("width", x)
	.attr("height", y)
});

var g = svg.append("g")
    .attr("class", "everything");

links = g.append("g").attr("class", "links")
nodes = g.append("g").attr("class", "nodes")

var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

zoom_handler(svg);  
  
var worker = new Worker('force.worker.js');
worker.onmessage = function (event) {
	nodes_data = event.data.nodes;
	links_data = event.data.links;
	draw();
};

function submenu(s,q=0)
{
	if (q == 0) {
		str2 = "loadDoc(\"oai=1&rq=" + s +"\")"
		str1 = "loadDoc(\"type=sons&pj=fr&rq=" + s +"\")"
		str3 = "loadDoc('type=newnode&oai=1&rq=" + s +"')"
		str4 = "loadDoc(\"type=delthis&rq=" + s +"\")"
		str5 = "loadDoc(\"obi=1&rq=" + s +"\")"
		quer = s;
	}
	else {
		str1 = "loadDoc('type=newnode&pj=fr&rq=" + q +"')"
		//str2 = "loadDoc('obi=1&rq=" + q +"')"
		str3 = "loadDoc('oai=1&rq=" + q +"')"
		str4 = "loadDoc(\"type=delthis&rq=" + q +"\")"
		quer = q;
	}

	d3.select("#details").html("");
	subm = d3.select("#details").append("ul")
	subm.append("li").append("a").attr("href",window.location.hash).attr("onclick",str1).append("img").attr("src","link.png")
	if (q == 0) {
		subm.append("li").append("a").attr("href",window.location.hash).attr("onclick",str5).append("img").attr("src","basic_globe.png")
		subm.append("li").append("a").attr("href",window.location.hash).attr("onclick",str2).append("img").attr("src","loop.png")
	}
	subm.append("li").append("a").attr("href",window.location.hash).attr("onclick",str3).append("img").attr("src","thuglife.png")
	subm.append("li").append("a").attr("href",window.location.hash).attr("onclick",str4).append("img").attr("src","dl.png")
	subm = d3.select("#details").html() + s
	d3.select("#details").html(subm);

	c_s = d3.select("#compl_search");
	c_s.html("")
	c_s.append("li").append("a").attr("href",'https://'+lang+'.wikipedia.org/wiki/'+encodeURI(quer)).attr("target","_blank").append("img").attr("src","w.png")
	c_s.append("li").append("a").attr("href",'https://www.google.com/search?q='+encodeURI(quer)).attr("target","_blank").append("img").attr("src","gg.png")

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function go_graph(graph)
{
		status = "running";
		
		d_nodes = graph.nodes;
		d_links = graph.links;
		worker.postMessage({
			  nodes: d_nodes,
			  links: d_links,
			  center: { x: width / 2, y: height / 2 }
			});
		worker.postMessage("TICKIT");

}
function loadDoc(string_to_pass,q=0) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	json = JSON.parse(this.responseText)

	//console.log(json);
	if (json[2])
	{
		loadDoc("type=qing")
	}
	if (json[0] == 1)
	{
		a = JSON.parse(json[1])
		lang = a['lang']
		go_graph(a)
	}
	else if (json[0] == 0)
	{
		submenu(json[1],q)
	}

    }
  };
  xhttp.open("POST", "./controleur.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(string_to_pass);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function new_ajax(d)
{
	erid = d.id
	hid = "#id"+erid

	d3.selectAll("text").transition().duration(duration/3).style("fill","#999999")
	d3.selectAll("circle").transition().duration(duration/3).attr("stroke","white")
	d3.select(hid).select("circle").transition().duration(duration/3).attr("stroke","black")
	d3.select(hid).select("text").transition().duration(duration/3).style("fill","black")
	link = g.selectAll(".links").selectAll("line").transition().duration(duration/6).attr("stroke","#999999").attr("stroke-opacity","0.6")

	link.filter(function(e) {return ((e.target == d) || (e.source == d))})
		.transition().duration(duration/6).attr("stroke","black")
		.attr("stroke-opacity","1")

	g.selectAll(".links").selectAll("line").filter(function(e) {
		if (e.target == d)
		{
			d3.select("#id"+e.source.id).select("circle").transition().duration(duration/2).attr("stroke", "#A76282")
			d3.select("#id"+e.source.id).select("text").transition().duration(duration/2).style("fill","#A76282")
		}
		if (e.source == d)
		{
			d3.select("#id"+e.target.id).select("circle").transition().duration(duration/2).attr("stroke", "#A76282")
			d3.select("#id"+e.target.id).select("text").transition().duration(duration/2).style("fill","#A76282")
		}
		})

	if ((d.group == 3) || (d.group == 1))
	{
		submenu(d.title)
		//loadDoc("type=sons&pj=fr&rq=" + d.id)	
		//alert(d.id);
	}
	if ((d.group == 2) || (d.group == 0))
	{
		//loadDoc("type=newnode&pj=fr&rq=" + d.id)
		loadDoc("pj=fr&details=" + d.title, d.title)
		//alert(d.id);
	}
}

function togglemenu(w)
{
	if (window.location.hash.search("men3") >= 0)
	{
		new_href = "#"

	}
	else
	{
		new_href = "#men3"
	}
	document.getElementById("mainbutton").setAttribute("href",new_href)
}
function test(e)
{
	if (e.keyCode == 13 || e.which == 13)
	{
		person = document.forms["mainform"].elements["requete"].value
		if (status == "running")
			{
				loadDoc("type=newnode&rq=" + person)
				loadDoc("pj=fr&details=" + person, person)	
			}
			else
			{
				loadDoc("new=1&lang="+lang+"&type=newnode&rq=" + person)
				loadDoc("pj=fr&details=" + person+"&lang="+lang, person)
			}
	}
}
function show(toggle_state,group1,group2)
{
	if (toggle_state)
	{
		visib = "visible";
	}
	else
	{
		visib = "hidden";
	}
	//d3.selectAll("text").
	nodes.selectAll("g").filter(function(d) { return d.group == group1; }).select("text").style("visibility",visib)
	nodes.selectAll("g").filter(function(d) { return d.group == group2; }).select("text").style("visibility",visib)
}
function qunatize()
{
	qt_lvl = document.getElementById("qt").value;
	loadDoc("qt=" + qt_lvl)
}
function changelang()
{
	if (status == "running")
	{
		if (confirm("Changing language erases your current tree. Are you sure ?"))
		{
			lang = document.getElementById("lang").value;
			loadDoc("lang=" + lang)
		}
	}
	else
	{
			lang = document.getElementById("lang").value;
	}
}
function openitall()
{
	loadDoc("oai=1")
}