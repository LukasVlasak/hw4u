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

export class APIClientFormData<T extends Entity> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private checkToken() {
    const token = localStorage.getItem("x-auth-token");

    axiosInstance.interceptors.request.use((config) => {
      config.headers["x-auth-token"] = token;
      return config;
    });
  }

  put(data: FormData) {
    this.checkToken();
    return axiosInstance
      .put<T>(this.endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }})
      .then((res) => res.data);
  }

  getDifferentRoute(route: string) {
    this.checkToken();
    
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + route)
      .then((res) => res.data);
  }

  delete(id: number) {
    this.checkToken();
    return axiosInstance
      .delete<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  }

  get(id?: number) {
    if (!id) return null;
    this.checkToken();
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + id)
      .then((res) => res.data[0]);
  }


  post(data: FormData) {
    this.checkToken();

    return axiosInstance
      .post<T>(this.endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent) {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            // Update UI with progress information
            //console.log(`Upload Progress: ${progress}%`);
          }
        },
      })
      .then((res) => res);
  }
}

class APIClient<T extends Entity> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private checkToken() {
    const token = localStorage.getItem("x-auth-token");

    axiosInstance.interceptors.request.use((config) => {
      config.headers["x-auth-token"] = token;
      return config;
    });
  }

  getAll(queryObject?: Partial<QueryObject>) {
    this.checkToken();
    return axiosInstance
      .get<T[]>(this.endpoint, queryObject ? { params: queryObject } : {})
      .then((res) => res.data);
  }

  // .get<T> nefunguje protoze z nejakyho duvodu to vzdy vraci pole - typescript si mysli ze je to object: Task, ale je to Array - ocekavam T[], predavam pouze T
  get(id?: number) {
    if (!id) return null;
    this.checkToken();
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + id)
      .then((res) => res.data[0]);
  }

  getDifferentRoute(route: string) {
    this.checkToken();
    
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + route)
      .then((res) => res.data);
  }

  post(data: T) {
    this.checkToken();
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res);
  }

  update(data: T) {
    this.checkToken();
    return axiosInstance
      .put<T>(this.endpoint + "/" + data.id, data) // idk jestli tam musi byt lomitko ... asi ne zkusit kdyztak
      .then((res) => res.data);
  }

  delete(id: number) {
    this.checkToken();
    return axiosInstance
      .delete<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  }

  put(data: T) {
    this.checkToken();
    return axiosInstance
      .put<T>(this.endpoint + "/" + data.id, data)
      .then((res) => res);
  }

  putCurrentUser(data: T) {
    this.checkToken();
    return axiosInstance
      .put<T>(this.endpoint, data)
      .then((res) => res);
  }
}

export default APIClient;
