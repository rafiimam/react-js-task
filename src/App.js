import React, { useState } from "react";
import { Media } from "./media";
import "./index.css"; 

// Image Selection Modal Component
const ImageSelectionModal = ({ onClose, onAddImage }) => {
  return (
    <div className="image-selection-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="imageSelection">Select an Image</h2>
        <div className="image-list">
          {/* Display list of images to select from */}
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

// Main App Component
const App = () => {
  const [media, setMedia] = useState(Media);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showImageSelectionModal, setShowImageSelectionModal] = useState(false);

  // Toggle selection of an image
  const handleToggleSelect = (index) => {
    const updatedSelectedItems = [...selectedItems];
    if (updatedSelectedItems.includes(index)) {
      updatedSelectedItems.splice(updatedSelectedItems.indexOf(index), 1);
    } else {
      updatedSelectedItems.push(index);
    }
    setSelectedItems(updatedSelectedItems);
  };

  // Delete selected images
  const handleDeleteSelected = () => {
    const updatedMedia = media.filter((_, index) => !selectedItems.includes(index));
    setMedia(updatedMedia);
    setSelectedItems([]);
  };

  // Handle drag start
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (index) => (event) => {
    event.preventDefault();
  
    // Check if the drop target is the "Add Images" box
    const isAddImageBox = event.target.classList.contains('add-image-box');
  
    // Only perform sorting if not over the "Add Images" box
    if (draggedIndex !== null && draggedIndex !== index && !isAddImageBox) {
      const updatedMedia = [...media];
      const [draggedItem] = updatedMedia.splice(draggedIndex, 1);
      updatedMedia.splice(index, 0, draggedItem);
      setMedia(updatedMedia);
      setDraggedIndex(index);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Open the image selection modal
  const handleOpenImageSelectionModal = () => {
    setShowImageSelectionModal(true);
  };

  // Close the image selection modal
  const handleCloseImageSelectionModal = () => {
    setShowImageSelectionModal(false);
  };

  // Add selected image from the modal
  const handleAddImage = (selectedImage) => {
    const updatedMedia = [...media, selectedImage];
    setMedia(updatedMedia);
    handleCloseImageSelectionModal();
  };

  // Get the selected message for the delete button
  const getSelectedMessage = () => {
    const count = selectedItems.length;
    if (count === 1) {
      return "(1 image selected)";
    } else if (count > 1) {
      return `(${count} images selected)`;
    }
    return "";
  };

  // Scroll to the gallery section
  const handleScrollToGallery = () => {
    document.getElementById("gallery").scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div className="container">
      <div className="background"></div>
      <div className="banner-txt">
        <h1> Photo <span className="gal">Gallery</span></h1>
        <p>
        but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
        {/* Display media items */}
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

      {/* Delete button */}
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
