import React, { useState } from 'react';
import './Image.css';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <div className="upload-container">
      <h2>Upload an Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="button"
      />

      {preview && (
        <div className="preview">
          <img src={preview} alt="Uploaded preview" />
          <p>{image?.name}</p>
        </div>
      )}
    
    </div>
    </>
  );
};

export default ImageUpload;
