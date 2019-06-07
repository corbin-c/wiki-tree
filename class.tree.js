function Tree()
{
	this.lang = "en";
	this.nodes = {};
	this.links = {};
	this.explicit_links = [];
	this.wv = {};
	this.id = 0;
}
Tree.prototype.changelang = function(lang)
{
	if (confirm("Changing language will erase current tree. Are you sure?"))
	{
		this.lang = lang;
		this.nodes = {};
		this.links = [];
	}
}
Tree.prototype.new_node = function(str)
{
	if (typeof this.nodes[str] === "undefined")
	{
		this.nodes[str] = new Node(str);
	}
}
Tree.prototype.load_nodes = function(type)
{
	for (i in this.nodes)
	{
		if (!this.nodes[i].loaded[type])
		{
			this.nodes[i].load(type);
		}
	}
}
Tree.prototype.add_link = function(array)
{
	this.nodes[array[0]].add_link(array[1],array[2])
	this.nodes[array[1]].add_link(array[0],array[2],false)
}
Tree.prototype.clean_tree = function()
{
	var nodes = Object.keys(this.nodes)
	var clean_nodes = [];
	for (i in nodes)
	{
		clean_nodes.push({name:this.nodes[nodes[i]].name,id:this.nodes[nodes[i]].id})
	}
	return {links:this.explicit_links,nodes:clean_nodes}
}
Tree.prototype.get_id = function()
{
	this.id = this.id+1;
	return this.id;
}
