import React, { ReactElement, useEffect, useState } from "react";
import MultiSelectMenu from "./Multiselect";
import { CheckboxGroup, Flex, Stack, Checkbox } from "@chakra-ui/react";

interface Props {
  /**
   * to co bude napsane na selectu
   */
  name: string;
  categories: string[];
  setCategoryFiltered: (categoryFiltered: string[]) => void;
  /**
   * if true, reset selected options
   */
  resetSignal?: boolean;
  /**
   * for displaying div with color backgroud - to not just display color name but hex also, bacha na chakra Container vole ma to margin jak debil
   */
  elementsToDisplayWithOptions?: ReactElement[];
  /**
   * if it should display as multiselect that opens on click or as list with checkboxes, default as multiselect
   */
  asList?: boolean;
  /**
   * works only if isList=true
   */
  selectedCategories?: string[];
}

function CategoryFilter({
  name,
  categories,
  selectedCategories,
  setCategoryFiltered,
  resetSignal,
  elementsToDisplayWithOptions,
  asList,
}: Props) {
  /**
   * needed in asList, because i need to be able to reset values with resetSignal
   */
  const [values, setValues] = useState<string[]>([]);

  // for sync two different CategoryFilter components
  useEffect(() => {
    if (selectedCategories) {
      setValues(selectedCategories);
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (resetSignal) {
      // smaze se cely filtr kdyz tam je []
      setCategoryFiltered([]);
      setValues([]);
    }
  }, [resetSignal]);
  return asList === undefined || asList === false ? (
    <MultiSelectMenu
      resetSignal={resetSignal}
      label={name}
      options={categories}
      elementsToDisplayWithOptions={elementsToDisplayWithOptions}
      onChange={(e) => setCategoryFiltered(e)}
    />
  ) : (
    <CheckboxGroup
      value={values}
      onChange={(val) => {
        setCategoryFiltered(val as string[]);
        setValues(val as string[]);
      }}
    >
      <Stack>
        {categories.map((c, i) => {
          return (
            <Checkbox
              key={i}
              value={c}
            >
              {elementsToDisplayWithOptions &&
              elementsToDisplayWithOptions[i] ? (
                <Flex alignItems={"center"} justifyContent={"left"}>
                  {elementsToDisplayWithOptions[i]}
                  {c}
                </Flex>
              ) : (
                c
              )}
            </Checkbox>
          );
        })}
      </Stack>
    </CheckboxGroup>
  );
}

export default CategoryFilter;
