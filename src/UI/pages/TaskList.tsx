import React, { useState } from "react";
import LoadingComponents from "../components/LoadingComponents";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { MdBlock } from "react-icons/md";
import { use } from "i18next";
import useUsers, { useGetUsers } from "../../hooks/useUsers";
import DataGrid from "../components/DataGrid";
import { User } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import useTasks from "../../hooks/useTasks";
import { Task } from "../../services/taskService";

const TaskList = () => {
  const { data, isLoading } = useTasks();
  const navigate = useNavigate();

  return !isLoading && data ? (
    <>
      <h2>Seznam nevyřešených úkolů</h2>
      <DataGrid<Task & { id: number }>
        id="tasks"
        heading=""
        
        // always true just for typescript
        columns={[
          { key: "title", label: "Titul", isVisible: true },
          { key: "price", label: "Cena (Kč)", isVisible: true },
          { key: "category_name", label: "Kategorie", isVisible: true },
          { key: "due_date", label: "Do data", isVisible: true, type: "date" },
          { key: "app_user_email", label: "Zadavatel", isVisible: true, },
          { key: "created_date", label: "Vytvořeno", isVisible: true, type: "date"},
        ]}
        rows={data.map(user => ({
            ...user,
            id: user.task_id,
          }))}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        search={{
          title: "Titul",
          category_name: "Kategorie",
        }}
        onRowClick={(id) => {
          navigate("" + id);
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default TaskList;
