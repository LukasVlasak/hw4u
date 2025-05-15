import { Modal, Button, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Heading, Textarea, ModalFooter, FormControl, FormLabel, Input, FormErrorMessage, FormHelperText, UnorderedList, ListItem, useToast } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { t } from 'i18next';
import Joi from 'joi';
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import { User } from '../../../services/userService';
import useHandleAdminPayment from '../../../hooks/usePayment';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productId?: number;
}

interface FormData {
    email: string;
    password: string;
}

const AdminPaymentModal = ({isOpen, onClose, productId}: Props) => {
  
    const schema = Joi.object({
        email: Joi.string()
          .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
          .required()
          .messages({ "string.pattern.base": t("auth.emailErrors.1") }),
        password: Joi.string()
          .regex(/[A-Z0-9]/)
          .min(8)
          .required()
          .messages({ "string.min": "", "string.pattern.base": "" }),
      }).messages({
        "string.empty": t("errors.required"),
      });

      const toast = useToast();
      const { mutate, error } = useHandleAdminPayment(() => {
        toast({
          title: "Admin platba byla úspěšně zpracována",
          status: "success",
          duration: 3000,
      });
      onClose();
    });
    
      
      const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
      } = useForm<FormData>({ resolver: joiResolver(schema) });

        const [passwordVal, setPasswordVal] = useState("");
        const patternMin = new RegExp(/.{8,}/);
        const patternUpperCase = new RegExp(/[A-Z]/);
        const patternNum = new RegExp(/[0-9]/);
        const onSubmit = (formData: FieldValues) => {
          formData.productId = productId;
          mutate(formData as User);
        };

  return (
   <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
            
        
        <ModalHeader>Admin payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size={"sm"}>Zadejte prosím přihlašovací údaje admina k uskutečnění platby</Heading>

<FormControl
          mt={2}
          isInvalid={
            errors.email
              ? true
              : error
              ? error.response?.data.type === "notAdmin"
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
            error.response?.data.type === "notAdmin" ? (
              <FormErrorMessage>
                {t(`auth.${error.response.data.errorCode}`)}
              </FormErrorMessage>
            ) : null
          ) : null}
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
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" type='button' mr={3} onClick={onClose}>
            {t("tasks.close")}
          </Button>
          <Button type='submit' colorScheme="blue">
            {t("tasks.submit")}
          </Button>
        </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AdminPaymentModal;