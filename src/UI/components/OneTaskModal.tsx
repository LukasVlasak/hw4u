import {
  Modal,
  ModalContent,
  ModalOverlay
} from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from "react";
import TaskModalContent from "./TaskModalContent";
import { useTask } from "../../hooks/useTasks";
import LoadingComponents from "./LoadingComponents";

interface Props {
  isOpen: boolean;
  index: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  ids: number[];
}

const OneTaskModal = ({ index, isOpen, setIsOpen, ids }: Props) => {
  const onClose = () => {
    setIsOpen(false);
  };

  const nextTask = () => {
    setI(i === ids.length - 1 ? 0 : i + 1)
  }

  const previousTask = () => {
    setI(i === 0 ? ids.length - 1 : i - 1)
  }
  
  const [i, setI] = useState(index);
  const { data: task, isSuccess } = useTask(ids[i]);

  useEffect(() => {
    setI(index);
  }, [index]);
  
  return (
    <>
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={"calc(100vh - 100px)"} maxW={"60%"}>
          {isSuccess ? (task ? <TaskModalContent nextTask={nextTask} previousTask={previousTask} task={task} /> : null) : <LoadingComponents />}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OneTaskModal;
