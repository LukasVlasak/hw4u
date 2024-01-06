import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import { User } from "../../services/userService";
import { useEffect } from "react";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
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

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { mutate, error } = useLogin(() => {
    navigate("/");
    toast({
      description: t("auth.successSignInDesc"),
      title: t("auth.successSignIn"),
      duration: 5000,
      isClosable: true,
      status: "success",
    });
  });
  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitted, errors },
  } = useForm<FormData>();
  const onSubmit = (formData: FieldValues) => {
    mutate(formData as User);
  };

  useEffect(() => {
    if (isSubmitted && error?.response?.data.type === "password")
      resetField("password");
  }, [isSubmitted, resetField, error?.response?.data.type]);

  return (
    <Div>
      <Text mt={6} mb={6} textAlign={"center"} fontSize={"3xl"}>
        {t("auth.signIn")}
      </Text>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          mt={2}
          isInvalid={
            error?.response?.data.type === "email" || errors.email
              ? true
              : false
          }
        >
          <FormLabel>{t("auth.email")}</FormLabel>
          <Input
            autoComplete="email"
            {...register("email", { required: true })}
            name="email"
            type="text"
          />
          {error?.response?.data.type === "email" ? (
            <FormErrorMessage>
              {t("auth." + error.response.data.errorCode)}
            </FormErrorMessage>
          ) : errors.email ? (
            <FormErrorMessage>{t("errors.required")}</FormErrorMessage>
          ) : null}
        </FormControl>
        <FormControl
          mt={2}
          isInvalid={
            error?.response?.data.type === "password" || errors.password
              ? true
              : false
          }
        >
          <FormLabel>{t("auth.password")}</FormLabel>
          <Input
            autoComplete="current-password"
            {...register("password", { required: true })}
            name="password"
            type="password"
          />
          {error?.response?.data.type === "password" ? (
            <FormErrorMessage>
              {t("auth." + error.response.data.errorCode)}
            </FormErrorMessage>
          ) : errors.password ? (
            <FormErrorMessage>{t("errors.required")}</FormErrorMessage>
          ) : null}
        </FormControl>
        <Checkbox mt={4} {...register("rememberMe")} defaultChecked>{t("auth.rememberMe")}</Checkbox>
        <Button type="submit" mt={6} mb={3} colorScheme="blue">
          {t("auth.submit")}
        </Button>
        <Flex>
          {t("auth.stillDoNotHaveAccount")}&nbsp;
          <Link to={"/register"}>
            <Text textDecoration={"underline"} color={"brand.hoverBlueColor"}>
              {t("auth.signUp")}
            </Text>
          </Link>
        </Flex>
      </Form>
    </Div>
  );
};

export default LoginForm;
