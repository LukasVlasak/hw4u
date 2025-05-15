import {
  Popover,
  PopoverTrigger,
  Input,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  useDisclosure,
} from "@chakra-ui/react";
import { cs } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import formatDateToDDMMYYYY from "../../utils/fc";

interface Props {
  dateProp?: Date;
  onChange: (date?: Date) => void;
}

const DayPickerInput = ({ dateProp, onChange }: Props) => {
  const [date, setDate] = useState<Date>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    setDate(dateProp);
  }, [dateProp]);
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Input
          color={date && date <= new Date() ? "red" : "black"}
          isReadOnly
          onClick={() => onOpen()}
          value={formatDateToDDMMYYYY(date)}
          type="text"
          placeholder="dd.MM.yyyy"
        ></Input>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              onChange(date);
              onClose();
            }}
            showOutsideDays
            disabled={{ before: new Date() }}
            // @ts-ignore
            locale={cs}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DayPickerInput;
