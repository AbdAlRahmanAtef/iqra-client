import axios from "axios";

const api = axios.create({
  baseURL: "https://iqra-server-six.vercel.app",
});

export default api;
