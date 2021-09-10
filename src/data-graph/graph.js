import Edge from "./edge.js";
import Node from "./node.js";
import WikiAPI from "./wikiApi.js";

const WikiGraph = class {
  constructor(lang, callback) {
    this.api = new WikiAPI(lang,callback);
    this.nodes = {};
    this.edges = {};
    this.callback = callback;
  }
  removeNode(id) {
    
  }
  async createNode(options) {
    const {
      ns,
      pageid,
      title
    } = options;
    if (typeof pageid === "undefined") { //this is a "missing" article
      return;
    }
    if (pageid === false) { //this is coming from our search form
      const url = this.api.buildRequest({
        action: "query",
        list: "search",
        srsearch: title,
        srnamespace: 0,
        srlimit: 1
      });
      let results = await fetch(url);
      results = await results.json();
      results = results.query.search[0];
      this.createNode(results);
      this.articlesLookup({
        pageids: [results.pageid]
      });
      return;
    } 
    const entity = (ns === 0) ? "article" : "category";
    const node = new Node(entity, { title });
    this.nodes[pageid] = node;
    this.callback("nodes", "add", pageid);
  }
  createEdge() {
    
  }
  categoriesLookup(options) {
    options.action = "query";
    options.list = "categorymembers";
    options.cmlimit = 500;
    options.cmtype = ["page", "subcat"];
    options.clshow = "!hidden";
    this.lookup(options, console.log);
  }
  articlesLookup(options) {
    options.action = "query";
    const lhOptions = { ...options };
    const plOptions = { ...options };
    const clOptions = { ...options };
    lhOptions.prop = ["linkshere"];
    lhOptions.lhlimit = 500;
    lhOptions.lhnamespace = 0;

    plOptions.gpllimit = 500;
    plOptions.gplnamespace = 0;
    plOptions.generator = "links";
    plOptions.prop = "info";

    clOptions.gcllimit = 500;
    clOptions.generator = "categories";
    clOptions.prop = "info";

    this.lookup(clOptions, console.log);
    this.lookup(plOptions, console.log);
    this.lookup(lhOptions, console.log);
  }
  lookup(options, callback) {
    this.api.buildRequest(options).map(async r => {
      const resultsGenerator = this.api.fetchAndContinue(r);
      while (true) {
        let results = (await resultsGenerator.next()).value;
        if (typeof results === "undefined") {
          break;
        }
        //if any, do something with the data
        delete results.redirects;
        results = results[Object.keys(results)[0]];
        callback(results);
      }
    });
  }
};

export default WikiGraph;
