import React, { useState, useRef } from "react";
import WikiAPI from "../wikiApi.js";

function SearchInput(props) {
  const { handleChanges, lang, id } = props;
  const [searchString,setSearchString] = useState("");
  const [resultsList,setResults] = useState([]);
  const timer = useRef(null);
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

  const performSearch = async (searchString, input) => {
    const wiki = new WikiAPI(lang);
    if (searchString.length > 0) {
      //perform full text search
      const url = wiki.buildRequest({
        action:"query",
        list:"search",
        srsearch:searchString,
        srnamespace:0,
        srlimit:10
      })[0].url;
      try {
        let results = await fetch(url);
        results = await results.json();
        results = results.query.search;
        setResults(results);
        setTimeout(() => {
          input.focus();
        }, 10);
      } catch(e) {
        console.error(e);
      }
    } else {
      setResults([]);
    }
  }

  const inputChange = (e) => {
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    setSearchString(e.target.value);
    clearTimeout(timer.current);
    handleChanges(e.target.value);
    timer.current = setTimeout(() => {
      triggerChange(e.target.value, e.target);
    }, WAIT_INTERVAL);
  }

  const triggerChange = (value, input) => {
    performSearch(value, input);
  }

  return (
    <>
      <label htmlFor={ "searchInput"+id }>Search terms:</label>
      <input
        autoFocus={ true }
        autoComplete="off"
        id={ "searchInput"+id }
        onChange={ inputChange }
        type="search"
        list={ "results"+id }
        value={ searchString }
        className="textInput"
      />
      {
        resultsList.length > 0 ?
        (<datalist id={ "results"+id }>
          { displaySearchResults() }
        </datalist>)
        : (<></>)
      }
    </>
  )
}

export default SearchInput;
