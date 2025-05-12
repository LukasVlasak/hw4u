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
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { t } from "i18next";
import Joi from "joi";
import { FieldValues, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { User } from "../../../../services/userService";
import { useEditUser, useGetOneUser } from "../../../../hooks/useUsers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
}
interface FormData {
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

const UserModal = ({ onClose, isOpen, userId }: Props) => {
  const { data, isLoading } = useGetOneUser(userId);
  const schema = Joi.object({
    is_admin: Joi.boolean(),
     username: Joi.string()
          .min(3)
          .max(15)
          // eslint-disable-next-line
          .regex(/[a-zA-Z0-9\.]/)
          .allow("")
          .messages({
            "string.min": t("auth.usernameErrors.1"),
            "string.max": t("auth.usernameErrors.2"),
            "string.pattern.base": t("auth.usernameErrors.3"),
          }),
    full_name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/[a-zA-ZěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ]/)
      .messages({
        "string.min": t("auth.nameErrors.1"),
        "string.max": t("auth.nameErrors.2"),
        "string.pattern.base": t("auth.nameErrors.3"),
      }),
      email: Joi.string()
            .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
            .required()
            .messages({ "string.pattern.base": t("auth.emailErrors.1") }),

  }).messages({
    "string.empty": t("errors.required"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({ resolver: joiResolver(schema) });
  
  const toast = useToast();
  const { mutate, error } = useEditUser(() => {
    toast({
      title: "Uživatel upraven",
      status: "success",
    });
    onClose();
  });
  const onSubmit = (formData: FieldValues) => {
    console.log(formData);
    formData.app_user_id = userId;
    mutate(formData as User);
  };

  useEffect(() => {
    if (data) {
      setValue("full_name", data.full_name);
      setValue("email", data.email);
      setValue("username", data.username ?? "");
      setValue("is_admin", data.is_admin);
    }
  }, [isOpen, data]);
  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Editovat uživatele</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.full_name ? true : false}>
              <FormLabel>{t("auth.name")}</FormLabel>
              <Input autoComplete="name" {...register("full_name")} name="full_name" type="text" />
              {errors.full_name ? (
                <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>{t("auth.username")}</FormLabel>
              <Input autoComplete="nickname" {...register("username")} name="username" type="text" />
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>{t("auth.email")}</FormLabel>
              <Input autoComplete="email" {...register("email")} name="email" type="text" />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Je admin</FormLabel>
              <Checkbox {...register("is_admin")} defaultChecked={data?.is_admin} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              {t("tasks.close")}
            </Button>
            <Button type="submit" colorScheme="blue">
              {t("tasks.submit")}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
