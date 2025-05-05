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
import { useDeleteTask, useTasksByUser } from "../../hooks/useTasks";
import TaskEditModal from "../components/TaskEditModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAnswersByUser, useDeleteAnswer } from "../../hooks/useAnswers";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Interweave } from "interweave";
import AddReviewModal from "../components/AddReviewModal";
import EditAccountModal from "../components/EditAccountModal";
import AddFeedbackModal from "../components/AddFeedbackModal";
import { useGetOneUser } from "../../hooks/useUsers";
import { Review } from "../../services/reviewService";

const AccountPage = () => {
  const params = useParams();
  
  const navigateWithToast = useNavigateWithToast();
  const toast = useToast();
  const { data: currUser } = useAuth();
  const { data: user } = useGetOneUser(parseInt(params.id ?? ""));
  const { t } = useTranslation();
  const { data, isLoading } = useTasksByUser();
  //const { data: answers, isLoading: isAnswersLoading } = useAnswersByUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenReview, onOpen: onOpenReview, onClose: onCloseReview } = useDisclosure();
  const { isOpen: isOpenAccount, onOpen: onOpenAccount, onClose: onCloseAccount } = useDisclosure();
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();

  const [taskId, setTaskId] = useState<number | undefined>(undefined);


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
    <Button onClick={() => navigate("/users")}>Zpět</Button>
    <EditAccountModal isOpen={isOpenAccount} onClose={onCloseAccount} />
      <AddReviewModal isOpen={isOpenReview} onClose={onCloseReview} onAddReview={(r) => {
        const review = {
          ...r,
          for_app_user_id: user.app_user_id,
        };
        postReview(review as Review);
      }} />
      {/* <TaskEditModal id={taskId} onClose={onClose} isOpen={isOpen} /> */}
      <AddFeedbackModal isOpen={isFeedbackOpen} onClose={onFeedbackClose} />
      <div>
      <Card>
  <CardHeader>
    <Flex justifyContent={'space-between'} alignItems={'center'}>
      <Heading size='lg'>{t("account.accountInformation")}</Heading>
      {user && currUser && user.app_user_id === currUser[0].app_user_id ? <IconButton aria-label={"edit user profile"} colorScheme="blue" onClick={() => onOpenAccount()} icon={<MdEdit />}>{t("account.editAccount")}</IconButton> : null}
    </Flex>
  </CardHeader>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          {t("homePage.reviews.averageRating")}
        </Heading>
        <Flex pt='2' fontSize='sm'>
          {user.average_rating ? (
            <Flex flexDir={'column'}>
            <ReactStars
              count={5}
              // @ts-ignore
              value={parseFloat(user.average_rating)}
              size={24}
              edit={false}
              color2={'#ffd700'}
              half={true}
            />
            <Link className="link" to={"reviews"}>{t("account.showReviews")}</Link>
            </Flex>
          ) : (
            <Text>{t("homePage.reviews.noRating")}</Text>
          )}
        </Flex>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          {t("auth.email")}
        </Heading>
        <Text pt='2' fontSize='sm'>
        {user.email}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {t("account.name")}
        </Heading>
        <Text pt='2' fontSize='sm'>
          {user.full_name}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {t("account.username")}
        </Heading>
        <Text pt='2' fontSize='sm'>
        {user.username}
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
        {t("account.actions")}
        </Heading>
        <Text pt='2' fontSize='sm'>
          {/* <Button mr={2} colorScheme="blue" onClick={handleAddTask}>{t("account.addTask")}</Button> */}
          {user && currUser && user.app_user_id !== currUser[0].app_user_id ? <Button mr={2} colorScheme="blue" onClick={() => onOpenReview()}>{t("account.addReview")}</Button> : null}
          {user && currUser && user.app_user_id === currUser[0].app_user_id ? <Button mr={2} colorScheme="blue" onClick={() => onFeedbackOpen()}>{t("feedback.addFeedback")}</Button> : null}
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
              {isLoading ? (
                <LoadingComponents />
              ) : data ? (
                <p>todo datagrid</p>
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

