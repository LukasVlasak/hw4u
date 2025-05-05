import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import usePostAnswer, {
  useAnswersByTask,
  useDeleteAnswer,
} from "../../hooks/useAnswers";
import useNavigateWithToast from "../../hooks/useNavigateWithToast";
import { useDeleteTask } from "../../hooks/useTasks";
import { useGetOneUser } from "../../hooks/useUsers";
import { LoaderDataTaskInterface } from "../../services/taskService";
import formatDateToDDMMYYYY, { deleteConfirm } from "../../utils/fc";
import LoadingComponents from "../components/LoadingComponents";
import TaskEditModal from "../components/TaskEditModal";
import { Interweave } from "interweave";
import useAuth from "../../hooks/useAuth";

const OneTaskPage = () => {
  const { data } = useLoaderData() as LoaderDataTaskInterface;
  const { revalidate } = useRevalidator();
  const task = data[0];
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigateWithToast();
  const [files, setFiles] = useState<ExtFile[]>([]);
  const { data: user } = useAuth();
  const { data: creator } = useGetOneUser(task.app_user_id);
  const { mutate } = usePostAnswer(() => {
    navigate("/account", {
      description: t("oneTaskPage.successPostDesc"),
      title: t("successPost"),
      duration: 5000,
      isClosable: true,
      status: "success",
    });
  });
  const CKEditorRef = useRef<CKEditor<ClassicEditor>>(null);

  const trimData = (data: string) => {
    return data.replace(/;|<p[^>]*>|<\/p>|<br\s*\/?>/gi, "");
  };

  // const handleClick = () => {
  //   if (CKEditorRef.current && CKEditorRef.current.editor) {
  //     const editorData = CKEditorRef.current.editor.getData();

  //     if (trimData(editorData) === "" || trimData(editorData).length > 300) {
  //       toast({
  //         description: t("oneTaskPage.errorPostDesc"),
  //         title: t("errorPost"),
  //         duration: 5000,
  //         isClosable: true,
  //         status: "error",
  //       });
  //     } else {
  //       const formData = new FormData();
  //       if (files.length > 0) {
  //         files.forEach((f, i) => {
  //           if (f.file) {
  //             formData.append("files[]", f.file);
  //           }
  //         });
  //       }
  //       if (value) {
  //         formData.append("user_id", value.id.toString());
  //       }
  //       formData.append("task_id", task.id.toString());
  //       formData.append("description", editorData);

  //       mutate(formData);
  //     }
  //   }
  // };

  const updateFiles = (incomingFiles: ExtFile[]) => {
    setFiles(incomingFiles);
  };

  const { data: answers, isLoading: isAnswersLoading } = useAnswersByTask(
    task.task_id
  );
  const navigateToast = useNavigateWithToast();

  const removeFile = (fileId: number | string | undefined) => {
    setFiles(files.filter((x) => x.id !== fileId));
  };

  const { mutate: mutateDel } = useDeleteTask(() => {
    navigateToast("/tasks", {
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("deleteSuccess"),
      description: t("tasks.deleteSuccessDesc"),
    });
  });

  const { mutate: mutateDelAnswer } = useDeleteAnswer(() => {
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("deleteSuccess"),
      description: t("answers.deleteSuccessDesc"),
    });
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEdit = () => {
    onOpen();
  };

  const handleDelete = () => {
    if (deleteConfirm(t("deleteConfirm"))) {
      mutateDel(task.task_id);
    }
  };

  const handleAnswerDelete = (id: number) => {
    if (deleteConfirm(t("deleteConfirm"))) {
      mutateDelAnswer(id);
    }
  };

  return null;
  // return (
  //   <>
  //     <TaskEditModal
  //       callbackAfterEdit={() => revalidate()}
  //       id={task.id}
  //       onClose={onClose}
  //       isOpen={isOpen}
  //     />
  //     <Flex
  //       flexDir={"row"}
  //       maxW={{ base: "100%", lg: "80%" }}
  //       margin={"0 auto"}
  //       justifyContent={"space-between"}
  //     >
  //       <Container py={6}>
  //         <Flex justifyContent={"space-between"} flexDir={"row"}>
  //           <Heading mb={6} size={"lg"}>
  //             {t("tasks.task") + ": " + task.title}
  //           </Heading>
  //           {value && value.id === task.user_id ? (
  //             <Flex>
  //               <IconButton
  //                 mr={3}
  //                 onClick={() => handleEdit()}
  //                 aria-label="Edit"
  //                 colorScheme="blue"
  //                 icon={<MdEdit />}
  //               />
  //               <IconButton
  //                 onClick={() => handleDelete()}
  //                 aria-label="Delete"
  //                 colorScheme="red"
  //                 icon={<MdDelete />}
  //               />
  //             </Flex>
  //           ) : null}
  //         </Flex>

  //         <Accordion allowToggle>
  //           <AccordionItem>
  //             <h2>
  //               <AccordionButton>
  //                 <Box as="span" flex="1" textAlign="left">
  //                   {t("oneTaskPage.description")}
  //                 </Box>
  //                 <AccordionIcon />
  //               </AccordionButton>
  //             </h2>
  //             <AccordionPanel pb={4}>
  //               <p>{task.description}</p>
  //               <Wrap display={{ base: "flex", md: "none" }} spacing={"40px"}>
  //                 <WrapItem>
  //                   <Box>
  //                     <Heading size="xs" textTransform="uppercase">
  //                       {t("oneTaskPage.category")}
  //                     </Heading>
  //                     <Text pt="2" fontSize="sm">
  //                       {task.category}
  //                     </Text>
  //                   </Box>
  //                 </WrapItem>
  //                 <WrapItem>
  //                   <Box>
  //                     <Heading size="xs" textTransform="uppercase">
  //                       {t("oneTaskPage.willingToPay")}
  //                     </Heading>
  //                     <Text pt="2" fontSize="sm">
  //                       {task.willing_to_pay}$
  //                     </Text>
  //                   </Box>
  //                 </WrapItem>
  //                 <WrapItem>
  //                   <Box>
  //                     <Heading size="xs" textTransform="uppercase">
  //                       Created date
  //                     </Heading>
  //                     <Text pt="2" fontSize="sm">
  //                       {task.created_date
  //                         ? formatDateToDDMMYYYY(task.created_date)
  //                         : "this should not happend, please contact us via page 'contact us'"}
  //                     </Text>
  //                   </Box>
  //                 </WrapItem>
  //                 {task.due_date && (
  //                   <WrapItem>
  //                     <Box>
  //                       <Heading size="xs" textTransform="uppercase">
  //                         Due date
  //                       </Heading>
  //                       <Text pt="2" fontSize="sm">
  //                         {task.due_date.toString()}
  //                       </Text>
  //                     </Box>
  //                   </WrapItem>
  //                 )}
  //                 <WrapItem>
  //                   <Box>
  //                     <Heading size="xs" textTransform="uppercase">
  //                       {t("oneTaskPage.creator")}
  //                     </Heading>
  //                     <Flex alignItems={"center"}>
  //                       <Avatar size={"sm"} mr={2} /> {creator?.name}
  //                     </Flex>
  //                   </Box>
  //                 </WrapItem>
  //               </Wrap>
  //             </AccordionPanel>
  //           </AccordionItem>
  //         </Accordion>
  //         <Heading my={4} size={"md"}>
  //           {t("oneTaskPage.answer")}
  //         </Heading>
  //         <CKEditor
  //           ref={CKEditorRef}
  //           data="<br><br><br><br>"
  //           editor={ClassicEditor}
  //         />
  //         <Dropzone max={3} onChange={updateFiles} value={files} accept="application/pdf, application/msword">
  //           {files.map((file) => (
  //             <FileMosaic
  //               key={file.id}
  //               id={file.id}
  //               name={file.name}
  //               size={file.size}
  //               onDelete={removeFile}
  //               info
  //             />
  //           ))}
  //         </Dropzone>
  //         <Button colorScheme="blue" mt={3} onClick={handleClick}>
  //           {t("oneTaskPage.answer")}
  //         </Button>
  //         {isAnswersLoading ? (
  //           <LoadingComponents />
  //         ) : answers && answers.length > 0 ? (
  //           <>
  //             <Heading mt={5} size="md">
  //               {t("answers.answers")}
  //             </Heading>

  //             <Accordion allowToggle>
  //               {answers.map((a, i) => {
  //                 return (
  //                   <React.Fragment key={a.id}>
  //                     <AccordionItem>
  //                       <h2>
  //                         <AccordionButton>
  //                           <Box as="span" flex="1" textAlign="left">
  //                             {t("answers.answer") + " č." + (i + 1)}
  //                           </Box>
  //                           <AccordionIcon />
  //                         </AccordionButton>
  //                       </h2>
  //                       <AccordionPanel pb={4}>
  //                         <Box>
  //                           <Flex
  //                             flexDir={"row"}
  //                             justifyContent={"space-between"}
  //                           >
  //                             <Heading size="xs" textTransform="uppercase">
  //                               {t("answers.answerToTask")}
  //                             </Heading>
  //                             {value && value.id === a.user_id ? (
  //                               <Flex>
  //                                 <IconButton
  //                                   onClick={() => handleAnswerDelete(a.id)}
  //                                   aria-label="Delete"
  //                                   colorScheme="red"
  //                                   icon={<MdDelete />}
  //                                 />
  //                               </Flex>
  //                             ) : null}
  //                           </Flex>
  //                           <Text pt="2" fontSize="sm">
  //                             <Link
  //                               style={{
  //                                 textDecoration: "underline",
  //                                 color: "blue",
  //                               }}
  //                               to={"/task/" + a.tasks.id}
  //                             >
  //                               {a.tasks.title}
  //                             </Link>
  //                           </Text>
  //                         </Box>
  //                         <Box>
  //                           <Heading size="xs" textTransform="uppercase">
  //                             {t("answers.postedBy")}
  //                           </Heading>
  //                           <Text pt="2" fontSize="sm">
  //                             {a.for_user[0].name}{" "}
  //                           </Text>
  //                         </Box>
  //                         <Box>
  //                           <Heading size="xs" textTransform="uppercase">
  //                             {t("answers.files")}
  //                           </Heading>
  //                           {a.documents ? (
  //                             a.documents.map((d) => {
  //                               return (
  //                                 <a
  //                                   style={{
  //                                     textDecoration: "underline",
  //                                     color: "blue",
  //                                   }}
  //                                   href={
  //                                     "http://localhost:3001/api/documents/" +
  //                                     d.filename
  //                                   }
  //                                 >
  //                                   {d.filename}
  //                                 </a>
  //                               );
  //                             })
  //                           ) : (
  //                             <Text pt="2" fontSize="sm">
  //                               {t("answers.withoutDocument")}
  //                             </Text>
  //                           )}
  //                         </Box>
  //                         <Box>
  //                           <Heading size="xs" mt={2} textTransform="uppercase">
  //                             {t("answers.description")}
  //                           </Heading>
  //                           <Interweave content={a.description}></Interweave>

  //                         </Box>
  //                       </AccordionPanel>
  //                     </AccordionItem>
  //                   </React.Fragment>
  //                 );
  //               })}
  //             </Accordion>
  //           </>
  //         ) : (
  //           <Heading size={"md"} mt={5}>
  //             {t("answers.noAnswers")}
  //           </Heading>
  //         )}
  //       </Container>
  //       <Card
  //         my={5}
  //         bg={"#fcfaf8"}
  //         w={"30%"}
  //         display={{ base: "none", md: "flex" }}
  //       >
  //         <CardBody>
  //           <Stack divider={<StackDivider />} spacing="6">
  //             <Box>
  //               <Heading size="xs" textTransform="uppercase">
  //                 {t("oneTaskPage.category")}
  //               </Heading>
  //               <Text pt="2" fontSize="sm">
  //                 {task.category}
  //               </Text>
  //             </Box>
  //             <Box>
  //               <Heading size="xs" textTransform="uppercase">
  //                 {t("oneTaskPage.willingToPay")}
  //               </Heading>
  //               <Text pt="2" fontSize="sm">
  //                 {task.willing_to_pay}$
  //               </Text>
  //             </Box>
  //             <Box>
  //               <Heading size="xs" textTransform="uppercase">
  //                 Created date
  //               </Heading>
  //               <Text pt="2" fontSize="sm">
  //                 {task.created_date
  //                   ? formatDateToDDMMYYYY(task.created_date)
  //                   : "this should not happend, please contact us via page 'contact us'"}
  //               </Text>
  //             </Box>
  //             {task.due_date && (
  //               <Box>
  //                 <Heading size="xs" textTransform="uppercase">
  //                   Due date
  //                 </Heading>
  //                 <Text pt="2" fontSize="sm">
  //                   {task.due_date.toString()}
  //                 </Text>
  //               </Box>
  //             )}
  //             <Box>
  //               <Heading size="xs" textTransform="uppercase">
  //                 {t("oneTaskPage.creator")}
  //               </Heading>
  //               <Flex alignItems={"center"}>
  //                 <Avatar size={"sm"} mr={2} /> {creator?.name}
  //               </Flex>
  //             </Box>
  //           </Stack>
  //         </CardBody>
  //       </Card>
  //     </Flex>
  //   </>
  // );
};

export default OneTaskPage;
