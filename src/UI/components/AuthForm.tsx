import { FieldValues, useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useRegister from "../../hooks/useUsers";
import { User } from "../../services/userService";

interface FormData {
  username: string;
  email: string;
  password: string;
  country: string;
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

const AuthForm = () => {
  const { t } = useTranslation();
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(15)
      .alphanum()
      .required()
      .messages({
        "string.min": t("auth.usernameErrors.1"),
        "string.max": t("auth.usernameErrors.2"),
        "string.alphanum": t("auth.usernameErrors.3"),
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
    country: Joi.string().required(),
  }).messages({
    "string.empty": t("errors.required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({ resolver: joiResolver(schema) });
  const { data, error, mutate } = useRegister();
  const [passwordVal, setPasswordVal] = useState("");
  const patternMin = new RegExp(/.{8,}/);
  const patternUpperCase = new RegExp(/[A-Z]/);
  const patternNum = new RegExp(/[0-9]/);
  const onSubmit = (data: FieldValues) => {
    mutate(data as User);
  };
  console.log(data);
  console.log(errors.password?.message);
  
  if (error) throw error;

  return (
    <Div>
      <Text mt={6} mb={6} textAlign={"center"} fontSize={"3xl"}>
        {t("auth.signUp")}
      </Text>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username ? true : false}>
          <FormLabel>{t("auth.username")}</FormLabel>
          <Input {...register("username")} name="username" type="text" />
          {errors.username ? (
            <FormErrorMessage>{errors.username.message}</FormErrorMessage>
          ) : null}
        </FormControl>
        <FormControl mt={2} isInvalid={errors.email ? true : false}>
          <FormLabel>{t("auth.email")}</FormLabel>
          <Input
            autoComplete="email"
            {...register("email")}
            name="email"
            type="text"
          />
          {errors.email ? (
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          ) : // <FormHelperText>We'll never share your email.</FormHelperText>
          null}
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
                  {t("passwordErrors.0")}{" "}
                </Text>
                <UnorderedList>
                  {patternMin.test(passwordVal) ? (
                    ""
                  ) : (
                    <ListItem ml={3} className="text-danger">
                      {t("passwordErrors.1")}
                    </ListItem>
                  )}
                  {patternNum.test(passwordVal) ? (
                    ""
                  ) : (
                    <ListItem ml={3} className="text-danger">
                      {t("passwordErrors.2")}
                    </ListItem>
                  )}
                  {patternUpperCase.test(passwordVal) ? (
                    ""
                  ) : (
                    <ListItem ml={3} className="text-danger">
                      {t("passwordErrors.3")}
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

export default AuthForm;
