import APIClient from "./api-client";

export interface User {
    id: number;
    created_date: Date;
    name: string;
    email: string;
    password: string;
    country: string;
    username: string;
    bought_answers: number[];
}

const userService = new APIClient<User>("users");

export default userService;