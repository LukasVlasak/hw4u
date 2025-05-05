import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ErrorCode {
  message: string;
  errorCode: string;
  type: string;
}

interface QueryObject {
  _start: number;
  _limit: number;
  orderBy: string;
  where: string;
}

export class APIClientFormData<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  put(data: FormData) {
    return axiosInstance
      .put<T>(this.endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }})
      .then((res) => res.data);
  }

  getDifferentRoute(route: string) {
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + route)
      .then((res) => res.data);
  }

  delete(id: number) {
    return axiosInstance
      .delete<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  }

  get(id?: number) {
    if (!id) return null;
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + id)
      .then((res) => res.data[0]);
  }


  post(data: FormData) {
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

class APIClient<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll(queryObject?: Partial<QueryObject>) {
    return axiosInstance
      .get<T[]>(this.endpoint, queryObject ? { params: queryObject } : {})
      .then((res) => res.data);
  }

  // .get<T> nefunguje protoze z nejakyho duvodu to vzdy vraci pole - typescript si mysli ze je to object: Task, ale je to Array - ocekavam T[], predavam pouze T
  get(id?: number) {
    if (!id) return null;
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + id)
      .then((res) => res.data[0]);
  }

  getDifferentRoute(route: string) {
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + route)
      .then((res) => res.data);
  }

  getDifferentRouteWithId(route: string, id?: number) {
    if (!id) return null;
    return axiosInstance
      .get<T[]>(this.endpoint + "/" + route + "/" + id)
      .then((res) => res.data);
  }

  post(data: T) {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res);
  }

  update(data: T, id: number) {
    return axiosInstance
      .put<T>(this.endpoint + "/" + id, data) // idk jestli tam musi byt lomitko ... asi ne zkusit kdyztak
      .then((res) => res.data);
  }

  delete(id: number) {
    return axiosInstance
      .delete<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
  }

  put(data: T, id: number) {
    return axiosInstance
      .put<T>(this.endpoint + "/" + id, data)
      .then((res) => res);
  }

  putCurrentUser(data: T) {
    return axiosInstance
      .put<T>(this.endpoint, data)
      .then((res) => res);
  }
}

export default APIClient;
