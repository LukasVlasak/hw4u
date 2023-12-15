"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { HiMiniChevronDown } from "react-icons/hi2";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import Headroom from "react-headroom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Headroom pinStart={60}>
      {" "}
      {/* pro zobrazeni headru pri scroll up - knihovna */}
      <Box>
        <Flex
          backgroundColor={"brand.bgColor"}
          color={"white"}
          minH={"60px"}
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
                src="./logo.png"
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
              _hover={{bg: 'transparent'}}
              icon={
                isOpen ? (
                  <IoMdClose style={{color: 'white', fontSize: '25px'}}/>
                ) : (
                  <GiHamburgerMenu style={{color: 'white', fontSize: '25px'}} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "center" }}>
            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            alignItems={"center"}
          >
            <Button
              fontSize={"md"}
              fontWeight={400}
              variant={"link"}
              color={"grey.200"}
            >
              <Link to={"/login"}>{t("auth.signIn")}</Link>
            </Button>
            <Button
              display={{ hideSignUp: "inline-flex", md: "none", base: "none" }}
              fontSize={"md"}
              fontWeight={600}
              color={"white"}
              bg={"transparent"}
              onClick={() => navigate("/register")}
              border={"2px solid white"}
              _hover={{color: 'brand.hoverBlueColor'}}
              _focus={{bg: 'transparent'}}
            >
              <Link to={"/register"}>{t("auth.signUp")}</Link>
            </Button>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </Headroom>
  );
}

const DesktopNav = () => {
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
          <Icon color={"brand.hoverBlueColor"} w={5} h={5} as={FaChevronRight} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack bg={"white"} borderWidth={'1px'} borderColor={'grey.200'} p={4} display={{ md: "none" }}>
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
      <Box
        mt={index === 0 ? 0 : 6}
        pb={0}
        height={"30px !important"}
        justifyContent="space-between"
        display="flex"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text _hover={children ? {} : {color: 'brand.hoverBlueColor'}} py={0} fontWeight={600} color={"gray.600"}>
          <Link to={href ?? "#"}>{label}</Link>
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
              <Box _hover={{color: 'brand.hoverBlueColor', cursor: 'pointer'}} key={child.label} py={2}>
                <Link to={child.href ?? "#"}>{child.label}</Link>
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  index?: number;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Vydělávej peníze",
    children: [
      {
        label: "Odpověz na otázku",
        subLabel: "Za to jsou lidé schopni utrácet opravdu hodně",
        href: "/tasks",
      },
      {
        label: "Pozvi kámaše",
        subLabel: "Pozvi kámoše pomocí speciálního linku",
        href: "/invite",
      },
    ],
  },
  {
    label: "Najdi pomoc",
    children: [
      {
        label: "Zadej úkol",
        subLabel: "Vytvoř úkol, se kterým si nevíš rady a někdo ti rád pomůže",
        href: "/createTask",
      },
      {
        label: "Podívej se na zodpovězené otázky",
        subLabel: "Koukni se komu už naše stránka pomohla a třeba najdeš odpověď na svůj problém",
        href: "/answeredQuestions",
      },
      {
        label: "Uživatelé",
        subLabel: "Podívej se na to, v čem jsou naši uživatelé vzdělaní a můžeš je přímo požádat o pomoc",
        href: "/users",
      },
    ],
  },
  {
    label: "Ceník / Jak to funguje",
    href: "/pricing",
  },
  {
    label: "Podpora / FAQ",
    href: "/faq",
  },
];

const NAV_ITEMS_MOBILE: Array<NavItem> = [
  {
    label: "Domů",
    href: '/'
  },
  {
    label: "Vydělávej peníze",
    children: [
      {
        label: "Odpověz na otázku",
        subLabel: "Za to jsou lidé schopni utrácet opravdu hodně",
        href: "/tasks",
      },
      {
        label: "Pozvi kámaše",
        subLabel: "Pozvi kámoše pomocí speciálního linku",
        href: "/invite",
      },
    ],
  },
  {
    label: "Najdi pomoc",
    children: [
      {
        label: "Zadej úkol",
        subLabel: "Vytvoř úkol, se kterým si nevíš rady a někdo ti rád pomůže",
        href: "/createTask",
      },
      {
        label: "Podívej se na zodpovězené otázky",
        subLabel: "Koukni se komu už naše stránka pomohla a třeba najdeš odpověď na svůj problém",
        href: "/answeredQuestions",
      },
      {
        label: "Uživatelé",
        subLabel: "Podívej se na to, v čem jsou naši uživatelé vzdělaní a můžeš je přímo požádat o pomoc",
        href: "/users",
      },
    ],
  },
  {
    label: "Ceník / Jak to funguje",
    href: "/pricing",
  },
  {
    label: "Podpora / FAQ",
    href: "/faq",
  },
]
