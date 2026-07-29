import axios from "axios";

const API = axios.create({
  baseURL: "https://flashlink-eswar-bch2bagaa6azcnc2.centralindia-01.azurewebsites.net",
});

export default API;