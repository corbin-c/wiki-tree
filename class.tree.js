function Tree()
{
	this.lang = "en";
	this.nodes = {};
	this.links = {};
	this.wv = {};
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
Tree.prototype.add_link = function(array,reverted=false)
{
	this.wv[array.toString()] = true;
	if (typeof this.links[array[0][0]+array[0][1]] == "undefined")
	{
		this.links[array[0][0]+array[0][1]] = [array]
	}
	else
	{
		for (i in this.links[array[0][0]+array[0][1]])
		{
			if (this.links[array[0][0]+array[0][1]][i] == array)
			{
				this.wv[array.toString()] = false;
				break;
			}
		}
		if (this.wv[array.toString()])
		{
			this.links[array[0][0]+array[0][1]].push(array);
		}
	}
	if (!reverted)
	{
		this.add_link([array[1],array[0],array[2]],true)
	}
	delete this.wv[array.toString()];
}
