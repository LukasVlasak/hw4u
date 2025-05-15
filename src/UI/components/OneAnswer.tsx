import React, { useEffect, useState } from 'react'
import { Answer } from '../../services/answerService'
import { Flex, IconButton, Text, useToast, Button } from '@chakra-ui/react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../services/api-client';
import { truncateText } from '../../utils/fc';
import { MdDelete } from 'react-icons/md';
import { useBuyAnswer, useDeleteAnswer } from '../../hooks/useAnswers';

interface Props {
    answer: Answer;
}

const OneAnswer = ({answer}: Props) => {
    
    
    const { data: currUser } = useAuth();
    const toast = useToast();
    const { mutate: deleteAnswer, isPending } = useDeleteAnswer(() => {
        toast({
            status: "success",
            duration: 3000,
            isClosable: true,
            title: "Odpověď smazána",
        });
    });

    const navigate = useNavigate();

    const { mutate: buy, isPending: isBuyPending, error } = useBuyAnswer(() => {
        toast({
            status: "success",
            duration: 6000,
            isClosable: true,
            title: "Odpověď zakoupena - potvrďte platbu v profilu",
    });
    if (currUser) {
        navigate('/users/' + currUser[0].app_user_id);
    }
    });

    useEffect(() => {
        if (error) {
            toast({
                status: "error",
                duration: 6000,
                isClosable: true,
                title: "Tuto odpověď již máte zakoupenou",
            });
        }
    }, [error, toast]);

  return (
        <Flex
            borderWidth="1px"
            borderRadius="lg"
            padding="4"
            marginBottom="4"
            backgroundColor="white"
            boxShadow="md"
            flexDirection="row"
            justifyContent={"space-between"}
        >
            <Flex flexDir={'column'}>
                <Text fontWeight={'bold'}>Titul: {answer.title}</Text>
                <Text>Veřejná část odpovědi: {answer.preview}</Text>
                <Flex flexDir={'column'}>Veřejné soubory: {!currUser ? "Nejdříve se přihlaste" : answer.documents && answer.documents.map((document) => {
                    return document.is_preview && <Flex key={document.document_id} maxWidth={'fit-content'} flexDir={'column'}><a className='link' key={document.document_id} href={API_URL + "documents/" + document.document_id} target="_blank" rel="noopener noreferrer">{truncateText(document.filename, 10)}</a></Flex>
                })}</Flex>
            </Flex>
            <Flex flexDir={'column'} justifyContent={'space-between'}>
                <Flex flexDir={'column'}>
                {currUser && currUser[0].app_user_id === answer.app_user_id && <Flex justifyContent={'right'}><IconButton maxW={'fit-content'} colorScheme='red' aria-label='delete answer' isLoading={isPending} icon={<MdDelete />} onClick={() => {
                    if (window.confirm("Opravdu chcete smazat tuto odpověď?")) {
                        deleteAnswer(answer.answer_id);
                    }
                }} /></Flex>}
                <Link className='link' to={'/users/' + answer.app_user_id}>{answer.app_user_email_answer}</Link>
                </Flex>
                <Flex justifyContent={'right'}>
                    {currUser && !currUser[0].is_admin && currUser[0].app_user_id !== answer.app_user_id ? <Button isLoading={isBuyPending} onClick={() => buy(answer.answer_id)} colorScheme='blue'>Zakoupit</Button> : null}
                </Flex>
            </Flex>
        </Flex>
  )
}

export default OneAnswer