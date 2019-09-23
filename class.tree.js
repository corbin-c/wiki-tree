let Tree = class {
  constructor() {
    this.lang = "en";
    this.nodes = {};
    this.links = {};
    this.explicit_links = {};
    this.internal_links = {};
    this.id = 0;
    this.pending_ops = {};
    this.focal_point = 1;
    this.base_url = "https://"+this.lang
      +".wikipedia.org/w/api.php?action=query&";
  }
  delete_node(name) {
    var tmp_node = this.nodes[name];
    delete this.nodes[name];
    for (i in tmp_node.links) {
      try {
        console.log("link removed")
        delete this.explicit_links[tmp_node.links[i].id]
      }
      catch {
        console.log("couldn't delete")
      }
      if (typeof this.nodes[i] !== "undefined") {
        if (Object.keys(this.nodes[i].links).length == 1) {
          console.log("delete "+i)
          this.delete_node(i);
        } else {
          try {
            delete this.explicit_links[this.nodes[i].links[name].id]
          }
          catch {
            console.log("couldn't delete")
          }
          try {
            delete this.nodes[i].links[name];
          }
          catch {
            console.log("couldn't delete")
          }
        }
      }
    }
    this.graph(true,true);
  }
  focus(name,linked={},level=0) {
    if (level == 0) {
      linked[this.nodes[name].id] = 0
      this.focal_point = this.nodes[name].id
    }
    level++;
    for (i in this.nodes[name].links) {
      if ((typeof linked[this.nodes[i].id] === "undefined") || (linked[this.nodes[i].id] > level) || (typeof linked[this.nodes[name].links[i].id] === "undefined") || (linked[this.nodes[name].links[i].id] > level)) {
        if ((typeof linked[this.nodes[i].id] === "undefined") || (linked[this.nodes[i].id] > level)) {
          linked[this.nodes[i].id] = level
        }
        if ((typeof linked[this.nodes[name].links[i].id] === "undefined") || (linked[this.nodes[name].links[i].id] > level)) {
          linked[this.nodes[name].links[i].id] = level
        }
        if (level < 3) {
          linked = this.focus(i,linked,level)
        }
      }
    }
    return linked;
  }
  graph(force=false,new_op=true,parameters=false) {
    if (new_op) {
      var id = this.get_id();
      this.pending_ops[id] = this.clean_tree();
    }
    if ((Object.keys(this.pending_ops).length == 1) || (force)) {
      id = Object.keys(this.pending_ops);
      id = id[id.length - 1];
      if (parameters) {
        force_graph.postMessage({parameters:parameters});
      }
      force_graph.postMessage({id:id,tree:this.pending_ops[id],x_center:Number(document.querySelector("svg").getBoundingClientRect().width)/2,y_center:Number(document.querySelector("svg").getBoundingClientRect().height)/2});
    }
  }
  changelang(lang) {
    this.lang = lang;
    this.base_url = "https://"+this.lang+".wikipedia.org/w/api.php?action=query&";
  }
  new_node(response,parent) {
    if (typeof response === "string") {response = {title:response,ns:0}}
    if (typeof this.nodes[response.title] === "undefined") {
      this.nodes[response.title] = new Node(response,parent);
      if (typeof this.internal_links[response.title] !== "undefined") {
        for (var i in this.internal_links[response.title]) {
          try {
            this.nodes[response.title].add_link(this.internal_links[response.title][i],"internal_links",this.nodes[this.internal_links[response.title][i]].add_link(response.title,"internal_links"))
          }
          catch {
            console.log("Couldn't create link from "+response.title+" to "+this.internal_links[response.title][i]+".")
          }
        }
      }
    }
  }
  load_nodes(type) {
    for (i in this.nodes) {
      if (!this.nodes[i].loaded[type]) {
        this.nodes[i].load(type);
      }
    }
  }
  add_link(array) {
    this.nodes[array[1]].addLink(array[0],array[2],this.nodes[array[0]].addLink(array[1],array[2]))
  }
  add_internal_link(target,source) {
    if (typeof this.nodes[target] !== "undefined") {
      this.nodes[target].addLink(source,"internal_links",this.nodes[source].addLink(target,"internal_links"))
    } else {
      try {
        this.internal_links[target].push(source);
      }
      catch {
        this.internal_links[target] = [source];
      }
    }
  }
  clean_tree() {
    var nodes = Object.values(this.nodes);
    nodes = JSON.parse(JSON.stringify(nodes));
    return {links:Object.values(this.explicit_links),nodes:nodes}
  }
  get_id() {
    this.id = this.id+1;
    return this.id;
  }
}