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
  Textarea,
} from "@chakra-ui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { t } from "i18next";
import Joi from "joi";
import { FieldValues, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { User } from "../../../../services/userService";
import { useEditUser, useGetOneUser } from "../../../../hooks/useUsers";
import { useGetOneFeedback } from "../../../../hooks/useFeedback";
import { useGetOneReview } from "../../../../hooks/useReviews";
import ReactStars from "react-stars";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reviewId?: number;
}
interface FormData {
email: string;
  for_user_email: string;
  text: string;
}

const UserModal = ({ onClose, isOpen, reviewId }: Props) => {
  const { data, isLoading } = useGetOneReview(reviewId);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>();
  
  const toast = useToast();
  
  const [stars, setStars] = useState(0);


  useEffect(() => {
    if (data) {
      setValue("text", data.text ?? "");
      setValue("email", data.email ?? "");
      setValue("for_user_email", data.for_user_email ?? "");
      setStars(parseInt(data.stars as unknown as string));
    }
  }, [isOpen, data]);
  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form>
          <ModalHeader>Recenze</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Email uživatele, který recenzi napsal</FormLabel>
              <Input autoComplete="email" {...register("email")} name="email" type="text" />
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Email uživatele, kterému byla recenze napsána</FormLabel>
              <Input autoComplete="email" {...register("for_user_email")} name="email" type="text" />
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Hvězdy</FormLabel>
                      <ReactStars edit={false} value={stars}/>
                
            </FormControl>
            <FormControl mt={2} isReadOnly>
              <FormLabel>Text</FormLabel>
              <Textarea {...register("text")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="ghost" mr={3} onClick={onClose}>
              {t("tasks.close")}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
