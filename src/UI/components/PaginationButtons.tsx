import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Props {
  setPage: (page: number) => void;
  page: number;
  pageSize: number;
  /**
   * napr. order.length
   */
  dataLength: number;
  /**
   * when setPageSize && pageSizesToChoose are defined - allows user to dynamically choose pageSize
   */
  setPageSize?: (pageSize: number) => void;
  pageSizesToChoose?: number[];
}

const PaginationButtons = ({
  page,
  setPage,
  pageSize,
  dataLength,
  setPageSize,
  pageSizesToChoose,
}: Props) => {
  return (
    <Flex
      mt={3}
      flexDir={"row"}
      justifyContent={setPageSize && pageSizesToChoose ? "space-between" : "flex-end"}
    >
      {setPageSize && pageSizesToChoose && (
        <select
          onChange={(e) => setPageSize(parseInt(e.currentTarget.value))}
          defaultValue={pageSize}
        >
          {pageSizesToChoose.map((p) => {
            return (
              <option key={p} value={p}>
                {p}
              </option>
            );
          })}
        </select>
      )}
      {dataLength > pageSize ? (
        <Flex>
          <Flex alignItems={"center"} mr={2}>
            <span>
              {(page - 1) * pageSize + 1} -{" "}
              {page * pageSize > dataLength ? dataLength : page * pageSize}
              {" z " + dataLength}
            </span>
          </Flex>
          <Button mr={1} isDisabled={page <= 1} onClick={() => setPage(page - 1)}>
            <IoIosArrowBack />
          </Button>
          <Button isDisabled={page * pageSize >= dataLength} onClick={() => setPage(page + 1)}>
            <IoIosArrowForward />
          </Button>
        </Flex>
      ) : setPageSize && pageSizesToChoose ? (
        <Flex>{dataLength + " z " + dataLength}</Flex>
      ) : null}
    </Flex>
  );
};

export default PaginationButtons;
