function Category(props) {
  const {
    id,
    action
  } = props;
  return (<>
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
