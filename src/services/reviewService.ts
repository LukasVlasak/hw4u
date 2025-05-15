import APIClient from "./api-client";

export interface Review {
    review_id: number;
    app_user_id: number;
    for_app_user_id: number;
    stars: number;
    text?: string;
    created_date: Date;

    username?: string;
    full_name?: string;
    email?: string;
    for_user_email?: string;
}

const reviewService = new APIClient<Review>("reviews");

export default reviewService;