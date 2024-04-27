import React, { useEffect, useState } from 'react';
import { ReactPhotoCollage } from 'react-photo-collage';
import { Web3Storage } from 'web3.storage'
import * as Constants from "../../utils/constants"
import Button from 'react-bootstrap/Button';
import { Input } from 'reactstrap';
import axios from 'axios';

const PhotoCollageWithEdit = ({ initialPhotos, onSave }) => {
    const [photos, setPhotos] = useState(initialPhotos);
    const [newPhotos, setNewPhotos] = useState([]);

    const getRecords = async () => {
        const data = await axios.get(Constants.local_api_gateway_host + '/mediaStorageCID/');
        console.log(data.data.response)
        const responseData = data.data.response
        // const response = await axios.get(Constants.api_gateway_host + '/wh_media_storage_cid/?WH_ID=' + id);
        // const responseData = response.data.response as StorageCidItem[];
        // setStorageCid(responseData);

        if (responseData.length > 0) {
            for (let i = 0; i < responseData.length; i++) {
                getImages(responseData[i].cid)
                console.log(responseData[i].cid)
            }
        }
    }
    useEffect(()=>{
        try {
            getRecords()
        } catch (error) {
            console.log(error)
        }
    },[])
    const handleDeletePhoto = (index) => {
        const updatedPhotos = [...photos];
        updatedPhotos.splice(index, 1);
        setPhotos(updatedPhotos);
    };

    const getImages = async (cidnumber: string) => {


        const client = new Web3Storage({ token: Constants.web3ApiToken });
        const cid = cidnumber;

        try {
            const res = await client.get(cid);
            if (!res.ok) {
                throw new Error(`Failed to get ${cid} - [${res.status}] ${res.statusText}`);
            }

            const files = await res.files();
            const imagePromises = files.map(async (file) => {
                console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
                const url = 'https://ipfs.io/ipfs/' + cid + '/' + file.name;
                return url;
            });

            const imageUrls = await Promise.all(imagePromises);
            console.log(imageUrls)
            // setImages({ img: imageUrls });
            // console.log({ img: imageUrls })

        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleDrop = (acceptedFiles) => {
        // Here, you can handle the uploaded files (images).
        // You might want to upload them to a server or process them as needed.
        // For this example, we'll just add them to the newPhotos state.
        setNewPhotos([...newPhotos, ...acceptedFiles]);
    };

    const handleSave = () => {
        const updatedPhotos = [...photos, ...newPhotos];
        onSave(updatedPhotos);
        setPhotos(updatedPhotos);
        setNewPhotos([]);
    };

    return (
        <>
            <div>
                <div className="row">
                    {photos.map((photo, index) => (
                        <div className="col-md-3" key={index}>
                            <div className="image-container">

                                <button type="button" className="btn-close" aria-label="Close" onClick={() => handleDeletePhoto(index)}></button>
                                <img src={photo.source} alt={`Image ${index}`} />

                            </div>
                        </div>
                    ))}
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Input
                        className='m-2'
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleDrop(Array.from(e.target.files))}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <Button className='m-1' type='submit' variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>

                    </div>
                </div>
            </div></>
    );
};

export default PhotoCollageWithEdit;
