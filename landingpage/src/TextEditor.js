import React, { useState, useRef, useEffect } from "react";
import WebFont from "webfontloader";
import ColorWheel from "./ColorWheel";
import "./TextEditor.css";

const TextEditor = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSuggestions, setFontSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyA4oDrDekV7N1uDjyW9daSeHP_PoB--jmk"
        );
        const data = await res.json();
        const fontNames = data.items.map((item) => item.family);
        setFontSuggestions(fontNames);
      } catch (error) {
        console.error("Failed to load fonts", error);
      }
    };

    fetchFonts();
  }, []);

  const filteredFonts = fontSuggestions.filter((font) =>
    font.toLowerCase().includes(selectedFont.toLowerCase())
  );

  const loadFont = (fontName) => {
    WebFont.load({
      google: {
        families: [fontName],
      },
    });
  };

  const handleFontChange = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    setShowSuggestions(true);
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    loadFont(font);
    setShowSuggestions(false);
  };

  const handleSizeChange = (e) => {
    setSelectedFontSize(`${e.target.value}px`);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    setIsUnderline(!isUnderline);
  };

  const resetEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    setSelectedFont("Arial");
    setSelectedFontSize("16px");
    setSelectedColor("#000000");
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
  };

  const applyStyleToSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const contents = range.extractContents();

    const span = document.createElement("span");
    span.textContent = contents.textContent;

    span.style.color = selectedColor;
    span.style.fontFamily = selectedFont;
    span.style.fontSize = selectedFontSize;
    span.style.fontWeight = isBold ? "bold" : "normal";
    span.style.fontStyle = isItalic ? "italic" : "normal";
    span.style.textDecoration = isUnderline ? "underline" : "none";

    range.insertNode(span);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    selection.addRange(newRange);
  };

  return (
    <div className="text-editor-container">
      <h1 className="title">Multi-Style Text Editor</h1>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="editable-content"
        style={{ fontFamily: selectedFont }}
      ></div>

      <div className="font-input-wrapper">
        <input
          type="text"
          value={selectedFont}
          onChange={handleFontChange}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search Fonts"
          style={{ fontFamily: selectedFont }}
          className="dropdown"
        />
        {showSuggestions && filteredFonts.length > 0 && (
          <ul className="suggestions">
            {filteredFonts.slice(0, 10).map((font, index) => (
              <li
                key={index}
                onClick={() => handleFontSelect(font)}
                style={{ fontFamily: font }}
              >
                {font}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="number"
        min="8"
        max="100"
        value={parseInt(selectedFontSize)}
        onChange={handleSizeChange}
        className="dropdown"
        placeholder="Font size (px)"
      />

      <div className="style-toggles">
        <button
          onClick={toggleBold}
          className={`toggle-button ${isBold ? "active" : ""}`}
        >
          B
        </button>
        <button
          onClick={toggleItalic}
          className={`toggle-button ${isItalic ? "active" : ""}`}
        >
          I
        </button>
        <button
          onClick={toggleUnderline}
          className={`toggle-button ${isUnderline ? "active" : ""}`}
        >
          U
        </button>
      </div>

      <ColorWheel
        selectedColor={selectedColor}
        onChangeComplete={handleColorChange}
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={applyStyleToSelection}
          className="apply-button"
          style={{ backgroundColor: "#007bff" }}
        >
          Apply Style
        </button>

        <button
          onClick={resetEditor}
          className="apply-button"
          style={{ backgroundColor: "#dc3545" }}
        >
          Reset Editor
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
