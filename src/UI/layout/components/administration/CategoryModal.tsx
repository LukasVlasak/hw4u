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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: number;
}
interface FormData {
  name: string;
  parent_category_id: number;
}

const CategoryModal = ({ onClose, isOpen, categoryId }: Props) => {
  const { data, isLoading } = useGetOneCategory(categoryId);
  const { data: categories } = useGetCategories();

  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(15)
      // eslint-disable-next-line
      .regex(/[a-zA-Z0-9\.]/)
      .messages({
        "string.min": "Minimální délka je 3 znaky",
        "string.max": "Maximální délka je 15 znaků",
        "string.pattern.base": "Nesprávný formát",
      }),
    parent_category_id: Joi.number().allow(""),
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
  const { mutate, error } = useEditCategory(() => {
    toast({
      title: "Kategorie upravena",
      status: "success",
    });
    onClose();
  });
  const { mutate: create } = usePostCategory(() => {
    toast({
      title: "Kategorie přidána",
      status: "success",
    });
    onClose();
  });
  const onSubmit = (formData: FieldValues) => {    
    if (categoryId) {
      formData.category_id = categoryId;
      mutate(formData as Category);
    } else {
      create(formData as Category);
    }
  };  

  useEffect(() => {
    if (data) {
      if (data.parent_category_id) {
        setValue("parent_category_id", data.parent_category_id);
      }
      setValue("name", data.name);
    } else {
        setValue("name", "");
        resetField("parent_category_id");
    }
  }, [isOpen, data]);
  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Přidat/editovat kategorii</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.name ? true : false}>
              <FormLabel>Název</FormLabel>
              <Input {...register("name")} name="name" type="text" />
              {errors.name ? <FormErrorMessage>{errors.name.message}</FormErrorMessage> : null}
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Rodičovská kategorie</FormLabel>
              <Select {...register("parent_category_id")} name="parent_category_id">
                <option value="">Žádná</option>
                {categories?.map((category) => {
                  if (category.category_id === categoryId) {
                    return null;
                  }
                  return (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  );
                })}
              </Select>
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

export default CategoryModal;
