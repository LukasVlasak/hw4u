import APIClient from "./api-client";

export interface Task {
    task_id: number;
    title: string;
    price: number;
    description?: string;
    due_date?: Date;
    status: string;
    created_date: Date;
    app_user_id: number;
}

export interface LoaderDataTaskInterface {
    data: Task[];
}

const taskService = new APIClient<Task>("tasks");

export default taskService;