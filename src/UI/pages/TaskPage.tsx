import useTasks from "../../hooks/useTasks";
import {
  Task,
  TaskCategoryObj,
  TaskCategoryObj2,
} from "../../services/taskService";
import LoadingComponents from "../components/LoadingComponents";
import DataGrid from "../components/DataGrid";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../layout/components/ErrorBoundary";
import { PartialWithId } from "../../interfaces/interfaces";

const TaskPage = () => {
  const { data, isLoading } = useTasks();
  const navigate = useNavigate();

  const handleRowClick = (rowId: number) => {
    navigate("/task/" + rowId);
  };

  if (isLoading) return <LoadingComponents />;

  return data ? (
    <ErrorBoundary>
      <DataGrid<PartialWithId<Task>, [typeof TaskCategoryObj, typeof TaskCategoryObj2]>
        onRowClick={handleRowClick}
        /* 
        dve stejne implementace 

        const newData = data.map(({ desc, ...rest }) => rest);

        const newData = data.map(item => ({
          id: item.id,
          title: item.title,
          // Add more properties here if needed
        }));
        */
        rows={data.map(({description, user_id, category_second, ...ostatni}) => ostatni)}
        pagination={{ defaultPageSize: 10, pageSizesToChoose: [5, 10, 15, 20] }}
        columns={[
          "Titul",
          "Ochoten Zaplatit",
          "Kategorie",
          "Do data",
          "Pro uzivatele",
          "Created",
        ]}
        sort
        search={["title", "due_date"]}
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
            },
          },
          {
            dataKey: "category",
            name: "Kategori2",
            props: {
              type: "category",
              categoryEnum: TaskCategoryObj,
            },
          },
        ]}
      />
    </ErrorBoundary>
  ) : <LoadingComponents />;
};

export default TaskPage;
