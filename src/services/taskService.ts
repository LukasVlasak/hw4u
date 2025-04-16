import APIClient from "./api-client";
import { User } from "./userService";

export interface Task {
    id: number;
    title: string;
    willing_to_pay: number;
    category: string;
    due_date?: Date;
    user_id: number;
    description: string;
    created_date?: Date;
    for_user: Partial<User>[];
}

export interface LoaderDataTaskInterface {
    data: Task[];
}

export const TaskCategoryObj = {
    programming: "Programming",
    marketing: "Marketing",
    development: "Development",
}

export const TaskCategoryObj2 = {
    math: "Math",
    geo: "Geo",
    cj: "Cj",
    aj: "Aj"
}

const taskService = new APIClient<Task>("tasks");

export default taskService;