/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Input, Button } from 'reactstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

const ImageUpload = ({ ImagesData, setImagesDataState, setNewImageState }) => {

    const [selectedImages, setSelectedImages] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredStates, setHoveredStates] = useState([false]);

    const totalImageAllowed = 5;

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newSelectedImages = Array.from(files);
        console.log(newSelectedImages)
        if (newSelectedImages.length < totalImageAllowed) {
            setSelectedImages([...selectedImages, ...newSelectedImages]);
            console.log(selectedImages)

        } else {
            newSelectedImages.pop();
            setSelectedImages([...selectedImages, ...newSelectedImages]);
            console.log(selectedImages)

        }
    };

    const handleImageUpload = () => {
        selectedImages.forEach((selectedImage) => {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);

                fetch('http://localhost:3001/api/compress-images', {
                    method: 'POST',
                    body: formData,
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.blob();
                        } else {
                            console.error('Error uploading image');
                            return Promise.reject('Error uploading image');
                        }
                    })
                    .then((blob) => {
                        const imageUrl = URL.createObjectURL(blob);
                        console.log(imageUrl);

                        // Add imageUrl to your ImagesData state or handle it as needed
                        setImagesDataState((prevImages) => [...prevImages, imageUrl]);
                    })
                    .catch((error) => {
                        console.error('Error uploading image:', error);
                    });
            }
        });

        if (selectedImages.length <= totalImageAllowed) {
            setSelectedImages(selectedImages);
        } else {
            selectedImages.pop();
            setSelectedImages(selectedImages);
        }
    };

    const openImageInNewTab = (url) => {
        window.open(url, '_blank'); // Open the image in a new tab
    };

    const removeImage = (index) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages.splice(index, 1);
        setSelectedImages(newSelectedImages);
        console.log(selectedImages)
    };

    const uploadButton = (
        <div>
            <Input className='m-2' type="file" accept="image/*" onChange={handleImageChange} multiple />
        </div>
    );

    const handleMouseEnter = (index) => {
        const updatedHoveredStates = [...hoveredStates];
        updatedHoveredStates[index] = true;
        setHoveredStates(updatedHoveredStates);
    };

    const handleMouseLeave = (index) => {
        const updatedHoveredStates = [...hoveredStates];
        updatedHoveredStates[index] = false;
        setHoveredStates(updatedHoveredStates);
    };
    return (
        <>
            <div>
                {selectedImages.length > totalImageAllowed ? null : uploadButton
                }
                {/* <button type="button" onClick={handleImageUpload}>Upload Images</button> */}
                <div className="container">
                    <div className="row justify-content-">
                        {selectedImages.map((image, index) => (
                            <div key={index} style={{ height: "150px", width: "150px" }}
                                className="col-md-6">
                                <div
                                    onMouseOver={() => handleMouseEnter(index)}
                                    onMouseLeave={() => handleMouseLeave(index)}
                                    style={{
                                        position: "relative",
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        style={{ height: "100px", width: "100px" }}
                                        className="image-preview img-thumbnail"
                                    />
                                    {hoveredStates[index] && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                zIndex: 2,
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <button
                                                style={{
                                                    background: "rgba(0, 0, 0, 0.5)",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "5px",
                                                }}
                                                onClick={() => removeImage(index)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} /> Delete
                                            </button>
                                            <button
                                                style={{
                                                    background: "rgba(0, 0, 0, 0.5)",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "5px",
                                                }}
                                                onClick={() => openImageInNewTab(URL.createObjectURL(image))}
                                            >
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>





            </div>
        </>
    );
};

export default ImageUpload;

//style={{ height: "100px", width: "100px" }}


