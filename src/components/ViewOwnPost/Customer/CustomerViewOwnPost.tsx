// @ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Constants from "../../../utils/constants";
import Footer from '../../../components/Home/Footer';
import { useAuth } from '../../../contexts/UserContext';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';
import withAuth from '../../../utils/urlAuth';
import { ReactPhotoCollage } from "react-photo-collage";
import ImageEditor from '../../../components/ImageEditor/ImageEditor';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
} from "reactstrap";
import Spinner from 'react-bootstrap/Spinner';
import PostBulkEdit from '../../../components/PostBulkEdit/PostBulkEdit';
import GalleryComponentCustomerViewOwnPost from '../../Board/RecordCardCustomerViewOwnPost';

const CustomerViewOwnPost = () => {
    const { currentUser } = useAuth()

    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedData, setEditedData] = useState({});
    const [show, setShow] = useState(false);
    const [requirementDetails, setRequirementDetails] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = Constants.paginationPostPerPage;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [paginationId, setpaginationId] = useState();
    const [customerId, setCustomerId] = useState("");

    const getUserPosts = async (id: string) => {
        try {
            console.log(id)
            const response = await axios.get(Constants.local_api_gateway_host + `/requirementDetails/?CUSTOMER_ID=${id}`);
            console.log(response);
            const userData = response.data;
            console.log("consoling posts data")
            console.log(userData.response);
            setData(userData.response);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            throw error;
        }
    };

    const getRecordsSize = async (id: string) => {
        try {
            console.log(id)
            const res = await axios.get(Constants.local_api_gateway_host + `/requirementDetailsSize/?CUSTOMER_ID=${id}`);
            const data = res.data;
            console.log(data);
            const totalCount = data.response[0].count;
            console.log(Math.floor(totalCount / itemsPerPage));
            console.log(data.response[0])
            console.log(data.response[0].min);
            setTotalPages(Math.floor(totalCount / itemsPerPage));
            setpaginationId(data.response[0].min);
        } catch (error) {
            console.error(error);
            throw error; // Rethrow the error to be caught by the caller
        }
    };


    const getCustomerDetails = async (id: string) => {
        try {
            const response = await axios.get(Constants.local_api_gateway_host + `/customerDetails`);
            const userExists = response.data.response?.response.length > 0;
            console.log("Logging customer details")
            console.log(response.data.response?.response);
            if (userExists) {
                const customerIdResponse = response.data.response?.response[0].customer_id;
                setCustomerId(customerIdResponse);
                console.log(customerIdResponse);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    useEffect(() => {

        const fetchData = async () => {
            try {
                if (!currentUser?.email) {
                    return;
                }

                await getCustomerDetails(currentUser.email);

                if (customerId) {
                    console.log("customerId " + customerId);
                    await getRecordsSize(customerId);
                    await getUserPosts(customerId);
                }
                console.log("customerId " + customerId);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        fetchData();
        setIsLoading(false);
    }, [currentPage, currentUser, customerId]);

    const handlePublish = (str: string) => {
        const article = { title: "React PUT Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };
        if (selectedRows.length === 0) {
            alert('Please select a row to delete');
            return;
        }
        const confirmText = str === 'true' ? 'Publish!' : 'Unpublish!';
        console.log(selectedRows)
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be able to undo this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, ' + confirmText,
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true)
                console.log('Selected warehouse IDs:', selectedRows);
                selectedRows.forEach(id => {
                    axios
                        .put(Constants.local_api_gateway_host + `/requirementDetails/?REQUIREMENT_POST_ID=${id}&IS_ACTIVE=${str}`, article,
                            {
                                headers,
                            })
                        .then((response) => {
                            if (response.status === 200) {
                                getUserPosts(customerId);
                                console.log(customerId)
                            }
                        })
                        .catch(error => {
                            console.log(error);

                        });

                });
            }
        });
        setIsLoading(false)
        setSelectedRows([]);
    }

    const handleDelete = () => {

        const article = { title: "React PUT Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };

        if (selectedRows.length === 0) {
            alert('Please select a row to delete');
            return;
        }
        console.log(selectedRows)
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to undo this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true)
                console.log('Selected warehouse IDs:', selectedRows);
                selectedRows.forEach(id => {
                    axios
                        .delete(Constants.api_gateway_host + `/wh_requirement_details/?REQUIREMENT_POST_ID=${id}`, article,
                            {
                                headers,
                            })
                        .then(response => {
                            if (response.status === 200) {
                                getUserPosts(customerId);
                                console.log(customerId)
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });

                });
            }
        });
        setIsLoading(false);
        setSelectedRows([]);
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
            console.log(data)
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

    const handleCheckboxChange = (postId, isChecked) => {
        if (isChecked) {
            setSelectedRows([...selectedRows, postId]);
        } else {
            setSelectedRows(selectedRows.filter(id => id !== postId));
        }
    };

    const getPostThumbnail = (firstLetter) => {
        // firstLetter = "k"
        if (!firstLetter) {
          const defaultThumbnail =
            "https://images.unsplash.com/photo-1591795523670-5999e124d7d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
          return defaultThumbnail;
        }
    
        const letter = firstLetter.charAt(0).toUpperCase();
    
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
      

    return (
        <>
            {isLoading ?
                <>
                    <div className="column d-flex align-items-xl-center justify-content-center">
                        <h3 className="m-3 p-3">
                            <ReactLoading type="spinningBubbles" color="#1a152e" />
                        </h3>
                    </div>
                </> :
                <>
                    <div className="m-3 p-3">
                        <Row className="d-flex justify-content-between align-items-center">
                            <Col>
                                <Button onClick={() => (handlePublish('true'))} className="btn btn-success m-2">
                                    Publish Selected
                                </Button>
                                <Button onClick={() => (handlePublish('false'))} className="btn btn-warning m-2">
                                    Unpublish Selected
                                </Button>
                                <Button onClick={handleDelete} className="btn btn-danger m-2">
                                    Delete Selected
                                </Button>
                            </Col>
                            <Col className=' d-flex justify-content-end align-items-end'>
                                <div>
                                    <p>Selected Posts: {selectedRows.length}</p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            {isLoading ? (
                                <div className="text-center p-5">
                                    <Spinner className="spinner-border text-light" />
                                </div>
                            ) : (
                                data?.map((e, i) => (
                                    <Col xs="12" sm="6" md="4" lg="3"
                                        style={{
                                            backgroundColor: selectedRows.includes(e.requirement_post_id) ? '#a1a09f' : 'transparent',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            boxShadow: selectedRows.includes(e.requirement_post_id) ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',

                                        }}
                                        key={i}>
                                        <GalleryComponentCustomerViewOwnPost
                                            details={e}
                                            onCheckboxChange={handleCheckboxChange}
                                            thumbnail={getPostThumbnail(e.requirement_location)}
                                        />
                                    </Col>
                                ))

                            )}
                        </Row>
                        {totalPages > 0 && <Row className="mx-auto justify-content-md-center">
                            <div className="col-md-auto">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePrevPageChange(currentPage - 1)}>
                                                Previous
                                            </button>
                                        </li>
                                        {totalPages >= 1 &&
                                            Array.from({ length: totalPages }, (_, index) => {
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
                        </Row>}

                    </div>
                </>
            }


        </>
    )
}

export default CustomerViewOwnPost
