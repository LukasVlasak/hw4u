import { Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-stars";
import { RxAvatar } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { useDeleteReview } from "../../hooks/useReviews";
import useAuth from "../../hooks/useAuth";

interface Props {
  username?: string;
  fullName: string;
  userId: number;
  review?: string;
  rating: number;
  reviewId: number;
}

const OneUserReview = ({ username, fullName, review, rating, userId, reviewId }: Props) => {
    const toast = useToast();
    const { data: user } = useAuth();
    const { mutate } = useDeleteReview(() => {
        toast({
            title: "Recenze byla úspěšně smazána",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    });
  return (
    <Flex flexDir={"column"} p={5} my={3} border={"1px solid #ccc"} borderRadius={5}>
      <Flex flexDir={"row"} alignItems={"center"} justifyContent={'space-between'}>
        <Flex flexDir={'row'} alignItems={'center'}>

        <RxAvatar size={30} />
        <Text ml={2}></Text>
        <Link className="no-color-link" to={"/users/" + userId}>
          {username ? username : fullName}
        </Link>
        &nbsp;
        {"napsal:"}
        </Flex>
        {user && user[0].app_user_id === userId ? <IconButton onClick={() => mutate(reviewId)} aria-label="delete review" colorScheme="red" icon={<MdDelete />}></IconButton> : null}
      </Flex>
      <Flex mt={2}>{review}</Flex>
      <ReactStars count={5} value={rating} size={24} edit={false} color2={"#ffd700"} half={true} />
    </Flex>
  );
};

export default OneUserReview;
