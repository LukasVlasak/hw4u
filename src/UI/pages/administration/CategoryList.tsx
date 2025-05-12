import React from "react";
import DataGrid from "../../components/DataGrid";
import { useDeleteUser, useGetUsers } from "../../../hooks/useUsers";
import LoadingComponents from "../../components/LoadingComponents";
import { User } from "../../../services/userService";
import { useDeleteAnswer } from "../../../hooks/useAnswers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import useAuth from "../../../hooks/useAuth";
import UserModal from "../../layout/components/administration/UserModal";
import { useDeleteCategory, useGetCategories } from "../../../hooks/useCategory";
import CategoryModal from "../../layout/components/administration/CategoryModal";
import { Category } from "../../../services/categoryService";

const CategoryList = () => {
  const { data, isLoading } = useGetCategories();
  const { data: user } = useAuth();
  const [categoryId, setCategoryId] = React.useState<number>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate, isPending } = useDeleteCategory(() => {
    toast({
      title: "Kategorie smazána",
      status: "success",
    });
  });
  return data ? (
    <>
      <CategoryModal isOpen={isOpen} onClose={onClose} categoryId={categoryId} />
      <DataGrid<Category & { id: number }>
        onAdd={() => {
          setCategoryId(undefined);
          onOpen();
        }}
        columns={[
          { key: "category_id", label: "ID", isVisible: true },
          { key: "name", label: "Název", isVisible: true },
          { key: "parent_category_name", label: "Název rodičovské kategorie", isVisible: true },
        ]}
        rows={data.map((user) => ({
          ...user,
          id: user.category_id,
        }))}
        columnSwitching={"localStorageById"}
        search={{
            name: "Název",
        }}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        onDelete={(id) => {
            setCategoryId(undefined);
          if (window.confirm("Opravdu chcete záznam smazat?")) {
            mutate(id);
          }
        }}
        id={"Category"}
        onRowClick={(id) => {
          setCategoryId(id);
          onOpen();
        }}
        onEdit={(id) => {
          setCategoryId(id);
          onOpen();
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default CategoryList;
