// date filter nefungujeu vice filtru, protoze jednim statem ovladam vsechny filtry - muselo by byt reseno stejne
// jako to je u category - globalni state v taskslistu, ktery si predavam jako prop do categoryFilter.tsx

import {
  Button,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import NumberFilter from "./NumberFilter";
import SearchFilter from "./SearchFilter";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authContext from "../../context/AuthContext";

interface Pagination {
  defaultPageSize: number;
  pageSizesToChoose: number[];
}

interface NumberFilterInterface {
  type: "number";
  start: number;
  end: number;
  currency?: string;
}

type TupleMember<T extends any[]> = T[number];

interface CategoryFilterInterface<K extends any[]> {
  type: "category";
  categoryEnum: TupleMember<K>;
}

interface DateFilterInterface {
  type: "date";
}

type Filter<K extends any[]> =
  | CategoryFilterInterface<K>
  | NumberFilterInterface
  | DateFilterInterface;

interface Filters<T, K extends any[]> {
  dataKey: keyof T;
  name: string;
  props: Filter<K>;
}

interface Props<T, K extends any[]> {
  onRowClick?: (id: number) => void;
  columns: string[] | "keyof T";
  rows: T[];
  sort?: boolean;
  search?: (keyof T)[];
  filters?: Filters<T, K>[];
  pagination?: Pagination;
}

function DataGrid<T extends { id: number }, K extends any[] = undefined[]>({
  onRowClick,
  columns,
  rows,
  sort,
  filters,
  search,
  pagination,
}: Props<T, K>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    pagination && pagination.defaultPageSize
  );
  const [renderedRows, setRenderedRows] = useState(rows);
  const [filteredByMultiRange, setFilteredByMultiRange] = useState<T[]>();
  const [filteredByCategory, setFilteredByCategory] = useState<T[]>();
  const [filteredBySearch, setFilteredBySearch] = useState<T[]>();
  const [filteredByDate, setFilteredByDate] = useState<T[]>();
  const [category, setCategory] =
    useState<{ category: string; dataKey: keyof T }[]>();

  const [ascOrder, setAscOrder] = useState<number[]>(
    Array(columns.length).fill(0)
  );
  const [lastClicked, setLastedClicked] = useState<number>();

  const [showFilters, setShowFilters] = useState(false);

  const [isHoveringTh, setIsHoveringTh] = useState<number>(); // kvuli zobrazovani sipky na hover

  const rendrededColumns =
    columns === "keyof T" ? Object.keys(rows[0]) : columns;

  /**
   *
   * @param columnNumber cislo sloupce, ktery je sortovan
   * @param forSorting pole ktere je sortovano
   * @param sortOrder 0 - bez razeni, vrati puvodni pole, 1 - asc order, 2 - desc order
   * @returns serazene nebo stejne pole
   */
  const sortFn = (
    columnNumber: number,
    forSorting: T[],
    sortOrder: number
  ): T[] => {
    if (sortOrder === 0) {
      return forSorting;
    }

    forSorting.sort((a, b) => {
      const ai = Object.values(a).map((k, i) => i === columnNumber && k)[
        columnNumber
      ] as unknown as string;
      const bi = Object.values(b).map((k, i) => i === columnNumber && k)[
        columnNumber
      ] as unknown as string;

      if (ai < bi) {
        return sortOrder === 1 ? -1 : 1;
      } else if (ai > bi) {
        return sortOrder === 1 ? 1 : -1;
      } else {
        return 0;
      }
    });

    return forSorting;
  };

  const handleSortClick = (columnNumber: number) => {
    if (!sort) return;
    setLastedClicked(columnNumber);
    setRenderedRows(
      sortFn(columnNumber, renderedRows, (ascOrder[columnNumber] + 1) % 3)
    );
    setAscOrder(ascOrder.map((a, i) => (i === columnNumber ? (a + 1) % 3 : a)));
  };

  const getTbody = (rows: T[]) => {
    return rows.map((r) => {
      return (
        <Tr
          key={r.id}
          _hover={{
            backgroundColor: "grey.200",
            cursor: "pointer",
          }}
          onClick={onRowClick ? () => onRowClick(r.id) : undefined}
        >
          {Object.values(r).map((v, i) => {
            return <Td key={i}>{v}</Td>;
          })}
        </Tr>
      );
    });
  };

  useEffect(() => {
    let rRows = _.intersection(
      filteredByMultiRange || rows,
      filteredByCategory || rows,
      filteredBySearch || rows,
      filteredByDate || rows
    );

    if (lastClicked) {
      rRows = sortFn(lastClicked, rRows, ascOrder[lastClicked]);
    }

    setRenderedRows(rRows);
    // eslint-disable-next-line
  }, [
    filteredByMultiRange,
    filteredByCategory,
    rows,
    filteredBySearch,
    filteredByDate,
  ]);

  useEffect(() => {
    if (pagination && pageSize) {
      const totalRows = renderedRows.length;
      const totalPages = Math.ceil(totalRows / pageSize);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [renderedRows, pageSize, page, pagination]);

  return (
    <Container
      margin={0}
      padding={"50px"}
      minWidth={"100%"}
      minHeight={"100%"}
      backgroundColor={"grey.300"}
    >
      <Flex
        backgroundColor={"white"}
        flexDirection={"column"}
        borderWidth={"1px"}
        borderColor={"grey.200"}
        padding={"20px"}
        borderRadius={"10px"}
      >
        {/* filters */}
        <Flex
          id="filters"
          flexDirection={"row"}
          justifyContent={"space-between"}
          paddingBottom={"10px"}
        >
          {/* search */}
          {search ? (
            <SearchFilter<T>
              data={rows}
              searchInValues={search}
              onSearch={setFilteredBySearch}
            />
          ) : null}
          <Flex>
            {filters ? (
              <Button onClick={() => setShowFilters(!showFilters)}>
                <FaFilter />
                Filter
              </Button>
            ) : null}
          </Flex>
        </Flex>

        <Flex
          display={showFilters && filters ? "flex" : "none"}
          alignItems={"center"}
          justifyContent={"space-around"}
          padding={"30px"}
          backgroundColor={"grey.200"}
          mb={3}
        >
          {filters ? (
            <>
              {/* typy filtru zatim - date, range number, category */}
              {category
                ? category.map((c) => {
                    return <Button>{c.dataKey as string}</Button>; // prekladat dataKey pomoci translate
                  })
                : null}
            </>
          ) : null}
        </Flex>
        {renderedRows ? (
          renderedRows.length > 0 ? (
            <TableContainer>
              <Table>
                <Thead
                  backgroundColor={"grey.200"}
                  _hover={sort ? { cursor: "pointer" } : {}}
                >
                  {/* zde bcs u th to nefunguje */}
                  <Tr>
                    {/* <div onMouseEnter={(e) => console.log(e.target)}> */}
                    {rendrededColumns.map((c, i) => {
                      return (
                        <Th onClick={() => handleSortClick(i)} key={i}>
                          <Flex
                            onMouseEnter={() => setIsHoveringTh(i)}
                            onMouseLeave={() => setIsHoveringTh(undefined)}
                            flexDirection={"row"}
                            alignItems={"center"}
                          >
                            <Text
                              minWidth={"calc(fit-content + 25px)"}
                              marginRight={"3px"}
                            >
                              {c}
                            </Text>
                            {lastClicked === i ? (
                              ascOrder[i] === 0 ? null : ascOrder[i] === 2 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )
                            ) : null}
                            {lastClicked !== i || ascOrder[i] === 0 ? (
                              <FaArrowDown
                                opacity={isHoveringTh === i ? "0.5" : "0.2"}
                              />
                            ) : null}
                          </Flex>
                        </Th>
                      );
                    })}
                    {/* </div> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {pagination && pageSize
                    ? getTbody(
                        renderedRows.slice(
                          (page - 1) * pageSize,
                          page * pageSize
                        )
                      )
                    : getTbody(renderedRows)}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Container minW={"100%"}>Nothing to show</Container>
          )
        ) : null}
        {/* pagination */}
        {pagination && pageSize ? (
          <Flex flexDir={"row"} justifyContent={"space-between"}>
            <select
              onChange={(e) => setPageSize(parseInt(e.currentTarget.value))}
              defaultValue={pagination.defaultPageSize}
            >
              {pagination.pageSizesToChoose.map((p, i) => {
                return (
                  <option key={i} value={p}>
                    {p}
                  </option>
                );
              })}
            </select>
            <Flex>
              <span>
                {(page - 1) * pageSize + 1} -{" "}
                {page * pageSize > renderedRows.length
                  ? renderedRows.length
                  : page * pageSize}
              </span>
              <Button isDisabled={page <= 1} onClick={() => setPage(page - 1)}>
                <IoIosArrowBack />
              </Button>
              <Button
                isDisabled={page * pageSize - 1 >= renderedRows.length}
                onClick={() => setPage(page + 1)}
              >
                <IoIosArrowForward />
              </Button>
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Container>
  );
}

export default DataGrid;

/*
{filters?.map((f, i) => {
              if (f.props.type === "number")
                return (
                    <Container
                      borderColor={"grey.200"}
                      boxShadow={"1px"}
                      borderWidth={"1px"}
                      borderRadius={"10px"}
                      key={i}
                      maxW={'300px'}
                      margin={0}
                    >
                      <Text fontWeight={'bold'}>{f.name}</Text>
                      <NumberFilter<T>
                        key={i}
                        onChange={setFilteredByMultiRange}
                        start={f.props.start}
                        end={f.props.end}
                        data={rows}
                        dataKey={f.dataKey}
                        currency={f.props.currency}
                      />
                    </Container>
                );
              else if (f.props.type === "date") {
                return (
                  <div key={i}>
                    <span>{f.name}</span>
                    <DateFilter<T>
                      data={rows}
                      dataKey={f.dataKey}
                      onChange={setFilteredByDate}
                    />
                  </div>
                );
              }
              if (f.props.type === "category")
                return (
                      <Container
                        id="containerCategory"
                        maxWidth={"fit-content"}
                        borderColor={"black"}
                        boxShadow={"1px"}
                        borderWidth={"1px"}
                        borderRadius={"10px"}
                        backgroundColor={"white"}
                        padding={"18px"}
                        zIndex={1}
                        key={i}
                      >
                        <CategoryFilter<T, typeof f.props.categoryEnum>
                          onChange={setFilteredByCategory}
                          categories={f.props.categoryEnum}
                          dataKey={f.dataKey}
                          name={f.name}
                          data={rows}
                          setCategory={setCategory}
                          category={category}
                        />
                      </Container>
                );
              else return null;
            })}
*/
