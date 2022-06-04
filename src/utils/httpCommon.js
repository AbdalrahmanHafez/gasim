import axios from "axios";
import { isProduction } from "./General";

let url = isProduction()
  ? "https://gasim-server.herokuapp.com"
  : "http://localhost:8080";

const axResource = axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json",
  },
  //   withCredentials: true,
});

export default axResource;
