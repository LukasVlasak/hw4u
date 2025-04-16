import { useContext, useEffect, useRef, useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import authContext from "../../context/AuthContext";
import { useLogout } from "../../hooks/useAuth";
import useNavigateWithToast from "../../hooks/useNavigateWithToast";
import LoadingComponents from "../components/LoadingComponents";
import usePostReview from "../../hooks/useReviews";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useToast,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  IconButton,
} from "@chakra-ui/react";
import ReactStars from "react-stars";
import DataGrid from "../components/DataGrid";
import { Task } from "../../services/taskService";
import { PartialWithId } from "../../interfaces/interfaces";
import formatDateToDDMMYYYY, { deleteConfirm } from "../../utils/fc";
import { useDeleteTask, useTasksByUser } from "../../hooks/useTasks";
import TaskEditModal from "../components/TaskEditModal";
import { Link, useNavigate } from "react-router-dom";
import { useAnswersByUser, useDeleteAnswer } from "../../hooks/useAnswers";
import React from "react";
import { MdDelete } from "react-icons/md";
import { Interweave } from "interweave";
import AddReviewModal from "../components/AddReviewModal";
import EditAccountModal from "../components/EditAccountModal";

const AccountPage = () => {
  const navigateWithToast = useNavigateWithToast();
  const toast = useToast();
  const { value } = useContext(authContext);
  const { t } = useTranslation();
  const { data, isLoading } = useTasksByUser();
  const { data: answers, isLoading: isAnswersLoading } = useAnswersByUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenReview, onOpen: onOpenReview, onClose: onCloseReview } = useDisclosure();
  const { isOpen: isOpenAccount, onOpen: onOpenAccount, onClose: onCloseAccount } = useDisclosure();

  const [taskId, setTaskId] = useState<number | undefined>(undefined);
  
  const { mutate: deleteTask } = useDeleteTask(() => {
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("deleteSuccess"),
      description: t("tasks.deleteSuccessDesc"),
    });
  });

  const { mutate } = useLogout(() => {
    // callback
    navigateWithToast("/", {
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("auth.successSignOut"),
      description: t("auth.successSignOutDesc"),
    });
  });

  const navigate = useNavigate();
  const handleEdit = (id: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpen();
    setTaskId(id);
  };

  const handleDelete = (id: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (deleteConfirm(t("deleteConfirm"))) {
      deleteTask(id);
    }
  };

  

  const { mutate: mutateDelAnswer } = useDeleteAnswer(() => {
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("deleteSuccess"),
      description: t("answers.deleteSuccessDesc"),
    });
  });

  const handleAddTask = () => {
    setTaskId(undefined);
    onOpen();
  };

  const handleRowClick = (rowId: number) => {
    navigate("/task/" + rowId);
  };

  const handleAnswerDelete = (id: number) => {
    if (deleteConfirm(t("deleteConfirm"))) {
      mutateDelAnswer(id);
    }
  };

  return value ? (
    <>
    <EditAccountModal isOpen={isOpenAccount} onClose={onCloseAccount} />
      <AddReviewModal isOpen={isOpenReview} onClose={onCloseReview} />
      <TaskEditModal id={taskId} onClose={onClose} isOpen={isOpen} />
      <div>
      <Card>
  <CardHeader>
    <Heading size='lg'>{t("account.accountInformation")}</Heading>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          E-mail
        </Heading>
        <Text pt='2' fontSize='sm'>
        {value.email}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {t("account.name")}
        </Heading>
        <Text pt='2' fontSize='sm'>
          {value.name}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {t("account.username")}
        </Heading>
        <Text pt='2' fontSize='sm'>
        {value.username}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {t("account.actions")}
        </Heading>
        <Text pt='2' fontSize='sm'>
          <Button mr={2} colorScheme="blue" onClick={handleAddTask}>{t("account.addTask")}</Button>
          <Button mr={2} colorScheme="blue" onClick={() => onOpenReview()}>{t("account.addReview")}</Button>
          <Button colorScheme="blue" onClick={() => onOpenAccount()}>{t("account.editAccount")}</Button>
        </Text>
      </Box>
    </Stack>
  </CardBody>
</Card>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>{t("account.answeredQuestions")}</Tab>
            <Tab>{t("account.addedTasks")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {isAnswersLoading ? (
                <LoadingComponents />
              ) : answers && answers.length > 0 ? (
                <>
                  <Heading size="md">{t("answers.answers")}</Heading>

                  <Accordion allowToggle>
                    {answers.map((a, i) => {
                      return (
                        <React.Fragment key={a.id}>
                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                  {t("answers.answer") + " č." + (i+1)}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <Box>
                                <Flex flexDir={'row'} justifyContent={'space-between'}>
                                <Heading size="xs" textTransform="uppercase">
                                  {t("answers.answerToTask")}
                                </Heading>
                                {value && value.id === a.user_id ? (
                                <Flex>
                                  <IconButton
                                    onClick={() => handleAnswerDelete(a.id)}
                                    aria-label="Delete"
                                    colorScheme="red"
                                    icon={<MdDelete />}
                                  />
                                </Flex>
                              ) : null}
                              </Flex>
                                <Text pt="2" fontSize="sm">
                                  <Link style={{textDecoration: "underline", color: "blue"}} to={"/task/" + a.tasks.id}>
                                    {a.tasks.title}
                                  </Link>
                                </Text>
                              </Box>
                              <Box>
                                <Heading size="xs" textTransform="uppercase">
                                  {t("answers.postedBy")}
                                </Heading>
                                <Text pt="2" fontSize="sm">
                                  {a.for_user[0].name}{" "}
                                </Text>
                              </Box>
                              <Box>
                                <Heading size="xs" textTransform="uppercase">
                                  {t("answers.files")}
                                </Heading>
                                {a.documents ? (
                                  a.documents.map((d) => {
                                    return (
                                      <a
                                        style={{textDecoration: "underline", color: 'blue'}}
                                        href={
                                          "http://localhost:3001/api/documents/" +
                                          d.filename
                                        }
                                      >
                                        {d.filename}
                                      </a>
                                    );
                                  })
                                ) : (
                                  <Text pt="2" fontSize="sm">
                                    {t("answers.withoutDocument")}
                                  </Text>
                                )}
                              </Box>
                              <Box>
                                <Heading size="xs" mt={2} textTransform="uppercase">
                                  {t("answers.description")}
                                </Heading>
                                  <Interweave content={a.description}></Interweave>
                              </Box>
                            </AccordionPanel>
                          </AccordionItem>
                        </React.Fragment>
                      );
                    })}
                  </Accordion>
                </>
              ) : <Heading size={'md'} mt={4}>{t("answers.noAnswers")}</Heading>}
            </TabPanel>
            <TabPanel>
              {isLoading ? (
                <LoadingComponents />
              ) : data ? (
                <DataGrid<PartialWithId<Task>>
                  columns={[
                    "Titul",
                    "Ochoten Zaplatit",
                    "Kategorie",
                    "Do data",
                    "Vytvoril",
                    "Created",
                  ]}
                  rows={data.map(
                    ({
                      description,
                      user_id,
                      id,
                      created_date,
                      due_date,
                      title,
                      willing_to_pay,
                      category,
                      for_user,
                    }) => {
                      const formatted_created_date =
                        formatDateToDDMMYYYY(created_date);
                      const formatted_due_date = formatDateToDDMMYYYY(due_date);
                      let name = null;
                      if (user_id) {
                        name = for_user[0].name;
                      }
                      return {
                        id,
                        title,
                        willing_to_pay,
                        category,
                        formatted_due_date,
                        name,
                        formatted_created_date,
                      };
                    }
                  )}
                  pagination={{
                    defaultPageSize: 10,
                    pageSizesToChoose: [5, 10, 15, 20],
                  }}
                  sort
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRowClick={handleRowClick}
                />
              ) : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  ) : (
    <LoadingComponents />
  );
};

export default AccountPage;
