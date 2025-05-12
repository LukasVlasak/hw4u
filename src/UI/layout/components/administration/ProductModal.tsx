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
import usePostProduct, { useEditProduct, useEditProductStatus, useGetOneProduct } from "../../../../hooks/useProducts";
import { Product } from "../../../../services/productService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
}
interface FormData {
  name: string;
  price: number;
  answer_limit: number;
}

const ProductModal = ({ onClose, isOpen, productId }: Props) => {
  const { data, isLoading } = useGetOneProduct(productId);

  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(45)
      .messages({
        "string.min": "Minimální délka je 3 znaky",
        "string.max": "Maximální délka je 15 znaků",
        "string.pattern.base": "Nesprávný formát",
      }),
    price: Joi.number().required().min(0).messages({
      "number.min": "Minimální cena je 0",
      "number.base": "Cena musí být číslo",
    }),
    answer_limit: Joi.number().required().min(0).messages({
        "number.min": "Minimální limit odpovědí je 0",
        "number.base": "Limit odpovědí musí být číslo",
        }),
  }).messages({
    "string.empty": t("errors.required"),
  });
  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({ resolver: joiResolver(schema) });

  const toast = useToast();
  const { mutate, error } = useEditProduct(() => {
    toast({
      title: "Produkt upraven",
      status: "success",
    });
    onClose();
  });
  const { mutate: create } = usePostProduct(() => {
    toast({
      title: "Produkt přidán",
      status: "success",
    });
    onClose();
  });
  const { mutate: activate, isPending} = useEditProductStatus(() => {
    toast({
      title: "Produkt aktivován",
      status: "success",
    });
    onClose();
  });
  const onSubmit = (formData: FieldValues) => {    
    if (productId) {
      formData.product_id = productId;
      mutate(formData as Product);
    } else {
      create(formData as Product);
    }
  };  

  useEffect(() => {
    if (data) {
    setValue("price", data.price);
      setValue("name", data.name);
      setValue("answer_limit", data.answer_limit);
    } else {
        resetField("price");
        resetField("name");
        resetField("answer_limit");
    }
  }, [isOpen, data]);
  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Přidat/editovat produkt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.name ? true : false}>
              <FormLabel>Název</FormLabel>
              <Input {...register("name")} name="name" type="text" />
              {errors.name ? <FormErrorMessage>{errors.name.message}</FormErrorMessage> : null}
            </FormControl>
            <FormControl isInvalid={errors.price ? true : false}>
              <FormLabel>Cena</FormLabel>
              <Input {...register("price")} name="price" type="number" />
              {errors.price ? <FormErrorMessage>{errors.price.message}</FormErrorMessage> : null}
            </FormControl>
            <FormControl isReadOnly={productId !== undefined} isInvalid={errors.answer_limit ? true : false}>
              <FormLabel>Limit odpovědí</FormLabel>
              <Input {...register("answer_limit")} name="answer_limit" type="number" />
              {errors.answer_limit ? <FormErrorMessage>{errors.answer_limit.message}</FormErrorMessage> : null}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              {t("tasks.close")}
            </Button>
            <Button type="submit" colorScheme="blue">
              {t("tasks.submit")}
            </Button>
            {data && !data.active && (
                <Button ml={3} isLoading={isPending} colorScheme="green" onClick={() => activate({product_id: productId} as Product)}>Aktivovat</Button>
            )}
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
