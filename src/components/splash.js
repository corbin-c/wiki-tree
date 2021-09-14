import { useSelector } from "react-redux";
import SearchForm from "./search-form.js";

function Splash(props) {
  const searchString = useSelector(state => state.init.searchString);
  const lang = useSelector(state => state.init.lang);
  return (
    <section id="splash" className={ (lang !== "" && searchString !== "") ? "hidden":"" }>
      <h1>Welcome to Wiki-Tree!</h1>
      <p>select your language and start exploring</p>
      <img src="./logo.svg" alt="Wiki-Tree logo" />
      <SearchForm />
      <p className="wt-info">
        Wiki-Tree is a project by Clément Corbin aimed at
        providing a visual exploration of Wikipedia. It draws a 3d force graph
        representing articles and their relations.
      </p>
    </section>
  );
}

export default Splash
