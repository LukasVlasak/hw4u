import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { BsCash } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { IoPeopleOutline } from "react-icons/io5";
import { RxDotsHorizontal } from "react-icons/rx";
import {
  SlArrowDown,
  SlArrowLeft,
  SlArrowRight,
  SlArrowUp,
} from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { Task } from "../../services/taskService";
import formatDateToDDMMYYYY from "../../utils/fc";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import authContext from "../../context/AuthContext";

const ModalTopSection = styled("div")({
  padding: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

interface ItemProps {
  heading: string;
  text?: string;
  headingPad?: boolean;
  Icon: ReactNode;
}

const Item = ({ heading, text, headingPad, Icon }: ItemProps) => {
  return (
    <Container>
      <Text
        pt={headingPad ? 3 : 0}
        fontSize={"13px"}
        fontWeight={"bold"}
        color={"#808080"}
      >
        {heading}
      </Text>
      <Flex pt={3} alignItems={"center"} flexDir={"row"}>
        {Icon}
        <Text ml={3}>{text}</Text>
      </Flex>
      <Divider pt={3} />
    </Container>
  );
};

interface Props {
  task: Task;
  nextTask: () => void;
  previousTask: () => void;
}

const TaskModalContent = ({ task, nextTask, previousTask }: Props) => {
  const sideSection = useRef<HTMLDivElement>(null);
  const sideArrow = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const { value: user } = useContext(authContext);
  const navigate = useNavigate();

  return (
    <>
      <ModalTopSection style={{ padding: "9px" }}>
        <Flex ml={3} alignItems={"center"} flexDir={"row"}>
          <Text mr={1}># Skupina</Text> <IoPeopleOutline />
        </Flex>
        <Flex alignItems={"center"} flexDir={"row"}>
          <Menu>
            <MenuButton
              w={"30px"}
              h={"30px"}
              p={"5px"}
              minW={"unset"}
              bg={"white"}
              _hover={{
                cursor: "pointer",
                bg: "#f0f0f0",
                borderRadius: "5px",
              }}
              as={IconButton}
              icon={<RxDotsHorizontal />}
            />
            <MenuList color={"black"}>
              <Link role="group" to={"/account"}>
                <MenuItem _groupHover={{ color: "brand.hoverBlueColor" }}>
                  Some action
                </MenuItem>
              </Link>
              <Link role="group" to={"/ask"}>
                <MenuItem _groupHover={{ color: "brand.hoverBlueColor" }}>
                  Some action
                </MenuItem>
              </Link>
              <Link role="group" to={"/subscripe"}>
                <MenuItem _groupHover={{ color: "brand.hoverBlueColor" }}>
                  Some action
                </MenuItem>
              </Link>
              <MenuItem _hover={{ color: "brand.hoverBlueColor" }}></MenuItem>
            </MenuList>
          </Menu>
          <Icon
            w={"30px"}
            h={"30px"}
            p={"8px"}
            as={SlArrowUp}
            _hover={{
              cursor: "pointer",
              bg: "#f0f0f0",
              borderRadius: "5px",
            }}
            mx={"8px"}
            onClick={nextTask}
          />
          <Icon
            w={"30px"}
            h={"30px"}
            p={"8px"}
            as={SlArrowDown}
            _hover={{
              cursor: "pointer",
              bg: "#f0f0f0",
              borderRadius: "5px",
            }}
            mx={"8px"}
            onClick={previousTask}
          />
          <ModalCloseButton position={"unset"} />
        </Flex>
      </ModalTopSection>
      <Divider />
      <ModalBody pt={0} pr={0} pb={0}>
        <Flex flexDir={"row"} flexGrow={1}>
          <Flex
            flexDir={"column"}
            height={"fit-content"}
            flexBasis={"75%"}
            pr={"20px"}
          >
            <ModalHeader>{task?.title}</ModalHeader>
            <Flex opacity={"1"} zIndex={"1"} ref={descRef}>
              {task?.description}
            </Flex>
            <Flex
              ref={accordionRef}
              opacity={"0"}
              flexDir={"column"}
              position={"absolute"}
              left={0}
              top={"18%"}
              minW={"90%"}
              maxW={"90%"}
            >
              <Accordion defaultIndex={[1]} allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Description
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel maxH={"448px"} overflow={"scroll"} pb={4}>
                    {task.description}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <CKEditor
                data="<br><br><br><br><br><br>"
                editor={ClassicEditor}
              />
            </Flex>
            <Flex
              position={"absolute"}
              width={"75%"}
              right={"25%"}
              bottom={"0"}
              padding={"10px"}
              bg={"white"}
              flexDir={"column"}
              zIndex={1}
            >
              <Divider mb={"15px"} />
              <Flex flexDir={"column"} alignSelf={"end"}>
                {!user ? (
                  <Text>
                    Nejdrive se prihlaste
                    <Link
                      style={{ textDecoration: "underline", color: "blue" }}
                      to="/login"
                    >
                      zde
                    </Link>
                  </Text>
                ) : null}
                <Button
                  colorScheme="blue"
                  mr={3}
                  maxWidth={'fit-content'}
                  isDisabled={user ? false : true}
                  onClick={() => navigate("/task/" + task.id)}
                >
                  Answer
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            position={"absolute"}
            bottom={10}
            opacity={"0"}
            right={10}
            ref={sideArrow}
            _hover={{
              cursor: "pointer",
              boxShadow: "rgba(0, 0, 0, 0.86) 0px 22px 70px 4px",
              bg: "transparent",
            }}
            height={"90%"}
            width={"0px"}
            alignItems={"center"}
          >
            <Icon
              w={"30px"}
              h={"30px"}
              p={"8px"}
              as={SlArrowLeft}
              _hover={{
                cursor: "pointer",
              }}
            />
          </Flex>
          <Flex
            flexDir={"column"}
            bg={"#fcfaf8"}
            padding={"15px"}
            minHeight={"79vh"}
            flexGrow={1}
            ref={sideSection}
          >
            <Item
              heading="Willing to pay"
              text={task?.willing_to_pay.toString()}
              Icon={<BsCash />}
            />
            <Item
              heading="Created date"
              text={formatDateToDDMMYYYY(task?.created_date)}
              Icon={<CiCalendar />}
              headingPad
            />
            {task?.due_date ? (
              <Item
                heading="Due date"
                text={formatDateToDDMMYYYY(task?.due_date)}
                Icon={<CiCalendar />}
                headingPad
              />
            ) : null}
            <Item
              heading="Category"
              text={task?.category}
              Icon={<BiCategory />}
              headingPad
            />
          </Flex>
        </Flex>
      </ModalBody>
    </>
  );
};

export default TaskModalContent;
