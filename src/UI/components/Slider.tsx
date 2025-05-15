import {
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Flex,
    Button,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  
  interface Props {
    min: number;
    max: number;
    defaultValue?: number[];
    onChangeEnd: (minMax: number[] | undefined) => void;
    resetSignal?: boolean;
    onReset?: () => void;
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
  
  const Slider = ({
    min,
    max,
    onChangeEnd,
    defaultValue,
    selectedValues,
    resetSignal,
    onReset,
    withKc,
    thumbColor,
    sliderColor
  }: Props) => {
    const [rangeState, setRangeState] = useState<number[]>(
      defaultValue || [min, max],
    );
  
    // for sync between two same NumberFilter components
    useEffect(() => {
      if (selectedValues) {
        setRangeState(selectedValues);
      }
    }, [selectedValues]);
  
    useEffect(() => {
      if (resetSignal) {
        setRangeState([min, max]);
        onChangeEnd(undefined);
      }
    }, [resetSignal]);  
    return (
      <>
        <RangeSlider
          aria-label={["min", "max"]}
          colorScheme="blue"
          defaultValue={defaultValue || [min, max]}
          min={min}
          max={max}
          onChangeEnd={(val) =>
            onChangeEnd(val[0] === min && val[1] === max ? undefined : val)
          }
          onChange={(e) => setRangeState(e)}
          value={rangeState}
        >
          <RangeSliderTrack boxSize={1}>
            <RangeSliderFilledTrack background={sliderColor ? sliderColor : "#1d4bb5"} />
          </RangeSliderTrack>
          <RangeSliderThumb backgroundColor={thumbColor ? thumbColor : "blue.500"} boxSize={4} index={0} />
          <RangeSliderThumb backgroundColor={thumbColor ? thumbColor : "blue.500"} boxSize={4} index={1} />
        </RangeSlider>
        <Flex
          flexDir={"row"}
          justifyContent={"space-between"}
          textAlign={"end"}
          verticalAlign={"bottom"}
        >
          <div>{withKc ? rangeState[0] + " Kč" : rangeState[0]}</div>
          <Button
            variant={"link"}
            mt={5}
            onClick={() => {
              setRangeState([min, max]);
              onChangeEnd(undefined);
              if (onReset) {
                onReset();
              }
            }}
          >
            reset
          </Button>
          <div>{withKc ? rangeState[1] + " Kč" : rangeState[1]}</div>
        </Flex>
      </>
    );
  };
  
  export default Slider;
  