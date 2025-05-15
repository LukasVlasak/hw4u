import { useContext, useEffect, useRef, useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import useAuth, { useLogout } from "../../hooks/useAuth";
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
import { useDeleteTask, useEditTask, usePostTask, useTasksByUser } from "../../hooks/useTasks";
import TaskEditModal from "../components/TaskEditModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAnswersByUser, useDeleteAnswer } from "../../hooks/useAnswers";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Interweave } from "interweave";
import AddReviewModal from "../components/modals/AddReviewModal";
import EditAccountModal from "../components/EditAccountModal";
import AddFeedbackModal from "../components/modals/AddFeedbackModal";
import { useGetOneUser } from "../../hooks/useUsers";
import { Review } from "../../services/reviewService";
import { useGetActiveProduct } from "../../hooks/useProducts";
import AddTaskModal from "../components/modals/AddTaskModal";
import { Category } from "../../services/categoryService";
import OneAnswer from "../components/OneAnswer";
import BoughtAnswers from "../components/BoughtAnswers";
import ProvidedAnswers from "../components/ProvidedAnswers";

const AccountPage = () => {
  const params = useParams();

  const navigateWithToast = useNavigateWithToast();
  const toast = useToast();
  const { data: currUser } = useAuth();
  const { data: user } = useGetOneUser(parseInt(params.id ?? ""));
  const { t } = useTranslation();
  const { data: tasks, isLoading } = useTasksByUser(user?.app_user_id);
  const { data: answers } = useAnswersByUser(user?.app_user_id);

  //const { data: answers, isLoading: isAnswersLoading } = useAnswersByUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenReview, onOpen: onOpenReview, onClose: onCloseReview } = useDisclosure();
  const { isOpen: isOpenAccount, onOpen: onOpenAccount, onClose: onCloseAccount } = useDisclosure();
  const {
    isOpen: isFeedbackOpen,
    onOpen: onFeedbackOpen,
    onClose: onFeedbackClose,
  } = useDisclosure();
  const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();

  const [taskId, setTaskId] = useState<number>();

  const { mutate: postReview } = usePostReview(() => {
    // callback
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("successPost"),
      description: t("homePage.reviews.successPostDesc"),
    });
  });

  const { data: activePayments } = useGetActiveProduct();

  const { mutate: deleteTask, isPending: isDeleteTaskPending } = useDeleteTask(() => {
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: "Úkol smazán",
    });
  });

  // const { mutate: deleteTask } = useDeleteTask(() => {
  //   toast({
  //     status: "success",
  //     duration: 5000,
  //     isClosable: true,
  //     title: t("deleteSuccess"),
  //     description: t("tasks.deleteSuccessDesc"),
  //   });
  // });

  const navigate = useNavigate();
  // const handleEdit = (id: number, e: MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   onOpen();
  //   setTaskId(id);
  // };

  // const handleDelete = (id: number, e: MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   if (deleteConfirm(t("deleteConfirm"))) {
  //     deleteTask(id);
  //   }
  // };

  // const { mutate: mutateDelAnswer } = useDeleteAnswer(() => {
  //   toast({
  //     status: "success",
  //     duration: 5000,
  //     isClosable: true,
  //     title: t("deleteSuccess"),
  //     description: t("answers.deleteSuccessDesc"),
  //   });
  // });

  // const handleAddTask = () => {
  //   setTaskId(undefined);
  //   onOpen();
  // };

  // const handleRowClick = (rowId: number) => {
  //   navigate("/task/" + rowId);
  // };

  // const handleAnswerDelete = (id: number) => {
  //   if (deleteConfirm(t("deleteConfirm"))) {
  //     mutateDelAnswer(id);
  //   }
  // };


  return user ? (
    <>
      <AddTaskModal isOpen={isTaskOpen} onClose={onTaskClose} taskId={taskId} />
      <Button onClick={() => navigate("/users")}>Zpět</Button>
      <EditAccountModal isOpen={isOpenAccount} onClose={onCloseAccount} />
      <AddReviewModal
        isOpen={isOpenReview}
        onClose={onCloseReview}
        onAddReview={(r) => {
          const review = {
            ...r,
            for_app_user_id: user.app_user_id,
          };
          postReview(review as Review);
        }}
      />
      {/* <TaskEditModal id={taskId} onClose={onClose} isOpen={isOpen} /> */}
      <AddFeedbackModal isOpen={isFeedbackOpen} onClose={onFeedbackClose} />
      <div>
        <Card>
          <CardHeader>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Heading size="lg">{t("account.accountInformation")}</Heading>
              {user && currUser && user.app_user_id === currUser[0].app_user_id ? (
                <IconButton
                  aria-label={"edit user profile"}
                  colorScheme="blue"
                  onClick={() => onOpenAccount()}
                  icon={<MdEdit />}
                >
                  {t("account.editAccount")}
                </IconButton>
              ) : null}
            </Flex>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {t("homePage.reviews.averageRating")}
                </Heading>
                <Flex pt="2" fontSize="sm">
                  {user.average_rating ? (
                    <Flex flexDir={"column"}>
                      <ReactStars
                        count={5}
                        // @ts-ignore
                        value={parseFloat(user.average_rating)}
                        size={24}
                        edit={false}
                        color2={"#ffd700"}
                        half={true}
                      />
                      <Link className="link" to={"reviews"}>
                        {t("account.showReviews")}
                      </Link>
                    </Flex>
                  ) : (
                    <Text>{t("homePage.reviews.noRating")}</Text>
                  )}
                </Flex>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {t("auth.email")}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {user.email}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {t("account.name")}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {user.full_name}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {t("account.username")}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {user.username}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  {t("account.actions")}
                </Heading>
                <Text pt="2" fontSize="sm">
                  {/* <Button mr={2} colorScheme="blue" onClick={handleAddTask}>{t("account.addTask")}</Button> */}
                  {user && currUser && user.app_user_id !== currUser[0].app_user_id ? (
                    <Button mr={2} colorScheme="blue" onClick={() => onOpenReview()}>
                      {t("account.addReview")}
                    </Button>
                  ) : null}
                  {user && currUser && user.app_user_id === currUser[0].app_user_id ? (
                    <Button mr={2} colorScheme="blue" onClick={() => onFeedbackOpen()}>
                      {t("feedback.addFeedback")}
                    </Button>
                  ) : null}
                  {user && currUser && user.app_user_id === currUser[0].app_user_id ? (
                    <Button
                      mr={2}
                      colorScheme="blue"
                      onClick={() => {
                        setTaskId(undefined);
                        onTaskOpen();
                      }}
                    >
                      Inzerovat úkol
                    </Button>
                  ) : null}
                </Text>
              </Box>
              {currUser && currUser[0].app_user_id === user.app_user_id ? (
                <Tabs isFitted variant="enclosed">
                  <TabList mb="1em">
                    <Tab>Zakoupené odpovědi</Tab>
                    <Tab>Vaše odpovědi zakoupené od jiných už.</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <BoughtAnswers />
                    </TabPanel>
                    <TabPanel>
                      <ProvidedAnswers />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              ) : null}
            </Stack>
          </CardBody>
        </Card>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>{t("account.answeredQuestions")}</Tab>
            <Tab>{t("account.addedTasks")}</Tab>
            {currUser && currUser[0].app_user_id === user.app_user_id ? <Tab>Aktivní produkty</Tab> : null}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex flexDir={"column"} maxW={"90%"} margin={"0 auto"}>
                {answers && answers.length > 0
                  ? answers.map((answer) => {
                      return <OneAnswer key={answer.answer_id} answer={answer} />;
                    })
                  : "Nejsou žádné odpovědi"}
              </Flex>
            </TabPanel>
            <TabPanel>
              {tasks && tasks.length > 0
                ? tasks.map((task) => {
                    return (
                      <Flex
                        key={task.task_id}
                        flexDir={"row"}
                        justifyContent={"space-between"}
                        maxW={"90%"}
                        margin={"0 auto"}
                        mb={6}
                        borderWidth={1}
                        borderRadius={"lg"}
                        p={4}
                        boxShadow={"lg"}
                      >
                        <Flex flexDir={"column"} alignItems={"left"}>
                          <Text fontSize={"lg"} fontWeight={"bold"}>
                            Titul: <Link to={"/tasks/" + task.task_id}>{task.title}</Link>
                          </Text>
                          <Text fontSize={"md"}>Cena za vypracování: {task.price} Kč</Text>
                          <Text fontSize={"md"}>
                            Kategorie:{" "}
                            {JSON.parse(JSON.stringify(task.category_hierarchy))
                              .reverse()
                              .map((category: Category) => category.name)
                              .join(" > ")}
                          </Text>
                          {task.due_date && (
                            <Flex fontSize={"md"}>
                              Do data:&nbsp;
                              <Text color={"red"}>{formatDateToDDMMYYYY(task.due_date)}</Text>
                            </Flex>
                          )}
                          <Text fontSize={"md"}>{task.description}</Text>
                        </Flex>
                        <Flex flexDir={"column"} textAlign={"right"}>
                          {currUser && task.app_user_id === currUser[0].app_user_id && (
                            <Flex mb={3} flexDir={"row"} justifyContent={"right"}>
                              <IconButton
                                isLoading={isDeleteTaskPending}
                                mr={2}
                                aria-label={"edit task"}
                                colorScheme="blue"
                                onClick={() => {
                                  setTaskId(task.task_id);
                                  onTaskOpen();
                                }}
                                icon={<MdEdit />}
                              />
                              <IconButton
                                aria-label={"delete task"}
                                colorScheme="red"
                                onClick={() => {
                                  if (window.confirm("Opravdu chcete smazat úkol?")) {
                                    deleteTask(task.task_id);
                                  }
                                }}
                                icon={<MdDelete />}
                              />
                            </Flex>
                          )}
                          <Text fontSize={"sm"}>
                            {"Vytvořeno: " + formatDateToDDMMYYYY(task.created_date)}
                          </Text>
                          <Text fontSize={"sm"}>
                            {"Zadavatel: "}
                            <Link className="link" to={"/users/" + task.app_user_id}>
                              {task.app_user_email}
                            </Link>
                          </Text>
                        </Flex>
                      </Flex>
                    );
                  })
                : "Nejsou žádné úkoly"}
            </TabPanel>
            {currUser && currUser[0].app_user_id === user.app_user_id ? (

            <TabPanel>
              {activePayments && activePayments.length > 0
                ? activePayments.map((product) => {
                    return (
                      <Flex
                        key={product.product_id}
                        flexDir={"column"}
                        mb={4}
                        maxW={"400px"}
                        borderWidth={1}
                        borderColor={"green"}
                        borderRadius={"lg"}
                        p={4}
                        boxShadow={"lg"}
                      >
                        <Flex justifyContent={"space-between"} alignItems={"center"}>
                          <Text fontSize={"lg"}>{product.name}</Text>
                          <Text fontSize={"lg"}>{product.price} Kč</Text>
                        </Flex>
                        <Flex justifyContent={"space-between"} alignItems={"center"}>
                          <Text fontSize={"sm"}>
                            {"Počet zbývajicích odpovědí: " +
                              (product.answer_limit - product.answered!)}
                          </Text>
                        </Flex>
                      </Flex>
                    );
                  })
                : "Nejsou žádné aktivní produkty"}
            </TabPanel>
            ) : null}
          </TabPanels>
        </Tabs>
      </div>
    </>
  ) : (
    <LoadingComponents />
  );
};

//   <DataGrid<PartialWithId<Task>>
//     columns={[
//       "Titul",
//       "Ochoten Zaplatit",
//       "Kategorie",
//       "Do data",
//       "Vytvoril",
//       "Created",
//     ]}
//     rows={data.map(
//       ({
//         description,
//         user_id,
//         id,
//         created_date,
//         due_date,
//         title,
//         willing_to_pay,
//         category,
//         for_user,
//       }) => {
//         const formatted_created_date =
//           formatDateToDDMMYYYY(created_date);
//         const formatted_due_date = formatDateToDDMMYYYY(due_date);
//         let name = null;
//         if (user_id) {
//           name = for_user[0].name;
//         }
//         return {
//           id,
//           title,
//           willing_to_pay,
//           category,
//           formatted_due_date,
//           name,
//           formatted_created_date,
//         };
//       }
//     )}
//     pagination={{
//       defaultPageSize: 10,
//       pageSizesToChoose: [5, 10, 15, 20],
//     }}
//     sort
//     onEdit={handleEdit}
//     onDelete={handleDelete}
//     onRowClick={handleRowClick}
//   />
// ) : null}

export default AccountPage;
