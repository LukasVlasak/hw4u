import React, { useEffect, useState } from 'react'
import { useEditTask, useGetOneTask, usePostTask } from '../../../hooks/useTasks';
import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Textarea, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import ReactStars from 'react-stars';
import { FieldValues, useForm } from 'react-hook-form';
import { Task } from '../../../services/taskService';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { DayPicker } from 'react-day-picker';
import { cs } from "date-fns/locale";
import DayPickerInput from '../DayPickerInput';
import { useGetCategories, useGetCategoryWithParentId } from '../../../hooks/useCategory';
import { isNumber } from 'lodash';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    taskId?: number;
}

interface FormData {
    title: string;
    price: number;
    description: string;
}

const AddTaskModal = ({isOpen, onClose, taskId}: Props) => {

    const schema = Joi.object({
        title: Joi.string()
          .max(50)
          // eslint-disable-next-line
          .regex(/^[a-zA-ZěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ \-\/\!\?\.\,\s0-9]+$/)
          .messages({
            "string.max": "Maximální délka je 50 znaků",
            "string.pattern.base": "Obsahuje nepovolené znaky",
          }),
        price: Joi.number().required(),
        description: Joi.string()
          .required()
          .max(300)
          // eslint-disable-next-line
          .regex(/^[a-zA-Z0-9\.\,\?\!\-\/ěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ ]+$/)
          .messages({
            "string.max": "Maximální délka je 300 znaků",
            "string.pattern.base": "Obsahuje nepovolené znaky",
          }),
      }).messages({
        "string.empty": t("errors.required"),
      });
      
    const toast = useToast();
      const { mutate: addTask } = usePostTask(() => {
    toast({
      status: "success",
      duration: 4000,
      isClosable: true,
      title: "Úkol vytvořen",
    });
  })

    const { mutate: editTask, isPending: isEditTaskPending } = useEditTask(() => {
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: "Úkol upraven",
    });
  })

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FormData>({ resolver: joiResolver(schema) });

    const [date, setDate] = useState<Date>();

    const { data } = useGetOneTask(taskId);

    const [category1, setCategory1] = useState<number | "">("");
    const [category2, setCategory2] = useState<number | "">("");
    const [category3, setCategory3] = useState<number | "">("");

    const [categoryError, setCategoryError] = useState(false);
    

    useEffect(() => {
        if (taskId && data) {

            setValue("title", data.title);
            setValue("price", data.price);
            setValue("description", data.description);
            setDate(data.due_date ? new Date(data.due_date.toString()) : undefined);
            if (data.category_hierarchy) {
                const category_hierarchy = JSON.parse(JSON.stringify(data.category_hierarchy));
                category_hierarchy.reverse();
                category_hierarchy[0] ? setCategory1(category_hierarchy[0].category_id) : setCategory1("");
                category_hierarchy[1] ? setCategory2(category_hierarchy[1].category_id) : setCategory2("");
                category_hierarchy[2] ? setCategory3(category_hierarchy[2].category_id) : setCategory3("");
            }
        } else {
            reset();
            setCategory1("");
            setCategory2("");
            setCategory3("");
            setDate(undefined);
        }
    }, [isOpen, data, taskId]);
  const onSubmit = (formData: FieldValues) => {
    if (taskId != null) {
        formData.due_date = date;
        formData.category_id = category3 && categories3?.find((c) => c.category_id === category3) ? category3 : category2 && categories2?.find(c => c.category_id === category2) ? category2 : category1;
        if (formData.category_id === "") {
            setCategoryError(true);
            toast({
                title: "Vyberte kategorii",
                status: "error",
                duration: 5000,
            });
            return;
        }
        formData.task_id = taskId;
        editTask(formData as Task);
    } else {
        formData.due_date = date;
        formData.category_id = category3 ? category3 : category2 ? category2 : category1;
        if (formData.category_id === "") {
            setCategoryError(true);
            toast({
                title: "Vyberte kategorii",
                status: "error",
                duration: 5000,
            });
            return;
        }
        
        addTask(formData as Task);
    }
    onClose();
  }

  const { data: categories1 } = useGetCategoryWithParentId(-1);
  
  const { data: categories2 } = useGetCategoryWithParentId(category1 !== "" ? category1 : undefined);
  const { data: categories3 } = useGetCategoryWithParentId(category2 !== "" ? category2 : undefined);

  return (
    <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Přidat úkol</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

        <FormControl isInvalid={errors.title ? true : false}>
              <FormLabel>Titul</FormLabel>
              <Input type='text' {...register("title")} name="title" />
              {errors.title ? (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              ) : null}
            </FormControl>

             <FormControl mt={2} isInvalid={errors.price ? true : false}>
              <FormLabel>Cena</FormLabel>
              <Input type='number' {...register("price")} name="price" />
              {errors.price ? (
                <FormErrorMessage>{errors.price.message}</FormErrorMessage>
              ) : null}
            </FormControl>

            <FormControl mt={2} isInvalid={errors.description ? true : false}>
              <FormLabel>Popis</FormLabel>
              <Textarea {...register("description")} name="description" />
              {errors.description ? (
                <FormErrorMessage>{errors.description.message}</FormErrorMessage>
              ) : null}
            </FormControl>
             <FormControl mt={2}>
              <FormLabel>Do data</FormLabel>
                <DayPickerInput dateProp={date} onChange={setDate} />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Kategorie</FormLabel>
              <Select value={category1} onChange={(e) => setCategory1(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : "")}>
                <option value={""}>Vyberte kategorii</option>
                {categories1?.map((category) => {
                    return (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    )
                })}
              </Select>
              {category1 && (
                <Select value={category2} onChange={(e) => setCategory2(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : "")}>
                    <option value={undefined}>Vyberte podkategorii</option>
                    {categories2?.map((category) => {
                        return (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name}
                            </option>
                        )
                    })}
                </Select>
              )}
              {category2 && (
                <Select value={category3} onChange={(e) => {
                    
                    setCategory3(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : "");

                    }}>
                    <option value={undefined}>Vyberte podkategorii</option>
                    {categories3?.map((category) => {
                        return (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name}
                            </option>
                        )
                    })}
                </Select>
              )}
            </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type='button' variant="ghost" mr={3} onClick={onClose}>
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

export default AddTaskModal