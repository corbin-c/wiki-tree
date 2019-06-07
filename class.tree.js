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
	this.lang = lang;
}
Tree.prototype.new_node = function(response)
{
	if (typeof response === "string") {response = {title:response,ns:0}}
	if (typeof this.nodes[response.title] === "undefined")
	{
		this.nodes[response.title] = new Node(response);
	}
}
Tree.prototype.load_nodes = async function(type)
{
	for (i in this.nodes)
	{
		if (!this.nodes[i].loaded[type])
		{
			this.nodes[i].load(type);
			await incr_wait(0,10);
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
		clean_nodes.push({name:this.nodes[nodes[i]].name,id:this.nodes[nodes[i]].id,type:this.nodes[nodes[i]].type,size:Math.floor(Object.keys(this.nodes[nodes[i]].links).length/5)+5})
	}
	return {links:this.explicit_links,nodes:clean_nodes}
}
Tree.prototype.get_id = function()
{
	this.id = this.id+1;
	return this.id;
}
