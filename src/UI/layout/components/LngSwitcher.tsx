import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Select = styled.select`
max-width: fit-content;
border: 1px solid white;
padding: 7px;
border-radius: 10px;
color: white;
background-color: transparent;
`

const LngSwitcher = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  
  const lngs: { [key: string]: { text: string } } = {
    en: { text: "EN" },
    cs: { text: "CZ" },
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);

    if (pathname === "/") {
      window.location.reload();
    }
  }

  return (
    <Select value={i18n.resolvedLanguage} onChange={handleChange}>
      {Object.keys(lngs).map((lng) => {
        return (
          <option
            key={lng}
            value={lng}
          >
            {lngs[lng].text}
          </option>
        );
      })}
    </Select>
  );
};

export default LngSwitcher;
