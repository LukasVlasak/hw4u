import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

const Select = styled("select")({
    maxWidth: 'fit-content',
    border: '1px solid black',
    padding: '7px',
    borderRadius: '10px',
});

const LngSwitcher = () => {
  const { i18n } = useTranslation();
  const lngs: { [key: string]: { text: string } } = {
    en: { text: "EN" },
    cs: { text: "CZ" },
  };
  return (
    <Select value={i18n.resolvedLanguage} onChange={(e) => i18n.changeLanguage(e.target.value)}>
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
