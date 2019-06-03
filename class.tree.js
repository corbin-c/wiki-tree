function Tree(types)
{
	this.lang = "en";
	this.nodes = {};
	this.links = [];
	
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
