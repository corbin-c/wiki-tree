import SearchInput from "./search-input.js";
import LangSelect from "./lang-select.js";
import { useSelector, useDispatch } from "react-redux";

function SearchForm(props) {
  const dispatch = useDispatch();
  const lang = useSelector(state => state.init.lang);
  const submit = (event) => {
    event.preventDefault();
    dispatch({ type: "init/start" }); 
  }
  const setLang = (value) => {
    dispatch({ type: "init/set", payload: { key: "lang", value }});
  }
  const setSearchString = (value) => {
    dispatch({ type: "init/set", payload: { key: "searchString", value }});
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
