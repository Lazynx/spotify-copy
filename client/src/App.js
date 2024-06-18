
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RouteList } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import Player from "./components/Player";

 const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <RouteList/>
          <Player></Player>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;