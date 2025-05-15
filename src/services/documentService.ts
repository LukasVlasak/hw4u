import APIClient from "./api-client";

export interface Document {
    document_id: number;
    filename: string;
    is_preview: boolean;
    answer_id: number;
}

const documentService = new APIClient<Document>("documents");
export default documentService;