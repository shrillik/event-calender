import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import the main App component
import "./styles.css"; // Import the global styles

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
