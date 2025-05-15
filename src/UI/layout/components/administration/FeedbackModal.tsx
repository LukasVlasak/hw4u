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
  Textarea,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { t } from "i18next";
import Joi from "joi";
import { FieldValues, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { User } from "../../../../services/userService";
import { useEditUser, useGetOneUser } from "../../../../hooks/useUsers";
import { useGetOneFeedback } from "../../../../hooks/useFeedback";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  feedbackId?: number;
}
interface FormData {
email: string;
  message: string;
  is_resolved: boolean;
}

const UserModal = ({ onClose, isOpen, feedbackId }: Props) => {
  const { data, isLoading } = useGetOneFeedback(feedbackId);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>();
  
  const toast = useToast();
  

  useEffect(() => {
    if (data) {
      setValue("message", data.message);
      setValue("email", data.email);
      setValue("is_resolved", data.is_resolved);
    }
  }, [isOpen, data]);
  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form>
          <ModalHeader>Message feedbacku</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Email uživatele</FormLabel>
              <Input autoComplete="email" {...register("email")} name="email" type="text" />
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Message</FormLabel>
              <Textarea {...register("message")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              {t("tasks.close")}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
