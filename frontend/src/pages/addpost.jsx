import { useState } from "react";
import api from "../services/axios.service";

const UploadPost = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(fileUrl);
    }
  };

  const handleUpload = async () => {
    if (!file && !content) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", content);

    try {
      await api.post("http://localhost:5000/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Post uploaded successfully!");
      setFile(null);
      setContent("");
      setPreview(null);
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-300">
      <textarea
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <input
        type="file"
        accept="image/*, video/*"
        onChange={handleFileChange}
        className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
      />

      {preview && (
        <div className="mb-4">
          {file.type.startsWith("image") ? (
            <img src={preview} alt="Preview" className="w-full rounded-md border border-gray-300" />
          ) : (
            <video controls className="w-full rounded-md border border-gray-300">
              <source src={preview} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Uploading..." : "Post"}
      </button>
    </div>
  );
};

export default UploadPost;
