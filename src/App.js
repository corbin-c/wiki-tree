import React, { useState } from "react";
import Splash from "./components/splash.js";
import "./index.css";

function App() {
  const [wt,setWT] = useState({});
  const init = (search) => {
    setWT(search);
  }

  return (
    <main className="App">
      <Splash handleInit={ init } visibility={ (Object.keys(wt).length === 0) } />
    </main>
  );
}

export default App;
