import { Answer } from "./answerService";
import APIClient from "./api-client";
import { Category } from "./categoryService";

export interface Task {
    task_id: number;
    title: string;
    price: number;
    description: string;
    due_date?: Date;
    status: string;
    created_date: Date;
    app_user_id: number;
    app_user_email?: string;
    category_hierarchy?: Category[];
    category_name? : string;
    answers?: Answer[];
}

export interface LoaderDataTaskInterface {
    data: Task[];
}

const taskService = new APIClient<Task>("tasks");

export default taskService;