"use client";

import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";
import { ReactNode } from "react";
import AnimatedText from "./AnimatedText";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function CallToActionWithIllustration({ children }: Props) {

  const { t } = useTranslation();

  return (
    <Container h={"100%"} w="calc(60% + 15vw)" maxW={"unset"} m={"0"} pt={24} pl={20}>
      <Stack spacing={{ base: 8, md: 10 }}>
        <Heading
          color={"white"}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
          lineHeight={"110%"}
          pt={"20px"}
        >
          {t("heroSection.findSolution")}{" "}
          <Text as={"span"} color={"#FF5941"}>
            {children}
          </Text>
        </Heading>
        <Text color={"gray.300"} maxW={"3xl"}>
          {t("heroSection.superWords")}
        </Text>
        <AnimatedText width="28" height="34" viewBox="0 0 58 34" fileName="main-svg.txt" duration={1000} stroke="white" isPositionAbsolute={true} top="700px" left="200px" />
    <AnimatedText width="19" height="32" viewBox="0 0 19 62" fileName="main-svg2.txt" duration={1000} stroke="white" isPositionAbsolute={true} top="100px" left="100px" />
    <AnimatedText width="29" height="33" viewBox="0 0 59 33" fileName="main-svg3.txt" duration={1000} stroke="white" isPositionAbsolute={true} top="300px" left="900px" />
        <Stack spacing={6} direction={"row"}>
        <Link to="/create-task">
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.400"}
            _hover={{ bg: "orange.500" }}
          >
            {t("heroSection.getStarted")}
          </Button>
          </Link>
          <Link to="/pricing">
          <Button rounded={"full"} px={6}>
            {t("heroSection.learnMore")}
          </Button>
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
