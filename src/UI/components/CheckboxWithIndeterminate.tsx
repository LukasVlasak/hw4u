import { Checkbox } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface Props {
  onChange: (state: boolean | undefined) => void;
  name: string;
  resetSignal?: boolean;
}

const CheckboxWithIndeterminate = ({ onChange, name, resetSignal }: Props) => {
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean | undefined>(false);
  const handleChange = () => {
    if (isChecked) {
      setIsIndeterminate(true);
      setIsChecked(undefined);
      onChange(false);
    } else if (isChecked === false) {
      setIsChecked(true);
      setIsIndeterminate(false);
      onChange(true);
    } else if (isChecked === undefined) {
      setIsChecked(false);
      setIsIndeterminate(false);
      onChange(undefined);
    }
  };

  useEffect(() => {
    if (resetSignal) {
      setIsChecked(false);
      setIsIndeterminate(false);
      onChange(undefined);
    }
  }, [resetSignal]);
  return (
    <>
      <Checkbox
        isChecked={isChecked}
        isIndeterminate={isIndeterminate}
        onChange={handleChange}
        id={name}
      />
    </>
  );
};

export default CheckboxWithIndeterminate;
