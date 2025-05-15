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
import usePostAnswer from '../../../hooks/useAnswers';
import Dropzone from '../Dropzone';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    taskId: number;
}

interface FormData {
    title: string;
    full_answer: string;
    preview: string;
}

const AddAnswerModal = ({isOpen, onClose, taskId}: Props) => {

    const schema = Joi.object({
        title: Joi.string()
          .max(50)
          .required()
          // eslint-disable-next-line
          .regex(/^[a-zA-ZěščřžýáíéůúĚŠČŘŽÝÁÍÉŮÚ \-\/\!\?\.\,\s0-9]+$/)
          .messages({
            "string.max": "Maximální délka je 50 znaků",
            "string.pattern.base": "Obsahuje nepovolené znaky",
          }),
        full_answer: Joi.string()
          .required()
          .max(600)
          // eslint-disable-next-line
          .regex(/^[a-zA-Z0-9\.\,\?\!\-\/ěščřžýá\síéůúĚŠČŘŽÝÁÍÉŮÚ ]+$/)
            .messages({
                "string.max": "Maximální délka je 600 znaků",
                "string.pattern.base": "Obsahuje nepovolené znaky",
            }),
        preview: Joi.string()
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
      const { mutate: addAnswer } = usePostAnswer(() => {
    toast({
      status: "success",
      duration: 4000,
      isClosable: true,
      title: "Odpověď vytvořena",
    });
  })

//     const { mutate: editTask, isPending: isEditTaskPending } = useEditTask(() => {
//     toast({
//       status: "success",
//       duration: 5000,
//       isClosable: true,
//       title: "Úkol upraven",
//     });
//   })

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FormData>({ resolver: joiResolver(schema) });

    //const { data } = useGetOneTask(taskId);
      const [files, setFiles] = useState<File[]>([]);
      const [files2, setFiles2] = useState<File[]>([]);


    useEffect(() => {
        setFiles([]);
        setFiles2([]);
        reset();
    }, [isOpen]);

  const onSubmit = (formData: FieldValues) => {
    const formDataToSend = new FormData();
    formData.task_id = taskId;

    Object.entries(formData).forEach(([key, val]) => {
      formDataToSend.append(key, val);
    });
    
    if (files) {
      // append files
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });
    }

    if (files2) {
      // append files
      files2.forEach((file) => {
        formDataToSend.append("previews", file);
      });
    }

    addAnswer(formDataToSend);

    onClose();
  }

  return (
    <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Přidat odpověď</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

        <FormControl isInvalid={errors.title ? true : false}>
              <FormLabel>Titul</FormLabel>
              <Input type='text' {...register("title")} name="title" />
              {errors.title ? (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              ) : null}
            </FormControl>

             <FormControl mt={2} isInvalid={errors.preview ? true : false}>
              <FormLabel>Preview {"(to, co už. uvidí bez zaplacení)"}</FormLabel>
              <Textarea {...register("preview")} name="preview" />
              {errors.preview ? (
                <FormErrorMessage>{errors.preview.message}</FormErrorMessage>
              ) : null}
            </FormControl>

            <FormControl mt={2} isInvalid={errors.full_answer ? true : false}>
              <FormLabel>Celá textová odpověď</FormLabel>
              <Textarea {...register("full_answer")} name="full_answer" />
              {errors.full_answer ? (
                <FormErrorMessage>{errors.full_answer.message}</FormErrorMessage>
              ) : null}
            </FormControl>
             <Heading mt={3} size={"sm"}>
                    Soubor jako celá odpověď
                  </Heading>
                  <Dropzone
                    idFor='fullAnswer'
                    label="Přetáhněte soubor nebo klikněte pro výběr"
                    border={"1px dashed #000"}
                    files={files}
                    setFiles={setFiles}
                    maxFileSize={20 * 1024 * 1024}
                    maxFiles={5}
                    maxFileSizeRuleMessage="Max. velikost: 20MB"
                    maxFilesRuleMessage="Max. počet: 5"
                    onFileError={(err) => {
                      if (err === "maxFileSizeError") {
                        toast({
                            title: "Maximální velikost souboru je 20MB",
                            status: "error",
                            duration: 4000,
                        });
                      } else {
                        toast({
                            title: "Maximální počet souborů je 5",
                            status: "error",
                            duration: 4000,
                        });
                      }
                    }}
                  />

                  <Heading mt={3} size={"sm"}>
                    Soubor jako preview
                  </Heading>
                  <Dropzone
                    idFor='preview'
                    label="Přetáhněte soubor nebo klikněte pro výběr"
                    border={"1px dashed #000"}
                    files={files2}
                    setFiles={setFiles2}
                    maxFileSize={5 * 1024 * 1024}
                    maxFiles={1}
                    maxFileSizeRuleMessage="Max. velikost: 5MB"
                    maxFilesRuleMessage="Max. počet: 1"
                    onFileError={(err) => {
                      if (err === "maxFileSizeError") {
                        toast({
                            title: "Maximální velikost souboru je 5MB",
                            status: "error",
                            duration: 4000,
                        });
                      } else {
                        toast({
                            title: "Maximální počet souborů je 1",
                            status: "error",
                            duration: 4000,
                        });
                      }
                    }}
                  />
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

export default AddAnswerModal;