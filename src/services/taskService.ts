import APIClient from "./api-client";

interface Task {
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

const taskService = new APIClient<Task>("tasks");

export default taskService;