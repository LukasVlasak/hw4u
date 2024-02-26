import {
  Button,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useInfiniteTasks } from "../../hooks/useTasks";
import LoadingComponents from "./LoadingComponents";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const ServerSideFiltering = () => {
  // onsubmit - filtry, sorting...
  // zmenit queryObject => useTasks - rerender - aktualizace rows

  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [where, setWhere] = useState<string | undefined>();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    refetch
  } = useInfiniteTasks({
    pageSize: 10,
    orderBy,
    where,
  });

  const columns = data?.pages ? Object.keys(data.pages[0][0]) : [];
  
  console.log(columns);
  

  const [lastClicked, setLastedClicked] = useState<number>();
  const [ascOrder, setAscOrder] = useState<number[]>(Array(10).fill(0));

    console.log(ascOrder);
    
  const handleSortClick = (columnNumber: number) => {
    setLastedClicked(columnNumber);
    ascOrder[columnNumber] !== 0 &&
      setOrderBy(
        `ORDER BY ${columns[columnNumber]} ${
          ascOrder[columnNumber] === 1 ? "ASC" : "DESC"
        }`
      );
    setAscOrder(ascOrder.map((a, i) => (i === columnNumber ? (a + 1) % 3 : a)));
  };

  const { inView, ref } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    console.log('refetchink');
    
    refetch();
  }, [refetch, orderBy, where])
  if (isLoading) return <LoadingComponents />;

  return data ? (
    <TableContainer marginTop={"20px"}>
      <Table>
        <Thead _hover={{ cursor: "pointer" }}>
          <Tr>
            {columns.map((d, i) => {
              return (
                <Th onClick={() => handleSortClick(i)} key={i}>
                  <Flex flexDirection={"row"} alignItems={"center"}>
                    <Container marginRight={"5px"}>{d} </Container>
                    {lastClicked === i ? (
                      ascOrder[i] === 0 ? null : ascOrder[i] === 2 ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      )
                    ) : null}
                  </Flex>
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.pages.map((d) => {
            return d.map((di) => {
              return (
                <Tr key={di.id}>
                  {Object.values(di).map((v, i) => {
                    return <Td key={i}>{v}</Td>;
                  })}
                </Tr>
              );
            });
          })}
        </Tbody>
      </Table>
      <span ref={ref}>
        {hasNextPage && isFetchingNextPage ? "Loading" : ""}
      </span>
    </TableContainer>
  ) : <LoadingComponents />;
};

export default ServerSideFiltering;
