import React from "react";
import { HexColorPicker } from "react-colorful";

const ColorWheel = ({ selectedColor, onChangeComplete }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      <HexColorPicker
        color={selectedColor}
        onChange={onChangeComplete}
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  );
};

export default ColorWheel;
