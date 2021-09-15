import { adjacentNodes } from "../../reducers/graph.js";
import { useSelector } from "react-redux";

function Category(props) {
  const {
    id,
    action
  } = props;
  const members = useSelector(adjacentNodes(id, "taxonomy"));

  const focus = (node) => {
    action({ action: "focusNode", options: { node }});
  }
  const catMembers = (entity) => {
    return members.filter(e => e.entity === entity).map(sub => {
      return (<li key={ sub.id } onClick={ () => { focus(sub) } }>
        { sub.name }
      </li>)
    });
  }

  return (<>
    <article>
      { (members.filter(e => e.entity === "category").length > 0)
        ? (<details open="true">
            <summary>Categories:</summary>
            <ul>
              { catMembers("category") }
            </ul>
          </details>)
        : (<></>)
      }
      { (members.filter(e => e.entity === "article").length > 0)
        ? (<details open="true">
            <summary>Pages:</summary>
            <ul>
              { catMembers("article") }
            </ul>
          </details>)
        : (<></>)
      }
    </article>
    <div className="buttons">
      <button title="Expand node" onClick={ () => {
        action( { action: "categoriesLookup", options: { cmpageid: id } });
      }}>
        <span className="material-icons-outlined">zoom_out_map</span>
      </button>
      <button title="Delete node" onClick={ () => {
        action( { action: "removeNode", options: { id } });
      }}>
        <span className="material-icons-outlined">delete</span>
      </button>
    </div>
  </>);
}

export default Category;
