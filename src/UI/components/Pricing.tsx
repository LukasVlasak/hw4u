"use client";

import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { Product } from "../../services/productService";
import { useGetUIProducts } from "../../hooks/useProducts";
import LoadingComponents from "./LoadingComponents";
import { useState } from "react";
import AdminPaymentModal from "./modals/AdminPaymentModal";

interface Props {
  product: Product;
  onSelect: (productId: number) => void;
}

function PriceWrapper({ product, onSelect }: Props) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
    >
      <Box py={4} px={12}>
        <Text fontWeight="500" fontSize="2xl">
          {product.name}
        </Text>
        <HStack justifyContent="center">
          <Text fontSize="5xl" fontWeight="900">
            {product.price + " Kč"}
          </Text>
        </HStack>
        {"Počet odpovědí: " + product.answer_limit}
        <Box justifyContent={'center'} w="100%" pt={7}>
          <Button w="full" onClick={() => onSelect(product.product_id)} colorScheme="red" variant="outline">
            Zakoupit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function ThreeTierPricing() {
  const { data, isLoading } = useGetUIProducts();
  const [productId, setProductId] = useState<number>();
  const {isOpen, onClose, onOpen} = useDisclosure();

  if (isLoading) {
    return <LoadingComponents />;
  }

  const onSelect = (productId: number) => {
    setProductId(productId);
    onOpen();
  }

  return (
    <><AdminPaymentModal isOpen={isOpen} onClose={onClose} productId={productId} /><Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Najděte produkt, který vám vyhovuje nejvíce
        </Heading>
        <Text maxW={"90%"} margin={"0 auto"} fontSize="lg" color={"gray.500"}>
          Zde jsou uvedeny všechny dostupné produkty. Pokud zde nevidíte produkt, který jste si
          koupili, je zablokován, ale nemá to žádný význam na váš účet.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        {data && data.map((product) => <PriceWrapper onSelect={onSelect} key={product.product_id} product={product} />)}
      </Stack>
    </Box></>
  );
}
