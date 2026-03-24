import React, { useState, useEffect } from "react";

const ImageUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  // ✅ Validate file
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, WEBP, GIF files are allowed";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    setError("");

    // Remove old preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreview = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreview);
  };

  // ✅ Cleanup memory
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    onUpload(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}

      <br /><br />

      <button disabled={!selectedFile || error}>
        Upload
      </button>
    </form>
  );
};

export default ImageUpload;