import { APIClientFormData } from "./api-client";
import { Document } from "./documentService";

export interface Answer {
    answer_id: number;
    title: string;
    full_answer: string;
    preview?: string;
    paid: boolean;
    selected: boolean;
    created_date: Date;
    confirmed: boolean;
    task_id: number;
    app_user_id: number;
    updated_date?: Date;
    app_user_email_answer?: string;
    documents?: Document[];
}

const answerService = new APIClientFormData<Answer>("answers");
export default answerService;