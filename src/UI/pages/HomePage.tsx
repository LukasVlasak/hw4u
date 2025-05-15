import styled from "styled-components";
import TextChange from "../components/TextChange";
import CallToActionWithIllustration from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Reviews from "../components/Reviews";
import SimpleThreeColumns from "../components/WhyUs";
import { useTranslation } from "react-i18next";
import { Flex, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { useGetTopEarningUsers } from "../../hooks/useUsers";
import { log } from "console";

const DivBg = styled.div`
  background-image: url("./bg-image.png") !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  height: 100vh;
`;

const HomePage = () => {

  const { data } = useGetTopEarningUsers();
  const { t } = useTranslation();
  return (
    <>
      <DivBg>
        <CallToActionWithIllustration>
          <br></br>
          Školní projekty
        </CallToActionWithIllustration>
      </DivBg>

      <Reviews />
      <HowItWorks />
      <SimpleThreeColumns />
      <Flex flexDir={'column'}>
        <Heading>Top earnings</Heading>
        <UnorderedList>
        {data?.map((user) => (
          <ListItem key={user.full_name}>
              {user.full_name} - {user.total_earnings} Kč
          </ListItem>
        ))}
        </UnorderedList>
      </Flex>
    </>
  );
};

export default HomePage;
