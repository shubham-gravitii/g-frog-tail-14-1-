/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import * as Constants from "../../utils/constants"


const ImageUpload = ({ ImagesData, setFileListState, setNewImageState, setDeletedImageState }) => {
    console.log(ImagesData)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(ImagesData.map((url, index) => ({
        uid: index.toString(),
        name: `image-${index}.png`,
        status: 'done',
        url: url,
    })));
    const totalImageAllowed = Constants.imagesPerPostAllowed;

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const newFileImageObjects = fileList.map((file) => file.originFileObj);
        console.log(newFileImageObjects)
        console.log(newFileList)

        const filteredArray = newFileImageObjects.filter((item) => item !== undefined);

        if (newFileList.length <= totalImageAllowed) {
            setFileList(newFileList);
            setFileListState(newFileList)
            setNewImageState(filteredArray)
            setDeletedImageState(newFileList)
            console.log(newFileList)
        } else {
            newFileList.pop();
            setFileList(newFileList);
            setFileListState(newFileList)
            setNewImageState(filteredArray)
            setDeletedImageState(newFileList)
            console.log(newFileList)
        }

    }

    const uploadButton = (
        <div >
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={true}
                // style={{ width: '200px', height: "200px" }}
                className='d-flex justify-content-center'
                
            >

                {fileList.length >= totalImageAllowed ? null : uploadButton}
            </Upload>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="Warehouse Image" style={{ width: '100%' }} src={previewImage[0]} />
            </Modal>
        </>
    );
};

export default ImageUpload;