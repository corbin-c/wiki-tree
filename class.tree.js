function Tree()
{
	this.lang = "en";
	this.nodes = {};
	this.links = {};
	this.explicit_links = [];
	this.internal_links = {};
	this.wv = {};
	this.id = 0;
	this.focal_point = false;
}
Tree.prototype.focus = function(name,linked={},level=0)
{
	if (level == 0)
	{
		linked[this.nodes[name].id] = 0
		this.focal_point = name
	}
	level++;
	for (i in this.nodes[name].links)
	{
		if ((typeof linked[this.nodes[i].id] === "undefined") || (linked[this.nodes[i].id] > level) || (typeof linked[this.nodes[name].links[i].id] === "undefined") || (linked[this.nodes[name].links[i].id] > level))
		{
			if ((typeof linked[this.nodes[i].id] === "undefined") || (linked[this.nodes[i].id] > level)) 
			{
				linked[this.nodes[i].id] = level
			}
			if ((typeof linked[this.nodes[name].links[i].id] === "undefined") || (linked[this.nodes[name].links[i].id] > level))
			{
				linked[this.nodes[name].links[i].id] = level
			}
			if (level < 3)
			{
				linked = this.focus(i,linked,level)
			}
		}
	}
	return linked;
}
Tree.prototype.graph = function()
{
	force_graph.postMessage({tree:this.clean_tree(),x_center:Number(document.querySelector("svg").getBoundingClientRect().width)/2,y_center:Number(document.querySelector("svg").getBoundingClientRect().height)/2})
	/*if (tree.focal_point)
	{
	links = tree.focus(tree.focal_point);
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
		}
	}*/
}
Tree.prototype.changelang = function(lang)
{
	this.lang = lang;
}
Tree.prototype.new_node = function(response,parent)
{
	if (typeof response === "string") {response = {title:response,ns:0}}
	if (typeof this.nodes[response.title] === "undefined")
	{
		this.nodes[response.title] = new Node(response,parent);
		if (typeof this.internal_links[response.title] !== "undefined")
		{
			for (var i in this.internal_links[response.title])
			{
				this.nodes[response.title].add_link(this.internal_links[response.title][i],"internal_links",null,this.nodes[this.internal_links[response.title][i]].add_link(response.title,"internal_links",null)
)
			}
		}
	}
}
Tree.prototype.load_nodes = async function(type)
{
	for (i in this.nodes)
	{
		if (!this.nodes[i].loaded[type])
		{
			this.nodes[i].load(type);
			//await incr_wait(0,10);
		}
	}
}
Tree.prototype.add_link = function(array,queue)
{
	this.nodes[array[1]].add_link(array[0],array[2],queue,this.nodes[array[0]].add_link(array[1],array[2],queue))
}
Tree.prototype.add_internal_link = function(target,source)
{
	//on vérifie si target existe, si oui le lien est validé
	if (typeof this.nodes[target] !== "undefined")
	{
		//console.log("node found")
		this.nodes[target].add_link(source,"internal_links",null,this.nodes[source].add_link(target,"internal_links",null))
	}
	//sinon, on vérifie si target est déjà présent dans les liens internes, et auquel cas le lien est validé aussi
	/*else if (typeof this.internal_links[target] !== "undefined")
	{
		//console.log("link found")
		this.new_node(target,this.nodes[source].id);
		this.nodes[source].add_link(target,"internal_links",null)
		this.nodes[target].add_link(source,"internal_links",null,false)
		this.nodes[this.internal_links[target]].add_link(target,"internal_links",null)
		this.nodes[target].add_link(this.internal_links[target],"internal_links",null,false)
		delete this.internal_links[target];
	}*/
	//sinon on ajoute le lien à la liste des liens internes en attente
	else
	{
		try
		{
			this.internal_links[target].push(source);
		}
		catch
		{
			this.internal_links[target] = [source];
		}
	}
}
Tree.prototype.clean_tree = function()
{
	var nodes = Object.keys(this.nodes)
	var clean_nodes = [];
	for (i in nodes)
	{
		clean_nodes.push({parent:this.nodes[nodes[i]].parent,name:this.nodes[nodes[i]].name,id:this.nodes[nodes[i]].id,type:this.nodes[nodes[i]].type,size:Math.floor(Object.keys(this.nodes[nodes[i]].links).length/5)+5})
	}
	return {links:this.explicit_links,nodes:clean_nodes}
}
Tree.prototype.get_id = function()
{
	this.id = this.id+1;
	return this.id;
}
