import { useState } from "react";
import ReactGA from "react-ga";
import "./App.css";
import Explorer from "./components/Explorer/Explorer";
import Player from "./components/Player/Player";
import logo from "./logo.png";

const TRACKING_ID = "UA-61056553-1";

ReactGA.initialize(TRACKING_ID);

function App() {
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  return (
    <>
      <header>
        <img src={logo} alt="logo" className="logo" />
        <span className="logo_text">myMusic</span>
      </header>

      <main className="mainContainer">
        <div className="mainContainer_box">
          <Player videoId={selectedVideoId}></Player>

          <Explorer videoSelected={(yId) => setSelectedVideoId(yId)}></Explorer>
        </div>
      </main>
    </>
  );
}

export default App;
