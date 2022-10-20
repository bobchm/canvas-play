import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Dashboard from "./routes/dashboard/dashboard.route";
import Editor from "./routes/editor/editor.route";
import Player from "./routes/player/player.route";

const App = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route path="edit" element={<Editor />} />
                <Route path="play" element={<Player />} />
            </Routes>
        </div>
    );
};

export default App;
