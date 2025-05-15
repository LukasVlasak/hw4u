import React from 'react'
import { useGetBoughtAnswers, useGetProvidedAnswers, usePutConfirmAnswer, usePutPaidAnswer } from '../../hooks/useAnswers'
import LoadingComponents from './LoadingComponents';
import { Flex, Text, Button, useToast, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MdBlock, MdCancel, MdCheck } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';

const ProvidedAnswers = () => {

    const { data, isLoading } = useGetProvidedAnswers();
    const toast = useToast();
    const { mutate, isPending } = usePutConfirmAnswer(() => {
        toast({
            status: "success",
            duration: 3000,
            isClosable: true,
            title: "Potvrzení přijetí platby úspěšné",
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
            <Flex flexDir={'row'} alignItems={'center'}>Potvrzení zaplacení od už., který si chce odpověď koupit: &nbsp;{answer.paid ? <FaCheckCircle color='green' /> : <MdCancel color='red' />}</Flex>
            <Flex flexDir={'row'} alignItems={'center'}>Potvrzení zaplacení od Vás: &nbsp;{answer.confirmed ? <FaCheckCircle color='green' /> : <MdCancel color='red' />}</Flex>
            <Text fontWeight={'italic'} fontSize={'xs'}>Aby byla odpověď plně přístupná pro už. musí být obě položky potvrzeny</Text>
            {!answer.confirmed && answer.paid && <Button isLoading={isPending} onClick={() => mutate(answer.answer_id)} colorScheme='blue'>Potvrdit zaplacení</Button>}
            </Flex>
        ))}
    </Flex>
  ) : null
}

export default ProvidedAnswers;