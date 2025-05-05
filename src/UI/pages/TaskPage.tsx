import { useContext, useState } from "react";
import useTasks, { useTask, useTasksWithUsers } from "../../hooks/useTasks";
import { PartialWithId } from "../../interfaces/interfaces";
import {
  Task,
} from "../../services/taskService";
import DataGrid from "../components/DataGrid";
import LoadingComponents from "../components/LoadingComponents";
import ErrorBoundary from "../layout/components/ErrorBoundary";
import OneTaskModal from "../components/OneTaskModal";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import formatDateToDDMMYYYY from "../../utils/fc";
import useAuth from "../../hooks/useAuth";

const TaskPage = () => {
  const { data, isLoading } = useTasksWithUsers();
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user } = useAuth();
 
  const handleClick = (id: number) => {
    // TODO zkusit
    if (!user) {
      toast({
        description: t("auth.firstSignIn"),
        title: t("error"),
        duration: 5000,
        isClosable: true,
        status: "error",
      });
    } else {
        navigate("/task/" + id);
    }
  };

  if (isLoading) return <LoadingComponents />;

  return null;
  // return data ? (
  //   <>
  //     <ErrorBoundary>
  //       <DataGrid<
  //         PartialWithId<Task>,
  //         [typeof TaskCategoryObj, typeof TaskCategoryObj2]
  //       >
  //         onRowClick={handleClick}
  //         /*
  //       dve stejne implementace
    
  //       const newData = data.map(({ desc, ...rest }) => rest);
    
  //       const newData = data.map(item => ({
  //         id: item.id,
  //         title: item.title,
  //         // Add more properties here if needed
  //       }));
  //       */
  //       rows = {data.map(({ description, user_id, id, created_date, due_date, title, willing_to_pay, category, for_user }) => {                  
  //         const formatted_created_date = formatDateToDDMMYYYY(created_date);
  //         const formatted_due_date = formatDateToDDMMYYYY(due_date);
  //         let name = null;
  //         if (user_id) {
  //           name = for_user[0].name
  //         }
  //         return { id, title, willing_to_pay, category, formatted_due_date, name, formatted_created_date };
  //       })}
  //         pagination={{
  //           defaultPageSize: 10,
  //           pageSizesToChoose: [5, 10, 15, 20],
  //         }}
  //         columns={[
  //           "Titul",
  //           "Ochoten Zaplatit",
  //           "Kategorie",
  //           "Do data",
  //           "Vytvoril",
  //           "Created",
  //         ]}
  //         sort
  //         search={["title", "due_date"]}
  //         filters={[
  //           {
  //             dataKey: "willing_to_pay",
  //             name: "Ochoten zaplatit",
  //             props: {
  //               type: "number",
  //               start: Math.min(...data.map((d) => d.willing_to_pay)),
  //               end: Math.max(...data.map((d) => d.willing_to_pay)),
  //             },
  //           },
  //           {
  //             dataKey: "due_date",
  //             name: "Do dne",
  //             props: {
  //               type: "date",
  //             },
  //           },
  //           {
  //             dataKey: "category",
  //             name: "Kategori2",
  //             props: {
  //               type: "category",
  //               categoryEnum: TaskCategoryObj,
  //             },
  //           },
  //         ]}
  //       />
  //     </ErrorBoundary>
  //   </>
  // ) : (
  //   <LoadingComponents />
  // );
};

export default TaskPage;
