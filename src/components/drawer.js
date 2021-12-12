import Locate from "./drawer-views/locate.js";
import Article from "./drawer-views/article.js";
import Settings from "./drawer-views/settings.js";
import Category from "./drawer-views/category.js";
import AddSearch from "./drawer-views/addSearch.js";
import { useSelector, useDispatch } from "react-redux";

const Drawer = (props) => {
  const dispatch = useDispatch();
  const lang = useSelector(state => state.init.lang);
  const content = useSelector(state => state.drawer.content);
  const handleActions = (e) => {
    dispatch({type: "drawer/action", payload: e});
  }

  const getContent = () => {
    if (Object.keys(content).length === 0) {
      return;
    }
    switch (content.component) {
      case "locate":
        return (<Locate action={ handleActions } />);
      case "settings":
        return (<Settings />);
      case "addSearch":
        return (<AddSearch lang={ lang } handleSubmit={
          (e) => {
            handleActions({
              action: "addSearch",
              options: e
            });
          }
        } />)
      case "article":
        return (<Article lang={ lang } id={ content.id } action={ handleActions } />);
      case "category":
        return (<Category id={ content.id } action={ handleActions } />);
      default:
        return (<></>)
    }
  }
  return (
    <aside
      id="drawer"
      className={ Object.keys(content).length === 0 ? "hidden":"" }>
        <header>
        <h2>
          { content.title }
        </h2>
        <button className="closebtn" title="Close drawer" onClick={ () => handleActions("closeDrawer") }>
          <span className="material-icons-outlined">close</span>
        </button>
        </header>
        <main>
          { getContent() }
        </main>
    </aside>
  )
};
export default Drawer;
