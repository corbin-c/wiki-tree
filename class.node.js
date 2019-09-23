let Node = class {
  constructor(node,parent) {
    this.name = node.title;
    this.parent = parent;
    this.type = node.ns;
    this.size = 7;
    this.links = {};
    this.loaded = {};
    this.id = tree.get_id();
    if (this.type == 0) {
      this.load("internal_links");
    }
  }
  load(type) {
    if (typeof this.loaded[type] === "undefined") {
      if (type == "categories") {
        this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=categories&format=json&cllimit=500&clshow=!hidden";
      } else if (type == "abstract") {
        if (this.type == 6) {
          this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=imageinfo&iiprop=url|mime&format=json";
        } else {
          this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&prop=extracts&titles="+this.name+"&exintro=true&exlimit=1&format=json";
        }
      } else if (type == "categorymembers") {
        this.url = "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&cmtitle="+this.name+"&format=json&cmlimit=500&list=categorymembers";
      } else if (type == "internal_links") {
        this.url =  "https://"+tree.lang+".wikipedia.org/w/api.php?action=query&titles="+this.name+"&prop=links&format=json&pllimit=500";
      }
      this.url = this.url+"&redirects&origin=*&utf8";
      this.pagedRequest(this.url,type,this.receiveData); 
    } else if (type == "abstract") {
      infobox(this.abstract,this.id);
    }
  }
  async receiveData(data,type) {
    if (typeof data !== "undefined") {
      if (type == "internal_links") {
        data = data[Object.keys(data)[0]];
        for (var i in data["links"]) {
          if (data["links"][i].ns == 0) {
            tree.add_internal_link(data["links"][i].title,this.name)
          }
        }
      } else if (type == "abstract") {
        if (this.type == 6) {
          this.abstract = data[Object.keys(data)[0]].imageinfo[0];
          this.abstract = multimedia(this.abstract);
          infobox(this.abstract,this.id)
        } else {
          this.abstract = data[Object.keys(data)[0]].extract;
          infobox(this.abstract,this.id)
        }
      } else {
        if (type == "categories") {
          data = data[Object.keys(data)[0]]
          if (data.missing) {
            delete tree.nodes[this.name];
            delete this;
          } else {
            delete tree.nodes[this.name];
            this.name = data.title;
            this.type = data.ns;
            if (typeof tree.nodes[this.name] === "undefined") {
              tree.nodes[this.name] = this;
            }
          }
        }
        for (var i in data[type]) {
          tree.new_node(data[type][i],this.id)
          tree.add_link([this.name,data[type][i].title,type])
        }
        tree.graph()
      }
    }
  }
  addLink(linked_node,type,explicit=true) {
    if (typeof this.links[linked_node] == "undefined") {
      var link = {id:tree.get_id(),source:this.id,target:tree.nodes[linked_node].id}
      this.links[linked_node] = {type:type};
      tree.links[link.id] = link;
      if (explicit === true) {
        var link = {id:tree.get_id(),source:this.id,target:tree.nodes[linked_node].id}
        tree.explicit_links[link.id] = link;
        this.links[linked_node].id = link.id;
        if (this.type == 0) {
          if (tree.nodes[linked_node].type == 0) {
            this.size++;
          } else {
            this.size = this.size+0.1
          }
        } else {
          this.size = this.size+0.1
        }
        tree.graph()
      } else if (explicit !== false) {
        this.links[linked_node].id = explicit;
      }
      return link.id
    } else {
      return false;
    }
  }
  async pagedRequest(url,type,callback) {
    let result = await fetch(url);
    result = await result.json();
    result.query = (type == "categorymembers") ?
      result.query:result.query.pages;
    callback.call(this,result.query,type);
    while (typeof result.continue !== "undefined") {
      result = await fetch(url+"&"+(Object.keys(result.continue)[0])+"="
        +result.continue[Object.keys(result.continue)[0]]);
      result = await result.json();
      result.query = (type == "categorymembers") ?
        result.query:result.query.pages;
      callback.call(this,result.query,type);
    }
    this.loaded[type] = true;
  }
}