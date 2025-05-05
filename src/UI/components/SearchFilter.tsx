import {
  Flex,
  FormControl,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import React, { ChangeEvent, useRef, useState } from "react";
import MultiSelectMenu from "./Multiselect";
import { SearchMapping } from "./DataGrid";

function getKeyByValue(object: Record<string, string>, value: string) {
  return Object.keys(object).find((key) => object[key] === value) || "";
}
interface Props<T> {
  onSearch: (data: T[] | undefined) => void;
  /**
   * search mapping - {[keyof T]: string} - string: to co se bude zobrazovat v inputu - vyhledat podle...
   */
  searchInValues: SearchMapping<T>;
  /**
   * zapne vybirani hodnot a vybere ty, ktere jsou tady - NE keyof T ale LABEL, ktery je napsany v searchInValues
   */
  defaultSelected?: string[];
  data: T[];
}

function SearchFilter<T>({ onSearch, searchInValues, data, defaultSelected }: Props<T>) {
  // values of SearchMapping<T>
  // ['Cele jmeno', 'E-mail']
  const [searchArray, setSearchArray] = useState<string[]>(
    defaultSelected ? defaultSelected : Object.values(searchInValues),
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  // searchInValues - {full_name: "Cele jmeno", email: "E-mail"}
  const searchMethod = (searchedWord: string) => {
    return data.filter((d) => {
      return searchArray.some((s) => {
        const item: string = d[
          getKeyByValue(searchInValues, s) as keyof T
        ] as string;
        if (item) {
          return (
            item.toString().toLowerCase().indexOf(searchedWord.toLowerCase()) >
            -1
          );
        } else {
          return false;
        }
      });
    });
  };

  const searchPlaceholder = `Vyhledat podle ${searchArray.map(
    (s, i) => (i !== 0 ? " " : "") + (s as string),
  )}`;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.currentTarget.value;
    onSearch(searchMethod(q));
  };
  return (
    <FormControl maxW={"250px"}>
      <Flex flexDir={"column"}>
        <Flex flexDir={"row"}>
          <Input
            ref={searchInputRef}
            onChange={handleSearch}
            id="search"
            placeholder={searchPlaceholder}
            type="text"
            minW={{base: "200px", '2sm': "300px"}}
            disabled={searchArray.length === 0 && defaultSelected ? true : false}
            mr={4}
          />
          {defaultSelected ? (
            <MultiSelectMenu
              onClear={() => {
                if (searchInputRef.current) {
                  searchInputRef.current.value = "";
                }
                onSearch(undefined);
              }}
              preSelectedOptions={defaultSelected ? defaultSelected : undefined}
              label="Vybrat hodnoty"
              onChange={(e) => setSearchArray(e)}
              options={Object.values(searchInValues)}
            />
          ) : null}
        </Flex>
        {searchArray.length === 0 && defaultSelected ? (
          <FormHelperText color={"red"}>
            Nejdříve vyberte hodnoty pro hledání
          </FormHelperText>
        ) : null}
      </Flex>
    </FormControl>
  );
}

export default SearchFilter;
