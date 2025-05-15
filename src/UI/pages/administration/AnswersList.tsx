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
import { set } from "lodash";

const AnswersList = () => {
  const { data, isLoading } = useGetAnswers();
  const { data: user } = useAuth();
  const [answerId, setAnswerId] = React.useState<number>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate, isPending } = useDeleteAnswer(() => {
    toast({
      title: "Odpověď smazána",
      status: "success",
    });
  });
  return data ? (
    <>
      <AnswerModal isOpen={isOpen} onClose={onClose} answerId={answerId} />
      <DataGrid<Answer & { id: number }>
        columns={[
          { key: "answer_id", label: "ID", isVisible: true },
          { key: "title", label: "Titul", isVisible: true },
          { key: "app_user_email_answer", label: "Vytvořil", isVisible: true },
          { key: "created_date", label: "Vytvořeno", isVisible: true, type: "date" },
        ]}
        rows={data.map((user) => ({
          ...user,
          id: user.answer_id,
        }))}
        columnSwitching={"localStorageById"}
        search={{
          app_user_email_answer: "Vytvořil",
        }}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        onDelete={(id) => {
          if (window.confirm("Opravdu chcete záznam smazat?")) {
            setAnswerId(undefined);
            mutate(id);
          }
        }}
        id={"Answers"}
        onRowClick={(id) => {
          setAnswerId(id);
          onOpen();
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default AnswersList;
