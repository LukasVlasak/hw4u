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
  Text,
  Heading,
} from "@chakra-ui/react";
import { t } from "i18next";
import React, { useContext, useRef, useState } from "react";
import usePostReview from "../../../hooks/useReviews";
import { Review } from "../../../services/reviewService";
import ReactStars from "react-stars";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: Pick<Review, "stars" | "text">) => void;
}

const AddReviewModal = ({ isOpen, onClose, onAddReview }: Props) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const starsRef = useRef<number>(1);
  const [textError, setTextError] = useState(false);
  const { t } = useTranslation();

  const handleReviewAdd = () => {
    if (textRef.current !== null && starsRef.current !== null) {
      if (textRef.current.value.length < 10) {
        setTextError(true);
        return;
      } else {
        setTextError(false);
      }

      const review = {
        text: textRef.current.value,
        stars: starsRef.current,
      };

      onAddReview(review);

      if (textRef.current) {
        textRef.current.value = "";
      }
      onClose();
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
          <Textarea isInvalid={textError} ref={textRef} name="" id="" placeholder={t("review")}></Textarea>
          {textError && (
            <Text color={"red.500"} fontSize={"sm"}>
              {t("homePage.reviews.reviewError")}
            </Text>
          )}
          <Heading mt={4} size={"sm"}>
            {t("stars")}
          </Heading>
          <ReactStars
            value={1}
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
