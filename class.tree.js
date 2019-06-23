function Tree()
{
	this.lang = "en";
	this.nodes = {};
	this.links = {};
	this.explicit_links = [];
	this.internal_links = {};
	this.id = 0;
	this.pending_ops = {};
	this.focal_point = 1;
}
Tree.prototype.focus = function(name,linked={},level=0)
{
	if (level == 0)
	{
		linked[this.nodes[name].id] = 0
		this.focal_point = this.nodes[name].id
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
Tree.prototype.graph = function(force=false,new_op=true,parameters=false)
{
	if (new_op)
	{
		var id = this.get_id();
		this.pending_ops[id] = this.clean_tree();
	}
	if ((Object.keys(this.pending_ops).length == 1) || (force))
	{
		id = Object.keys(this.pending_ops);
		id = id[id.length - 1];
		if (parameters)
		{
			force_graph.postMessage({parameters:parameters});
		}
		force_graph.postMessage({id:id,tree:this.pending_ops[id],x_center:Number(document.querySelector("svg").getBoundingClientRect().width)/2,y_center:Number(document.querySelector("svg").getBoundingClientRect().height)/2});
	}
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
				try
				{
					this.nodes[response.title].add_link(this.internal_links[response.title][i],"internal_links",this.nodes[this.internal_links[response.title][i]].add_link(response.title,"internal_links"))
				}
				catch
				{
					console.log("Couldn't create link from "+response.title+" to "+this.internal_links[response.title][i]+".")
				//	console.log(response.title, typeof tree.nodes[response.title])
				//	console.log(this.internal_links[response.title][i],typeof tree.nodes[this.internal_links[response.title][i]])
				}
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
Tree.prototype.add_link = function(array)
{
	this.nodes[array[1]].add_link(array[0],array[2],this.nodes[array[0]].add_link(array[1],array[2]))
}
Tree.prototype.add_internal_link = function(target,source)
{
	if (typeof this.nodes[target] !== "undefined")
	{
		this.nodes[target].add_link(source,"internal_links",this.nodes[source].add_link(target,"internal_links"))
	}
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
	var nodes = Object.values(this.nodes);
	nodes = JSON.parse(JSON.stringify(nodes));
	return {links:this.explicit_links,nodes:nodes}
}
Tree.prototype.get_id = function()
{
	this.id = this.id+1;
	return this.id;
}
