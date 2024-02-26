import { useLoaderData, useParams } from "react-router-dom";
import { LoaderDataTaskInterface } from "../../services/taskService";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useGetOneUser } from "../../hooks/useUsers";

const OneTaskPage = () => {
  const { data } = useLoaderData() as LoaderDataTaskInterface;
  const task = data[0];
  // const forUserQueryObj = useGetOneUser(task.for_user_id);
  // const appUserQueryObj = useGetOneUser(task.user_id);
  
  // console.log(forUserQueryObj);
  // console.log(appUserQueryObj);
  
  
  return (
    <Flex flexDir={'row'} justifyContent={'space-between'}>
       <Container>
      <Heading size={'lg'}>
        {task.title}
      </Heading>
      <p>{task.description}</p>
    </Container>
<Card>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Category
            </Heading>
            <Text pt="2" fontSize="sm">
              {task.category}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Willing to pay
            </Heading>
            <Text pt="2" fontSize="sm">
              {task.willing_to_pay}$
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Created date
            </Heading>
            <Text pt="2" fontSize="sm">
              {task.created_date ? task.created_date.toString() : "this should not happend, please contact us via page 'contact us'"}
            </Text>
          </Box>
          {task.due_date && (
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Due date
              </Heading>
              <Text pt="2" fontSize="sm">
                {task.due_date.toString()}
              </Text>
            </Box>
          )}
          {task.for_user_id && (
            <Box>
            <Heading size="xs" textTransform="uppercase">
              Assignee
            </Heading>
            <Text pt="2" fontSize="sm">
              <Avatar /> user name
            </Text>
          </Box>
          )}
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Creator
            </Heading>
            <Flex alignItems={"center"}>
              <Avatar size={'sm'} mr={2}/> user name
            </Flex>
          </Box>
        </Stack>
      </CardBody>
    </Card>
   
    </Flex>
    
  );
};

export default OneTaskPage;
