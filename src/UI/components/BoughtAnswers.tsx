import React from 'react'
import { useGetBoughtAnswers, usePutPaidAnswer } from '../../hooks/useAnswers'
import LoadingComponents from './LoadingComponents';
import { Flex, Text, Button, useToast, Icon, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MdBlock, MdCancel, MdCheck } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import ShowFullAnswerModal from './modals/ShowFullAnswerModal';

const BoughtAnswers = () => {

    const { data, isLoading } = useGetBoughtAnswers();
    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { mutate, isPending } = usePutPaidAnswer(() => {
        toast({
            status: "success",
            duration: 3000,
            isClosable: true,
            title: "Potvrzení platby úspěšné",
        });
    
    });
    

    
    if (isLoading) {
        return <LoadingComponents />
    }
  return data ? (
    <Flex flexDir={'column'} maxW={'50%'}>
        {data.map((answer) => (
            <Flex flexDir={'column'}  border={1} borderRadius={'lg'} p={4} boxShadow={'lg'} mb={5} key={answer.answer_id}>
            <Flex><Text fontWeight={'bold'}>Titul: <Link className='link' to={"/tasks/" + answer.task_id}>{answer.title}</Link></Text></Flex>
            <Flex flexDir={'row'} alignItems={'center'}>Potvrzení zaplacení od Vás: &nbsp;{answer.paid ? <FaCheckCircle color='green' /> : <MdCancel color='red' />}</Flex>
            <Flex flexDir={'row'} alignItems={'center'}>Potvrzení zaplacení od zadavatele: &nbsp;{answer.confirmed ? <FaCheckCircle color='green' /> : <MdCancel color='red' />}</Flex>
            <Text fontWeight={'italic'} fontSize={'xs'}>Aby byla odpověď plně přístupná musí být obě položky potvrzeny</Text>
            {!answer.paid && <Button isLoading={isPending} onClick={() => mutate(answer.answer_id)} colorScheme='blue'>Potvrdit zaplacení</Button>}
            {answer.confirmed && answer.paid && <><ShowFullAnswerModal isOpen={isOpen} onClose={onClose} answerId={answer.answer_id} /><Button onClick={() => onOpen()} colorScheme='blue'>Podívat se na odpověď</Button></>}
            </Flex>
        ))}
    </Flex>
  ) : null
}

export default BoughtAnswers