import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

function Locate(props) {
  const {
    action,
  } = props;
  const worker = useSelector(state => state.worker);
  const [results,setResults] = useState([]);
  const [searchString,setSearchString] = useState("");
  const displaySearchResults = () => {
    return results.map((item) => {
      return <option
        value={ item.name }
        key={ item.id }>
          { item.name }
        </option>
    });
  }
  const inputChange = (e) => {
    setSearchString(e.target.value);
    worker.entity.postMessage({ action: "search", options: { searchString } });
  }
  useEffect(() => {
    if (worker.message.search) {
      setResults(worker.message.search);
    }
  },[worker.message]);
  const submit = (e) => {
    e.preventDefault();
    let targetNode;
    targetNode = results.find(node => node.name === searchString);
    if (typeof targetNode !== "undefined") {
      action({ action: "focusNode", options: { node:targetNode }});
    } else {
      alert("node not found: "+searchString);
    }
  }
  return (
    <form onSubmit={ submit }>
      <label htmlFor={ "searchInput" }>Search terms:</label>
      <input
        id={ "locate" }
        onChange={ inputChange }
        type="search"
        list={ "locateresults" }
        value={ searchString }
        className="textInput"
      />
      <datalist id={ "locateresults" }>
        { displaySearchResults() }
      </datalist>
      <button className="btn" onClick={ submit }>
        <span className="material-icons-outlined">location_searching</span>Search
      </button>
    </form>
  )
}

export default Locate;
