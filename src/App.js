import React from "react";
import { Media } from "./media";

const App = () => {
  return(
    <div className="container">
      <h1>Responsive Media Gallery</h1>

      <div className="media-container">
        {
          Media.map((file, index) => (
            <div className="media" key={index}>
              {
                file.type === 'image'
                ? <img src= {file.url} alt=""/>
                : <video src={file.url} muted/> 
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App