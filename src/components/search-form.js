import React, { useState } from "react";
import SearchInput from "./search-input.js";
import LangSelect from "./lang-select.js";

function SearchForm(props) {
  const { handleSubmit } = props;
  const [lang,setLang] = useState("en");
  const [searchString,setSearchString] = useState("");
  const submit = (event) => {
    event.preventDefault();
    console.log(lang, searchString);
    handleSubmit({ lang, searchString });
  }
  return (
    <form onSubmit={ submit }>
      <SearchInput handleChanges={ setSearchString } lang={lang}/>
      <LangSelect handleChanges={ setLang } />
      <button className="btn" onClick={ submit }>
        <span className="material-icons-outlined">search</span>Search
      </button>
    </form>
  );
}

export default SearchForm
