import { FormControl, Input } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface Props<T> {
  onSearch: (data: T[]) => void;
  searchInValues: (keyof T)[];
  data: T[];
}

function SearchFilter<T>({ onSearch, searchInValues, data }: Props<T>) {
  const searchMethod = (searchedWord: string) => {
    return data.filter((d) => {
      return searchInValues.some((s) => {
        const item: string = d[s] as string;
        return (
          item.toString().toLowerCase().indexOf(searchedWord.toLowerCase()) > -1
        );
      });
    });
  };

  const searchPlaceholder = `Search for ${searchInValues.map(
    (s, i) => (i !== 0 ? " " : "") + (s as string)
  )}`;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.currentTarget.value;
    onSearch(searchMethod(q));
  };
  return (
    <FormControl maxW={'250px'}>
      <Input
        onChange={handleSearch}
        id="search"
        placeholder={searchPlaceholder}
        type="text"
      />
    </FormControl>
  );
}

export default SearchFilter;
