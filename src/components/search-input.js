import React, { useState, useRef } from "react";
import WikiAPI from "../data-graph/wikiApi.js";

function SearchInput(props) {
  const { handleChanges, lang } = props;
  const [searchString,setSearchString] = useState("");
  const [resultsList,setResults] = useState([]);
  const timer = useRef(null);
  const wiki = new WikiAPI(lang);
  const WAIT_INTERVAL = 1000;

  const displaySearchResults = () => {
    return resultsList.map((item) => {
      return <option
        value={ item.title }
        key={ item.pageid }>
          { item.title }
        </option>
    });
  }

  const performSearch = async (searchString) => {
    if (searchString.length > 0) {
      //perform full text search
      const url = wiki.buildRequest({
        action:"query",
        list:"search",
        srsearch:searchString,
        srnamespace:0,
        srlimit:10
      });
      let results = await fetch(url);
      results = await results.json();
      results = results.query.search;
      setResults(results);
    } else {
      setResults([]);
    }
  }

  const inputChange = (e) => {
    setSearchString(e.target.value);
    clearTimeout(timer.current);
    handleChanges(e.target.value);
    timer.current = setTimeout(() => {
      triggerChange(e.target.value);
    }, WAIT_INTERVAL);
  }

  const triggerChange = (value) => {
    performSearch(value);
  }

  return (
    <>
      <label htmlFor="searchInput">Search terms:</label>
      <input
        id="searchInput"
        onChange={ inputChange }
        type="search"
        list="results"
        value={ searchString }
        className="textInput"
      />
      <datalist id="results">
        { displaySearchResults() }
      </datalist>
    </>
  )
}

export default SearchInput;
