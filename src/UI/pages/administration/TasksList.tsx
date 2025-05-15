import React from "react";
import DataGrid from "../../components/DataGrid";
import { useDeleteUser, useGetUsers } from "../../../hooks/useUsers";
import LoadingComponents from "../../components/LoadingComponents";
import { User } from "../../../services/userService";
import { useDeleteAnswer, useGetAnswers } from "../../../hooks/useAnswers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import useAuth from "../../../hooks/useAuth";
import UserModal from "../../layout/components/administration/UserModal";
import { Answer } from "../../../services/answerService";
import AnswerModal from "../../layout/components/administration/AnswerModal";
import useTasks, { useDeleteTask } from "../../../hooks/useTasks";
import { Task } from "../../../services/taskService";
import TaskModal from "../../layout/components/administration/TaskModal";

const TasksList = () => {
  const { data, isLoading } = useTasks();
  const { data: user } = useAuth();
  const [taskId, setTaskId] = React.useState<number>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate, isPending } = useDeleteTask(() => {
    toast({
      title: "Úkol smazán",
      status: "success",
    });
  });
  return data ? (
    <>
      <TaskModal isOpen={isOpen} onClose={onClose} taskId={taskId} />
      <DataGrid<Task & { id: number }>
        columns={[
          { key: "task_id", label: "ID", isVisible: true },
          { key: "title", label: "Titul", isVisible: true },
          { key: "price", label: "Cena (Kč)", isVisible: true },
          { key: "description", label: "Popis", isVisible: true },
          { key: "app_user_email", label: "Vytvořil", isVisible: true },
          { key: "category_name", label: "Kategorie", isVisible: true },
          { key: "created_date", label: "Vytvořeno", isVisible: true, type: "date", filter: true, props: { type: "date" } },
        ]}
        rows={data.map((user) => ({
          ...user,
          id: user.task_id,
        }))}
        columnSwitching={"localStorageById"}
        search={{
          title: "Titul",
        }}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        onDelete={(id) => {
          if (window.confirm("Opravdu chcete záznam smazat?")) {
            setTaskId(undefined);
            mutate(id);
          }
        }}
        id={"Tasks"}
        onRowClick={(id) => {
          setTaskId(id);
          onOpen();
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default TasksList;
