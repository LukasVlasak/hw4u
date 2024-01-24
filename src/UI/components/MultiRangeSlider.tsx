import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: (minValue: number, maxValue: number) => void;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  onChange,
}) => {
  const [values, setValues] = useState<number[]>([min, max]);

  const handleChange = (newValues: number[]) => {
    setValues(newValues);
  };

  const handleFinalChange = () => {
    onChange(values[0], values[1]);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "30px",
        marginLeft: "30px",
        maxWidth: "300px",
        minHeight: "60px",
      }}
    >
      <Range
        step={1}
        min={min}
        max={max}
        values={values}
        onFinalChange={handleFinalChange}
        allowOverlap={false}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              width: "100%",
              background: getTrackBackground({
                values,
                colors: ["#ccc", "#007BFF", "#ccc"],
                min,
                max,
              }),
              borderRadius: "4px",
              marginLeft: "10px",
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ index, props }) => (
          <React.Fragment key={index}>
            <div
              {...props}
              style={{
                ...props.style,
                height: "16px",
                width: "16px",
                backgroundColor: "#007BFF",
                borderRadius: "50%",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `calc(${
                  ((values[index] - min) / (max - min)) * 100
                }% - 12px)`,
                paddingTop: "15px",
              }}
            >
              {values[index]}
            </div>
          </React.Fragment>
        )}
      />
    </div>
  );
};

export default MultiRangeSlider;
