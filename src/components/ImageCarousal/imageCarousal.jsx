import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
import Carousel from "react-bootstrap/Carousel";

const ImageCarousal = ({ Images }) => {
  console.log(Images);

  return (
    <div className="m-4">
      <Carousel>
        {Images.map((url, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={url} alt={`Image ${index}`} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousal;
