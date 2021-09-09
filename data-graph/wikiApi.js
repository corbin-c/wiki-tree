const wiki = class {
  constructor(lang,host) {
    this.baseUrl = `https://${lang}.wikipedia.org/w/api.php?`;
    this.host = host;
  }
  buildRequest(options) {
    options.format = "json";
    options.utf8 = true;
    options.origin = this.host;
    options.redirects = true;
    const queryParameters = Object.keys(options).map(e => {
      return e+"="+((typeof options[e] === "object")
        ? options[e].join("|")
        : options[e])
    }).join("&");
    console.log(options, queryParameters);
    return this.baseUrl+queryParameters;
  }
  fetchAndContinue(url) {
    return (async function*(url) {
      let results = true;
      let nextBatch = true;
      while (typeof nextBatch !== "undefined") {
        let continueString = (results === true)
          ? ""
          : "&"
            +(Object.keys(nextBatch)[0])
            +"="
            +nextBatch[Object.keys(nextBatch)[0]];
        results = await fetch(url+continueString);
        results = await results.json();
        nextBatch = results.continue;
        yield results.query;
      }
    })(url);
  }
};

(async () => {
  let z = new wiki("fr", window.location.origin);
  let url = z.buildRequest({
    "action": "query",
    "list": "categorymembers",
    "cmtitle": "Catégorie:Chanteur_jamaïcain_de_reggae",
    "cmtype": ["page", "subcat"],
    "cmlimit": 50
  });
  let resultsGenerator = z.fetchAndContinue(url);
  let results = true;
  while (typeof results !== "undefined") {
    results = (await resultsGenerator.next()).value;
    console.log(results);
  }
})()

export default wiki;
