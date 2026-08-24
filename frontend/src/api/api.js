import axios from "axios";

const API = axios.create({
  baseURL: "https://flashlink-api.onrender.com",
});

export default API;