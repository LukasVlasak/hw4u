import useTasks from "../../hooks/useTasks";
import { Task, TaskCategory, TaskType } from "../../services/taskService";
import LoadingComponents from "../components/LoadingComponents";
import TasksList from "../components/TasksList";

const TaskPage = () => {
  console.log();

  const { data, isLoading } = useTasks();
  console.log(data);
  if (isLoading) return <LoadingComponents />;

  return data ? (
    <TasksList<Task, TaskType>
      rows={data}
      columns={[
        "Titul",
        "Ochoten Zaplatit",
        "Kategorie",
        "Popis",
        "Do data",
        "Pro uzivatele",
      ]}
      sort
      filters={[{dataKey: "category", props: {type: 'category', categoryEnum: 'all'}}, {dataKey: "title", props: {type: 'category', categoryEnum: ['marketing']}}]}
    />
  ) : null;
};

export default TaskPage;
