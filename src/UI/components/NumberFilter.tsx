import React from "react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Slider from "./Slider";
import { FaFilter } from "react-icons/fa6";

interface Props {
  start: number;
  end: number;
  setNumberFilteredFn: (minMax: number[] | undefined) => void;
  name: string;
  resetSignal?: boolean;
  /**
   * if slider should appear as popover on button click or not
   * @default false
   */
  withoutButton?: boolean;
  /**
   * display Kč with min, max
   */
  withKc?: boolean;
  /**
   * for sync between two same NumberFilter components
   */
  selectedValues?: number[];
  thumbColor?: string;
  sliderColor?: string;
}

function NumberFilter({
  start,
  end,
  setNumberFilteredFn,
  name,
  resetSignal,
  withoutButton,
  withKc,
  selectedValues,
  thumbColor,
  sliderColor
}: Props) {
  const { onToggle, isOpen, onClose } = useDisclosure();

  if (start >= end) return null;

  return withoutButton === undefined || withoutButton === false ? (
    <Popover closeOnBlur={true} onClose={onClose} isOpen={isOpen}>
      <PopoverTrigger>
        <Button
          onClick={onToggle}
          bg={"transparent"}
          _hover={{ bg: "transparent" }}
        >
          <FaFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody p={"20px"}>
          <Text mb={4}>{name}</Text>
          <Slider
            key={start - end}
            resetSignal={resetSignal}
            max={end}
            min={start}
            withKc={withKc}
            selectedValues={selectedValues}
            onReset={onClose}
            onChangeEnd={(e) => setNumberFilteredFn(e)}
            thumbColor={thumbColor}
            sliderColor={sliderColor}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <Slider
      key={start - end}
      resetSignal={resetSignal}
      max={end}
      min={start}
      onReset={onClose}
      selectedValues={selectedValues}
      withKc={withKc}
      onChangeEnd={(e) => setNumberFilteredFn(e)}
      thumbColor={thumbColor}
      sliderColor={sliderColor}
    />
  );
}

export default NumberFilter;
