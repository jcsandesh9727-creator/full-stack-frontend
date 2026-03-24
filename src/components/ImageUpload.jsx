import React, { useState, useEffect } from "react";

const ImageUpload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");

  // ✅ Validate file
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, WEBP, GIF files are allowed";
    }

    if (file.size > maxSize) {
      return "Each file must be less than 5MB";
    }

    return null;
  };

  // ✅ Handle multiple file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    let validFiles = [];
    let newPreviews = [];
    let errorMsg = "";

    // Clear old previews
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    files.forEach((file) => {
      const validationError = validateFile(file);

      if (validationError) {
        errorMsg = validationError;
      } else {
        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });

    setError(errorMsg);
    setSelectedFiles(validFiles);
    setPreviewUrls(newPreviews);
  };

  // ✅ Cleanup memory
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // ✅ Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFiles.length) return;

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    onUpload(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {previewUrls.length > 0 && (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {previewUrls.map((url, index) => (
            <img key={index} src={url} alt="Preview" width="150" />
          ))}
        </div>
      )}

      <br /><br />

      <button disabled={!selectedFiles.length || error}>
        Upload
      </button>
    </form>
  );
};

export default ImageUpload;