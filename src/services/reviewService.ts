import APIClient from "./api-client";

export interface Review {
    id: number;
    user_id: number;
    text: string;
    stars: number;
    user_name: string;
    created_date?: Date;
}

const reviewService = new APIClient<Review>("reviews");

export default reviewService;