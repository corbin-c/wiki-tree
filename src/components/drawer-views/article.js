import React, { useState, useEffect } from "react";
import WikiAPI from "../../wikiApi.js";
import { useSelector } from "react-redux";
import { adjacentNodes } from "../../reducers/graph.js";

function Article(props) {
  const {
    lang,
    id,
    action
  } = props;
  const [extract, setExtract] = useState("");
  const categories = useSelector(adjacentNodes(id, "taxonomy"));
  const links = useSelector(adjacentNodes(id, "outlink"));
  const backlinks = useSelector(adjacentNodes(id, "backlink"));

  const focus = (node) => {
    action({ action: "focusNode", options: { node }});
  }
  const relations = (relationsList) => {
    return relationsList.map(sub => {
      return (<li key={ sub.id } onClick={ () => { focus(sub) } }>
        { sub.name }
      </li>)
    });
  }

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
  }, [id, lang]);
  /* return an extract from WP,
   * a button to expand node (eg find cateogries / links)
   * a button to delete
   * an ordered/clickable list of siblings
   */
  return (<>
    <article dangerouslySetInnerHTML={ { "__html": extract } } />
    <article>
      { (categories.length > 0)
        ? (<details open={true}>
            <summary>Categories:</summary>
            <ul>
              { relations(categories) }
            </ul>
          </details>)
        : (<></>)
      }
      { (links.length > 0)
        ? (<details open={true}>
            <summary>Links:</summary>
            <ul>
              { relations(links) }
            </ul>
          </details>)
        : (<></>)
      }
      { (backlinks.length > 0)
        ? (<details open={true}>
            <summary>Backlinks:</summary>
            <ul>
              { relations(backlinks) }
            </ul>
          </details>)
        : (<></>)
      }
    </article>
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
      <a href={ "https://"+lang+".wikipedia.org/?curid="+id } rel="noreferrer" target="_blank" title="View this page on Wikipedia">
        <span className="material-icons-outlined">link</span>
      </a>
    </div>
  </>);
}

export default Article;
