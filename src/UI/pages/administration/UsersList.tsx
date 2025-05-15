import React from "react";
import DataGrid from "../../components/DataGrid";
import { useDeleteUser, useGetUsers } from "../../../hooks/useUsers";
import LoadingComponents from "../../components/LoadingComponents";
import { User } from "../../../services/userService";
import { useDeleteAnswer } from "../../../hooks/useAnswers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import useAuth from "../../../hooks/useAuth";
import UserModal from "../../layout/components/administration/UserModal";

const UsersList = () => {
  const { data, isLoading } = useGetUsers();
  const { data: user } = useAuth();
  const [userId, setUserId] = React.useState<number>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate, isPending } = useDeleteUser(() => {
    toast({
      title: "Uživatel smazán",
      status: "success",
    });
  });
  return data ? (
    <>
      <UserModal isOpen={isOpen} onClose={onClose} userId={userId} />
      <DataGrid<User & { id: number }>
        columns={[
          { key: "app_user_id", label: "ID", isVisible: true },
          { key: "full_name", label: "Celé jméno", isVisible: true },
          { key: "email", label: "E-mail", isVisible: true },
          { key: "username", label: "Uživatelské jméno", isVisible: true },
          {
            key: "is_admin",
            label: "Je admin",
            isVisible: true,
            type: "booleanPretty",
            filter: true,
            props: { type: "boolean" },
          },
        ]}
        rows={data.map((user) => ({
          ...user,
          id: user.app_user_id,
        }))}
        columnSwitching={"localStorageById"}
        search={{
          full_name: "Celé jméno",
          email: "E-mail",
        }}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        onDelete={(id) => {
          if (user && user[0].app_user_id === id) {
            toast({
              title: "Nemůžete smazat sami sebe",
              status: "error",
            });
            return;
          }
          if (window.confirm("Opravdu chcete záznam smazat?")) {
            mutate(id);
          }
        }}
        id={"Users"}
        onRowClick={(id) => {
          if (user && user[0].app_user_id === id) {
            toast({
              title: "Nemůžete editovat sami sebe",
              status: "error",
            });
            return;
          }
          setUserId(id);
          onOpen();
        }}
        onEdit={(id) => {
          if (user && user[0].app_user_id === id) {
            toast({
              title: "Nemůžete smazat sami sebe",
              status: "error",
            });
            return;
          }
          setUserId(id);
          onOpen();
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default UsersList;
