const WikiAPI = class {
  constructor(lang) {
    this.baseUrl = `https://${lang}.wikipedia.org/w/api.php?`;
  }
  buildRequest(options) {
    const getParameters = (options) => {
      options.format = "json";
      options.utf8 = true;
      options.origin = "*";
      options.redirects = true;
      return Object.keys(options).map(e => {
        return e+"="+((typeof options[e] === "object")
          ? options[e].join("|")
          : options[e])
      }).join("&");
    }
    if ((options.titles) && (options.titles.length > 50)) {
      let titlesChunks = [];
      for (let i = 0; i < options.titles.length; i += 50) {
        titlesChunks.push(options.titles.slice(i, i+50));
      }
      return titlesChunks.map(e => {
        options.titles = e;
        return [this.baseUrl+getParameters(options)];
      });
    }
    return [this.baseUrl+getParameters(options)];
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

export default WikiAPI;
