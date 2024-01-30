import APIClient from "./api-client";

export interface Task {
    id: number;
    title: string;
    willing_to_pay: number;
    category: string;
    due_date?: Date;
    user_id: number;
    description: string;
    for_user_id?: number;
    created_date?: Date;
}

export const TaskCategoryObj = {
    quality: "Quality",
    marketing: "Marketing",
    development: "Development",
    neco: "Neco"
}

export const TaskCategoryObj2 = {
    math: "Math",
    geo: "Geo",
    cj: "Cj",
    aj: "Aj"
}

const taskService = new APIClient<Task>("tasks");

export default taskService;