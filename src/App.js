import React, { useState } from "react";
import { Media } from "./media";
import "./index.css"; // Make sure to import your CSS file

const ImageSelectionModal = ({ onClose, onAddImage }) => {
  return (
    <div className="image-selection-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="imageSelection">Select an Image</h2>
        <div className="image-list">
          {Media.map((image, index) => (
            <div
              key={index}
              className="image-item"
              onClick={() => onAddImage(image)}
            >
              {image.type === "image" ? (
                <img src={image.url} alt="" />
              ) : (
                <video src={image.url} muted />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [media, setMedia] = useState(Media);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showImageSelectionModal, setShowImageSelectionModal] = useState(false);

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

  const handleOpenImageSelectionModal = () => {
    setShowImageSelectionModal(true);
  };

  const handleCloseImageSelectionModal = () => {
    setShowImageSelectionModal(false);
  };

  const handleAddImage = (selectedImage) => {
    const updatedMedia = [...media, selectedImage];
    setMedia(updatedMedia);
    handleCloseImageSelectionModal();
  };

  const getSelectedMessage = () => {
    const count = selectedItems.length;
    if (count === 1) {
      return "(1 image selected)";
    } else if (count > 1) {
      return `(${count} images selected)`;
    }
    return "";
  };

  return (
    <div className="container">
      <h1>React Image Gallery</h1>

      <div className="media-container">
        {/* Featured Image */}
        {media.map((file, index) => (
          <div
            key={index}
            className={`media ${index === 0 ? "first-image" : ""} ${
              selectedItems.includes(index) ? "selected" : ""
            } ${index === draggedIndex ? "dragged" : ""}`}
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

        {/* Box for Adding Images */}
        <div
          className="media add-image-box"
          onClick={handleOpenImageSelectionModal}
          onDragOver={handleDragOver(media.length)}
        >
          <span>Add Images</span>
        </div>
      </div>

      <button className="btn" onClick={handleDeleteSelected}>
        Delete {getSelectedMessage()}
      </button>

      {/* Image Selection Modal */}
      {showImageSelectionModal && (
        <ImageSelectionModal
          onClose={handleCloseImageSelectionModal}
          onAddImage={handleAddImage}
        />
      )}
    </div>
  );
};

export default App;
