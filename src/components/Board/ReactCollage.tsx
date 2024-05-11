//@ts-nocheck
import React, { useEffect, useState } from "react"
import { Web3Storage } from 'web3.storage'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Image from "next/image"
import { ZoomIn, ZoomOut } from "react-feather"
import * as Constants from "../../utils/constants"
import { argThresholdOpts } from "moment"

const Reactcollage = () => {
    const [imageUrl, setImageUrl] = useState<HTMLInputElement | void | string>("");
    const [processedarray, setprocessedarray] = useState<string[]>([])
    const [data, setdata] = useState<{ img: string, i: number }>({ img: "", i: 0 });
    const [images, setImages] = useState<{ img: Array<string>, i: number }>({ img: [], i: 0 });
    const imagesarray = ["bafybeiamsf5ovaqqjn7ov5syehyodiwjcxdal523xjfwkqpnx5nbhrfeee",
        "bafybeigndfjus5tlal6lxjispjuklauoscwolncb3nxjefa2fbjdp25b7u",
        "bafybeia3ubym4hjncex7s4wdnm6t7dgdhd7hzlm3vlckzi4gchktia552u",
        "bafybeidrjkzxyhaweyc4nxmngs2vgm6zc3sghyu7hx2y2ewsqvbkcbx4j4",
        "bafybeie6dmapqxnqs64dfp3q7l22m72nguxqsgeiobjnr3gbx6ybzvmwje"];

    const imagesurl = ["https://ipfs.io/ipfs/bafybeiekkgioconklkjczbdlzovw4bsaceuklngoheqp6kpbjkwtmadlxi/images (2).jpg",
        "https://ipfs.io/ipfs/bafybeifx35alf644tgtnneaxnm37srmb4snlxlatajsxw2rpzz7x3efauu/WIN_20230115_23_59_59_Pro.jpg",
        "https://ipfs.io/ipfs/bafybeifx35alf644tgtnneaxnm37srmb4snlxlatajsxw2rpzz7x3efauu/WIN_20230115_23_59_59_Pro.jpg",
        "https://ipfs.io/ipfs/bafybeiebri5rlzeq7uqa7jwusmrlzklfmdcez6rvt46dgglsea7zwysxbe/images (1).jpg",
        "https://ipfs.io/ipfs/bafybeiebri5rlzeq7uqa7jwusmrlzklfmdcez6rvt46dgglsea7zwysxbe/images (1).jpg",
        "https://ipfs.io/ipfs/bafybeiebri5rlzeq7uqa7jwusmrlzklfmdcez6rvt46dgglsea7zwysxbe/images (1).jpg"
    ];

    function makeStorageClient() {
        return new Web3Storage({ token: Constants.web3ApiToken })
    }

    const getimages = async (cidnumber) => {
        const client = new Web3Storage({ token: Constants.web3ApiToken });
        const cid = cidnumber;
        const res = await client.get(cid)
        console.log(`Got a response! [${res.status}] ${res.statusText}`)
        if (!res.ok) {
            throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
        }
        const files = await res.files()
        files.map((file) => {
            console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
            const url = 'https://ipfs.io/ipfs/' + cid + '/' + file.name;
            images.img.push(url);
            images.i = images.i+1;
            console.log("images:  "+images.img);
        });
    }

    // const retrieveFiles = async (cid) => {
    //     const client = makeStorageClient()
    //     const res = await client.get(cid)
    //     console.log(`Got a response! [${res.status}] ${res.statusText}`)
    //     if (!res.ok) {
    //         throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
    //     }

    //     // unpack File objects from the response
    //     const files = await res.files()
    //     for (const file of files) {
    //         console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
    //         images.push(file.name)
    //     }
    //     console.log("images " + images);
    // }

    useEffect(() => { imagesarray.forEach(getimages) 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const viewImage = (img, i) => {
        setdata({ img, i });
    }
    const imageaction = (action: any) => {
        let i = data.i;
        if (action === 'next-img') {
            setdata({ img: imagesurl[i + 1], i: i + 1 })
        }
        if (action === 'prev-img') {
            setdata({ img: imagesurl[i - 1], i: i - 1 })
        }
        if (!action) {
            setdata({ img: '', i: 0 })
        }
    }
    return (
        <div>
            {data.img &&
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    top: 0,
                    position: 'fixed',
                    left: 0,
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    <button
                        style={{
                            alignSelf: 'flex-start',
                            margin: '10px',
                            padding: '8px 16px',
                            border: 'none',
                            background: 'transparent',
                            color: 'white',
                            fontSize: '18px',
                            cursor: 'pointer'
                        }}
                        onClick={() => imageaction('')}
                    >
                        Close &times;
                    </button>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                backgroundColor: 'transparent',
                                border: '1px solid white',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onClick={() => imageaction('prev-img')}
                        >
                            &lt;
                        </button>
                        <img
                            src={data.img}
                            style={{
                                padding: "5px",
                                maxWidth: '90%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)',
                                cursor: 'zoom-out'
                            }}
                        />
                        <button
                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                backgroundColor: 'transparent',
                                border: '1px solid white',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onClick={() => imageaction('next-img')}
                        >
                            &gt;
                        </button>
                    </div>
                </div>

            }
            <div>
                <ResponsiveMasonry
                    columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                    <Masonry gutter="10px">
                        {images.img.map((image, i) => (
                            <img
                                key={i}
                                src={image}
                                style={{ width: "100%", display: "block", cursor: 'pointer' }}
                                alt=""
                                onClick={() => viewImage(image, i)}
                            />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        </div>


    );
}
export default Reactcollage;