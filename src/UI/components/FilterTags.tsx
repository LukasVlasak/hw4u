import { HStack, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import React from "react";

interface ActiveFilters<T> {
  key: keyof T;
  name: string;
}

interface Props<T> {
  activeFilters?: ActiveFilters<T>[];
  /**
   * setResetSignal(key);
   * deleteActiveFilter(key);
   */
  onClose: (dataKey: keyof T) => void;
  /**
   * setActiveFilters(undefined);
   * setActiveFiltersRows(undefined);
   * setResetSignal("all");
   */
  onCloseAll: () => void;
  bgColor?: string;
  color?: string;
}

function FilterTags<T>({ activeFilters, onClose, onCloseAll, bgColor, color }: Props<T>) {
  return activeFilters && activeFilters.length > 0 ? (
    <>
      {activeFilters.map((acf) => {
        return (
          <HStack key={acf.key as string} spacing={4}>
            <Tag
              size={"md"}
              borderRadius="full"
              variant="solid"
              colorScheme={!bgColor && !color ? "gray" : ""}
              backgroundColor={bgColor ? bgColor : ""}
              mb={2}
              ml={2}
            >
              <TagLabel>{acf.name}</TagLabel>
              <TagCloseButton
                onClick={() => {
                  onClose(acf.key);
                }}
              />
            </Tag>
          </HStack>
        );
      })}
      <HStack>
        <Tag
          size={"md"}
          borderRadius="full"
          variant="outline"
          border={bgColor ? "1px solid " + bgColor : ""}
          colorScheme={!bgColor && !color ? "gray" : ""}
          mb={2}
          ml={2}
          _hover={{
            cursor: "pointer",
            backgroundColor: bgColor ? bgColor : "#718096",
            color: color ? color : "white",
          }}
          onClick={() => {
            onCloseAll();
          }}
        >
          <TagLabel>Smazat vše</TagLabel>
        </Tag>
      </HStack>
    </>
  ) : null;
}

export default FilterTags;
