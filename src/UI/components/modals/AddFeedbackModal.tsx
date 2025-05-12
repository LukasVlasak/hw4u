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
  Textarea,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { t } from "i18next";
import Joi from "joi";
import { FieldValues, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { useEditAccount } from "../../../hooks/useUsers";
import { useContext, useEffect, useState } from "react";
import { User } from "../../../services/userService";
import useAuth from "../../../hooks/useAuth";
import usePostFeedback from "../../../hooks/useFeedback";
import { Feedback } from "../../../services/feedbackService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
interface FormData {
  message: string;
}

const AddFeedbackModal = ({ onClose, isOpen }: Props) => {
  const schema = Joi.object({
    message: Joi.string()
      .min(10)
      .max(300)
      // eslint-disable-next-line
      .regex(/^[a-zA-Z0-9\.\,\?\!ěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ]+$/)
      .messages({
        "string.min": t("feedback.min"),
        "string.max": t("feedback.max"),
        "string.pattern.base": t("feedback.pattern"),
      }),
  }).messages({
    "string.empty": t("errors.required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: joiResolver(schema) });
  const toast = useToast();
  const { mutate } = usePostFeedback(() => {
    reset();
    toast({
      title: t("feedback.feedbackSent"),
      duration: 5000,
      isClosable: true,
      status: "success",
    });
    onClose();
  });
  const onSubmit = (formData: FieldValues) => {
    mutate(formData as Feedback);
  };

  return (
    <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <Form onSubmit={handleSubmit(onSubmit)}>

        <ModalHeader>{t("feedback.addFeedback")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <FormControl isInvalid={errors.message ? true : false}>
              <FormLabel>{t("feedback.message")}</FormLabel>
              <Textarea {...register("message")} name="message" />
              {errors.message ? (
                <FormErrorMessage>{errors.message.message}</FormErrorMessage>
              ) : null}
            </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" mr={3} onClick={onClose}>
            {t("tasks.close")}
          </Button>
          <Button type="submit" colorScheme="blue">{t("feedback.submit")}</Button>
        </ModalFooter>
        </Form>

      </ModalContent>
    </Modal>
  );
};

export default AddFeedbackModal;
