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
import { useDeleteProduct, useGetProducts } from "../../../hooks/useProducts";
import { Product } from "../../../services/productService";
import { MdBlock } from "react-icons/md";
import ProductModal from "../../layout/components/administration/ProductModal";

const ProductList = () => {
  const { data, isLoading } = useGetProducts();
  const { data: user } = useAuth();
  const [productId, setProductId] = React.useState<number>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate, isPending } = useDeleteProduct(() => {
    toast({
      title: "Produkt deaktivován",
      status: "success",
    });
  });

  return data ? (
    <>
      <ProductModal isOpen={isOpen} onClose={onClose} productId={productId} />
      <DataGrid<Product & { id: number }>
        onAdd={() => {
          setProductId(undefined);
          onOpen();
        }}
        highlightCol={[{
            key: "active",
            equalTo: false,
            backgroundColor: "red.400",
            hoverBackgroundColor: "red.500",
        }]}
        columns={[
          { key: "product_id", label: "ID", isVisible: true },
          { key: "name", label: "Název", isVisible: true },
          { key: "price", label: "Cena (Kč)", isVisible: true },
          { key: "answer_limit", label: "Limit odpovědí", isVisible: true },
          { key: "active", label: "Aktivní pro uživatele", isVisible: true, type: "booleanPretty", filter: true, props: { type: "boolean" } },
        ]}
        rows={data.map((user) => ({
          ...user,
          id: user.product_id,
        }))}
        columnSwitching={"localStorageById"}
        search={{
            name: "Název",
            price: "Cena",
        }}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        onDelete={(id) => {
            setProductId(undefined);
          if (window.confirm("Opravdu chcete záznam zdeaktivovat?")) {
            mutate(id);
          }
        }}
        OnDeleteIcon={MdBlock}
        id={"Product"}
        onRowClick={(id) => {
          setProductId(id);
          onOpen();
        }}
        onEdit={(id) => {
          setProductId(id);
          onOpen();
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default ProductList;
