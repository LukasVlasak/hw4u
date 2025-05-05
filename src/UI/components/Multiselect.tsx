import React, { ReactElement, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuOptionGroup,
  MenuItemOption,
  MenuButtonProps,
  Flex,
} from "@chakra-ui/react";

function stringArraysContainsSameItems(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.includes(arr1[i])) {
        return false;
      }
    }
  
    return true;
  }

const MultiSelectMenu = (props: MultiSelectMenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    label,
    options,
    elementsToDisplayWithOptions,
    buttonProps,
    onClear,
    resetSignal,
    preSelectedOptions,
    selectOptions,
  } = props;
  useEffect(() => {
    if (resetSignal) {
      setSelectedOptions([]);
      handleChange([]);
      if (onClear) {
        onClear();
      }
      // Have to close, otherwise the defaultValue won't be reset correctly
      // and so the UI won't immediately show the menu item options unselected.
      setIsOpen(false);
    }
  }, [resetSignal]);

  // selectOptions - externi zmena - chci zmenit interni state na zaklade externi udalosti
  useEffect(() => {
    if (selectOptions) {
      if (!stringArraysContainsSameItems(selectOptions, selectedOptions)) {
        handleChange(selectOptions);
      }
    }
  }, [selectOptions]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    preSelectedOptions ? preSelectedOptions : []
  );
  const handleChange = (values: string[]) => {
    setSelectedOptions(values.filter((_) => _.length));
    props.onChange?.(values);
  };
  return (
    <Menu
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      closeOnSelect={false}
    >
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        minWidth={"fit-content"}
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore <MenuButton> does have a 'type' prop because it is just a button. This is to make sure clicking this doesn't submit any forms.
        type="button"
        /* eslint-enable @typescript-eslint/ban-ts-comment */
        backgroundColor={selectedOptions.length ? "blue.500" : "white"}
        color={selectedOptions.length ? "white" : "gray.600"}
        borderColor={selectedOptions.length ? "blue.500" : "gray.300"}
        borderWidth={1}
        p={2}
        px={4}
        borderRadius="25px"
        _focus={{
          outline: "none",
        }}
        {...buttonProps}
      >
        {`${label}${
          selectedOptions.length > 0 ? ` (${selectedOptions.length})` : ""
        }`}
      </MenuButton>
      <MenuList sx={{overflow: 'auto'}} maxH={'525px'}>
        <MenuGroup title={undefined}>
          <MenuItem
            onClick={() => {
              setSelectedOptions([]);
              handleChange([]);
              if (onClear) {
                onClear();
              }
              // Have to close, otherwise the defaultValue won't be reset correctly
              // and so the UI won't immediately show the menu item options unselected.
              setIsOpen(false);
            }}
          >
            Smazat vše
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuOptionGroup
          title={undefined}
          defaultValue={selectedOptions}
          value={selectedOptions}
          type="checkbox"
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore Arguments type is just wrong upstream.
          onChange={handleChange}

          /* eslint-enable @typescript-eslint/ban-ts-comment */
        >
          {options.map((option, i) => {
            return (
              // Use 'type'='button' to make sure it doesn't default to 'type'='submit'.
              <MenuItemOption
                key={`multiselect-menu-${option}-${i}`}
                /* eslint-disable @typescript-eslint/ban-ts-comment */
                // @ts-ignore <MenuItemOption> does have a 'type' prop because it is just a button. This is to make sure clicking this doesn't submit any forms.
                type="button"
                /* eslint-enable @typescript-eslint/ban-ts-comment */
                value={option}
                isChecked={selectedOptions.includes(option)}
              >
                {elementsToDisplayWithOptions &&
                elementsToDisplayWithOptions[i] ? (
                  <Flex alignItems={'center'} justifyContent={'left'}>
                    {elementsToDisplayWithOptions[i]}
                    {option}
                  </Flex>
                ) : (
                  option
                )}
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

MultiSelectMenu.displayName = "MultiSelectMenu";

export type MultiSelectMenuProps = {
  label: string;
  options: string[];
  /**
   * for displaying div with color backgroud - to not just display color name but hex also
   */
  elementsToDisplayWithOptions?: ReactElement[];
  onChange?: (selectedValues: string[]) => void;
  buttonProps?: MenuButtonProps;
  onClear?: () => void;
  resetSignal?: boolean;
  preSelectedOptions?: string[];
  selectOptions?: string[];
};

export default MultiSelectMenu;
