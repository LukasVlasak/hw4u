import APIClient from "./api-client";

export interface Payment {
    payment_id: number;
    state: string;
    paid_date?: Date;
    pay_to_date?: Date;
    payment_uid: string;
    admin_payment: boolean;
    created_date: Date;
    app_user_id: number;
    product_id: number;
}

const paymentService = new APIClient<Payment>("payment");

export default paymentService;