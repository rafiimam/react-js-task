import React, { useState } from "react";
import { Media } from "./media";
import "./index.css"; // Make sure to import your CSS file

const App = () => {
  const [media, setMedia] = useState(Media);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleToggleSelect = (index) => {
    const updatedSelectedItems = [...selectedItems];
    if (updatedSelectedItems.includes(index)) {
      updatedSelectedItems.splice(updatedSelectedItems.indexOf(index), 1);
    } else {
      updatedSelectedItems.push(index);
    }
    setSelectedItems(updatedSelectedItems);
  };

  const handleDeleteSelected = () => {
    const updatedMedia = media.filter((_, index) => !selectedItems.includes(index));
    setMedia(updatedMedia);
    setSelectedItems([]);
  };

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
            key={index}
            className={`media ${index === 0 ? "first-image" : ""} ${
              selectedItems.includes(index) ? "selected" : ""
            } ${
              index === draggedIndex ? "dragged" : ""
            }`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDragEnd={handleDragEnd}
            onClick={() => handleToggleSelect(index)}
          >
            {file.type === "image" ? (
              <img src={file.url} alt="" />
            ) : (
              <video src={file.url} muted />
            )}
          </div>
        ))}
      </div>

      <button className="btn" onClick={handleDeleteSelected}>Delete Selected</button>
    </div>
  );
};

export default App;
