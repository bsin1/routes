import React from "react"
import ReactDOM from "react-dom"
import "./react/styles/index.css"
import App from "./react/components/App"

import { toast } from "react-toastify"
toast.configure()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
