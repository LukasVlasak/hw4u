import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/",
  withCredentials: true,
});

export interface ErrorCode {
  message: string;
  errorCode: string;
  type: string;
}

interface Entity {
  id: number;
}

interface QueryObject {
  _start: number;
  _limit: number;
  orderBy: string;
  where: string;
}

class APIClient<T extends Entity> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    const token = localStorage.getItem("x-auth-token");
    axiosInstance.interceptors.request.use((config) => {
      config.headers["x-auth-token"] = token;
      return config;
    });
  }

  getAll(queryObject?: Partial<QueryObject>) {
    return axiosInstance
      .get<T[]>(this.endpoint, queryObject ? { params: queryObject } : {})
      .then((res) => res.data);
  }

  get(id: number) {
    return axiosInstance
      .get<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  }

  post(data: T) {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res);
  }

  update(data: T) {
    return axiosInstance
      .put<T>(this.endpoint + "/" + data.id, data) // idk jestli tam musi byt lomitko ... asi ne zkusit kdyztak
      .then((res) => res.data);
  }

  delete(data: T) {
    return axiosInstance
      .delete<T>(this.endpoint + "/" + data.id)
      .then((res) => res.data);
  }
}

export default APIClient;
