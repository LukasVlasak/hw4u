import { useMutation } from "@tanstack/react-query";
import documentService from "../services/documentService";
import { Document } from "../services/documentService";

const useDownloadDocument = () => {
    return useMutation({
        mutationKey: ['download'],
        mutationFn: (data: Document) => documentService.post(data),
        throwOnError: true,
    });
}

export default useDownloadDocument;