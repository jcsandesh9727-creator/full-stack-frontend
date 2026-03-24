import React from "react";
import ImageUpload from "../components/ImageUpload";

const CreatePost = () => {

  const handleUpload = (formData) => {
    // ✅ Check file in console
    console.log(formData.get("image"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Post</h1>
      <ImageUpload onUpload={handleUpload} />
    </div>
  );
};

export default CreatePost;