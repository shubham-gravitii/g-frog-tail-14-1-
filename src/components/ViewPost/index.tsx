// @ts-nocheck
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Footer from '../Home/Footer'
import ScrollToTop from "react-scroll-to-top";
import Spinner from 'react-bootstrap/Spinner';
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
    Modal,
    ModalBody,
    ModalHeader
} from "react-bootstrap";
import "@vtaits/react-color-picker/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "flatpickr/dist/themes/material_blue.css";
import * as Constants from "../../utils/constants";
import GalleryComponent from "../Board/RecordCardViewPost";
import Dropdown from 'react-bootstrap/Dropdown';
import withAuth from "../../utils/urlAuth";
import FilterPost from "../Filters/Filter";
import { ModalTitle } from "react-bootstrap";
import { da } from "date-fns/locale";
import { useRouter } from "next/navigation";
import NoPostsFound from "../Common/NoPostsFound";
import NoResultMessage from "../NoResultMessage/NoResultMessage"

const ViewPost = () => {
    const router = useRouter();

    const [apikey, setapikey] = useState("99deaecc5f0c49879f851cbded59ff69");
    const [lats, setlats] = useState(0);
    const [longs, setlongs] = useState(0);
    const [globalRantalData, setGlobalRantalData] = useState([]); //Rental Data
    const [data, setData] = useState([]); //Rental Data
    const [warehouseBasicFields, setWarehouseBasicFields] = useState([]); //Basic Data
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] = useState([]); //Specification Data
    const [isLoading, setIsLoading] = useState(false);
    const [noPostsFound, setNoPostsFound] = useState(false);
    const itemsPerPage = Constants.paginationPostPerPage;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationId, setpaginationId] = useState(0);
    const [totalPages, setTotalPages] = useState();
    const [showFilters, setShowFilters] = useState(false);
    const [warehouseIds, setWarehouseIds] = useState([])

    const userData = router.query?.data;
    const location = userData ? JSON.parse(userData).Location : null;

    const handleFilterButtonClick = () => {
        setShowFilters(!showFilters);
    };

    const handleSetBasicDetails = (newValue: any) => {
        setWarehouseBasicFields(prevData => [...prevData, newValue]);
        console.log(newValue)
    }

    const handleSetSpecificationDetails = (newValue: any) => {
        setWarehouseSpecificationFields(prevData => [...prevData, newValue]);
        console.log(newValue)
    }

    const handleSetRentalDetails = (newValue: any) => {
        setData(newValue);
        if (newValue.length === 0) {
            setNoPostsFound(true)
            getRentalData()
        }
        console.log(newValue)
    }

    const handleResetRentalDetails = () => {
        setData(globalRantalData)
        setNoPostsFound(false)
        console.log(globalRantalData)
    }

    const getRentalData = async () => {
        setIsLoading(true);
        console.log(paginationId)
        const res = await axios.get(Constants.local_api_gateway_host + '/rentalDetails', {
            params: {
                PAGINATION_ID: paginationId,
            }
        });
        const data = await res.data;
        console.table(data.response);
        setGlobalRantalData(data.response)
        setData(data.response);
        setIsLoading(false);
    }

    const getBasicData = async () => {
        setIsLoading(true);
        const res = await axios.get(Constants.local_api_gateway_host + '/basicDetails', {
            params: {
                PAGINATION_ID: paginationId,
            }
        });
        const data = await res.data;
        console.table(data.response);

        setWarehouseBasicFields(data.response);
        setIsLoading(false);
    }

    const getSpecData = async () => {
        setIsLoading(true);
        const res = await axios.get(Constants.local_api_gateway_host + '/specificationDetails', {
            params: {
                PAGINATION_ID: paginationId,
            }
        });
        const data = await res.data;
        console.table(data.response);
        setWarehouseSpecificationFields(data.response);
        setIsLoading(false);
    }

    const changetolat = (cord) => {
        const parts = cord.split(/\D+/);
        if (parts.length >= 4) {
            const degrees = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseFloat(parts[2]);
            const direction = parts[3].toUpperCase();
            const decimal = degrees + (minutes / 60) + (seconds / 3600);

            if (direction === "S" || direction === "W") {
                return -decimal.toFixed(6);
            } else {
                return decimal.toFixed(6);
            }
        }
    }

    const getData = async () => {
        let lattitude = 0;
        let longitude = 0;
        setIsLoading(true);
        const userData = JSON.parse(router.query.data);
        const location = userData.Location;
        const radius = parseInt(userData.Warehouse_Distance) * 1000;
        console.log(radius);
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${apikey}`;
        fetch(geocodeUrl, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(async (data) => {
                const lati = data.results[0].annotations.DMS.lat;
                lattitude = changetolat(lati);
                setlats(lattitude);
                console.log(" lattitude " + lattitude);
                const lngi = data.results[0].annotations.DMS.lng;
                longitude = changetolat(lngi);
                setlongs(longitude);
                console.log(" longitude " + longitude);
                const res = await axios.get(Constants.local_api_gateway_host + `/basicDetailsGis?IS_ACTIVE=True&latitude=${lattitude}&longitude=${longitude}&WH_RADIUS=${radius}`);
                const newdata = res.data;
                const totalCount = newdata.response.length;
                console.table(newdata.response);
                const latestData=newdata.response;
                setData(latestData);
                setTotalPages(Math.ceil(totalCount / itemsPerPage));
                console.log(totalCount)
                setNoPostsFound(totalCount === 0);
                setWarehouseBasicFields(newdata.response);
                setWarehouseIds(newdata.response.map(wh => wh.wh_id));
                console.log(warehouseIds);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // useEffect(() => {
    //     if (warehouseIds.length > 0) {
    //         // To Get common data fron basic and rental
    //         getCommanBasicAndRentalData();
    //     }
    // }, [warehouseIds]);

    const getCommanBasicAndRentalData = async () => {
        console.log(warehouseIds)
        const response = await axios.get(Constants.local_api_gateway_host + '/wh_basic_and_rental_details/?warehouse_ids=' + warehouseIds, {
            params: {
                warehouse_ids: warehouseIds,
            },
        });
        console.clear()
        console.log(response.data.response)
        setGlobalRantalData(response.data.response)
        setData(response.data.response)
        setIsLoading(false);
    }

    const getRecordsSize = async () => {
        try {
            const res = await axios.get(Constants.local_api_gateway_host + '/rentalDetailsSize');
            const data = await res.data;
            const totalCount = data.response[0].count;
            const latestPostsPaginationId = totalCount - itemsPerPage;
            setpaginationId(latestPostsPaginationId);
            console.log(paginationId)
            console.log(latestPostsPaginationId);
            console.log(totalCount);
            console.log(Math.ceil(totalCount / itemsPerPage));
            setTotalPages(Math.ceil(totalCount / itemsPerPage));
            setNoPostsFound(totalCount === 0);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGisData = async () => {
        try {
            await getData();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);

        try {

            const fetchDataSize = async () => {
                await getRecordsSize();
            }
            fetchDataSize()
        } catch (error) {
            console.error('Error fetching data:', error);

        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setIsLoading(true);

        try {
            const fetchData = async () => {
                try {

                    if (location) {
                        // Run one API call with the filter data
                        fetchGisData();
                    } else {
                        // Run another API call without the filter data
                        getRentalData();
                        getBasicData();
                        getSpecData();
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();

        } catch (error) {
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, paginationId]);


    const handlePageChange = (newPage: any) => {
        console.log(currentPage)
        console.log(totalPages)
        console.log(newPage)
        setNoPostsFound(false)
        if (newPage > 1) {
            const newPaginationId = ((totalPages * (itemsPerPage - 1)) - ((newPage - 1) * itemsPerPage))
            setpaginationId(newPaginationId);
            console.log(newPaginationId);
            setCurrentPage(newPage);
        } else {
            setpaginationId(totalPages * (itemsPerPage - 1));
            setCurrentPage(newPage);
        }
    };

    const handleNextPageChange = (newPage: any) => {
        console.log(currentPage)
        console.log(totalPages)
        if (newPage >= 1) {
            setCurrentPage(newPage);
            setpaginationId((data[0]?.pagination_id - 1) - itemsPerPage)
            console.log((data[0]?.pagination_id - 1) - itemsPerPage)
        }
    };

    const handlePrevPageChange = (newPage: any) => {
        console.log(currentPage)
        console.log(totalPages)
        if (newPage >= 1) {
            setCurrentPage(newPage);
            console.log(data[data.length - 1]?.pagination_id)
            setpaginationId((data[data.length - 1]?.pagination_id))
            console.log((data[data.length - 1]?.pagination_id))
        }
    };

    const handleSort = (type: string) => {
        setIsLoading(true);

        const sortedCopy = [...data];

        if (type === "descLease" || type === "ascLease") {
            sortedCopy.sort((a, b) => a.wh_min_lease - b.wh_min_lease);
            if (type === "descLease") {
                sortedCopy.reverse();
            }
        } else if (type === "descRentalRate" || type === "ascRentalRate") {
            sortedCopy.sort((a, b) => a.wh_rental_rate - b.wh_rental_rate);
            if (type === "descRentalRate") {
                sortedCopy.reverse();
            }
        }
        setData(sortedCopy);
        setIsLoading(false);
    };

    return (
        <>
            <React.Fragment>``

            <div style={{ minHeight: "100vh" }}>
                    <div className="section__title-wrapper text-center">
                        
                        <h2 style={{ color: "white" }} className="section__title mt-2">
                            View Post for Customer
                        </h2>
                        <p style={{ color: "white" }} >
                            View Listing Of All Owner Rental Details
                        </p>

                        <br />
                    </div>


                    <Row className="mx-auto">
                        <Col xs="6" sm="2" md="2" lg="2" className="d-block d-md-none">
                            <Button
                                variant="light p-2"
                                onClick={handleFilterButtonClick}
                            >
                                <span>
                                    <i className="fa fa-filter m-1 p-1"></i>
                                </span>

                            </Button>
                        </Col>

                        <Col >
                            <Dropdown className="mr-5 float-end">
                                <Dropdown.Toggle size="lg" className="ml-3" variant="light" id="dropdown-basic">
                                    {<span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32z" /></svg>
                                    </span>}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <button className="btn btn-link nav-link" onClick={() => { handleSort("ascLease") }}>Duration: Low to High</button>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <button className="btn btn-link nav-link" onClick={() => { handleSort("descLease") }}>Duration: High to Low</button>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <button className="btn btn-link nav-link" onClick={() => { handleSort("ascRentalRate") }}>Rent: Low to High</button>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <button className="btn btn-link nav-link" onClick={() => { handleSort("descRentalRate") }}>Rent: High to Low</button>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>




                    <div>
                        <Row className="mx-auto">
                            <Col xs="12" sm="12" md="4" lg="4" xl="3" className="py-3 my-3 d-none d-md-block">
                                <FilterPost
                                    RentalFields={data}
                                    BasicFields={warehouseBasicFields}
                                    SpecificationFields={warehouseSpecificationFields}
                                    SetBasicDetails={handleSetBasicDetails}
                                    SetSpecificationDetails={handleSetSpecificationDetails}
                                    SetRentalDetails={handleSetRentalDetails}
                                    handleResetRentalDetails={handleResetRentalDetails}
                                />
                            </Col>

                            {/* Posts Column */}
                            <Col xs="12" sm="12" md="8" lg="8" xl="9">
                                {isLoading ? (
                                    <div className="text-center p-5">
                                        <Spinner className="spinner-border text-light" />
                                    </div>
                                ) : (
                                    <Row className="m-3">

                                        {noPostsFound && <NoPostsFound />}

                                        {data?.map((e, i) => (
                                            // <Col xs="12" sm="6" md="6" lg="6" className="py-3" key={i}>
                                            //     <GalleryComponent
                                            //         RentalFields={e}
                                            //         BasicFields={warehouseBasicFields}
                                            //         SpecificationFields={warehouseSpecificationFields}
                                            //         SetBasicDetails={handleSetBasicDetails}
                                            //         SetSpecificationDetails={handleSetSpecificationDetails}
                                            //         SetRentalDetails={handleSetRentalDetails}
                                            //     />
                                            // </Col>
                                           
                                            <Col key={i} xs="12" sm="6" md="6" lg="6" xl="4" className="py-3">
                                                <GalleryComponent
                                                    RentalFields={e}
                                                // BasicFields={warehouseBasicFields}
                                                // SpecificationFields={warehouseSpecificationFields}
                                                // SetBasicDetails={handleSetBasicDetails}
                                                // SetSpecificationDetails={handleSetSpecificationDetails}
                                                // SetRentalDetails={handleSetRentalDetails}
                                                />

                                             
                                            </Col>
                                        ))}

                                        <Row className="mx-auto justify-content-md-center mt-4">
                                            <div className="col-md-auto">
                                                <nav aria-label="Page navigation">
                                                    <ul className="pagination">
                                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                            <button className="page-link" onClick={() => handlePrevPageChange(currentPage - 1)}>
                                                                Previous
                                                            </button>
                                                        </li>
                                                        {Array.from({ length: totalPages }, (_, index) => {
                                                            const page = index + 1;
                                                            const isCurrentPage = currentPage === page;
                                                            const isNearCurrentPage = Math.abs(page - currentPage) <= 1;

                                                            if (isCurrentPage || page === 1 || page === totalPages || isNearCurrentPage) {
                                                                return (
                                                                    <li className={`page-item ${isCurrentPage ? 'active' : ''}`} key={index}>
                                                                        {/* <button className="page-link" onClick={() => handlePageChange(page)}>
                                                                            {page}
                                                                        </button> */}
                                                                        <button className={`page-link  ${isCurrentPage ? '' : 'link-secondary'} `} disabled>
                                                                            {page}
                                                                        </button>
                                                                    </li>
                                                                );
                                                            } else if (page === 2 || page === totalPages - 1) {
                                                                return (
                                                                    <li className="page-item disabled" key={index}>
                                                                        <span className="page-link ">...</span>
                                                                    </li>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                            <button className="page-link" onClick={() => handleNextPageChange(currentPage + 1)}>
                                                                Next
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </Row>
                                    </Row>
                                )}
                            </Col>

                            <Modal show={showFilters} onHide={handleFilterButtonClick} size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>Filters</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FilterPost
                                        RentalFields={data}
                                        BasicFields={warehouseBasicFields}
                                        SpecificationFields={warehouseSpecificationFields}
                                        SetBasicDetails={handleSetBasicDetails}
                                        SetSpecificationDetails={handleSetSpecificationDetails}
                                        SetRentalDetails={handleSetRentalDetails}
                                    />
                                </Modal.Body>
                            </Modal>
                        </Row>
                    </div>

                </div>
                <ScrollToTop
                    smooth
                />

            </React.Fragment>
        </>
    );
};
export default ViewPost;

{/* <Row>
{data?.map((e, i) => {
  return (
    <RecordCardBroker
      key={e}
      IDName={e.broker_id}
      pickupdates={e.broker_load_pickup_date}
      origin={e.broker_load_origin}
      IDLoad={e.broker_load_id}
      Timestamps={e.broker_load_created_timestamp}
      delivery={e.broker_load_delivery_date}
      load={e.broker_load_equipment_type}
      weight={e.broker_load_weight}
      destinations={e.broker_load_destination}
      commodity={e.broker_load_commodity}
      Distances={e.broker_load_distance}
      rates={e.broker_load_rate}
      addition={e.broker_load_additional_requirements}
    />
  );
})}
</Row> */}

{/* <RecordCardCustomer
                  key={i}
                  details={e}
                  // RENTAL_ID={e.WH_RENTAL_ID}
                  // RENTAL_ID_CREATED_TIMESTAMP={e.WH_RENTAL_ID_CREATED_TIMESTAMP}
                  // RENTAL_DATE={e.WH_RENTAL_AVAILABLE_DATE}
                  // MIN_LEASE={e.WH_MIN_LEASE}
                  // MAX_LEASE={e.WH_MAX_LEASE}
                  // RENTAL_RATE={e.WH_RENTAL_RATE}
                  // RENTAL_UNIT={e.WH_RENTAL_UNIT}
                  // SECURITY_DEPOSIT={e.WH_SECURITY_DEPOSIT}
                  // LOCK_IN_PERIOD={e.WH_LOCK_IN_PERIOD}
                  // RENTAL_INCREMENT={e.WH_RENTAL_INCREMENT}
                  // NOTICE_PERIOD={e.WH_NOTICE_PERIOD}
                  // RENT_FREE_PERIOD={e.WH_RENT_FREE_PERIOD}
                  // ACTIVE={e.IS_ACTIVE}
                  // VERIFIED={e.IS_VERIFIED}
                  // WH_ID={e.WH_ID}
                  /> */}

{/* {data?.map((e, i) => {
                return (
                  <>
                    <Col xs="12" sm="6" md="4" lg="4" className="p-3" key={i}>
                      <GalleryComponent details={e} />
                    </Col>
                  </>
                );
              })} */}

// {/* <Row className="mx-auto">

// {/* Filter Column */}
// <Col xs="12" sm="4" md="4" lg="2" className="py-3 my-3">
//   <FilterPost />
// </Col>

// {/* Posts Column */}
// <Col xs="12" sm="8" md="8" lg="10">
//   {isLoading ? (
//     <div className="text-center p-5">
//       <Spinner className="spinner-border text-light" />
//     </div>
//   ) : (
//     <Row className="m-3">
//       {data?.map((e, i) => (
//         <Col xs="12" sm="6" md="6" lg="6" className="py-3" key={i}>
//           <GalleryComponent details={e} />
//         </Col>
//       ))}
//     </Row>
//   )}
// </Col>
// </Row> */}

{/* <Row className="mx-auto justify-content-md-center">
            <div className="col-md-auto">
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage + 1 > totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </Row> */}