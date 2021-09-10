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
    if ((options.pageids) && (typeof options.pageids === "object")) {
      return options.pageids.map(e => {
        const newOptions = {...options, pageids: e};
        return [this.baseUrl+getParameters(newOptions)];
      });
    }
    return [this.baseUrl+getParameters(options)];
  }
  fetchAndContinue(url) {
    return (async function*(url) {
      let results = true;
      let nextBatch = true;
      let finished = [];
      let lastContinue = "";
      while (typeof nextBatch !== "undefined") {
        let continueKey = Object.keys(nextBatch)
          .filter(e => !finished.includes(e))[0];
        console.log(continueKey, typeof results, typeof nextBatch, finished, lastContinue);
        if ((nextBatch !== true)
        && ((typeof continueKey === "undefined")
          || continueKey === "continue")) {
          yield undefined;
        }
        let continueString = ((results === true) && (nextBatch === true))
          ? ""
          : "&"
            +(continueKey)
            +"="
            +nextBatch[continueKey];
        if (typeof continueKey !== "undefined") {
          if ((lastContinue !== continueKey)
            && (lastContinue !== "")) {
            finished.push(lastContinue);
          }
          lastContinue = continueKey;
        }
        results = await fetch(url+continueString);
        results = await results.json();
        nextBatch = results.continue;
        yield results.query;
      }
    })(url);
  }
};

export default WikiAPI;
