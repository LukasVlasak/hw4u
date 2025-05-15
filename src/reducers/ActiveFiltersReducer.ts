import { ActiveFilters } from "../UI/components/DataGrid";

interface RemoveActiveFilter<T> {
  type: "REMOVE";
  payload: {
    dataKey: keyof T;
  };
}

interface AddActiveFilter<T> {
  type: "ADD";
  payload: {
    newFilter: ActiveFilters<T>;
  };
}

interface RemoveAllActiveFilters {
    type: "REMOVEALL";
}

type ActiveFiltersAction<T> = AddActiveFilter<T> | RemoveActiveFilter<T> | RemoveAllActiveFilters;

function ActiveFiltersReducer<T>(
  state: ActiveFilters<T>[] | undefined,
  action: ActiveFiltersAction<T>
): ActiveFilters<T>[] | undefined {
  if (action.type === "ADD") {
    if (state) {
      if (!state.some((obj) => obj.key === action.payload.newFilter.key)) {
        return [...JSON.parse(JSON.stringify(state)), action.payload.newFilter];
      } else {
        return state.map((f) => {
          if (f.key === action.payload.newFilter.key) {
            return action.payload.newFilter;
          }
          return f;
        });
      }
    } else {
      return [action.payload.newFilter];
    }
  }

  if (action.type === "REMOVE") {
    const arrayToBeSet = state?.filter((b) => b.key !== action.payload.dataKey);
    if (arrayToBeSet && arrayToBeSet.length > 0) {
      return arrayToBeSet;
    } else {
      return undefined;
    }
  }

  if (action.type === "REMOVEALL") {
    return undefined;
  }
  return state;
}

export default ActiveFiltersReducer;
