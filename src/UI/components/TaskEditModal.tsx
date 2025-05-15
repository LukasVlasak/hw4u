import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEditTask, useGetOneTask, usePostTask } from "../../hooks/useTasks";
import { Task } from "../../services/taskService";
import LoadingComponents from "./LoadingComponents";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id?: number;
  callbackAfterEdit?: () => void;
}

interface FormData {
  title: string;
  willing_to_pay: number;
  description: string;
  //category: typeof TaskCategoryObj;
  due_date: Date;
}

const TaskEditModal = ({ isOpen, onClose, id, callbackAfterEdit }: Props) => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const toast = useToast();
  const { data, isLoading } = useGetOneTask(id);
  
  useEffect(() => {
    if (!id) {
        reset();
    }
  }, [id]);
  const { t } = useTranslation();
  const {mutate: editTask} = useEditTask(() => {
    toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        title: t("successEdit"),
        description: t("tasks.successEditDesc"),
    });
    onClose();
    if (callbackAfterEdit) {
        callbackAfterEdit();
    }
  });
  const {mutate: addTask} = usePostTask(() => {
    toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        title: t("successPost"),
        description: t("tasks.successPostDesc"),
    });
    onClose();
  });
  const onSubmit = (data: FieldValues) => {
    if (id) {
        data.id = id;
        editTask(data as Task);
    } else {
        addTask(data as Task);
        reset();
    }
  };  

  // useEffect(() => {
  //   if (data?.title) {
  //     setValue("title", data.title);
  //   }
  //   if (data?.description) {
  //     setValue("description", data.description);
  //   }
  //   if (data?.willing_to_pay) {
  //     setValue("willing_to_pay", data.willing_to_pay);
  //   }
  //   if (data?.category) {
  //     //setValue("category", data.category)
  //   }
  //   if (data?.due_date) {
  //     setValue("due_date", data.due_date);
  //   }
  // }, [data, isOpen]);

  return null;
  // return (
  //   <>
  //     <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
  //       <ModalOverlay />
  //       <ModalContent>
  //         <ModalHeader>{t("tasks.addEditTask")}</ModalHeader>
  //         <ModalCloseButton />
  //         <form onSubmit={handleSubmit(onSubmit)}>
  //           <ModalBody>
  //             {isLoading ? (
  //               <LoadingComponents />
  //             ) : (
  //               <>
  //                 <Text pl={3} mb={1}>
  //                   {t("tasks.title")}
  //                 </Text>
  //                 <FormControl>
  //                   <Input
  //                     mb={errors.title ? 0 : 4}
  //                     isInvalid={errors.title ? true : false}
  //                     type="text"
  //                     placeholder={t("tasks.title")}
  //                     {...register("title", {
  //                       maxLength: {
  //                         value: 20,
  //                         message: t("tasks.max20chars"),
  //                       },
  //                     })}
  //                     required
  //                   ></Input>
  //                   {errors.title ? (
  //                     <FormHelperText className="text-danger" mb={3} pl={3}>
  //                       {errors.title?.message}
  //                     </FormHelperText>
  //                   ) : null}
  //                 </FormControl>
  //                 <Text pl={3} mb={1}>
  //                   {t("tasks.willingToPay")}
  //                 </Text>
  //                 <Input
  //                   mb={4}
  //                   type="number"
  //                   placeholder={t("tasks.willingToPay")}
  //                   {...register("willing_to_pay")}
  //                   required
  //                 ></Input>
  //                 <Text pl={3} mb={1}>
  //                   {t("tasks.dueDate")}
  //                 </Text>
  //                 <Input
  //                   mb={4}
  //                   type="date"
  //                   placeholder={t("tasks.dueDate")}
  //                   {...register("due_date")}
  //                 ></Input>
  //                 <Text pl={3} mb={1}>
  //                   {t("tasks.description")}
  //                 </Text>
  //                 <FormControl>
  //                   <Textarea
  //                     mb={errors.description ? 0 : 4}
  //                     isInvalid={errors.description ? true : false}
  //                     required
  //                     {...register("description", {
  //                       maxLength: {
  //                         value: 200,
  //                         message: t("tasks.max200chars"),
  //                       },
  //                     })}
  //                     placeholder={t("tasks.description")}
  //                   ></Textarea>
  //                   {errors.description ? (
  //                     <FormHelperText className="text-danger" mb={3} pl={3}>
  //                       {errors.description.message}
  //                     </FormHelperText>
  //                   ) : null}
  //                 </FormControl>
  //                 <Text pl={3} mb={1}>
  //                   {t("tasks.category")}
  //                 </Text>
  //                 <Select {...register("category")}>
  //                   <option value={undefined}>
  //                     {" "}
  //                     {t("tasks.doesntChoose")}
  //                   </option>
  //                   {Object.entries(TaskCategoryObj).map(([key, value]) => {
  //                     return (
  //                       <option key={key} value={key}>
  //                         {value}
  //                       </option>
  //                     );
  //                   })}
  //                 </Select>
  //               </>
  //             )}
  //           </ModalBody>

  //           <ModalFooter>
  //             <Button variant="ghost" onClick={onClose} mr={3}>
  //               {t("tasks.close")}
  //             </Button>
  //             <Button type="submit" colorScheme="blue">
  //               {t("tasks.submit")}
  //             </Button>
  //           </ModalFooter>
  //         </form>
  //       </ModalContent>
  //     </Modal>
  //   </>
  // );
};

export default TaskEditModal;
