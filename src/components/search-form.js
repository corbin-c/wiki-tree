import React, { useState } from "react";
import SearchInput from "./search-input.js";
import LangSelect from "./lang-select.js";
import { useDispatch } from "react-redux";

function SearchForm(props) {
  const [lang,setLang] = useState("en");
  const [searchString,setSearchString] = useState("");
  const dispatch = useDispatch();
  const submit = (event) => {
    event.preventDefault();
    dispatch({ type: "init", payload: {
      lang,
      searchString
    }}); 
  }
  return (
    <form onSubmit={ submit }>
      <SearchInput id="main" handleChanges={ setSearchString } lang={lang}/>
      <LangSelect handleChanges={ setLang } />
      <button className="btn" onClick={ submit }>
        <span className="material-icons-outlined">search</span>Search
      </button>
    </form>
  );
}

export default SearchForm
