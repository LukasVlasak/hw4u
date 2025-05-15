import React from 'react'
import { useDeleteFeedback, useEditFeedback, useFeedback, useGetUnresolvedFeedback } from '../../../hooks/useFeedback';
import useAuth from '../../../hooks/useAuth';
import { Heading, ListItem, UnorderedList, useDisclosure, useToast } from '@chakra-ui/react';
import { Feedback } from '../../../services/feedbackService';
import DataGrid from '../../components/DataGrid';
import { filter } from 'lodash';
import LoadingComponents from '../../components/LoadingComponents';
import FeedbackModal from '../../layout/components/administration/FeedbackModal';

const FeedbackList = () => {
    const { data, isLoading } = useFeedback();
    const { data: unresolvedData } = useGetUnresolvedFeedback();
    const { mutate } = useEditFeedback(() => {
        toast({
            title: "Feedback upraven",
            status: "success",
        });
    });
    const [feedbackId, setFeedbackId] = React.useState<number>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
  
    return data ? (
      <>
        <FeedbackModal isOpen={isOpen} onClose={onClose} feedbackId={feedbackId} />
        <Heading size={'sm'} ml={10} color={'red'}>Unresolved feedbacks</Heading>
        <UnorderedList ml={10}>
          {unresolvedData && unresolvedData.length > 0 ? unresolvedData.map((feedback) => (
            <ListItem key={feedback.full_name}>
              {feedback.full_name} - {feedback.unresolved_feedback_count}
            </ListItem>
          )) : <ListItem>Žádné nevyřešené feedbacky</ListItem>}
        </UnorderedList>
        <DataGrid<Feedback & { id: number }>
          columns={[
            { key: "feedback_id", label: "ID", isVisible: true },
            { key: "full_name", label: "Celé jméno už.", isVisible: true },
            { key: "email", label: "E-mail už.", isVisible: true },
            {
              key: "is_resolved",
              label: "Je vyřešeno",
              isVisible: true,
              type: "booleanPretty",
              filter: true,
              props: { type: "boolean" },
            },
            { key: "created_date", label: "Datum vytvoření", isVisible: true, type: "date", filter: true, props: { type: "date" } },
          ]}
          rows={data.map((user) => ({
            ...user,
            id: user.feedback_id,
          }))}
          columnSwitching={"localStorageById"}
          search={{
            email: "E-mail",
          }}
          sort
          pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 25] }}
          id={"Feedback"}
          onRowClick={(id) => {
            setFeedbackId(id);
            onOpen();
          }}
          onTransmit={(id) => {
            mutate({feedback_id: id } as Feedback);
          }}
        />
      </>
    ) : (
      <LoadingComponents />
    );
}

export default FeedbackList