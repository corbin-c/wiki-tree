import SearchForm from "./search-form.js";

function Splash(props) {
  const { visibility, handleInit } = props;
  const init = (search) => {
    handleInit(search);
  }
  return (
    <section id="splash" className={ visibility ? "":"hidden" }>
      <h1>Welcome to Wiki-Tree!</h1>
      <p>select your language and start exploring</p>
      <img src="./logo.svg" alt="Wiki-Tree logo" />
      <SearchForm handleSubmit={ init } />
      <p className="wt-info">
        Wiki-Tree is a project by Clément Corbin aimed at
        providing a visual exploration of Wikipedia. It draws a 3d force graph
        representing articles and their relations.
      </p>
    </section>
  );
}

export default Splash
