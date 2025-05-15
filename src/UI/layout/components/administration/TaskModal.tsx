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
  Textarea,
  Heading,
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
import { useGetOneAnswer } from "../../../../hooks/useAnswers";
import LoadingComponents from "../../../components/LoadingComponents";
import { API_URL } from "../../../../services/api-client";
import { truncateText } from "../../../../utils/fc";
import { useGetOneTask } from "../../../../hooks/useTasks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taskId?: number;
}

const TaskModal = ({ onClose, isOpen, taskId }: Props) => {
  const { data, isLoading } = useGetOneTask(taskId);

  const toast = useToast();

  if (isLoading) {
    return <LoadingComponents />;
  }

  return data ? (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Úkol</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isReadOnly>
            <FormLabel>Titul</FormLabel>
            <Input type="text" defaultValue={data.title}></Input>
          </FormControl>
          <FormControl mt={2} isReadOnly>
            <FormLabel>Popis</FormLabel>
            <Textarea defaultValue={data.description}></Textarea>
          </FormControl>
          <FormControl mt={2} isReadOnly>
            <FormLabel>Cena</FormLabel>
            <Input defaultValue={data.price}></Input>
          </FormControl>
          <FormControl mt={2} isReadOnly>
            <FormLabel>Vytvořil</FormLabel>
            <Input type="text" defaultValue={data.app_user_email}></Input>
          </FormControl>
          <FormControl mt={2} isReadOnly>
            <FormLabel>Kategorie</FormLabel>
            <Text fontSize={"md"}>
              {JSON.parse(JSON.stringify(data.category_hierarchy))
                .reverse()
                .map((category: Category) => category.name)
                .join(" > ")}
            </Text>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" mr={3} onClick={onClose}>
            {t("tasks.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : null;
};

export default TaskModal;
