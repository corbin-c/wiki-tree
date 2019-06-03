function Node(str)
{
	this.name = str;
	this.loaded = [false,false];
	//this.links = {categories:[]}
}
Node.prototype.load = function(type)
{
	if (type == 1)
	{
		this.url = "http://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=categories&format=json&cllimit=500&clshow=!hidden&formatversion=2&redirects&utf8=";
	}
	this.url = new Url(this.url,"https://cors-anywhere.herokuapp.com/");
	var _this = this;
	this.url.ready(function(e) {
		_this.data(JSON.parse(e.response).query.pages[0],type);
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
		this.name = data.title;
		if (typeof tree.nodes[this.name] === "undefined")
		{
			tree.nodes[this.name] = this;
		}
		for (var i in data.categories)
		{
			//this.links.categories.push(data.categories[i].title)
			tree.new_node(data.categories[i].title)
			tree.links.push([this.name,data.categories[i].title,type])
		}
	}
}
