import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/app";
import { registerBackgroundWorker } from './register-background-worker';

ReactDOM.render(
    <React.Fragment>
        <App />
    </React.Fragment>,
    document.getElementById("root")
);

registerBackgroundWorker();