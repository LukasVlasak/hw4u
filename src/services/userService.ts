import APIClient from "./api-client";

export interface User {
    app_user_id: number;
    created_date: Date;
    full_name: string;
    email: string;
    password: string;
    username?: string;
    average_rating?: number;
    is_admin: boolean;
    avg_rating?: number;
    total_earnings?: number;
}

const userService = new APIClient<User>("users");

export default userService;