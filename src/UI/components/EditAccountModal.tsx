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
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { t } from "i18next";
import Joi from "joi";
import { FieldValues, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { useEditAccount } from "../../hooks/useUsers";
import { useContext, useEffect, useState } from "react";
import { User } from "../../services/userService";
import authContext from "../../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
interface FormData {
  username: string;
  email: string;
  password: string;
  country: string;
  name: string;
}

const EditAccountModal = ({ onClose, isOpen }: Props) => {
  const [passwordVal, setPasswordVal] = useState("");
  const patternMin = new RegExp(/.{8,}/);
  const patternUpperCase = new RegExp(/[A-Z]/);
  const patternNum = new RegExp(/[0-9]/);
  const { value } = useContext(authContext);
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(15)
      // eslint-disable-next-line
      .regex(/[a-zA-Z0-9\.]/)
      .required()
      .messages({
        "string.min": t("auth.usernameErrors.1"),
        "string.max": t("auth.usernameErrors.2"),
        "string.pattern.base": t("auth.usernameErrors.3"),
      }),
    email: Joi.string()
      .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .messages({ "string.pattern.base": t("auth.emailErrors.1") }),
    password: Joi.string()
      .regex(/[A-Z0-9]/)
      .min(8)
      .allow("")
      .messages({ "string.min": "", "string.pattern.base": "" }),
    country: Joi.string().required(),
    name: Joi.string()
      .min(3)
      .max(30)
      .regex(/[a-zA-ZěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ]/)
      .messages({
        "string.min": t("auth.nameErrors.1"),
        "string.max": t("auth.nameErrors.2"),
        "string.pattern.base": t("auth.nameErrors.3"),
      }),
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
  const { mutate, error } = useEditAccount(() => {
    toast({
      title: t("account.accountEditted"),
      description: t("account.accountEdittedDesc"),
      duration: 5000,
      isClosable: true,
      status: "success",
    });
    onClose();
  });
  const onSubmit = (formData: FieldValues) => {
    mutate(formData as User);
  };

  useEffect(() => {
    if (value) {
      setValue("name", value.name);
      setValue("email", value.email);
      setValue("country", value.country);
      setValue("username", value.username);
    }
  }, [isOpen]);
  return (
    <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <Form onSubmit={handleSubmit(onSubmit)}>

        <ModalHeader>{t("account.editAccount")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <FormControl isInvalid={errors.name ? true : false}>
              <FormLabel>{t("auth.name")}</FormLabel>
              <Input
                autoComplete="name"
                {...register("name")}
                name="name"
                type="text"
              />
              {errors.name ? (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl
              mt={2}
              isInvalid={
                errors.username
                  ? true
                  : error
                  ? error.response?.data.type === "username"
                    ? true
                    : false
                  : false
              }
            >
              <FormLabel>{t("auth.username")}</FormLabel>
              <Input
                autoComplete="nickname"
                {...register("username")}
                name="username"
                type="text"
              />
              {errors.username ? (
                <FormErrorMessage>{errors.username.message}</FormErrorMessage>
              ) : error ? (
                error.response?.data.type === "username" ? (
                  <FormErrorMessage>
                    {t(`auth.${error.response.data.errorCode}`)}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    {t("auth.justDisplayUsername")}
                  </FormHelperText>
                )
              ) : (
                <FormHelperText>{t("auth.justDisplayUsername")}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              mt={2}
              isInvalid={
                errors.email
                  ? true
                  : error
                  ? error.response?.data.type === "email"
                    ? true
                    : false
                  : false
              }
            >
              <FormLabel>{t("auth.email")}</FormLabel>
              <Input
                autoComplete="email"
                {...register("email")}
                name="email"
                type="text"
              />
              {errors.email ? (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              ) : error ? (
                error.response?.data.type === "email" ? (
                  <FormErrorMessage>
                    {t(`auth.${error.response.data.errorCode}`)}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>{t("auth.signInWithEmail")}</FormHelperText>
                )
              ) : (
                <FormHelperText>{t("auth.signInWithEmail")}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              mt={2}
              isInvalid={
                isSubmitted && passwordVal !== ""
                  ? !patternMin.test(passwordVal) ||
                    !patternNum.test(passwordVal) ||
                    !patternUpperCase.test(passwordVal)
                    ? true
                    : false
                  : false
              }
            >
              <FormLabel>{t("auth.newPassword")}</FormLabel>
              <Input
                autoComplete="new-password"
                {...register("password")}
                onChange={(e) => setPasswordVal(e.currentTarget.value)}
                name="password"
                type="password"
              />
              {isSubmitted && passwordVal !== "" ? (
                !patternMin.test(passwordVal) ||
                !patternNum.test(passwordVal) ||
                !patternUpperCase.test(passwordVal) ? (
                  <>
                    <Text mt={2} className="text-danger">
                      {t("auth.passwordErrors.0")}
                    </Text>
                    <UnorderedList>
                      {patternMin.test(passwordVal) ? (
                        ""
                      ) : (
                        <ListItem ml={3} className="text-danger">
                          {t("auth.passwordErrors.1")}
                        </ListItem>
                      )}
                      {patternNum.test(passwordVal) ? (
                        ""
                      ) : (
                        <ListItem ml={3} className="text-danger">
                          {t("auth.passwordErrors.2")}
                        </ListItem>
                      )}
                      {patternUpperCase.test(passwordVal) ? (
                        ""
                      ) : (
                        <ListItem ml={3} className="text-danger">
                          {t("auth.passwordErrors.3")}
                        </ListItem>
                      )}
                    </UnorderedList>
                  </>
                ) : null
              ) : null}
            </FormControl>
            <FormControl mt={2} isInvalid={errors.country ? true : false}>
              <FormLabel>{t("auth.country")}</FormLabel>
              <Input {...register("country")} name="country" type="text" />
              {errors.country ? (
                <FormErrorMessage>{errors.country.message}</FormErrorMessage>
              ) : null}
            </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" mr={3} onClick={onClose}>
            {t("tasks.close")}
          </Button>
          <Button type="submit" colorScheme="blue">{t("tasks.submit")}</Button>
        </ModalFooter>
        </Form>

      </ModalContent>
    </Modal>
  );
};

export default EditAccountModal;
