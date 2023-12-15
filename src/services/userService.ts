import APIClient from "./api-client";

export interface User {
    id: number;
    created_date: Date;
    name: string;
    email: string;
    password: string;
    country: string;
}

const userService = new APIClient<User>("users");

export default userService;