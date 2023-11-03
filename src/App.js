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
  // State Hook for managing the media files
  const [media, setMedia] = useState(Media);

  // State Hook for keeping track of selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // State Hook for tracking the index of the currently dragged item
  const [draggedIndex, setDraggedIndex] = useState(null);

  // State Hook for managing the visibility of the image selection modal
  const [showImageSelectionModal, setShowImageSelectionModal] = useState(false);

  // Toggle selection of an image
  const handleToggleSelect = (index) => {
    // Create a copy of the selectedItems array to avoid direct mutation
    const updatedSelectedItems = [...selectedItems];
  
    // Check if the selectedItems array already includes the current index
    if (updatedSelectedItems.includes(index)) {
      // If it does, remove the index from the array
      updatedSelectedItems.splice(updatedSelectedItems.indexOf(index), 1);
    } else {
      // If it doesn't, add the index to the array
      updatedSelectedItems.push(index);
    }
  
    // Update the state with the new array of selected items
    setSelectedItems(updatedSelectedItems);
  };
  
  // Delete selected images
  const handleDeleteSelected = () => {
    // Use the filter method to create a new array of media excluding selected items
    const updatedMedia = media.filter((_, index) => !selectedItems.includes(index));
  
    // Update the state with the new array of media
    setMedia(updatedMedia);
  
    // Clear the selectedItems array by updating the state
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
    // Check if the draggedIndex is not null (an image is being dragged),
    // the draggedIndex is not the same as the current index (not dropping
    // an image on itself), and the drop target is not the "Add Images" box
    if (draggedIndex !== null && draggedIndex !== index && !isAddImageBox) {
      // Create a copy of the media array to avoid mutating the state directly
      const updatedMedia = [...media];
      
      // Remove the draggedItem from its original position using splice
      const [draggedItem] = updatedMedia.splice(draggedIndex, 1);

      // Insert the draggedItem at the new position using splice
      updatedMedia.splice(index, 0, draggedItem);

      // Update the state with the new order of items
      setMedia(updatedMedia);

      // Update the draggedIndex state to the new position
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
  // Create a shallow copy of the media array and add the selectedImage to the end
    const updatedMedia = [...media, selectedImage];

    // Update the state with the new media array containing the added image
    setMedia(updatedMedia);

    // Close the image selection modal after adding the image
    handleCloseImageSelectionModal();
};

  // Get the selected message for the delete button
  const getSelectedMessage = () => {
    // Get the number of selected items
    const count = selectedItems.length;

    // Check the number of selected items and return a corresponding message
    if (count === 1) {
      return "(1 image selected)";
    } else if (count > 1) {
      return `(${count} images selected)`;
    }

  // If no items are selected, return an empty string
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

      <div className="delete-caption-container">
        <h1 id="caption">Click on the images to delete</h1>
        <button className="btn" onClick={handleDeleteSelected}>
         Delete {getSelectedMessage()}
       </button>
      </div>


      <div className="media-container" id="gallery">
        {/* Display media items */}
        {media.filter(file => file).map((file, index) => (
          // Each media item is represented by a div
          <div
            key={index}  // Unique key for React to efficiently update the DOM
            className={`media ${index === 0 ? "first-image" : ""} ${selectedItems.includes(index) ? "selected" : ""} ${index === draggedIndex ? "dragged" : ""}`}
            draggable  // Enables the element to be draggable
            onDragStart={() => handleDragStart(index)}  // Event handler for the start of the drag
            onDragOver={handleDragOver(index)}  // Event handler for dragging over
            onDragEnd={handleDragEnd}  // Event handler for the end of the drag
            onClick={() => handleToggleSelect(index)}  // Event handler for clicking on the item
          >
            {file.type === "image" ? (  // Conditional rendering based on the type of media
              <img src={file.url} alt="" />  // Display an image if the type is "image"
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
