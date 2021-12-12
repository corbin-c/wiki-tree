import { useSelector, useDispatch } from "react-redux";

function Settings() {
  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const updateSettings = (e) => {
    const { key, value } = e;
    dispatch({type: "settings/set", payload: {
      key,
      value
    }});   
  }
  return (<>
    <form>
      <label htmlFor="repulsion">Nodes repulsion:</label>
      <input
        type="range"
        name="repulsion"
        id="repulsion"
        max="10000"
        min="0"
        onChange={ (e) => {
          updateSettings({
            key: "nodeRepulsion",
            value: parseInt(e.target.value)*-1
          })
        }}
        value={settings.nodeRepulsion*-1} />
      <label htmlFor="curvature">Link curvature:</label>
      <input
        type="range"
        name="curvature"
        id="curvature"
        max="3"
        min="0"
        step="0.05"
        onChange={ (e) => {
          updateSettings({
            key: "curvature",
            value: parseFloat(e.target.value)
          })
        }}
        value={settings.curvature} />
      <label htmlFor="showarrows">Show links arrows:</label>
      <input
        type="checkbox"
        name="showarrows"
        id="showarrows"
        onChange={ (e) => {
          updateSettings({
            key: "arrows",
            value: e.target.checked ? 1:0
          })
        }}
        checked={!!settings.arrows} />
    </form>
  </>);
}

export default Settings;
