import { useSelector } from "react-redux";
import SearchForm from "./search-form.js";

function Splash(props) {
  const init = useSelector(state => state.init);
  return (
    <section id="splash" className={
      (init.start === true
        && init.lang !== ""
        && init.searchString !== "")
        ? "hidden"
        :""
      }>
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
