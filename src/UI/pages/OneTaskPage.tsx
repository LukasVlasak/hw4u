import { Button, Flex, Heading, IconButton, Text, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Category } from "../../services/categoryService";
import formatDateToDDMMYYYY from "../../utils/fc";
import { useDeleteTask, useGetOneTask, useTasksByUser } from "../../hooks/useTasks";
import LoadingComponents from "../components/LoadingComponents";
import useAuth from "../../hooks/useAuth";
import AddAnswerModal from "../components/modals/AddAnswerModal";
import { useGetProductsByUser } from "../../hooks/useProducts";
import OneAnswer from "../components/OneAnswer";

const OneTaskPage = () => {
  const { id } = useParams();

  const { data: task, isLoading } = useGetOneTask(parseInt(id || ""));

  const { data: currUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: deleteTask, isPending: isDeleteTaskPending } = useDeleteTask(() => {
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: "Úkol smazán",
    });
  });

  const { data, refetch } = useGetProductsByUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return <LoadingComponents />;
  }
  return task ? (
    <>
      <AddAnswerModal isOpen={isOpen} onClose={onClose} taskId={task.task_id} />{" "}
      <Button onClick={() => navigate(-1)}>Zpět</Button>
      <Heading maxW={"80%"} margin={"0 auto"} mt={6} mb={5}>
        Detail úkolu
      </Heading>
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
            Titul: {task.title}
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
              Do data:&nbsp;<Text color={"red"}>{formatDateToDDMMYYYY(task.due_date)}</Text>
            </Flex>
          )}
          <Text fontSize={"md"}>{task.description}</Text>
        </Flex>
        <Flex flexDir={"column"} justifyContent={"space-between"} textAlign={"right"}>
          <Flex flexDir={"column"} textAlign={"right"}>
            {currUser && task.app_user_id === currUser[0].app_user_id && (
              <Flex mb={3} flexDir={"row"} justifyContent={"right"}>
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
            <Text fontSize={"sm"}>{"Vytvořeno: " + formatDateToDDMMYYYY(task.created_date)}</Text>
            <Text fontSize={"sm"}>
              {"Zadavatel: "}
              <Link className="link" to={"/users/" + task.app_user_id}>
                {task.app_user_email}
              </Link>
            </Text>
          </Flex>
          <Flex justifyContent={"right"}>
            <Button
              mt={3}
              colorScheme={"blue"}
              width={"fit-content"}
              onClick={() => {
                if (!currUser) {
                  toast({
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    title: "Nejdříve se přihlašte",
                  });
                  navigate("/login");
                } else if (data && data.length > 0 && data[0].answered != null && (data[0].answer_limit - data[0].answered > 0)) {
                  onOpen();
                } else {
                  toast({
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    title: "Nejdříve si vyberte produkt",
                  });
                  navigate("/pricing");
                }
              }}
            >
              Odpovědět
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={'column'} maxW={'80%'} margin={'0 auto'}>
      <Heading size={'sm'}>Odpovědi</Heading>
      <Flex flexDir={'column'}>
        {task.answers && task.answers.map((answer) => {
          return <OneAnswer key={answer.answer_id} answer={answer} />
        })
        }
      </Flex>
      </Flex>
    </>
  ) : null;
};

export default OneTaskPage;
