import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NumberDiv = styled.div`
display: flex;
justify-content:center;
align-items:center;
  border-radius: 5px;
  background-color: #c6f6d5;
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  color: #3b785a;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
`;

const Main = styled.div`
background-color: #edf2f6;
display: flex;
text-align: center;
justify-content: center;
width: 100%;
padding-top: 30px;
padding-bottom: 80px;
`;

const H1 = styled.h2`
font-weight: bold;
margin: 40px;
padding-bottom: 40px;
font-size: 40px;
`;
const H2 = styled.h3`
font-size: 23px;
font-weight: bold;
padding-top: 8px;
padding-bottom: 8px;
`;
const HowItWorks = () => {

  const { t } = useTranslation();
  return (
    <Main>
      <div className="d-flex flex-column w-100">
        <H1><span style={{'color': '#4bbc7a'}}>{t("homePage.howItWorks")}</span></H1>
        <div className="d-flex flex-row justify-content-around">
          <Item>
            <NumberDiv>1</NumberDiv>
            <H2>{t("homePage.enterTask")}</H2>
            <p>{t("homePage.enterTaskDesc")}<Link to="/create-task">{t("homePage.here")}</Link></p>
          </Item>
          <Item>
            <NumberDiv>2</NumberDiv>
            <H2>{t("homePage.chooseAnswer")}</H2>
            <p>{t("homePage.chooseAnswerDesc")}</p>
          </Item>
          <Item>
            <NumberDiv>3</NumberDiv>
            <H2>{t("homePage.enjoyFreeTime")}</H2>
            <p>{t("homePage.enjoyFreeTimeDesc")}</p>
          </Item>
        </div>
      </div>
    </Main>
  );
};

export default HowItWorks;
