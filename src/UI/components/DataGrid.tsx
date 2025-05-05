// type Partial<T> = { [P in keyof T]?: T[P] | undefined; } - zajimava implementace - mozna by vyresila zapaseni s TuppleMember
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import React, { ReactNode, useReducer, useRef } from "react";
import { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import LoadingComponents from "./LoadingComponents";

import { BiHide } from "react-icons/bi";
import { FaArrowLeft, FaPlus, FaArrowRight } from "react-icons/fa6";
import { FaArrowDown, FaArrowUp, FaCheck, FaCheckCircle } from "react-icons/fa";
import { MdEdit, MdDelete, MdCancel } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSaveDown1 } from "react-icons/ci";
import { IconType } from "react-icons";
import CategoryFilter from "./CategoryFilter";
import NumberFilter from "./NumberFilter";
import CheckboxWithIndeterminate from "./CheckboxWithIndeterminate";
import DateFilter, { DateToPass } from "./DateFilter";
import MultiSelectMenu from "./Multiselect";
import { useToast } from "@chakra-ui/react";
import FilterTags from "./FilterTags";
import ActiveFiltersReducer from "../../reducers/ActiveFiltersReducer";
import PaginationButtons from "./PaginationButtons";

const intersectionById = (...arrays: Array<any>) => {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, curr) =>
    acc.filter((item: any) =>
      curr.some((el: any) => el.id === item.id)
    )
  );
};


function formatDateToDDMMYYYY(date: Date | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  let day = "" + d.getDate();
  let month = "" + (d.getMonth() + 1);
  const year = d.getFullYear();

  if (day.length < 2) {
    day = "0" + day;
  }
  if (month.length < 2) {
    month = "0" + month;
  }

  return day + "." + month + "." + year;
}

function compareDates(
  sdate1: Date,
  sdate2: Date,
  operator: "equal" | "less than" | "more than"
): boolean {
  const date1 = new Date(sdate1);
  const date2 = new Date(sdate2);

  if (operator === "equal") {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  } else if (operator === "less than") {
    return date1 <= date2;
  } else {
    return date1 >= date2;
  }
}

interface HighlightCol<T> {
  key: keyof T;
  equalTo: any;
  backgroundColor: string;
  hoverBackgroundColor: string;
  // for banners - is_active = true; due_date > new Date() - TODO: predelat
  secondKey?: keyof T;
}

type ColumnConfig<T> = (WithFilter | WithoutFilter) & {
  key: keyof T;
  label: string;
  isVisible: boolean;
  type?: "boolean" | "date" | "color" | "booleanPretty";
  filter?: boolean;
  props?: Filter;
};

// pri zakladani statu pridavam property soring kvuli sortovani, tak toto je aby byl spravne type toho statu - renderedCols
type ColumnConfigRunTime<T> = ColumnConfig<T> & { sorting: number };

type ColumnConfigWithoutProps<T> = Omit<ColumnConfig<T>, "props"> & {
  sorting: number;
};

interface ColumnSwitchingDb<T> {
  /**
   * without props and with sorting
   */
  config?: ColumnConfigWithoutProps<T>[];
  onUpdate: (config: string) => void;
  /**
   * is update pending
   */
  isPending: boolean;
}

type ColumnSwitching<T> = "localStorageById" | ColumnSwitchingDb<T>;

type WithFilter = {
  filter: true;
  props: Filter;
};

type WithoutFilter = {
  filter?: false;
};

interface NumberFilterInterface {
  type: "number";
}

interface CategoryFilterState<T> {
  type: "category";
  name: string;
  key: keyof T;
  values: string[];
}

interface NumberFilterState<T> {
  type: "number";
  name: string;
  key: keyof T;
  min: number;
  max: number;
}

interface BooleanFilterState<T> {
  type: "boolean";
  name: string;
  key: keyof T;
  state: boolean | undefined;
}

type DateFilterState<T> = DateToPass<T>;

// sometimes i need to filter something that is not keyof T, so i create seperate filter, but i need it in activeFilters
// because FilterTags are from activeFilters
type FilterHelper<T> = {
  key: keyof T;
  name: string;
  type: "none";
};

export type ActiveFilters<T> =
  | NumberFilterState<T>
  | CategoryFilterState<T>
  | BooleanFilterState<T>
  | DateFilterState<T>
  | FilterHelper<T>;

//type TupleMember<T extends any[]> = T[number]; az to pochopim tak jdem slavit

interface CategoryFilterInterface {
  type: "category";
  categories: string[];
}

interface DateFilterInterface {
  type: "date";
}

interface BooleanFilterInterface {
  type: "boolean";
}

type Filter =
  | CategoryFilterInterface
  | NumberFilterInterface
  | DateFilterInterface
  | BooleanFilterInterface;

interface Pagination {
  defaultPageSize: number;
  pageSizesToChoose: number[];
}

// {"full_name": "cele jmeno"} - kvuli zobrazovani pro usera
export type SearchMapping<T> = {
  [K in keyof Partial<T>]: string;
};

interface Props<T> {
  onRowClick?: (id: number) => void;
  columns: ColumnConfig<T>[];
  /**
   * from local storage = "localStorageById"
   * from db - needed config
   */
  columnSwitching?: ColumnSwitching<T>;
  rows: T[];
  sort?: boolean;
  /**
   * {"full_name": "cele jmeno"} - kvuli zobrazovani pro usera
   */
  search?: SearchMapping<T>;
  pagination?: Pagination;
  /**
   * search select = default values to be selected in search select - povoleno pouze to co je v search - spelling stejnej - nedavat jine nebo se to rozbije
   */
  searchSelect?: string[];
  onDelete?: (rowId: number) => void;
  /**
   * @default MdDelete
   */
  OnDeleteIcon?: IconType;
  onEdit?: (rowId: number) => void;
  heading?: string;
  id: string;
  onAdd?: () => void;
  onDeleteAll?: () => void;
  /**
   * pouzivano u objednavek - vyridit objednavku
   * @param rowId
   * @returns
   */
  onTransmit?: (rowId: number) => void;
  /**
   * pouzivam u objednavek - zruseni objednavky
   * @param rowId
   * @returns
   */
  onCancel?: (rowId: number) => void;
  /**
   * if highlightCol.key === highlightCol.equalTo set bg color of row to highlightCol.backroundColor and _hover bg to highlightCol hoverBackgroundColor
   * 
   * EXAMPLE
   * 
   * highlightCol={[
      {
        key: "editted_by_admin",
        equalTo: true,
        backgroundColor: "#feebc8",
        hoverBackgroundColor: "#fae3b9",
      },
      {
        key: "return_money",
        equalTo: true,
        backgroundColor: "#ffc1c1",
        hoverBackgroundColor: "#ff9e9e",
      },
    ]}
   */
  highlightCol?: HighlightCol<T>[];
  /**
   * legenda k highlightCol barvam
   * 
   * EXAMPLE 
   * <Flex flexDir={"column"}>
      <Flex mb={2} flexDir={"row"}>
        <Flex
          width={"20px"}
          height={"20px"}
          backgroundColor={"#feebc8"}
          mr={2}
          alignItems={"center"}
        ></Flex>
        Produkty objednávky upraveny adminem
      </Flex>
      <Flex flexDir={"row"}>
        <Flex
          width={"20px"}
          height={"20px"}
          backgroundColor={"#ffc1c1"}
          mr={2}
          alignItems={"center"}
        ></Flex>
        Potřeba vrátit peníze
      </Flex>
    </Flex>
   */
  caption?: ReactNode;
}

/**
 *
 * @param id - unikatni mezi datagridy v aplikaci - pouziva se k ukladani columnsConfig do localStorage
 * @returns
 */
function DataGrid<T extends { id: number }>({
  onRowClick,
  columns,
  rows,
  sort,
  search,
  pagination,
  searchSelect,
  heading,
  onDelete,
  onEdit,
  id,
  columnSwitching,
  onAdd,
  onDeleteAll,
  onTransmit,
  highlightCol,
  caption,
  onCancel,
  OnDeleteIcon
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination && pagination.defaultPageSize);

  const toast = useToast();
  // radky, ktere se vykresluji
  const [renderedRows, setRenderedRows] = useState(rows);

  const storedConfig = useRef<string>(localStorage.getItem(id + "-columns-config"));

  /*
   * - const defualtConfig = columns.map((c) => ({ sorting: 0, ...c }))
   * - sloupce, ktere se vykresluji pri columnSwitching - add sorting - 0 - bez razeni, 1 - ASC, 2 - DESC, je dano tady, a ne v seperate statu, protoze mi to poradil muj nejlepsi pritel chatGPT
   * - tato silena podminka rika: - columnsswitching muze byt bud predem preddefinovane (z db) pokud tam neco je, tak se to nacte rovnou z toho]
   *                                zaroven po updatu se neuklada do localstorage ale vola se onUpdate v columnsswitching
   *                              - pokud tam nic neni, tak se snazi nacist z localstorage, ale furt se to uklada pomoci onUpdate
   *                              - pokud neni ani nic v localstorage tak default
   *                              - pokud je columnconfig === "localStorageById" tak se vezme z localstorage a UKLADA se do localstorage
   */
  const [renderedCols, setRenderedCols] = useState(
    columnSwitching
      ? columnSwitching !== "localStorageById" &&
        columnSwitching.config &&
        columnSwitching.config.length === columns.length
        ? (columnSwitching.config.map((s) => {
            return {
              ...s,
              props: columns.find((c) => c.key === s.key)?.props,
            };
          }) as unknown as ColumnConfigRunTime<T>[])
        : storedConfig.current !== null &&
            JSON.parse(storedConfig.current).length === columns.length
          ? // restore just its position, filter props take from default config - kdyz nekdo ulozi filtry a pote prida kateogrii, localStorage filter props se neupdatnou, takze tam tu novou kategorii neuvidi
            (JSON.parse(storedConfig.current).map((s: ColumnConfigRunTime<T>) => {
              return {
                ...s,
                props: columns.find((c) => c.key === s.key)?.props,
              };
            }) as unknown as ColumnConfigRunTime<T>[])
          : columns.map((c) => ({ sorting: 0, ...c }))
      : columns.map((c) => ({ sorting: 0, ...c }))
  );

  // searching
  const [filteredBySearch, setFilteredBySearch] = useState<T[]>();

  // reset signal for resetting local state in each filter
  const [resetSignal, setResetSignal] = useState<keyof T | "all">();

  // setResetSignal to undefined after every change, because local filter state updates only on signal change - 2 times delete same filter - signal wont change
  useEffect(() => {
    if (resetSignal) {
      setResetSignal(undefined);
    }
  }, [resetSignal]);

  // active filters
  // jeden element - reprezentuje jeden konkretni filter - bude jich vic, bude vic elemetu v poli
  const [activeFilters, dispatch] = useReducer(ActiveFiltersReducer<T>, undefined);
  // rows filtered by activeFilters
  const [activeFiltersRows, setActiveFiltersRows] = useState<T[]>();

  // cols change
  const handleColsChange = (selectedCols: string[]) => {
    setRenderedCols(
      renderedCols.map((r) =>
        selectedCols.includes(r.label) ? { ...r, isVisible: true } : { ...r, isVisible: false }
      )
    );
  };

  // save columns config to local storage
  const handleColsConfigSave = () => {
    if (columnSwitching) {
      if (columnSwitching === "localStorageById") {
        localStorage.setItem(
          id + "-columns-config",
          JSON.stringify(renderedCols.map(({ props, ...rest }) => rest))
        );
        toast({title: "Úspěšné uložení konfigurace sloupců", status: "success"});
      } else {
        columnSwitching.onUpdate(JSON.stringify(renderedCols.map(({ props, ...rest }) => rest)));
      }
    }
  };

  // preskakuji se sloupce s isVisible false
  const specialMoveCol = (direction: "right" | "left", index: number) => {
    let moveTo: number | undefined;
    let i = 1;

    if (direction === "right") {
      while (moveTo === undefined && index + i <= renderedCols.length - 1) {
        if (renderedCols[index + i].isVisible) {
          moveTo = index + i;
        } else {
          i++;
        }
      }
    } else {
      while (moveTo === undefined && index - i >= 0) {
        if (renderedCols[index - i].isVisible) {
          moveTo = index - i;
        } else {
          i++;
        }
      }
    }

    if (moveTo === undefined) {
      return renderedCols;
    }

    const newCols = [...renderedCols];
    [newCols[index], newCols[moveTo]] = [newCols[moveTo], newCols[index]];

    return newCols;
  };

  // NAHRAZENO REDUCEREM
  // // DELETE FILTER METHOD
  // const deleteActiveFilter = (dataKey: keyof T) => {
  //   const arrayToBeSet = activeFilters?.filter((b) => b.key !== dataKey);
  //   // zkontrolovat jestli tam neco zustalo
  //   if (arrayToBeSet && arrayToBeSet.length > 0) {
  //     setActiveFilters(arrayToBeSet);
  //     // smazat cely
  //   } else {
  //     setActiveFilters(undefined);
  //     setActiveFiltersRows(undefined);
  //   }
  // };

  // // IF USER CHANGE SOME STATE OF FILTER
  // const handleActiveFiltersChange = (
  //   toDelete: boolean,
  //   changedFilter: ActiveFilters<T>
  // ) => {
  //   if (!toDelete) {
  //     // pridavam
  //     if (activeFilters) {
  //       if (!activeFilters.some((obj) => obj.key === changedFilter.key)) {
  //         // nenahrazuji, pridavam
  //         setActiveFilters([...activeFilters, changedFilter]);
  //       } else {
  //         // nahrazuji
  //         setActiveFilters(
  //           activeFilters.map((f) => {
  //             if (f.key === changedFilter.key) {
  //               return changedFilter;
  //             }
  //             return f;
  //           })
  //         );
  //       }
  //     } else {
  //       // prvni filtr
  //       setActiveFilters([changedFilter]);
  //     }
  //   } else {
  //     // odebiram
  //     deleteActiveFilter(changedFilter.key);
  //   }
  // };

  // AFTER activeFilters are setted - set activeFiltersRow
  useEffect(() => {
    if (activeFilters) {
      const arrayOfFilteredData = activeFilters.map((f) => {
        if (f.type === "category") {
          return rows.filter((r) => f.values.includes(r[f.key] as string));
        } else if (f.type === "number") {
          return rows.filter((r) => (r[f.key] as number) >= f.min && (r[f.key] as number) <= f.max);
        } else if (f.type === "boolean") {
          // nemelo by se stat ze state je undefined
          return rows.filter((r) => r[f.key as keyof T] === f.state);
          // f.type === "date"
        } else if (f.type === "date") {
          // rows.filter na zacatku kvuli typecsriptu
          return rows.filter((r) => {
            if (f.props.type === "single") {
              if (f.props.operator === "equal") {
                return compareDates(r[f.key] as Date, f.props.date, f.props.operator);
              } else if (f.props.operator === "less than") {
                return compareDates(r[f.key] as Date, f.props.date, f.props.operator);
              } else {
                return compareDates(r[f.key] as Date, f.props.date, f.props.operator);
              }
            } else if (f.props.type === "multiple") {
              return f.props.dates.some((d) => compareDates(r[f.key] as Date, d, "equal"));
            } else {
              return (
                compareDates(r[f.key] as Date, f.props.dateFrom, "more than") &&
                compareDates(r[f.key] as Date, f.props.dateTo, "less than")
              );
            }
          });
        } else if (f.type === "none") {
          return rows;
        }
      });      
      setActiveFiltersRows(intersectionById(...arrayOfFilteredData));
    } else {
      setActiveFiltersRows(undefined);
    }
  }, [activeFilters]);

  /**
   *
   * @param dataKey key sloupce, ktery je sortovan
   * @param forSorting pole ktere je sortovano
   * @param sortOrder 0 - bez razeni, vrati puvodni pole, 1 - asc order, 2 - desc order
   * @returns serazene nebo stejne pole
   */
  const sortFn = (dataKey: keyof T, forSorting: T[], sortOrder: number): T[] => {
    if (sortOrder === 0) {
      return forSorting;
    }
    forSorting.sort((a, b) => {
      const ai = a[dataKey];
      const bi = b[dataKey];

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

  const handleSortClick = (dataKey: keyof T) => {
    if (!sort) return;
    const newSorting = (renderedCols.find((c) => c.key === dataKey)!.sorting + 1) % 3;
    setRenderedRows(sortFn(dataKey, renderedRows, newSorting));
    // u vsech ostatnich nastavit sorting na null, aby se vedelo na co se kliklo posledni a dava to tak vetsi smysl
    setRenderedCols(
      renderedCols.map((c) =>
        c.key === dataKey ? { ...c, sorting: newSorting } : { ...c, sorting: 0 }
      )
    );
  };

  const renderFilters = () => {
    return (
      <Tr>
        {renderedCols
          .filter((r) => r.isVisible)
          .map((c) => {
            if (c.filter && c.props) {
              if (c.props.type === "category") {
                return (
                  <Td key={c.key as string}>
                    <CategoryFilter
                      resetSignal={c.key === resetSignal || resetSignal === "all"}
                      categories={c.props.categories}
                      name={c.label}
                      setCategoryFiltered={(category) => {
                        if (category.length > 0) {
                          dispatch({
                            type: "ADD",
                            payload: {
                              newFilter: {
                                key: c.key,
                                type: "category",
                                values: category,
                                name: c.label,
                              },
                            },
                          });
                        } else {
                          dispatch({
                            type: "REMOVE",
                            payload: { dataKey: c.key },
                          });
                        }
                      }}
                    />
                  </Td>
                );
              } else if (c.props.type === "number") {
                return (
                  <Td key={c.key as string}>
                    <NumberFilter
                      resetSignal={c.key === resetSignal || resetSignal === "all"}
                      name={c.label}
                      start={Math.min(...rows.map((r) => r[c.key] as number))}
                      end={Math.max(...rows.map((r) => r[c.key] as number))}
                      setNumberFilteredFn={(minMax) => {
                        if (!minMax) {
                          dispatch({
                            type: "REMOVE",
                            payload: { dataKey: c.key },
                          });
                        } else {
                          dispatch({
                            type: "ADD",
                            payload: {
                              newFilter: {
                                key: c.key,
                                type: "number",
                                min: minMax[0],
                                max: minMax[1],
                                name: c.label,
                              },
                            },
                          });
                        }
                      }}
                    />
                  </Td>
                );
              } else if (c.props.type === "boolean") {
                return (
                  <Td key={c.key as string}>
                    {/* {f.name} */}
                    <CheckboxWithIndeterminate
                      resetSignal={c.key === resetSignal || resetSignal === "all"}
                      name={c.label}
                      onChange={(state) => {
                        if (state === undefined) {
                          dispatch({
                            type: "REMOVE",
                            payload: { dataKey: c.key },
                          });
                        } else {
                          dispatch({
                            type: "ADD",
                            payload: {
                              newFilter: {
                                key: c.key,
                                type: "boolean",
                                state: state,
                                name: c.label,
                              },
                            },
                          });
                        }
                      }}
                    />
                  </Td>
                );
              } else if (c.props.type === "date") {
                return (
                  <Td key={c.key as string}>
                    {/* <span>{f.name}</span> */}
                    <DateFilter
                      resetSignal={c.key === resetSignal || resetSignal === "all"}
                      name={c.label}
                      dataKey={c.key}
                      setDateFilterFn={(dateToPass) => {
                        if (!dateToPass) {
                          dispatch({
                            type: "REMOVE",
                            payload: { dataKey: c.key },
                          });
                        } else {
                          dispatch({
                            type: "ADD",
                            payload: {
                              newFilter: dateToPass,
                            },
                          });
                        }
                      }}
                    />
                  </Td>
                );
              }
            } else {
              return <Td key={c.key as string}></Td>;
            }
          })}
      </Tr>
    );
  };

  const renderTHead = () => {
    return (
      <>
        {renderedCols
          .filter((r) => r.isVisible)
          .map((c) => {
            return (
              <Th key={c.key as string}>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  <div style={{ maxWidth: "fit-content" }}>
                    <Flex
                      role="group"
                      onClick={() => handleSortClick(c.key)}
                      flexDirection={"row"}
                      alignItems={"center"}
                    >
                      <Text
                        whiteSpace={"nowrap"}
                        minWidth={"fit-content"}
                        marginRight={"3px"}
                        marginBottom={0}
                      >
                        {c.label}
                      </Text>
                      {sort ? (
                        c.sorting === 0 ? null : c.sorting === 2 ? (
                          <span>
                            <FaArrowUp />
                          </span>
                        ) : (
                          <span>
                            <FaArrowDown />
                          </span>
                        )
                      ) : null}
                      {sort ? (
                        !c.sorting || c.sorting === 0 ? (
                          <Box
                            opacity={"0.3"}
                            _groupHover={{
                              opacity: "0.6",
                            }}
                          >
                            <FaArrowDown />
                          </Box>
                        ) : null
                      ) : null}
                    </Flex>
                  </div>
                  {columnSwitching ? (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<BsThreeDotsVertical />}
                        height={7}
                        aria-label="Columns option"
                        width={7}
                        minWidth={"unset"}
                        borderRadius="full"
                        marginLeft={3}
                        backgroundColor={"transparent"}
                        _hover={{
                          backgroundColor: "gray.200",
                        }}
                      />
                      <MenuList fontSize={"medium"}>
                        <MenuItem
                          py={3}
                          icon={<BiHide />}
                          onClick={() => {
                            setRenderedCols(
                              renderedCols.map((r) =>
                                r.key === c.key ? { ...r, isVisible: false } : r
                              )
                            );
                          }}
                        >
                          Schovat sloupec
                        </MenuItem>
                        <MenuItem
                          py={3}
                          icon={<FaArrowLeft />}
                          onClick={() => {
                            setRenderedCols(
                              specialMoveCol(
                                "left",
                                renderedCols.findIndex((r) => r.key === c.key)
                              )
                            );
                          }}
                        >
                          Přesunout sloupec doleva
                        </MenuItem>
                        <MenuItem
                          py={3}
                          icon={<FaArrowRight />}
                          onClick={() => {
                            setRenderedCols(
                              specialMoveCol(
                                "right",
                                renderedCols.findIndex((r) => r.key === c.key)
                              )
                            );
                          }}
                        >
                          Přesunout sloupec doprava
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : null}
                </Flex>
              </Th>
            );
          })}
        {onCancel ? <Th>Zrušit</Th> : null}
        {onTransmit ? <Th>Vyřídit</Th> : null}
        {onEdit ? <Th>Editace</Th> : null}
        {onDelete ? <Th>Mazání</Th> : null}
      </>
    );
  };

  const renderTBody = (rows: T[]) => {
    return rows.map((r) => {
      let bg = undefined;
      let hoverBg = undefined;
      if (highlightCol) {
        for (const highlightColObj of highlightCol) {
          if (r[highlightColObj["key"]] === highlightColObj.equalTo) {
            if (highlightColObj.secondKey) {
              if (compareDates(r[highlightColObj.secondKey] as Date, new Date(), "more than")) {
                bg = highlightColObj.backgroundColor;
                hoverBg = highlightColObj.hoverBackgroundColor;
                break;
              }
            } else {
              bg = highlightColObj.backgroundColor;
              hoverBg = highlightColObj.hoverBackgroundColor;
              break;
            }
          }
        }
      }

      return (
        <Tr
          backgroundColor={bg}
          _hover={
            onRowClick
              ? {
                  backgroundColor: hoverBg ? hoverBg : "grey.200",
                  cursor: "pointer",
                }
              : {}
          }
          onClick={onRowClick ? () => onRowClick(r.id) : undefined}
          key={r.id}
        >
          {renderedCols
            .filter((r) => r.isVisible)
            .map((c) => {
              let value = null;
              if (c.type) {
                if (c.type === "date") {
                  value = formatDateToDDMMYYYY(r[c.key] as Date);
                  if (value === "") {
                    value = null;
                  }
                } else if (c.type === "boolean") {
                  if (r[c.key] === true) {
                    value = "ano";
                  } else {
                    value = "ne";
                  }
                } else if (c.type === "booleanPretty") {
                  if (r[c.key] === true) {
                    value = <FaCheckCircle color="green" fontSize={"20px"} />;
                  } else {
                    value = <MdCancel color="red" fontSize={"22px"} />;
                  }
                } else if (c.type === "color") {
                  value = (
                    <Container
                      display={"inline-block"}
                      border={"1px solid black"}
                      width={"30px"}
                      height={"30px"}
                      backgroundColor={r[c.key] as string}
                    ></Container>
                  );
                }
              } else {
                value = r[c.key] as string;
              }
              return <Td key={c.key as string}>{value !== null ? value : "-"}</Td>;
            })}
          {onCancel ? (
            <Td>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(r.id);
                }}
                aria-label="Cancel order"
                colorScheme="red"
                icon={<MdCancel />}
              />
            </Td>
          ) : null}
          {onTransmit ? (
            <Td>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onTransmit(r.id);
                }}
                aria-label="Transmit row"
                colorScheme="green"
                icon={<FaCheck />}
              />
            </Td>
          ) : null}
          {onEdit ? (
            <Td>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(r.id);
                }}
                aria-label="Edit row"
                colorScheme="blue"
                icon={<MdEdit />}
              />
            </Td>
          ) : null}
          {onDelete ? (
            <Td>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(r.id);
                }}
                aria-label="Delete row"
                colorScheme="red"
                icon={OnDeleteIcon ? <OnDeleteIcon /> : <MdDelete />}
              />
            </Td>
          ) : null}
        </Tr>
      );
    });
  };

  useEffect(() => {
    // filtrovani - zfiltrovat podle vsech aktivnich filtru
    let rRows = intersectionById(filteredBySearch || rows, activeFiltersRows || rows);    

    // sortovani po filtrovani
    const col = renderedCols.find((c) => c.sorting !== 0);
    if (col) {
      rRows = sortFn(col.key, rRows, col.sorting);
    }

    // zbytecny rerender
    setRenderedRows(rRows);

    // chci aby se toto vykonalo pouze po filtrovani
    // eslint-disable-next-line
  }, [rows, filteredBySearch, activeFiltersRows]);

  // pokud je nastavena pagination napr na 5 na stranku - uzivatel dojede na tu posledni a nastavi na 20 na stranku - osetreni aby se nestavali chyby
  useEffect(() => {
    if (pagination && pageSize) {
      const totalRows = renderedRows.length;
      const totalPages = Math.ceil(totalRows / pageSize);

      if (page > totalPages) {
        if (totalPages === 0) {
          setPage(1);
        } else {
          setPage(totalPages);
        }
      }
    }
  }, [renderedRows, pageSize, page, pagination]);

  return (
    <Container margin={0} padding={{ base: "10px", "2sm": "50px" }} minWidth={"100%"}>
      <Flex flexDir={"row"} justifyContent={"space-between"}>
        {heading && (
          <Heading size={"md"} pb={5}>
            {heading}
          </Heading>
        )}
        {onAdd && (
          <Button
            onClick={onAdd}
            colorScheme="blue"
            as={IconButton}
            aria-label="Add button"
            icon={<FaPlus />}
            fontSize={"17px"}
            px={3}
          ></Button>
        )}
        {onDeleteAll && (
          <Button
            onClick={onDeleteAll}
            colorScheme="red"
            as={IconButton}
            aria-label="Delete all button"
            icon={<MdDelete />}
            fontSize={"17px"}
            px={3}
          ></Button>
        )}
      </Flex>

      <Flex
        backgroundColor={"white"}
        flexDirection={"column"}
        borderWidth={"1px"}
        borderColor={"grey.200"}
        padding={"20px"}
        borderRadius={"10px"}
      >
        {caption && (
          <Box mb={4} fontSize={"13px"}>
            {caption}
          </Box>
        )}
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
              defaultSelected={searchSelect}
              searchInValues={search}
              onSearch={setFilteredBySearch}
            />
          ) : null}
          {/* column adding/removing */}
          {columnSwitching && (
            <Flex alignItems={"center"}>
              <MultiSelectMenu
                preSelectedOptions={columns.filter((c) => c.isVisible).map((col) => col.label)}
                selectOptions={renderedCols.filter((r) => r.isVisible).map((r) => r.label)}
                label="Sloupce"
                options={columns.map((c) => c.label)}
                onChange={handleColsChange}
              />
              <Button
                ml={3}
                as={IconButton}
                aria-label="Columns config save button"
                fontSize={"22px"}
                icon={
                  columnSwitching !== "localStorageById" ? (
                    columnSwitching.isPending ? (
                      <Spinner />
                    ) : (
                      <CiSaveDown1 />
                    )
                  ) : (
                    <CiSaveDown1 />
                  )
                }
                disabled={
                  columnSwitching !== "localStorageById"
                    ? columnSwitching.isPending
                      ? false
                      : false
                    : false
                }
                title="Uložit nastavení sloupců"
                isLoading={true}
                onClick={handleColsConfigSave}
              ></Button>
            </Flex>
          )}
        </Flex>
        <Flex flexDir={"row"}>
          <FilterTags
            activeFilters={activeFilters}
            onClose={(key) => {
              setResetSignal(key);
              dispatch({ type: "REMOVE", payload: { dataKey: key } });
            }}
            onCloseAll={() => {
              dispatch({ type: "REMOVEALL" });
              setActiveFiltersRows(undefined);
              setResetSignal("all");
            }}
          />
        </Flex>
        {renderedRows ? (
          <TableContainer>
            <Table>
              <Thead backgroundColor={"grey.200"} _hover={sort ? { cursor: "pointer" } : {}}>
                {/* zde bcs u th to nefunguje */}
                <Tr>{renderTHead()}</Tr>
              </Thead>

              <Tbody>
                {renderFilters()}
                {renderedRows.length > 0 ? (
                  pagination && pageSize ? (
                    renderTBody(renderedRows.slice((page - 1) * pageSize, page * pageSize))
                  ) : (
                    renderTBody(renderedRows)
                  )
                ) : (
                  <tr>
                    <td
                      style={{ paddingBottom: "30px", paddingTop: "30px" }}
                      colSpan={renderedCols.length}
                    >
                      Žádný výsledek
                    </td>
                  </tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <LoadingComponents />
        )}
        {/* pagination */}
        {pagination && pageSize ? (
          <PaginationButtons
            pageSize={pageSize}
            pageSizesToChoose={pagination.pageSizesToChoose}
            setPage={setPage}
            setPageSize={setPageSize}
            dataLength={renderedRows.length}
            page={page}
          />
        ) : null}
      </Flex>
    </Container>
  );
}

export default DataGrid;
