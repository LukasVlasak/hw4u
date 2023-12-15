import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '/api/'
});

interface Entity {
    id: number;
}

class APIClient<T extends Entity> {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll() {
        return axiosInstance
                .get<T[]>(this.endpoint)
                .then(res => res.data)
    }

    post(data: T) {
        return axiosInstance
                .post(this.endpoint, data)
                .then(res => res.data)
    }

    update(data: T) {
        return axiosInstance
                .put(this.endpoint + "/" + data.id, data) // idk jestli tam musi byt lomitko ... asi ne zkusit kdyztak
                .then(res => res.data)
    }

    delete(data: T) {
        return axiosInstance
                .delete(this.endpoint + "/" + data.id)
                .then(res => res.data)
    }
}

export default APIClient;