import useTasks from "../../hooks/useTasks";
import { Task, TaskCategoryObj, TaskCategoryObj2 } from "../../services/taskService";
import LoadingComponents from "../components/LoadingComponents";
import DataGrid from "../components/DataGrid";
import { useContext } from "react";
import authContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {

  const { data, isLoading } = useTasks();
  const { value } = useContext(authContext);
  const navigate = useNavigate();
  
  const handleRowClick = (rowId: number) => {
    navigate("/task/" + rowId);
  }

  if (isLoading) return <LoadingComponents />;

  return data ? (
    <DataGrid<Task, [typeof TaskCategoryObj, typeof TaskCategoryObj2]>
      onRowClick={value ? handleRowClick : undefined}
      rows={data}
      pagination={{defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 20]}}
      columns={[
        "Titul",
        "Ochoten Zaplatit",
        "Kategorie",
        "Popis",
        "Do data",
        "Pro uzivatele",
        "Category 2",
        "Created"
      ]}
      sort
      search={['title', 'due_date']}
      filters={[
        {
          dataKey: "willing_to_pay",
          name: "Ochoten zaplatit",
          props: {
            type: "number",
            start: Math.min(...data.map((d) => d.willing_to_pay)),
            end: Math.max(...data.map((d) => d.willing_to_pay)),
          },
        },
        {
          dataKey: "due_date",
          name: "Do dne",
          props: {
            type: "date",
          }
        },
        {
          dataKey: "category",
          name: "Kategori2",
          props: {
            type: "category",
            categoryEnum: TaskCategoryObj
          }
        },
      ]}
    />
  ) : null;
};

export default TaskPage;
