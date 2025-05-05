"use client";

import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import Headroom from "react-headroom";
import { useTranslation } from "react-i18next";
import { FaChevronRight, FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniChevronDown } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth, { useLogout } from "../../../hooks/useAuth";
import useNavigateWithToast from "../../../hooks/useNavigateWithToast";
import LngSwitcher from "./LngSwitcher";

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  index?: number;
}

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();
  const navigateWithToast = useNavigateWithToast();
  const { t } = useTranslation();

  const { data: user } = useAuth();
  const { mutate } = useLogout(() => {
    // callback
    navigateWithToast("/", {
      status: "success",
      duration: 5000,
      isClosable: true,
      title: t("auth.successSignOut"),
      description: t("auth.successSignOutDesc"),
    });
  });

  const handleSignOut = () => {
    mutate();
  };

  const NAV_ITEMS: Array<NavItem> = [
    {
      label: t("nav.questions"),
      children: [
        {
          label: t("nav.answerAQuestion"),
          subLabel: t("nav.answerAQuestionDesc"),
          href: "/tasks",
        },
        {
          label: t("nav.archivOfQuestions"),
          subLabel: t("nav.archivOfQuestionsDesc"),
          href: "/tasks_archive",
        },
        {
          label: t("nav.inviteAFriend"),
          subLabel: t("nav.inviteAFriendDesc"),
          href: "/invite",
        },
      ],
    },
    {
      label: t("nav.findHelp"),
      children: [
        {
          label: t("nav.setATask"),
          subLabel: t("nav.setATaskDesc"),
          href: "/create-task",
        },
        {
          label: t("nav.answeredQuestions"),
          subLabel: t("nav.answeredQuestionsDesc"),
          href: "/asnwered-questions",
        },
        {
          label: t("nav.users"),
          subLabel: t("nav.usersDesc"),
          href: "/users",
        },
      ],
    },
    {
      label: t("nav.pricingHowItWorks"),
      href: "/pricing",
    },
    {
      label: t("nav.supportFAQ"),
      href: "/faq",
    },
  ];
  
  const NAV_ITEMS_MOBILE: Array<NavItem> = [
    {
      label: t("nav.home"),
      href: "/",
    },
    {
      label: t("nav.answerAQuestion"),
      children: [
        {
          label: t("nav.answerAQuestion"),
          subLabel: t("nav.answerAQuestionDesc"),
          href: "/tasks",
        },
        {
          label: t("nav.inviteAFriend"),
          subLabel: t("nav.inviteAFriendDesc"),
          href: "/invite",
        },
      ],
    },
    {
      label: t("nav.findHelp"),
      children: [
        {
          label: t("nav.setATask"),
          subLabel: t("nav.setATaskDesc"),
          href: "/createTask",
        },
        {
          label: t("nav.answeredQuestions"),
          subLabel: t("nav.answeredQuestionsDesc"),
          href: "/answeredQuestions",
        },
        {
          label: t("nav.users"),
          subLabel: t("nav.usersDesc"),
          href: "/users",
        },
      ],
    },
    {
      label: t("nav.pricingHowItWorks"),
      href: "/pricing",
    },
    {
      label: t("nav.supportFAQ"),
      href: "/faq",
    },
  ];
  

  return (
    <Headroom pinStart={60}>
      {" "}
      {/* pro zobrazeni headru pri scroll up - knihovna */}
      <Box>
        <Flex
          backgroundColor={"brand.bgColor"}
          color={"white"}
          minH={"60px"}
          borderBottomWidth={{ base: "1px", md: "0px" }}
          borderBottomColor={{ base: "grey.100", md: "none" }}
          alignItems={"center"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={"center"}
          display={"flex"}
          justifyContent={"space-around"}
        >
          <Flex display={{ base: "none", md: "flex" }}>
            <Link to={"/"}>
              <img
                alt="company logo"
                src="/logo.png"
                width={135}
                className="pt-2"
                height={45}
              />
            </Link>
          </Flex>
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
            justifyContent={"space-between"}
          >
            <IconButton
              onClick={onToggle}
              _hover={{ bg: "transparent" }}
              icon={
                isOpen ? (
                  <IoMdClose style={{ color: "white", fontSize: "25px" }} />
                ) : (
                  <GiHamburgerMenu
                    style={{ color: "white", fontSize: "25px" }}
                  />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "center" }}>
            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav NAV_ITEMS={NAV_ITEMS}  />
            </Flex>
          </Flex>

          {!user ? (
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={"flex-end"}
              direction={"row"}
              spacing={6}
              alignItems={"center"}
            >
              <LngSwitcher />
              <Button
                fontSize={"md"}
                fontWeight={400}
                variant={"link"}
                color={"grey.200"}
              >
                <Link to={"/login"}>{t("auth.signIn")}</Link>
              </Button>
              <Button
                display={{
                  hideSignUp: "inline-flex",
                  md: "none",
                  base: "none",
                }}
                fontSize={"md"}
                fontWeight={600}
                color={"white"}
                bg={"transparent"}
                onClick={() => navigateWithToast("/register")}
                border={"2px solid white"}
                _hover={{ color: "brand.hoverBlueColor" }}
                _focus={{ bg: "transparent" }}
              >
                <Link to={"/register"}>{t("auth.signUp")}</Link>
              </Button>
            </Stack>
          ) : (
            <Menu>
              <LngSwitcher />
              <MenuButton
                aria-label="User account options"
                /* _expanded={} */ _active={{
                  color: "white",
                  backgroundColor: "transparent",
                }}
                _hover={{ backgroundColor: "transparent" }}
                backgroundColor={"transparent"}
                color={"white"}
                as={IconButton}
                icon={<FaRegUser />}
              />
              <MenuList color={"black"}>
                <Link role="group" to={"/users/" + user[0].app_user_id}>
                  <MenuItem _groupHover={{ color: "brand.hoverBlueColor" }}>
                    {t("account.account")}
                  </MenuItem>
                </Link>
                <Link role="group" to={"/ask"}>
                  <MenuItem _groupHover={{ color: "brand.hoverBlueColor" }}>
                    {t("tasks.askAQuestion")}
                  </MenuItem>
                </Link>
                <Link role="group" to={"/subscripe"}>
                  <MenuItem _groupHover={{ color: "brand.hoverBlueColor" }}>
                    {t("subscripe.subscripe")}
                  </MenuItem>
                </Link>
                <MenuItem
                  _hover={{ color: "brand.hoverBlueColor" }}
                  onClick={handleSignOut}
                >
                  {t("auth.signOut")}
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav NAV_ITEMS_MOBILE={NAV_ITEMS_MOBILE} />
        </Collapse>
      </Box>
    </Headroom>
  );
}

interface DesktopNavProps {
  NAV_ITEMS: Array<NavItem>;
}

const DesktopNav = ({NAV_ITEMS}: DesktopNavProps) => {
  const linkColor = "gray.200";
  const linkHoverColor = "white";
  const popoverContentBgColor = "white";
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                p={2}
                fontSize={"md"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                <NavLink to={navItem.href ?? "#"}>{navItem.label}</NavLink>
              </Box>
            </PopoverTrigger>
            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      role={"group"}
      display={"block"}
      p={3}
      rounded={"md"}
      bg={"transparent"}
      color={"black"}
      _hover={{ bg: "gray.100" }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Link to={href ?? "#"}>
            <Text
              transition={"all .3s ease"}
              _groupHover={{ color: "brand.hoverBlueColor" }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={"xs"}>{subLabel}</Text>
          </Link>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon
            color={"brand.hoverBlueColor"}
            w={5}
            h={5}
            as={FaChevronRight}
          />
        </Flex>
      </Stack>
    </Box>
  );
};

interface MobileNavProps {
  NAV_ITEMS_MOBILE: Array<NavItem>;
}
const MobileNav = ({NAV_ITEMS_MOBILE}: MobileNavProps) => {
  return (
    <Stack
      bg={"white"}
      borderWidth={"1px"}
      borderColor={"grey.200"}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS_MOBILE.map((navItem, i) => (
        <MobileNavItem index={i} key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, index }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={0} onClick={children && onToggle} fontSize={"sm"}>
      <Link to={href ?? "#"}>
        <Box
          mt={index === 0 ? 0 : 6}
          pb={0}
          height={"30px !important"}
          justifyContent="space-between"
          display="flex"
          alignItems="center"
          role="group"
          // _hover={{
          //   textDecoration: "none",
          //   color: "red"
          // }}
        >
          <Text
            _groupHover={{ color: "brand.hoverBlueColor" }}
            py={0}
            fontWeight={600}
            color={"gray.600"}
          >
            {label}
          </Text>
          {children && (
            <Icon
              as={HiMiniChevronDown}
              transition={"all .25s ease-in-out"}
              transform={isOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Box>
      </Link>
      <Collapse in={isOpen} animateOpacity>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={"gray.200"}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link
                style={{ width: "100%" }}
                key={child.label}
                to={child.href ?? "#"}
              >
                <Box
                  _hover={{ color: "brand.hoverBlueColor", cursor: "pointer" }}
                  key={child.label}
                  py={2}
                  width={"100%"}
                >
                  {child.label}{" "}
                </Box>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};