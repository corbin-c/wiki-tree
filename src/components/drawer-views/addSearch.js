import React, { useState } from "react";
import SearchInput from "../search-input.js";

const AddSearch = (props) => {
  const {
    lang,
    handleSubmit
  } = props;
  const [searchString,setSearchString] = useState("");
  const submit = (event) => {
    event.preventDefault();
    console.log(searchString);
    handleSubmit({ searchString });
  }
  return (
    <form onSubmit={ submit }>
      <SearchInput id="drawer" handleChanges={ setSearchString } lang={lang}/>
      <button className="btn" onClick={ submit }>
        <span className="material-icons-outlined">search</span>Search
      </button>
    </form>
  );
}

export default AddSearch;
