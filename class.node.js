function Node(node)
{
	this.name = node.title;
	this.type = node.ns;
	this.links = {};
	this.loaded = {};
	this.id = tree.get_id();
}
Node.prototype.load = function(type)
{
	if (type == "categories")
	{
		this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=categories&format=json&cllimit=500&clshow=!hidden&redirects";
	}
	else if (type == "categorymembers")
	{
		this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&cmtitle="+this.name+"&format=json&cmlimit=500&list=categorymembers";
	}
	this.url = this.url+"&origin=*&utf8";
	this.url = new Url(this.url,"https://cors-anywhere.herokuapp.com/");
	var _this = this;
	this.url.ready(function(e) {
		handle_links(e,_this,type,this)
	});	
}
Node.prototype.data = async function(data,type)
{
	if (typeof data !== "undefined")
	{
		if (type == "categories")
		{
			data = data[Object.keys(data)[0]]
			if (data.missing)
			{
				delete tree.nodes[this.name];
				delete this;
			}
			else
			{
				delete tree.nodes[this.name];
				this.name = data.title;
				this.type = data.ns;
				if (typeof tree.nodes[this.name] === "undefined")
				{
					tree.nodes[this.name] = this;
				}
			}
		}
		for (var i in data[type])
		{
			tree.new_node(data[type][i])
			tree.add_link([this.name,data[type][i].title,type])
			await incr_wait(0,10)
		}
	}
}
Node.prototype.add_link = function(linked_node,type,explicit=true)
{
	if (typeof this.links[linked_node] == "undefined")
	{
		this.links[linked_node] = type;
		var link = {id:tree.get_id(),source:this.id,target:tree.nodes[linked_node].id}
		tree.links[link.id] = link;
		if (explicit)
		{
			var link = {id:tree.get_id(),source:this.id,target:tree.nodes[linked_node].id}
			tree.explicit_links.push(link);
			force_graph.postMessage({tree:tree.clean_tree(),width:Number(document.querySelector("svg").getBoundingClientRect().width),height:Number(document.querySelector("svg").getBoundingClientRect().height)})
		}
		delete link;
	}
}
function handle_links(e,_obj,type,obj)
{
	obj.data = JSON.parse(e.response)
	if (type == "categories")
	{
		_obj.data(obj.data.query.pages,type);
	}
	else if (type == "categorymembers")
	{
		_obj.data(obj.data.query,"categorymembers");
	}
	if (typeof obj.data.continue !== "undefined")
	{
		_obj.url = new Url(obj.url+"&"+(Object.keys(obj.data.continue)[0])+"="+obj.data.continue[Object.keys(obj.data.continue)[0]],"https://cors-anywhere.herokuapp.com/");
		_obj.url.ready(function(e) {
			handle_links(e,_obj,type,obj)
		});	
	}
	_obj.loaded[type] = true;
	delete _obj.url
}
