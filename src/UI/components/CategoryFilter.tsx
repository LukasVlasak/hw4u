import { useEffect, useRef } from "react";
import _ from "lodash";

interface Props<T, K extends Record<string, string>> {
  onChange: (data: T[]) => void;
  categories: K;
  dataKey: keyof T;
  data: T[];
  name: string;
  setCategory: (category: CategoryState<T>[] | undefined) => void;
  category: { category: string; dataKey: keyof T }[] | undefined;
}

interface CategoryState<T> {
  category: string;
  dataKey: keyof T;
}

function CategoryFilter<T, K extends Record<string, string>>({
  onChange,
  categories,
  dataKey,
  data,
  name,
  category,
  setCategory
}: Props<T, K>) {

  const mounted = useRef(false);

  const handleCategoryChange = (
    name: string, // keyof K
    dataKey: keyof T,
    checked: boolean
  ) => {
    if (checked) {
      setCategory(
        category && category.length > 0
          ? [...category, { category: name, dataKey: dataKey }]
          : [{ category: name, dataKey: dataKey }]
      );
    } else {
      setCategory(category?.filter((c) => c.category !== name));
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      let filteredArray: T[] = data;
      let filteredByCategories: T[] | undefined = undefined;

      if (category && category.length > 0) {
        let arraysOfFilteredData = category.map(c =>
          data.filter(d => d[c.dataKey] === c.category)
        );
        filteredByCategories = _.intersection(...arraysOfFilteredData)
      }
      onChange(filteredByCategories || filteredArray);
    }
    mounted.current = false;
  }, [category, data, onChange]);

  return (
    <div>
      <span>{name}</span>
      {Object.values(categories).map((c, i) => {
        return (
          <div key={i}>
            <label>{c}</label>
            <input
              type="checkbox"
              value={c}
              onChange={(e) => {
                handleCategoryChange(c, dataKey, e.currentTarget.checked);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
