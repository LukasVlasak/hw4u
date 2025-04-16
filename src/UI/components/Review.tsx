import { Avatar, Box, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import ReactStars from "react-stars";
interface Props {
  text: string;
  stars: number;
  userName: string;
}

const Review = ({text, userName, stars}: Props) => {
  return (
    <Stack
      className='px-3'
      bg={useColorModeValue('gray.50', 'gray.800')}
      py={8}
      borderRadius={'40px'}
      spacing={{ base: 6, md: 6 }}
      align={'center'}
      direction={'column'}>
      <Text fontSize={{ base: 's', md: 'md' }} textAlign={'center'} maxW={'3xl'}>
        {text}
      </Text>
      <Box textAlign={'center'}>
        <Avatar
          src={
            'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
          }
          mb={2}
        />

        <Text fontWeight={600}>{userName}</Text>
      </Box>
      <ReactStars edit={false} value={stars}/>

    </Stack>
  )
}

export default Review;