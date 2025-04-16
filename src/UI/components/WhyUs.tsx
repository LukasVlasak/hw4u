'use client'

import { ReactElement } from 'react'
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react'
import { FcAssistant } from 'react-icons/fc'
import { CiMoneyBill } from "react-icons/ci";
import { useTranslation } from 'react-i18next'
import { IoCheckmarkDoneOutline } from "react-icons/io5";

interface FeatureProps {
  title: string
  text: string
  icon: ReactElement
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack display={'flex'} alignItems={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  )
}

export default function SimpleThreeColumns() {
  const {t} = useTranslation();
  return (
    <Box my={8} p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={t("homePage.whyUs.telephoneAssistance")}
          text={
            t("homePage.whyUs.telephoneAssistanceDesc")
          }
        />
        <Feature
          icon={<Icon as={IoCheckmarkDoneOutline} color={'green'} w={10} h={10} />}
          title={t("homePage.whyUs.allInOnePlace")}
          text={
            t("homePage.whyUs.allInOnePlaceDesc")
          }
        />
        <Feature
          icon={<Icon as={CiMoneyBill} color={'green'} w={10} h={10} />}
          title={t("homePage.whyUs.moneySafety")}
          text={
            t("homePage.whyUs.moneySafetyDesc")
          }
        />
      </SimpleGrid>
    </Box>
  )
}