import axios from "axios";

const api = axios.create({
  baseURL:
    "mysql://root:pzyuwWeXpmPEvLLSjVyCXbVgmWnJuRpf@shinkansen.proxy.rlwy.net:24971/quran_tracker",
});

export default api;
