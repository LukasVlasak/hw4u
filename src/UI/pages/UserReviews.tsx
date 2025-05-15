import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetReviewsByUser } from "../../hooks/useReviews";
import LoadingComponents from "../components/LoadingComponents";
import { Box, Button, Flex } from "@chakra-ui/react";
import OneUserReview from "../components/OneUserReview";

const UserReviews = () => {
  const params = useParams();

  const navigate = useNavigate();
  const { data, isLoading } = useGetReviewsByUser(parseInt(params.id ?? ""));

  return data ? (
    <Box maxW={'60%'} margin={"0 auto"}>
      <Button my={5} onClick={() => navigate(-1)}>Zpět</Button>
      <Flex flexDir={"column"}>
        {data.map((review) => {
          return (
            <OneUserReview
            reviewId={review.review_id}
                key={review.review_id}
              username={review.username}
              fullName={review.full_name!}
              userId={review.app_user_id}
              // @ts-ignore
              rating={parseInt(review.stars)}
              review={review.text}
            />
          );
        })}
      </Flex>
    </Box>
  ) : (
    <LoadingComponents />
  );
};

export default UserReviews;
