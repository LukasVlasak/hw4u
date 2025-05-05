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

const UsersList = () => {
  const { data, isLoading } = useGetUsers();
  const navigate = useNavigate();

  return !isLoading && data ? (
    <>
      <h2>Seznam uživatelů</h2>
      <DataGrid<User & { id: number }>
        id="users"
        heading=""
        
        // always true just for typescript
        columns={[
          { key: "full_name", label: "Celé jméno", isVisible: true },
          { key: "email", label: "E-mail", isVisible: true },
          { key: "username", label: "Uživatelské jméno", isVisible: true },
        ]}
        rows={data.map(user => ({
            ...user,
            id: user.app_user_id,
          }))}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        search={{
          full_name: "Celé jméno",
          email: "E-mail",
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

export default UsersList;
