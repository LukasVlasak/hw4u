import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  ListItem,
  Text,
  UnorderedList
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useNavigateWithToast from "../../hooks/useNavigateWithToast";
import useRegister from "../../hooks/useUsers";
import { User } from "../../services/userService";

interface FormData {
  username?: string;
  email: string;
  password: string;
  full_name: string;
}

const Form = styled("form")({
  margin: "0 auto",
  width: "450px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 0px 1px 0px grey",
  borderRadius: "10px",
  padding: "40px",
  alignContent: "center",
  fontSize: "calc(0.6rem + 0.5vw)",
});

const Div = styled("div")({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  marginBottom: "30px",
  marginTop: "30px",
});

const RegisterForm = () => {
  const { t } = useTranslation();
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(15)
      .allow("")
      // eslint-disable-next-line
      .regex(/[a-zA-Z0-9\.]/)
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
      .required()
      .messages({ "string.min": "", "string.pattern.base": "" }),
    full_name: Joi.string()
    .required()
      .min(3)
      .max(50)
      .regex(/[a-zA-ZěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ]+/)
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
    formState: { errors, isSubmitted },
  } = useForm<FormData>({ resolver: joiResolver(schema) });
  const navigateWithToast = useNavigateWithToast();
  const { mutate, error } = useRegister(() => {
    navigateWithToast("/", {
      title: t("auth.accountCreated"),
      description: t("auth.yourAccountWasCreated"),
      duration: 5000,
      isClosable: true,
      status: "success",
    });
  });
  const [passwordVal, setPasswordVal] = useState("");
  const patternMin = new RegExp(/.{8,}/);
  const patternUpperCase = new RegExp(/[A-Z]/);
  const patternNum = new RegExp(/[0-9]/);
  const onSubmit = (formData: FieldValues) => {
    mutate(formData as User);
  };

  return (
    <Div>
      <Text mt={6} mb={6} textAlign={"center"} fontSize={"3xl"}>
        {t("auth.signUp")}
      </Text>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.full_name ? true : false}>
          <FormLabel>{t("auth.name")}</FormLabel>
          <Input
            autoComplete="name"
            {...register("full_name")}
            name="full_name"
            type="text"
          />
          {errors.full_name ? (
            <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>
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
              <FormHelperText>{t("auth.justDisplayUsername")}</FormHelperText>
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
            isSubmitted
              ? !patternMin.test(passwordVal) ||
                !patternNum.test(passwordVal) ||
                !patternUpperCase.test(passwordVal)
                ? true
                : false
              : false
          }
        >
          <FormLabel>{t("auth.password")}</FormLabel>
          <Input
            autoComplete="new-password"
            {...register("password")}
            onChange={(e) => setPasswordVal(e.currentTarget.value)}
            name="password"
            type="password"
          />
          {isSubmitted ? (
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
        <Button type="submit" mt={6} mb={3} colorScheme="blue">
          {t("auth.submit")}
        </Button>
        <Flex>
          {t("auth.alreadyHaveAccount")}&nbsp;
          <Link to={"/login"}>
            <Text textDecoration={"underline"} color={"brand.hoverBlueColor"}>
              {t("auth.signIn")}
            </Text>
          </Link>
        </Flex>
      </Form>
    </Div>
  );
};

export default RegisterForm;
