import React, { useEffect, useRef, useState } from "react";
import WebFont from "webfontloader";
import { HexColorPicker } from "react-colorful";
import "./TextEditor.css";

const TextEditor = () => {
  const editorRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState(16); // Start with default font size
  const [fontSuggestions, setFontSuggestions] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [footnotes, setFootnotes] = useState([]);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyA4oDrDekV7N1uDjyW9daSeHP_PoB--jmk"
        );
        const data = await res.json();
        const fontNames = data.items.map((item) => item.family);
        setFontSuggestions(fontNames.slice(0, 100));
      } catch (err) {
        console.error("Failed to load fonts", err);
      }
    };
    fetchFonts();
  }, []);

  useEffect(() => {
    if (selectedFont) {
      WebFont.load({
        google: { families: [selectedFont] },
      });
    }
  }, [selectedFont]);

  const applyStyle = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.color = selectedColor;
    span.style.fontFamily = selectedFont;
    span.style.fontSize = `${selectedFontSize}px`;
    span.innerHTML = range.toString();

    range.deleteContents();
    range.insertNode(span);
  };

  const exec = (command) => document.execCommand(command, false, null);

  const addFootnote = () => {
    const note = prompt("Enter footnote text:");
    if (!note) return;
    const index = footnotes.length + 1;

    const sup = document.createElement("sup");
    sup.innerText = `[${index}]`;
    sup.contentEditable = "false";
    sup.className = "footnote-inline";

    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.collapse(false);
      range.insertNode(sup);
    }

    setFootnotes((prev) => [...prev, note]);
  };

  const handleGenerate = async () => {
    //const content = editorRef.current.innerHTML;
    const jsonOps = [];
    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === 3) {
        const parent = node.parentElement;
        const style = window.getComputedStyle(parent);
        const attributes = {};

        if (style.color) attributes.color = style.color;
        if (style.fontFamily) attributes.font = style.fontFamily;
        if (style.fontSize) attributes.size = style.fontSize;
        if (style.fontWeight === "700") attributes.bold = true;
        if (style.fontStyle === "italic") attributes.italic = true;
        if (style.textDecoration.includes("underline")) attributes.underline = true;

        jsonOps.push({ insert: node.nodeValue, attributes });
      }
    }

    const payload = { data: [JSON.stringify({ ops: jsonOps })] };

    try {
      const res = await fetch("http://localhost:7860/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      const image = result.data?.[0];
      if (image?.startsWith("data:image")) {
        setImageSrc(image);
      } else {
        console.error("Invalid image response", image);
      }
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <div className="text-editor-container">
      <h1 className="title">Multi-Style Text Editor</h1>

      <div className="toolbar">
        <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
          {fontSuggestions.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={selectedFontSize}
          onChange={(e) => setSelectedFontSize(parseInt(e.target.value))}
          min="1"
        />

        <HexColorPicker color={selectedColor} onChange={setSelectedColor} />

        <div className="format-buttons">
          <button onClick={() => exec("bold")}><b>B</b></button>
          <button onClick={() => exec("italic")}><i>I</i></button>
          <button onClick={() => exec("underline")}><u>U</u></button>
        </div>

        <button className="apply-button" onClick={applyStyle}>Apply Style</button>
        <button className="apply-button" onClick={addFootnote}>Add Footnote</button>
        <button className="apply-button" onClick={handleGenerate}>Generate</button>
      </div>

      <div
        ref={editorRef}
        className="editable-content"
        contentEditable
        suppressContentEditableWarning={true}
        style={{ fontFamily: selectedFont }}
      ></div>

      {footnotes.length > 0 && (
        <div className="footnote-section">
          <h3>Footnotes:</h3>
          <ol>
            {footnotes.map((f, i) => (
              <li key={i}>
                {f}
                <button className="delete-note" onClick={() => {
                  const newList = [...footnotes];
                  newList.splice(i, 1);
                  setFootnotes(newList);
                }}>
                  ✖
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {imageSrc && (
        <div className="image-output">
          <h3>Generated Image:</h3>
          <img src={imageSrc} alt="Output" />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
