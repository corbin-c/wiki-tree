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
Tree.prototype.add_link = function(array)
{
	this.wv[array.toString()] = [true,[array[1],array[0],array[2]]];
	if (typeof this.links[array[0][0]] !== "undefined")
	{
		for (i in this.links[array[0][0]])
		{
			if (this.links[array[0][0]][i] == array)
			{
				this.wv[array.toString()][0] = false;
				break;
			}
		}
	}
	if (this.wv[array.toString()][0])
	{
		if (typeof this.links[this.wv[array.toString()][1][0][0]] !== "undefined")
		{
			for (i in this.links[this.wv[array.toString()][1][0][0]])
			{
				if (this.links[this.wv[array.toString()][1][0][0]][i] == array)
				{
					this.wv[array.toString()][0] = false;
					break;
				}
			}
		}			
	}
	if (this.wv[array.toString()][0])
	{
		if (typeof this.links[array[0][0]] === "undefined")
		{
			this.links[array[0][0]] = [array]
		}
		else
		{
			this.links[array[0][0]].push(array);
		}
	}
	delete this.wv[array.toString()];
}
