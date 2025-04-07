import React from "react";
import { ChromePicker } from "react-color";

const ColorWheel = ({ selectedColor, onChangeComplete }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      <ChromePicker
        color={selectedColor}
        onChangeComplete={onChangeComplete}
        disableAlpha
      />
    </div>
  );
};

export default ColorWheel;
