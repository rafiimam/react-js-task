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
  
    // Check if the drop target is the "Add Images" box
    const isAddImageBox = event.target.classList.contains('add-image-box');
  
    if (draggedIndex !== null && draggedIndex !== index && !isAddImageBox) {
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

  const handleScrollToGallery = () => {
    document.getElementById("gallery").scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="banner"></div>
      </div>
      <div className="banner-txt">
        <h1> Photo <span className="gal">Gallery</span></h1>
        <p>
        <p> but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </p>
        
        {/* Button to Scroll to Gallery */}
        <button className="scroll-to-gallery-btn" onClick={handleScrollToGallery}>
          Scroll to Gallery
        </button>
      </div>
      <div>
        <h1 id="caption">Select the images to delete</h1>
      </div>
      <div className="media-container" id="gallery">
        {/* Featured Image */}
        {media.filter(file => file).map((file, index) => (
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
            ) : file.type === "video" ? (
              <video src={file.url} muted />
            ) : null}
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
