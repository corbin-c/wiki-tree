import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

function Category(props) {
  const {
    id,
    action,
  } = props;

  const worker = useSelector(state => state.worker);
  const [node,setNode] = useState({ adjacent: [] });

  const focus = (node) => {
    action({ action: "focusNode", options: { node }});
  }
  const catMembers = (entity) => {
    return node.adjacent.filter(e => e.entity === entity).map(sub => {
      return (<li key={ sub.id } onClick={ () => { focus(sub) } }>
        { (entity === "category")
            ? sub.name.split(":").slice(1).join(":")
            : sub.name }
      </li>)
    });
  }

  useEffect(() => {
    if ((worker.message.node) && (worker.message.node.id === id)) {
      setNode(worker.message.node);
    }
  },[worker.message]);

  useEffect(() => {
    worker.entity.postMessage({ action: "getNode", options: { id }});
  },[id]);

  return (<>
    <article>
      { (node.adjacent.filter(e => e.entity === "category").length > 0)
        ? (<details open={true}>
            <summary>Categories:</summary>
            <ul>
              { catMembers("category") }
            </ul>
          </details>)
        : (<></>)
      }
      { (node.adjacent.filter(e => e.entity === "article").length > 0)
        ? (<details open={true}>
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
