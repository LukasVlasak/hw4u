import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    BoxProps,
    Button,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    HStack,
    Icon,
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
  } from "@chakra-ui/react";
  import React, { ReactNode } from "react";
  
  import { BiCategory, BiSolidCategory } from "react-icons/bi";
  import { BsListTask, BsPlusSquare, BsPlusSquareFill, BsShieldExclamation, BsShieldFillExclamation } from "react-icons/bs";
  import { IoIosColorPalette, IoMdReturnLeft } from "react-icons/io";
  import { IoColorPaletteOutline, IoHomeOutline, IoHomeSharp, IoBackspaceOutline, IoBackspaceSharp } from "react-icons/io5";
  import { FiChevronDown, FiMenu } from "react-icons/fi";
  import { IconType } from "react-icons";
  import { FaExclamation, FaMoneyBill, FaRegWindowMaximize, FaTasks, FaWindowMaximize } from "react-icons/fa";
  import { FcTodoList } from "react-icons/fc";
  import { MdCancel, MdFeedback, MdOutlineCancel, MdOutlineFeedback, MdOutlineQuestionAnswer, MdOutlineRateReview, MdQuestionAnswer, MdRateReview } from "react-icons/md";
  import { PiShoppingBagOpenDuotone, PiShoppingBagOpenFill, PiUsersThreeBold, PiUsersThreeFill } from "react-icons/pi";
  import { RiCoupon2Fill, RiCoupon2Line, RiTodoFill, RiTodoLine } from "react-icons/ri";
  
  import { Outlet, useLocation, Link } from "react-router-dom";
  import LoadingComponents from "../components/LoadingComponents";
  import useAuth, { useLogout } from "../../hooks/useAuth";
  import useNavigateWithToast from "../../hooks/useNavigateWithToast";
import { CiMoneyBill } from "react-icons/ci";
  
  interface LinkItemProps {
    name: string;
    icon: IconType;
    activeIcon: IconType;
    pathname: string;
  }
  const LinkItems: Array<LinkItemProps> = [
    {
      name: "Dashboard",
      icon: IoHomeOutline,
      activeIcon: IoHomeSharp,
      pathname: "/administration",
    },
    {
      name: "Uživatelé",
      icon: PiUsersThreeBold,
      activeIcon: PiUsersThreeFill,
      pathname: "/administration/users",
    },
    {
      name: "Produkty",
      icon: PiShoppingBagOpenDuotone,
      activeIcon: PiShoppingBagOpenFill,
      pathname: "/administration/products",
    },
    {
      name: "Kategorie",
      icon: BiCategory,
      activeIcon: BiSolidCategory,
      pathname: "/administration/categories",
    },
    {
        name: "Zpětná vazba",
        icon: MdOutlineFeedback,
        activeIcon: MdFeedback,
        pathname: "/administration/feedback",
      },
      {
        name: "Odpovědi",
        icon: MdOutlineQuestionAnswer,
        activeIcon: MdQuestionAnswer,
        pathname: "/administration/answers",
      },
      {
        name: "Úkoly",
        icon: BsListTask,
        activeIcon: FaTasks,
        pathname: "/administration/tasks",
      },
      {
        name: "Platby",
        icon: CiMoneyBill,
        activeIcon: FaMoneyBill,
        pathname: "/administration/payments",
      },
      {
        name: "Recenze",
        icon: MdOutlineRateReview,
        activeIcon: MdRateReview,
        pathname: "/administration/reviews",
      },
  ];
  
  
  export default function SidebarWithHeader() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Box minH="100vh" bg={"gray.100"}>
          <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
          <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full"
          >
            <DrawerContent>
              <SidebarContent onClose={onClose} />
            </DrawerContent>
          </Drawer>
          {/* mobilenav */}
          <MobileNav onOpen={onOpen} />
          <Box ml={{ base: 0, md: 60 }} p="4">
            <Outlet />
          </Box>
        </Box>
      </>
    );
  }
  
  interface SidebarProps extends BoxProps {
    onClose: () => void;
  }
  
  const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const { pathname } = useLocation();
  
    return (
      <Box
        transition="3s ease"
        bg={"white"}
        borderRight="1px"
        borderRightColor={"gray.200"}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        overflow={"auto"}
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          
            <Link to={"/"}>
              <img
                alt="company logo"
                src="/logo.png"
                width={135}
                className="pt-2"
                height={45}
              />
            </Link>
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem
            my={2}
            active={pathname === link.pathname}
            pathname={link.pathname}
            key={link.name}
            activeIcon={link.activeIcon}
            icon={link.icon}
            onClose={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
    );
  };
  
  interface NavItemProps extends FlexProps {
    icon: IconType;
    activeIcon: IconType;
    children: ReactNode;
    active: boolean;
    pathname: string;
    onClose: () => void;
    /**
     * for new orders - display label in right-top corner of link
     * number of new orders
     */
    label?: string | null;
  }
  const NavItem = ({
    pathname,
    active,
    children,
    activeIcon,
    icon,
    onClose,
    label,
    ...rest
  }: NavItemProps) => {
    return (
      <Link to={pathname}>
        <Flex
          position={"relative"}
          onClick={onClose}
          align="center"
          _focus={{ boxShadow: "none" }}
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={active ? "grey.300" : ""}
          _hover={{
            bg: "grey.300",
          }}
          {...rest}
        >
          {label && label !== "0" ? (
            <Flex
              position={"absolute"}
              borderRadius={"full"}
              justifyContent={"center"}
              alignItems={"center"}
              backgroundColor={"red"}
              width={"20px"}
              height={"20px"}
              fontSize={"small"}
              right={0}
              top={0}
            >
              {label}
            </Flex>
          ) : null}
          {icon && <Icon mr="4" fontSize="16" as={active ? activeIcon : icon} />}
          {children}
        </Flex>
      </Link>
    );
  };
  
  interface MobileProps extends FlexProps {
    onOpen: () => void;
  }
  const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { data: user } = useAuth();
    const navigateWithToast = useNavigateWithToast();
    const { mutate, isPending } = useLogout(() => {
      navigateWithToast("/", {
        status: "success",
        title: "Úspěšně odhlášeno",
      });
    });
    if (isPending) {
      return <LoadingComponents />;
    }
    return (
      <>
        <Flex
          ml={{ base: 0, md: 60 }}
          px={{ base: 4, md: 4 }}
          height="20"
          alignItems="center"
          bg={"white"}
          borderBottomWidth="1px"
          borderBottomColor={"gray.200"}
          justifyContent={{ base: "space-between", md: "flex-end" }}
          {...rest}
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
  
          <Image
            display={{ base: "block", md: "none" }}
            width={"60px"}
            src="/images/logo_stylman.png"
            alt="company logo"
          />
  
          <HStack spacing={{ base: "0", md: "6" }}>
            <Flex alignItems={"center"}>
              <Link to={"/"}>
                <Button variant={"outline"} mr={6} colorScheme="blue">
                  Přepnout do e-shopu
                </Button>
              </Link>
              <Menu>
                <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                  <HStack>
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="sm">{user![0].full_name}</Text>
                      <Text fontSize="xs" color="gray.600">
                        Admin
                      </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={"white"}
                  borderColor={"gray.200"}
                >
                  <Link to={"/users/" + user![0].app_user_id}>
                    <MenuItem>Profil</MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={() => mutate()}>Odhlásit se</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>
        </Flex>
      </>
    );
  };
  