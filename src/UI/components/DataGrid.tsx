// date filter nefungujeu vice filtru, protoze jednim statem ovladam vsechny filtry - muselo by byt reseno stejne
// jako to je u category - globalni state v taskslistu, ktery si predavam jako prop do categoryFilter.tsx

import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import NumberFilter from "./NumberFilter";
import SearchFilter from "./SearchFilter";

interface Pagination {
  defaultPageSize: number;
  pageSizesToChoose: number[];
}

interface NumberFilterInterface {
  type: "number";
  start: number;
  end: number;
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
  columns: string[];
  rows: T[];
  sort?: boolean;
  search?: (keyof T)[];
  filters?: Filters<T, K>[];
  pagination?: Pagination;
}

function DataGrid<T extends {}, K extends any[] = undefined[]>({
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
  console.log(page);
  console.log(pageSize);
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
      console.log("stop sorting");
      return forSorting;
    }

    forSorting.sort((a, b) => {
      const ai = Object.values(a).map((k, i) => i === columnNumber && k)[
        columnNumber
      ] as string;
      const bi = Object.values(b).map((k, i) => i === columnNumber && k)[
        columnNumber
      ] as string;

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

  useEffect(() => {
    //console.log(filteredByDate);

    let rRows = _.intersection(
      filteredByMultiRange || rows,
      filteredByCategory || rows,
      filteredBySearch || rows,
      filteredByDate || rows
    );

    if (lastClicked) {
      console.log("sorting");
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
    <>
      {/* filters */}
      {filters
        ? filters.map((f, i) => {
            if (f.props.type === "category")
              return (
                <div key={i}>
                  <CategoryFilter<T, typeof f.props.categoryEnum>
                    onChange={setFilteredByCategory}
                    categories={f.props.categoryEnum}
                    dataKey={f.dataKey}
                    name={f.name}
                    data={rows}
                    setCategory={setCategory}
                    category={category}
                  />
                </div>
              );
            else if (f.props.type === "number")
              return (
                <div key={i}>
                  <span>{f.name}</span>
                  <NumberFilter<T>
                    key={i}
                    onChange={setFilteredByMultiRange}
                    start={f.props.start}
                    end={f.props.end}
                    data={rows}
                    dataKey={f.dataKey}
                  />
                </div>
              );
            else if (f.props.type === "date") {
              return (
                <div key={i}>
                  <span>{f.name}</span>
                  <DateFilter<T>
                    data={rows}
                    dataKey={f.dataKey}
                    onChange={setFilteredByDate}
                    key={i}
                  />
                </div>
              );
            } else return null;
          })
        : null}

      {/* search */}
      {search ? (
        <SearchFilter<T>
          data={rows}
          searchInValues={search}
          onSearch={setFilteredBySearch}
        />
      ) : null}

      {renderedRows ? (
        <TableContainer maxWidth={"90%"} margin={"0 auto"}>
          <Table>
            <Thead _hover={sort ? { cursor: "pointer" } : {}}>
              <Tr>
                {columns.map((c, i) => {
                  return (
                    <Th onClick={() => handleSortClick(i)} key={i}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginRight: "5px" }}>{c} </span>
                        {lastClicked === i ? (
                          ascOrder[i] === 0 ? null : ascOrder[i] === 2 ? (
                            <FaArrowUp />
                          ) : (
                            <FaArrowDown />
                          )
                        ) : null}
                      </div>
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {pagination && pageSize
                ? renderedRows
                    .slice((page - 1) * pageSize, page * pageSize)
                    .map((r, i) => {
                      return (
                        <Tr key={i}>
                          {Object.values(r).map((v, i) => {
                            return <Td key={i}>{v as string}</Td>;
                          })}
                        </Tr>
                      );
                    })
                : renderedRows.map((r, i) => {
                    return (
                      <Tr key={i}>
                        {Object.values(r).map((v, i) => {
                          return <Td key={i}>{v as string}</Td>;
                        })}
                      </Tr>
                    );
                  })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
      {pagination && pageSize ? (
        <>
          <span>current page {page}</span>
          <Button
            isDisabled={page * pageSize - 1 >= renderedRows.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
          <Button isDisabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <select
            onChange={(e) => setPageSize(parseInt(e.currentTarget.value))}
            name=""
            id=""
          >
            {pagination.pageSizesToChoose.map((p, i) => {
              return (
                <option
                  key={i}
                  value={p}
                  selected={p === pagination.defaultPageSize}
                >
                  {p}
                </option>
              );
            })}
          </select>
        </>
      ) : null}
    </>
  );
}

export default DataGrid;
