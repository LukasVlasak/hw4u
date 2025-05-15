import { Modal, ModalOverlay, ModalContent, Button, ModalHeader, ModalCloseButton, ModalBody, Heading, FormControl, FormLabel, Input, FormErrorMessage, UnorderedList, ListItem, ModalFooter, Textarea, Flex } from '@chakra-ui/react'
import { t } from 'i18next'
import React from 'react'
import { useGetFullAnswer } from '../../../hooks/useAnswers';
import LoadingComponents from '../LoadingComponents';
import { API_URL } from '../../../services/api-client';
import { truncateText } from '../../../utils/fc';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    answerId: number;
}

const ShowFullAnswerModal = ({isOpen, onClose, answerId}: Props) => {

    const { data, isLoading } = useGetFullAnswer(answerId);
    
  return (
    <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>        
        <ModalHeader>Celá odpověď</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            {isLoading ? <LoadingComponents /> : (data && data.length > 0 ? (
                <>
                    <Textarea defaultValue={data[0].full_answer} isReadOnly></Textarea>
                    <Flex flexDir={'column'}>Soubory: {data[0].documents && data[0].documents[0].filename != null && data[0].documents.map((document) => {
                        return !document.is_preview && <Flex key={document.document_id} maxWidth={'fit-content'} flexDir={'column'}><a className='link' key={document.document_id} href={API_URL + "documents/" + document.document_id} target="_blank" rel="noopener noreferrer">{truncateText(document.filename, 10)}</a></Flex>
                })}</Flex>
                </>
            ) : null)}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" type='button' mr={3} onClick={onClose}>
            {t("tasks.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ShowFullAnswerModal