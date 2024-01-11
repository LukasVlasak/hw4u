import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import CategoryFilter from "./CategoryFilter";
import NumberFilter from "./NumberFilter";

interface NumberFilterInterface {
  type: "number";
  start: number;
  end: number;
}

interface CategoryFilterInterface<K> {
  type: "category";
  categoryEnum: (keyof K)[] | "all";
}

type Filter<K> = CategoryFilterInterface<K> | NumberFilterInterface;

interface Filters<T, K> {
  dataKey: keyof T;
  props: Filter<K>;
}

interface Props<T, K> {
  columns: string[];
  rows: T[];
  sort?: boolean;
  filters?: Filters<T, K>[];
}

function TasksList<T extends {}, K = undefined>({
  columns,
  rows,
  sort,
  filters,
}: Props<T, K>) {
  function printValues<T>(...values: T[]): void {
    values.forEach((value) => console.log(value));
  }

  // Example usage
  printValues(1, 2, 3, 4, 6, 6);
  // Output:
  // 1
  // hello
  // true

  const [sortedRows, setSortedRows] = useState(rows);
  const [ascOrder, setAscOrder] = useState<boolean[]>(
    Array(rows.length).fill(true)
  );
  const [lastClicked, setLastedClicked] = useState<number>();

  const sortFn = (ik: number) => {
    rows.sort((a, b) => {
      const ai = Object.values(a).map((k, i) => i === ik && k)[ik] as string;
      const bi = Object.values(b).map((k, i) => i === ik && k)[ik] as string;

      if (ai < bi) {
        return ascOrder[ik] ? -1 : 1;
      } else if (ai > bi) {
        return ascOrder[ik] ? 1 : -1;
      } else {
        return 0;
      }
    });
    setSortedRows(rows);
    setAscOrder(ascOrder.map((a, i) => (i === ik ? !a : a)));
  };

  const handleSortClick = (i: number) => {
    if (!sort) return;
    setLastedClicked(i);
    sortFn(i);
  };

  const handleCategoryChange = (name: keyof K, dataKey: keyof T) => {
    
  }

  const handleNumberChange = (minValue: number, maxValue: number, dataKey: keyof T) => {
    
  }

  return (
    <>
      {filters ? filters.forEach((f) => {
        if (f.props.type === 'category') return <CategoryFilter<K> onChange={(name: keyof K) => handleCategoryChange(name, f.dataKey)} categories={f.props.categoryEnum} />
        else if (f.props.type === 'number') return <NumberFilter onChange={(maxValue: number, minValue: number) => handleNumberChange(minValue, maxValue, f.dataKey)} start={f.props.start} end={f.props.end} />
      }) : null}
      <TableContainer>
        <Table>
          <Thead _hover={sort ? { cursor: "pointer" } : {}}>
            <Tr>
              {columns.map((c, i) => {
                return (
                  <Th onClick={() => handleSortClick(i)} key={i}>
                    {c}{" "}
                    {lastClicked === i ? (
                      ascOrder[i] ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      )
                    ) : null}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {sortedRows.map((r, i) => {
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
    </>
  );
}

export default TasksList;
