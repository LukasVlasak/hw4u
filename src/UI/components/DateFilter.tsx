import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { BsCalendarDate } from "react-icons/bs";
import { CiCircleQuestion } from "react-icons/ci";
import React from "react";

type Operator = "more than" | "less than" | "equal";

interface SingleDate {
  type: "single";
  date: Date;
  operator: Operator;
}

interface MultipleDate {
  type: "multiple";
  dates: Date[];
}

interface DateRangeToPass {
  dateFrom: Date;
  dateTo: Date;
  type: "range";
}

export interface DateToPass<T> {
  name: string;
  type: "date";
  key: keyof T;
  props: SingleDate | MultipleDate | DateRangeToPass;
}

interface Props<T> {
  setDateFilterFn: (value?: DateToPass<T>) => void;
  dataKey: keyof T;
  resetSignal?: boolean;
  name: string;
}

/* 
  <T> bcs je zde vice moznosti co to muze vracet - byla by kravina mit tu logiku toho jakej interface to vrati tady a i v datagridu - v handleDateFilterChange bych musel delat to samy to co tady abych to nastavil sparvne
**/
function DateFilter<T>({
  setDateFilterFn,
  dataKey,
  resetSignal,
  name,
}: Props<T>) {
  useEffect(() => {
    if (resetSignal) {
      setSelectedMultiple(undefined);
      setSelectedSingle(undefined);
      setSelectedRange(undefined);
    }
  }, [resetSignal]);
  const [selectedSingle, setSelectedSingle] = useState<Date>();
  const [selectedMultiple, setSelectedMultiple] = useState<Date[]>();
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [mode, setMode] = useState<"single" | "multiple" | "range">("single");
  const [operator, setOperator] = useState<Operator>("equal");

  return (
    <>
      <button onClick={onOpen}>
        <BsCalendarDate size={"22px"} />
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={"fit-content"}>
          <ModalCloseButton />
          <ModalBody py={"25px"} px={"20px"}>
            <Tabs
              defaultIndex={mode === "single" ? 0 : mode === "multiple" ? 1 : 2}
              onChange={(i) =>
                i === 0
                  ? setMode("single")
                  : i === 1
                    ? setMode("multiple")
                    : setMode("range")
              }
              variant="soft-rounded"
              colorScheme="blue"
            >
              <TabList mt={5} justifyContent={"center"}>
                <Tab>Single</Tab>
                <Tab>Multiple</Tab>
                <Tab>Range</Tab>
                <Tooltip
                  label={
                    <>
                      <p>Single - vybrat jedno datum</p>
                      <p>Multiple - vybrat více dat</p>
                      <p>Range - vybrat rozsah datumů</p>
                    </>
                  }
                  placement="right-start"
                >
                  <span>
                    <CiCircleQuestion />
                  </span>
                </Tooltip>
              </TabList>
              <TabPanels>
                <TabPanel pt={2} pb={0}>
                  <DayPicker
                    mode="single"
                    selected={selectedSingle}
                    onSelect={(date) => setSelectedSingle(date)}
                    showOutsideDays
                    // @ts-ignore
                    locale={cs}
                  />
                </TabPanel>
                <TabPanel pt={2} pb={0}>
                  <DayPicker
                    mode="multiple"
                    selected={selectedMultiple}
                    onSelect={(date) => setSelectedMultiple(date)}
                    showOutsideDays
                    // @ts-ignore
                    locale={cs}
                  />
                </TabPanel>
                <TabPanel pt={2} pb={0}>
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={(date) => setSelectedRange(date)}
                    showOutsideDays
                    // @ts-ignore
                    locale={cs}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Text fontWeight={"bold"} mb={mode === "single" ? 2 : 6} ml={10}>
              {selectedSingle && mode === "single"
                ? format(selectedSingle, "dd.MM.yyyy")
                : selectedMultiple && mode === "multiple"
                  ? "Vybráno " + selectedMultiple.length + " datumy"
                  : selectedRange &&
                      selectedRange.from &&
                      selectedRange.to &&
                      mode === "range"
                    ? format(selectedRange.from, "dd.MM.yyyy") +
                      "-" +
                      format(selectedRange.to, "dd.MM.yyyy")
                    : "Datum nevybráno"}
            </Text>
            {mode === "single" ? (
              <RadioGroup
                mb={6}
                display={"flex"}
                justifyContent={"center"}
                onChange={(val) => setOperator(val as Operator)}
                value={operator}
              >
                <Stack direction="row">
                  <Radio value="equal">stejné</Radio>
                  <Radio value="more than">větší než</Radio>
                  <Radio value="less than">menší než</Radio>
                  <Tooltip
                    label={
                      <>
                        <p>stejné - data se mají vybranému datu rovnat</p>
                        <p>větší než - data mají být větší než vybrané datum</p>
                        <p>menší než - data mají být menší než vybrané datum</p>
                      </>
                    }
                    placement="right-start"
                  >
                    <span>
                      <CiCircleQuestion />
                    </span>
                  </Tooltip>
                </Stack>
              </RadioGroup>
            ) : null}

            <Flex flexDir={"row"} justifyContent={"flex-end"}>
              <Button
                onClick={() => {
                  setSelectedMultiple(undefined);
                  setSelectedSingle(undefined);
                  setSelectedRange(undefined);
                  setDateFilterFn(undefined);
                  onClose();
                }}
                variant="outline"
                mr={3}
              >
                Reset
              </Button>
              {mode === "single" ? (
                <Button
                  mr={3}
                  onClick={() => setSelectedSingle(new Date())}
                  variant="outline"
                >
                  Dnes
                </Button>
              ) : null}
              <Button
                mr={"35px"}
                colorScheme="blue"
                onClick={() => {
                  if (mode === "single" && selectedSingle) {
                    // aby byl aktivni jen ten co je vybrany
                    setSelectedRange(undefined);
                    setSelectedMultiple(undefined);
                    setDateFilterFn({
                      props: {
                        date: selectedSingle,
                        operator: operator,
                        type: "single",
                      },
                      name: name,
                      type: "date",
                      key: dataKey,
                    });
                  } else if (mode === "multiple" && selectedMultiple) {
                    setSelectedSingle(undefined);
                    setSelectedRange(undefined);
                    setDateFilterFn({
                      type: "date",
                      key: dataKey,
                      name: name,
                      props: { type: "multiple", dates: selectedMultiple },
                    });
                  } else if (
                    mode === "range" &&
                    selectedRange &&
                    selectedRange.from &&
                    selectedRange.to
                  ) {
                    setSelectedSingle(undefined);
                    setSelectedMultiple(undefined);
                    setDateFilterFn({
                      props: {
                        dateFrom: selectedRange.from,
                        dateTo: selectedRange.to,
                        type: "range",
                      },
                      name: name,
                      type: "date",
                      key: dataKey,
                    });
                  }
                  onClose();
                }}
              >
                Ok
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DateFilter;
