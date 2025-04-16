import APIClient from "./api-client";

export interface Document {
    id: number;
    filename?: string;
}

const documentService = new APIClient<Document>("documents");
export default documentService;