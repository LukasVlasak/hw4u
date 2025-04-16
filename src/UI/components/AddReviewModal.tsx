import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Textarea,
  Heading,
} from "@chakra-ui/react";
import { t } from "i18next";
import React, { useContext, useRef } from "react";
import authContext from "../../context/AuthContext";
import usePostReview from "../../hooks/useReviews";
import { Review } from "../../services/reviewService";
import ReactStars from "react-stars";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddReviewModal = ({ isOpen, onClose }: Props) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const starsRef = useRef<number>(-1);
  const toast = useToast();
  const { value } = useContext(authContext);

  const { mutate: postReview } = usePostReview(() => {
    // callback
    toast({
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("successPost"),
      description: t("homePage.reviews.successPostDesc"),
    });
  });

  const handleReviewAdd = () => {
    if (
      starsRef.current !== null &&
      textRef.current !== null &&
      starsRef.current !== -1 &&
      value !== null &&
      textRef.current.value.length > 10
    ) {
      const review = {
        text: textRef.current.value,
        stars: starsRef.current,
        user_name: value.name,
        user_id: value.id,
      };

      postReview(review as unknown as Review);
      textRef.current.value = "";
      onClose();
    } else {
      toast({
        status: "error",
        duration: 3000,
        isClosable: true,
        title: t("errorPost"),
        description: t("homePage.reviews.errorPostDesc"),
      });
    }
  };
  return (
    <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("account.addReview")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size={"sm"}>{t("tasks.description")}</Heading>
          <Textarea
            ref={textRef}
            name=""
            id=""
            placeholder={t("review")}
          ></Textarea>
          <Heading mt={4} size={"sm"}>
            {t("stars")}
          </Heading>
          <ReactStars
            value={0}
            edit={true}
            onChange={(newRating) => {
              if (starsRef.current) {
                starsRef.current = newRating;
              }
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t("tasks.close")}
          </Button>
          <Button onClick={handleReviewAdd} colorScheme="blue">
            {t("tasks.submit")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddReviewModal;
