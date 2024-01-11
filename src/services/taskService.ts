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

export enum TaskCategory {
    quality = "Quality Assurance",
    marketing = "Marketing"
}
export type TaskType = {
    quality: "Quality Assurance",
    marketing: "Marketing"
}

const taskService = new APIClient<Task>("tasks");

export default taskService;