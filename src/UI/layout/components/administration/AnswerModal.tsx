import {
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ListItem,
  UnorderedList,
  useToast,
  Checkbox,
  Select,
  Textarea,
  Heading,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { t } from "i18next";
import Joi from "joi";
import { FieldValues, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { User } from "../../../../services/userService";
import { useEditUser, useGetOneUser } from "../../../../hooks/useUsers";
import usePostCategory, {
  useEditCategory,
  useGetCategories,
  useGetOneCategory,
} from "../../../../hooks/useCategory";
import { Category } from "../../../../services/categoryService";
import { useGetOneAnswer } from "../../../../hooks/useAnswers";
import LoadingComponents from "../../../components/LoadingComponents";
import { API_URL } from "../../../../services/api-client";
import { truncateText } from "../../../../utils/fc";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  answerId?: number;
}

const AnswerModal = ({ onClose, isOpen, answerId }: Props) => {
  const { data, isLoading } = useGetOneAnswer(answerId);

  const toast = useToast();

  if (isLoading) {
    return <LoadingComponents />;
  }
  

  return data ? (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
          <ModalHeader>Odpověď</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isReadOnly>
                <FormLabel>Titul</FormLabel>
                <Input type="text" defaultValue={data.title}></Input>
            </FormControl>
            <FormControl mt={2} isReadOnly>
                <FormLabel>Celá odpověď</FormLabel>
                <Textarea defaultValue={data.full_answer}></Textarea>
            </FormControl>
            <FormControl mt={2} isReadOnly>
                <FormLabel>Veřejná část odpovědi</FormLabel>
                <Textarea defaultValue={data.preview}></Textarea>
            </FormControl>
            <FormControl mt={2} isReadOnly>
                <FormLabel>Vytvořil</FormLabel>
                <Input type="text" defaultValue={data.app_user_email_answer}></Input>
            </FormControl>
            <Heading mt={2} size="md">Soubory</Heading>
            <UnorderedList mt={2}>
                {data.documents && data.documents[0].filename != null && data.documents.map((document) => {
                    return (
                        <ListItem key={document.document_id}>
                            <a className="link" href={API_URL + "documents/" + document.document_id} target="_blank" rel="noopener noreferrer">
                                {truncateText(document.filename, 10)}
                            </a>
                            - {document.is_preview ? "Veřejný" : "Soukromý"}
                        </ListItem>
                    );
                })}
            </UnorderedList>

          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              {t("tasks.close")}
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null;
};

export default AnswerModal;
