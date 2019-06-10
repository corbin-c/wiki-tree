function Node(node,parent)
{
	this.name = node.title;
	this.parent = parent;
	this.type = node.ns;
	this.links = {};
	this.loaded = {};
	this.id = tree.get_id();
}
Node.prototype.load = function(type)
{
	if (typeof this.loaded[type] === "undefined")
	{
		if (type == "categories")
		{
			this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=categories&format=json&cllimit=500&clshow=!hidden&redirects";
		}
		else if (type == "categorymembers")
		{
			this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&cmtitle="+this.name+"&format=json&cmlimit=500&list=categorymembers";
		}
		else if (type == "internal_links")
		{
			this.url = 	"http://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=links&format=json&pllimit=500&utf8=";
		}
		this.url = this.url+"&origin=*&utf8";
		this.url = new Url(this.url,"https://cors-anywhere.herokuapp.com/");
		var _this = this;
		this.url.ready(function(e) {
			handle_links(e,_this,type,this)
		});	
	}
}
Node.prototype.data = async function(data,type)
{
	if (typeof data !== "undefined")
	{
		if (type == "internal_links")
		{
			data = data[Object.keys(data)[0]]
			for (var i in data["links"])
			{
				if (data["links"][i].ns == 0)
				{
					tree.add_internal_link(data["links"][i].title,this.name)
				}
			}
		}
		else
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
				tree.new_node(data[type][i],this.id)
				tree.add_link([this.name,data[type][i].title,type],[parseInt(i),data[type].length])
				if (tree.nodes[data[type][i].title].type == 0)
				{
					tree.nodes[data[type][i].title].load("internal_links");
				}
			}
			tree.graph();
		}
	}
}
Node.prototype.add_link = function(linked_node,type,q,explicit=true)
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
			if ((q == null) || (q[0] == q[1]-1) || (q[1] < 20) || (q[0] % Math.floor(q[1]/10) == 0))
			{
				tree.graph();
			}
		}
		delete link;
	}
}
function handle_links(e,_obj,type,obj)
{
	obj.data = JSON.parse(e.response)
	if (type == "categories" || type == "internal_links")
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
