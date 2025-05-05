import APIClient from "./api-client";

export interface Category {
    category_id: number;
    name: string;
    parent_category_id?: number;
}

const categoryService = new APIClient<Category>("category");

export default categoryService;