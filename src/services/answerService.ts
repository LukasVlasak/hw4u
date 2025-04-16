import { APIClientFormData } from "./api-client";
import { User } from "./userService";
import { Document } from "./documentService";

interface Tasks {
    id: number;
    title: string;
}

export interface Answer {
    id: number;
    user_id: number;
    task_id: number;
    description: string;
    tasks: Tasks;
    for_user: Partial<User>[];
    documents: Document[];
}

const answerService = new APIClientFormData<Answer>("answers");
export default answerService;