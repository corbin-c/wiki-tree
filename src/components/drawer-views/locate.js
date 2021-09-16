import { useSelector } from "react-redux";
import React, { useState } from "react";

function Locate(props) {
  const {
    action
  } = props;
  const [searchString,setSearchString] = useState("");
  const nodes = useSelector(state => state.graph.nodes);
  const displaySearchResults = () => {
    return Object.values(nodes)
      .filter(node => node.name.toLowerCase()
        .includes(searchString.toLowerCase())
      )
      .sort((a,b) => a.name.localeCompare(b.name))
      .map((item) => {
      return <option
        value={ item.name }
        key={ item.id }>
          { item.name }
        </option>
    });
  }
  const inputChange = (e) => {
    setSearchString(e.target.value);
  }
  const submit = (e) => {
    e.preventDefault();
    let targetNode;
    targetNode = Object.values(nodes).find(node => node.name === searchString);
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
