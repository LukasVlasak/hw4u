import React from "react";
import { MutatingDots } from "react-loader-spinner";

const LoadingComponents = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "-webkit-fill-available",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MutatingDots
        width={100}
        secondaryColor="#6887fe"
        color="#1d1168"
        ariaLabel="loading image"
      />
    </div>
  );
};

export default LoadingComponents;
