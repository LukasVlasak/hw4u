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

class APIClient<T extends Entity> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll() {
    const token = localStorage.getItem("x-auth-token"); // toto pred vsemi requesty - ale spis predelat na nejakej global storage a dat do headers pri vytvareni axios instance
    return axiosInstance
      .get<T[]>(this.endpoint, {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((res) => res.data);
  }

  get(id: number) {
    return axiosInstance
      .get<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  }

  post(data: T) {
    const token = localStorage.getItem("x-auth-token"); // toto pred vsemi requesty - ale spis predelat na nejakej global storage a dat do headers pri vytvareni axios instance

    return axiosInstance.post<T>(this.endpoint, data, {
      headers: {
        "x-auth-token": token
      }
    }).then((res) => res);
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
