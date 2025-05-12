import React from "react";
import DataGrid from "../../components/DataGrid";
import { useDeleteUser, useGetUsers } from "../../../hooks/useUsers";
import LoadingComponents from "../../components/LoadingComponents";
import { User } from "../../../services/userService";
import { useDeleteAnswer } from "../../../hooks/useAnswers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import useAuth from "../../../hooks/useAuth";
import UserModal from "../../layout/components/administration/UserModal";
import { useDeleteReview, useGetReviews } from "../../../hooks/useReviews";
import { Review } from "../../../services/reviewService";
import ReviewModal from "../../layout/components/administration/ReviewModal";

const ReviewList = () => {
  const { data, isLoading } = useGetReviews();
  const { data: user } = useAuth();
  const [reviewId, setReviewId] = React.useState<number>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate, isPending } = useDeleteReview(() => {
    toast({
      title: "Recenze smazána",
      status: "success",
    });
  });
  return data ? (
    <>
      <ReviewModal isOpen={isOpen} onClose={onClose} reviewId={reviewId} />
      <DataGrid<Review & { id: number }>
        columns={[
          { key: "review_id", label: "ID", isVisible: true },
          { key: "email", label: "Recenzi napsal uživatel", isVisible: true },
          { key: "for_user_email", label: "Recenzi napsal uživateli", isVisible: true },
          { key: "stars", label: "Hvězdičky", isVisible: true },
        ]}
        rows={data.map((user) => ({
          ...user,
          id: user.review_id,
        }))}
        columnSwitching={"localStorageById"}
        search={{
          email: "E-mail",
          for_user_email: "E-mail",
        }}
        sort
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
        onDelete={(id) => {
          if (window.confirm("Opravdu chcete záznam smazat?")) {
            mutate(id);
          }
        }}
        id={"Review"}
        onRowClick={(id) => {
          setReviewId(id);
          onOpen();
        }}
      />
    </>
  ) : (
    <LoadingComponents />
  );
};

export default ReviewList;
