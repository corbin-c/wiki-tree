import { useDispatch } from "react-redux";

const ToolBar = (props) => {
  const dispatch = useDispatch();
  const handleActions = (e) => {
    dispatch({ type: "drawer/content", payload: e });
  }
  const clearAll = () => {
    if (!window.confirm(`This will clear all your graph and bring you back to the initial search form.
Are you sure?`)) {
      return;
    }
    dispatch( { reset: true, type:"reset" } );
  }
  return (
    <aside id="toolbar">
      <button
        title="perform a new search to complete the graph"
        onClick={ () => {
          handleActions({
            component: "addSearch",
            title: "Add new node"
          })
        }}
      >
        <span className="material-icons-outlined">zoom_in</span>
      </button>
      <button title="search for a node on the graph"
        onClick={ () => {
          handleActions({
            component: "locate",
            title: "Locate a node"
          });
        }}
      >
        <span className="material-icons-outlined">location_searching</span>
      </button>
      <button
        title="clear all & start from scratch"
        onClick={ clearAll }
      >
        <span className="material-icons-outlined">refresh</span>
      </button>
      <button title="fine tune your graph"
        onClick={ () => {
          handleActions({
            component: "settings",
            title: "Settings"
          });
        }}
      >
        <span className="material-icons-outlined">settings</span>
      </button>
      <button title="what am I seeing? help!">
        <span className="material-icons-outlined">support</span>
      </button>
    </aside>
  )
};
export default ToolBar;
