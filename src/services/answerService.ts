import { APIClientFormData } from "./api-client";

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
}

const answerService = new APIClientFormData<Answer>("answers");
export default answerService;