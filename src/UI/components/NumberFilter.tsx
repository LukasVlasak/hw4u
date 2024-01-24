import MultiRangeSlider from "./MultiRangeSlider";

interface Props<T> {
  start: number;
  end: number;
  onChange: (data: T[]) => void;
  dataKey: keyof T;
  data: T[];
}

function NumberFilter<T>({ start, end, onChange, data, dataKey }: Props<T>) {
  return (
    <MultiRangeSlider
      min={start}
      max={end}
      onChange={(min, max) =>
        onChange(
          data.filter(
            (r) =>
              (r[dataKey] as number) <= max && (r[dataKey] as number) >= min
          )
        )
      }
    />
  );
}

export default NumberFilter;
