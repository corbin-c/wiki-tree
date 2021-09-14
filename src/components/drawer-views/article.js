import React, { useState, useEffect } from "react";
import WikiAPI from "../../wikiApi.js";

function Article(props) {
  const {
    lang,
    id,
    action
  } = props;
  const [extract, setExtract] = useState("");
  useEffect(() => {
    (async () => {
      const api = new WikiAPI(lang);
      const url = api.buildRequest({
          action:"query",
          pageids:[id],
          prop:"extracts",
          exintro: true,
          exlimit:1
        })[0].url;
        let results = await fetch(url);
        results = await results.json();
        results = results.query.pages[id];
        setExtract(results.extract);
    })()
  }, [id]);
  /* return an extract from WP,
   * a button to expand node (eg find cateogries / links)
   * a button to delete
   * an ordered/clickable list of siblings
   */
  return (<>
    <article dangerouslySetInnerHTML={ { "__html": extract } } />
    <div className="buttons">
      <button title="Expand node" onClick={ () => {
        action( { action: "articlesLookup", options: { pageids: [id] } });
      }}>
        <span className="material-icons-outlined">zoom_out_map</span>
      </button>
      <button title="Delete node" onClick={ () => {
        action( { action: "removeNode", options: { id } });
      }}>
        <span className="material-icons-outlined">delete</span>
      </button>
      <a href={ "https://"+lang+".wikipedia.org/?curid="+id } target="_blank" title="View this page on Wikipedia">
        <span className="material-icons-outlined">link</span>
      </a>
    </div>
  </>);
}

export default Article;
