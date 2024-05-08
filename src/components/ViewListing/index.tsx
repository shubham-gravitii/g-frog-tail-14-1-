// @ts-nocheck
import React, { useEffect, useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
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
} from "reactstrap";
import "@vtaits/react-color-picker/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import RecordList from "../../components/Board/RecordList";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import RecordRate from "../../components/Board/RecordRate";
import RecordCardOwner from "../../components/Board/RecordCardOwner.tsx";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as Constants from "../../utils/constants";
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import Footer from '../../components/Home/Footer'
import { useAuth } from "../../contexts/UserContext";
import withAuth from "../../utils/urlAuth";
import GalleryComponentCustomerViewOwnPost from "../../components/Board/RecordCardCustomerViewOwnPost";
import { useRouter, useSearchParams } from "next/navigation";
import NoPostsFound from "../../components/Common/NoPostsFound";

const RateExplorer = () => {
    const router = useRouter();   //used to access data coming from board explorer
    const [apikey, setapikey] = useState("99deaecc5f0c49879f851cbded59ff69");  //apikey for the opencage 
    const [lats, setlats] = useState(0);
    const [longs, setlongs] = useState(0);
    const [selectedSource, setSelectedSource] = useState("");
    const [EquipmentType, setEquipmentType] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const [data, setData] = useState([]);
    const { currentUser } = useAuth()
    const [noPostsFound, setNoPostsFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = Constants.paginationPostPerPage;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationId, setpaginationId] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [showFilters, setShowFilters] = useState(false);
    const searchParams=useSearchParams();
    
    // const userData = router.query.data;                                 //accessing data from search box
    const userData = searchParams.get('data');                                 //accessing data from search box
    const location = userData ? JSON.parse(userData).Location : null;
    // const [datas, setDatas] = useState([])
    const [globalData, setGlobalData] = useState([]);

    //function to run when no information is enterd by the user while searching 
    const getRecords = async () => {
        const res = await fetch(Constants.local_api_gateway_host + "/requirementDetails/", {
            params: {
                PAGINATION_ID: paginationId,
            }
        });
        const data = await res.json();
        const totalCount = data.response.length;
        setData(data.response);
        setGlobalData(data.response);
        setNoPostsFound(totalCount === 0);
        setIsLoading(false);
    };

    const startIndex = 0;
    const endIndex = 1;
    console.log(data);

    const getRecordsSize = async () => {
        const res = await axios.get(Constants.local_api_gateway_host + '/requirementDetailsSize/');
        const data = await res.data;
        const totalCount = data.response[0].count;
        console.log(Math.ceil(totalCount / itemsPerPage));
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
        setNoPostsFound(totalCount === 0);
    };

    //SARTHAK for search Query
    const changetolat = (cord) => {                    //to change gps coordinates into readable format
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

    //function to search using gis_query
    const getData = async () => {
        let lattitude = 0;
        let longitude = 0;
        setIsLoading(true);
        
        const userData = JSON.parse(searchParams.get('data'));
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
                const res = await axios.get(Constants.api_gateway_host + `/wh_requirement_details_gis/?latitude=${lattitude}&longitude=${longitude}&WH_RADIUS=${radius}`);
                const newdata = await res.data;
                const totalCount = newdata.response.length;
                console.log(totalCount);
                setTotalPages(Math.ceil(totalCount / itemsPerPage));
                setData(newdata.response);
                setGlobalData(newdata.response);
                console.table(newdata.response);
                setNoPostsFound(totalCount === 0);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if location is defined
                if (location) {
                    // Run one API call with the filter data
                    const fetchGisData = async () => {
                        try {
                            await getData();
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    fetchGisData();

                } else {
                    getRecordsSize();//to get number post in requirement details
                    getRecords();//to get posts
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const getPostThumbnail = (firstLetter) => {

        if (!firstLetter) {
            const defaultThumbnail =
                "https://images.unsplash.com/photo-1591795523670-5999e124d7d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
            return defaultThumbnail;
        }

        const letter = firstLetter.charAt(0).toUpperCase();
        console.log(letter)
        const apiEndpoint = (letter) => {
            return `https://ui-avatars.com/api/?size=256&name=${letter}&background=3dd5f3&color=000`;
        };

        const defaultThumbnails = {};

        for (let charCode = 'A'.charCodeAt(0); charCode <= 'Z'.charCodeAt(0); charCode++) {
            const letter = String.fromCharCode(charCode);
            defaultThumbnails[letter] = apiEndpoint(letter);
        }

        return defaultThumbnails[letter] || defaultThumbnails['DEFAULT'];
    };

    const handlePageChange = (newPage: any) => {
        console.log(currentPage)
        console.log(totalPages)
        console.log(newPage)

        if (newPage > 1) {
            const newPaginationId = (newPage) * Constants.paginationPostPerPage;
            setpaginationId(newPaginationId);
            console.log(newPaginationId);
            setCurrentPage(newPage);
        } else {
            setpaginationId(1);
            setCurrentPage(newPage);
        }
    };

    const handleNextPageChange = (newPage: any) => {
        console.log(currentPage)
        console.log(totalPages)
        if (newPage >= 1) {
            setCurrentPage(newPage);
            setpaginationId(data[data.length - 1]?.pagination_id)
            console.log(data[data.length - 1]?.pagination_id)
        }
    };

    const handlePrevPageChange = (newPage: any) => {
        console.log(currentPage)
        console.log(totalPages)
        if (newPage >= 1) {
            setCurrentPage(newPage);
            setpaginationId((data[0]?.pagination_id - 1) - Constants.paginationPostPerPage)
            console.log((data[0]?.pagination_id) - Constants.paginationPostPerPage)
        }
    };


    return (
        <>
            <React.Fragment>
                <Container
                    style={{ minHeight: "100vh" }}
                    fluid={true}
                    className="black-bg"
                >
                    <Container fluid={true} className="black-bg">
                        <div className="section__title-wrapper text-center mb-60">
                            <br />
                            <h2 style={{ color: "white" }} className="section__title">
                                View Post for Owner{" "}
                            </h2>
                            <p style={{ color: "white" }}>
                                View Listing Of All Customer Requirements Details{" "}
                            </p>
                            <br />
                        </div>
                        <br></br>

                        {data?.length === 0 && noPostsFound ? (<div> <NoPostsFound /> </div>) :
                            <>
                                {isLoading ? (<div className="text-center p-5"> <Spinner className="spinner-border text-light" /></div>) : <><Row>
                                    {currentUser ?
                                        <>
                                            <Row className="m-3">
                                                {data?.map((e, i) => (
                                                    <Col key={i} xs="12" sm="6" md="4" lg="4" className="py-3">
                                                        <RecordCardOwner
                                                            thumbnail={getPostThumbnail(e.requirement_location)}
                                                            req_post_id={e.requirement_post_id}
                                                            created_timestamp={e.requirement_id_created_timestamp}
                                                            start_date={e.requirement_start_date}
                                                            req_location={e.requirement_location}
                                                            req_max_distance={e.requirement_max_distance}
                                                            req_area={e.requirement_area}
                                                            req_wh={e.requirement_wh}
                                                            req_duration={e.requirement_duration}
                                                            req_other_details={e.requirement_other_details}
                                                            req_rate={e.requirement_rate}
                                                            customer_id={e.customer_id}
                                                        />
                                                    </Col>

                                                )
                                                )}
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
                                                                    const isNearCurrentPage = Math.abs(page - currentPage) <= 2;

                                                                    if (isCurrentPage || page === 1 || page === totalPages || isNearCurrentPage) {
                                                                        return (
                                                                            <li className={`page-item ${isCurrentPage ? 'active' : ''}`} key={index}>
                                                                                <button className="page-link" onClick={() => handlePageChange(page)}>
                                                                                    {page}
                                                                                </button>
                                                                            </li>
                                                                        );
                                                                    } else if (page === 2 || page === totalPages - 1) {
                                                                        return (
                                                                            <li className="page-item disabled" key={index}>
                                                                                <span className="page-link">...</span>
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

                                        </> :
                                        <>
                                            {data?.slice(startIndex, endIndex).map((e, i) => (
                                                <Col xs="12" sm="6" md="4" lg="3"
                                                    style={{
                                                        borderRadius: '10px',
                                                        padding: '10px',
                                                        transition: 'background-color 0.3s, box-shadow 0.3s',
                                                    }}
                                                    key={i}>
                                                    <RecordCardOwner
                                                        key={e}
                                                        req_post_id={e.requirement_post_id}
                                                        created_timestamp={e.requirement_id_created_timestamp}
                                                        start_date={e.requirement_start_date}
                                                        req_location={e.requirement_location}
                                                        req_max_distance={e.requirement_max_distance}
                                                        req_area={e.requirement_area}
                                                        req_wh={e.requirement_wh}
                                                        req_duration={e.requirement_duration}
                                                        req_other_details={e.requirement_other_details}
                                                        req_rate={e.requirement_rate}
                                                        customer_id={e.customer_id}
                                                    />
                                                </Col>
                                            ))}
                                        </>}
                                </Row>
                                </>}

                            </>}


                    </Container>
                </Container>
            </React.Fragment>
        </>
    );
};

export default RateExplorer;

// export default withAuth(RateExplorer, ['Owner']);
