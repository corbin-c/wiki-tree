import { useSelector } from "react-redux";
import Splash from "./components/splash.js";
import Drawer from "./components/drawer.js";
import ToolBar from "./components/toolbar.js";
import Graph from "./components/graph.js";
import "./index.css";

function App() {
  const searchString = useSelector(state => state.init.searchString);
  const lang = useSelector(state => state.init.lang);
  return (
    <main className="App">
      <Splash />
      {
        (lang !== "" && searchString !== "") && (
        <>
          <Graph />
          <ToolBar />
        </>
        )
      }
      <Drawer />
    </main>
  );
}

export default App;
