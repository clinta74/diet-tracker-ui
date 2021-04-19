import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/app";

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-clinta74.us.auth0.com"
            clientId="I1EPbV0JzhQ4sMebkA5XSg0RhYhJBa1k"
            audience="https://diet-tracker.pollyspeople.net"
            scope="openid token"
            redirectUri={window.location.origin}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById("root")
);