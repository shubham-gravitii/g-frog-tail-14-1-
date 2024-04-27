// @ts-nocheck
'use client'
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import * as Constants from "../../utils/constants";

import ImgFlip from './ImgFlip'
import Spinner from 'react-bootstrap/Spinner'
const Background = () => {
  const [isLoading, setisLoading] = useState(true)
  const [data, setData] = useState([]);


  const imageLinks = [
    "https://media.istockphoto.com/id/1284193221/photo/retail-warehouse-full-of-shelves-with-goods-in-cardboard-boxes-workers-scan-and-sort-packages.jpg?s=2048x2048&w=is&k=20&c=Bx46w3muoV2wXSjOgvfg5PymCxtVLoa866LO8vShCVE=",
    "https://media.istockphoto.com/id/1302200961/photo/autonomous-robot-transportation-in-warehouses-warehouse-automation-concept.jpg?s=2048x2048&w=is&k=20&c=dZdmmZoN_XXQkM1ujMrVGizVNPX1Pm1UQa02DwxGbRA=",
    "https://media.istockphoto.com/id/1425627709/photo/pile-of-fresh-fish-in-traditional-market-local-small-business.jpg?s=2048x2048&w=is&k=20&c=stjDjLY1-81uWX5gYYYnV5tAeG_uDecl6ausYCvzZOQ=",
    "https://media.istockphoto.com/id/1437355350/photo/cargo-containes-at-sea-port-global-business.jpg?s=2048x2048&w=is&k=20&c=dGSlQpEA5YvV6Po3i7OEcDbWekXfoGTe3uEGerzyFXY=",
    "https://media.istockphoto.com/id/1460822484/photo/warehouse-tablet-and-people-teamwork-for-storage-inventory-and-supply-chain-management-for.jpg?s=2048x2048&w=is&k=20&c=y3kVRsNe0ug8YozS04mL8F7tUxbPDSVzQRpgVnXUyQI=",
    "https://media.istockphoto.com/id/1349338733/photo/future-technology-3d-concept-automated-retail-warehouse-agv-robots-with-infographics.jpg?s=2048x2048&w=is&k=20&c=804Qw4y-ewqrW4qdfX9Z91qT0R1DhTLi5whqkKGNQjE=",
    "https://media.istockphoto.com/id/1329695941/photo/smart-warehouse-management-system.jpg?s=2048x2048&w=is&k=20&c=vnHaQs6StQBCsfFk-sAORi_LTIsmzUv3el-mhtgUNdg=",
    "https://media.istockphoto.com/id/1493118569/photo/manager-with-arms-crossed-standing-by-cardboard-boxes-in-storage-room.jpg?s=2048x2048&w=is&k=20&c=4n3CRNXlW-5WrsASyVg-EMpk6veCzx0Mx9I7UOXmSEs=",
  ];

  const gradientBackground = {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle closest-corner at center 125px,#222,black 40%) no-repeat", // Change colors as needed
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  // background: radial-gradient( at top left, var(--light), var(--dark)
  

  useEffect(() => {
    axios
      .get(Constants.api_gateway_host + `/wh_basic_details`, {})
      .then((response) => {
        // console.log(response);
        const data = response.data;
        // console.log(data.response);
        setData(data.response);
        setisLoading(false)

      })
      .catch((error) => {
        console.error(error);
        setisLoading(false)

      });

  }, []);

  

  return (
    <>
      <div className=" py-5" style={gradientBackground}>
        <Container>
          <Row>
            <div className="container row px-2 pl-2 ">
              <div className="row justify-content-center">
                <div className="col-lg-6 ">
                  <div className="text-center my-5">
                    <h1 className="display-5 fw-bolder text-white mb-2 ml-1">
                      Know about our product GRAVITII
                    </h1>
                    <p className=" text-white-50 mb-4 ml-1">
                      Quickly design and customize responsive mobile-first sites
                      with Bootstrap, the world’s most popular front-end open
                      source toolkit!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <div className="bg-black py-4">
              <h1 className="text-4xl fw-bolder text-white font-bold text-center">
                WAREHOUSES AVAILABLE
              </h1>
            </div>
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={true}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={1000}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
            >
              {imageLinks.map((link, index) => (
                <div key={index} className="p-3 m-3">
                  <img src={link} alt={`Image ${index}`} style={{ height: "300px", width: "400px", objectFit: "cover", borderRadius: "30px" }} className="" />
                </div>
              ))}
            </Carousel>
          </Row>

          <Row>
            <div className="bg-black py-4">
              <h1 className="text-4xl fw-bolder text-white font-bold text-center">
                PREMIUM POSTS
              </h1>
            </div>
            {isLoading ?
              <div className="text-center">
                <Spinner animation="border" variant="light" />
              </div> :
              <Carousel
                style={{ width: '100vh', height: '100vh' }}
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={false}
                autoPlaySpeed={2000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={1000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
              >
                {/* {imageslink.map((link, index) => (
          <div key={index} className="p-3" onClick={handleClick}>
            <img src={link} alt={`Image ${index}`} />
          </div>
        ))} */}
                {/* {data?.slice(0, 10).map((e, i) => (
                < >
                
                  <div className="m-3 mb-5">
                    <GalleryComponentOwnerViewOwnPost
                      style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "10px",
                        transition: "background-color 0.3s, box-shadow 0.3s",
                        width: '100vh',
                        height: '100vh',
                      }}
                      details={e}
                    />
                  </div>
                </>
              ))} */}

                {data?.slice(0, 10).map((e, i) => (

                  < >
                    {console.log(e)}
                    {console.log("Img data")}
                    <div className="m-3 mb-5">
                      <ImgFlip
                        style={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          padding: "10px",
                          transition: "background-color 0.3s, box-shadow 0.3s",
                          width: '100vh',
                          height: '100vh',
                        }}
                        details={e}
                      />
                    </div>

                  </>
                ))}
              </Carousel>
              }
              

          </Row>

        </Container>
      </div>
    </>
  );
};

export default Background;
