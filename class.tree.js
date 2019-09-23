import { TreeNode } from "./class.node.js";
let Tree = class {
  constructor() {
    this.lang = "en";
    this.nodes = [];
    this.links = [];
    this.internal_links = [];
    this.pending_ops = {};
    this.id = 0;
    this.focal_point = 1;
    this.base_url = "https://"+this.lang
      +".wikipedia.org/w/api.php?action=query&";
  }
  findNode(title) {
    return (this.nodes.find(node => (node.name == title)) || false);
  }
  deleteNode(name) {
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
      var id = this.getId();
      this.pending_ops[id] = this.outputTree();
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
  changeLang(lang) {
    this.lang = lang;
    this.base_url = "https://"+this.lang+".wikipedia.org/w/api.php?action=query&";
  }
  newNode(response,parent) {
    if (typeof response === "string") {response = {title:response,ns:0}}
    if (!this.findNode(response.title)) {
      let node_param = [response,parent];
      if (this.nodes.length == 0) {
        node_param.push(this);
      }
      this.nodes.push(new TreeNode(...node_param));
      try {
      this.internal_links[response.title].map({
//here we handle internal links, if any
      });
      } catch {
        console.warn("no matching internal links found");
      }
    }
    return this.nodes[response.title];
  }
  loadNodes(type) {
    this.nodes.map(node => {
      if (!node.loaded[type]) { node.load(type); }
    });
  }
  addLink(source,target,explicit=true) {
    let link = {
      id:this.getId(),
      source:source.id,
      target:target.id,
      explicit:(explicit===true)
    };
    this.links[link.id] = link;
    if (explicit) { this.addLink(target,source,!explicit); }
  }
  addInternalLink(target,source) {
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
  outputTree() {
    let nodes = Object.values(this.nodes);
    nodes = JSON.parse(JSON.stringify(nodes));
    return {links:Object.values(this.links.filter(link => (link.explicit))),
            nodes:nodes};
  }
  getId() {
    this.id = this.id+1;
    return this.id;
  }
}
export { Tree };