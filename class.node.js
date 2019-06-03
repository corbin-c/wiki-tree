function Node(str)
{
	this.name = str;
	this.loaded = {};
}
Node.prototype.load = function(type)
{
	if (type == "categories")
	{
		this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=categories&format=json&cllimit=500&clshow=!hidden&formatversion=2&redirects&utf8=";
	}
	else if (type == "categorymembers")
	{
		this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&cmtitle="+this.name+"&format=json&cmlimit=500&list=categorymembers&formatversion=2&utf8=";
	}
	this.url = new Url(this.url,"https://cors-anywhere.herokuapp.com/");
	var _this = this;
	this.url.ready(function(e) {
		if (type == "categories")
		{
			this.name = JSON.parse(e.response).query.pages[0].title;
			_this.data(JSON.parse(e.response).query.pages[0],type);
		}
		else if (type == "categorymembers")
		{
			_this.data(JSON.parse(e.response).query,type);
		}
		_this.loaded[type] = true;
		delete _this.url
	});	
}
Node.prototype.data = function(data,type)
{
	if (data.missing)
	{
		delete tree.nodes[this.name];
		delete this;
	}
	else
	{
		delete tree.nodes[this.name];
		if (typeof tree.nodes[this.name] === "undefined")
		{
			tree.nodes[this.name] = this;
		}
		for (var i in data[type])
		{
			tree.new_node(data[type][i].title)
			tree.add_link([this.name,data[type][i].title,type])
		}
	}
}
Node.protottype.links = function(type)
{
	
}
