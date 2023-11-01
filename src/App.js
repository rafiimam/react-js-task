import React, { useState } from "react";
import { Media } from "./media";
import "./index.css"; // Make sure to import your CSS file

const App = () => {
  const [media, setMedia] = useState(Media);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const updatedMedia = [...media];
      const [draggedItem] = updatedMedia.splice(draggedIndex, 1);
      updatedMedia.splice(index, 0, draggedItem);
      setMedia(updatedMedia);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="container">
      <h1>Responsive Media Gallery</h1>

      <div className="media-container">
        {media.map((file, index) => (
          <div
            className={`media ${index === 0 ? "first-image" : ""} ${
              index === draggedIndex ? "dragged" : ""
            }`}
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDragEnd={handleDragEnd}
          >
            {file.type === "image" ? (
              <img src={file.url} alt="" />
            ) : (
              <video src={file.url} muted />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
