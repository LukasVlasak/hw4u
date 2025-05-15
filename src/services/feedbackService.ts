import APIClient from "./api-client";

export interface Feedback {
    feedback_id: number;
    message: string;
    is_resolved: boolean;
    created_date: Date;
    app_user_id: number;
    full_name: string;
    email: string;
    unresolved_feedback_count? : number;
}

const feedbackService = new APIClient<Feedback>("feedback");

export default feedbackService;