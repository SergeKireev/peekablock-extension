// import { setupUi } from './popup'
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./popup";

document.addEventListener("DOMContentLoaded", function (event) {
    const container = document.getElementById("app");
    const root = createRoot(container);
    root.render(<App />);
});
