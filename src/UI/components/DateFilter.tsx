import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { cs, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const Button = styled("button")({
  border: "0.5px solid black",
  padding: "4px 8px",
});

const DatePickerWrapper = styled("div")({
  display: "none",
  position: "absolute",
  transition: "opacity 0.3s ease-in-out",
  zIndex: 1,
  "&.show": {
    display: "flex",
  },
  backgroundColor: "white",
  border: "1px solid black",
  borderRadius: "10px",
});

interface Props<T> {
  data: T[];
  onChange: (data: T[]) => void;
  dataKey: keyof T;
}

function DateFilter<T>({data, onChange, dataKey}: Props<T>) {
  const [selected, setSelected] = useState<Date>();
  const [show, setShow] = useState(false);
  const { i18n } = useTranslation();

  const handleClick = (e: MouseEvent) => {
    const btn = document.getElementById("dateBtn");
    const dayPicker = document.getElementById("dayPicker");

    if (e.target !== btn && !dayPicker?.contains(e.target as Node)) {
      setShow(false);
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  });

  return (
    <>
      <Button id="dateBtn" onClick={() => setShow(!show)}>
        {selected ? format(selected, "PP") : "dd.mm.yyyy"}
      </Button>
      <DatePickerWrapper className={show ? "show" : ""}>
        <DayPicker
          id="dayPicker"
          mode="single"
          selected={selected}
          onSelect={(date) => {
            setSelected(date);
            setShow(!show);
          }}
          showOutsideDays
          onNextClick={() => setShow(true)}
          locale={i18n.resolvedLanguage === "cs" ? cs : enUS}
        />
      </DatePickerWrapper>
      <button onClick={() => {onChange(data); setSelected(undefined)}}>Reset</button>
    </>
  );
};

export default DateFilter;
