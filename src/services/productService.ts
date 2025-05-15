import APIClient from "./api-client";

export interface Product {
    product_id: number;
    name: string;
    price: number;
    answer_limit: number;
    active: boolean;
    answered?: number;
}

const productService = new APIClient<Product>("product");

export default productService;