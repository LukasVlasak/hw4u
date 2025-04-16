import styled from "styled-components";
import TextChange from "../components/TextChange";
import CallToActionWithIllustration from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Reviews from "../components/Reviews";
import SimpleThreeColumns from "../components/WhyUs";
import { useTranslation } from "react-i18next";

const DivBg = styled.div`
  background-image: url("./bg-image.png") !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  height: 100vh;
`;

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <DivBg>
        <CallToActionWithIllustration>
          <TextChange
            texts={[t("heroSection.schoolProjects"), t("heroSection.termPaper"), t("heroSection.onlineTests")]}
          />
        </CallToActionWithIllustration>
      </DivBg>

      <Reviews />
      <HowItWorks />
      <SimpleThreeColumns />
    </>
  );
};

export default HomePage;
