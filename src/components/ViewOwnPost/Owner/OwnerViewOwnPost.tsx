// @ts-nocheck
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Constants from "../../../utils/constants";
import Footer from "../../../components/Home/Footer";
import { useAuth } from "../../../contexts/UserContext";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import withAuth from "../../../utils/urlAuth";
import { ReactPhotoCollage } from "react-photo-collage";
import ImageEditor from "../../../components/ImageEditor/ImageEditor";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
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
import Spinner from "react-bootstrap/Spinner";
import PostBulkEdit from "../../../components/PostBulkEdit/PostBulkEdit";
import GalleryComponentOwnerViewOwnPost from "../../Board/RecordCardOwnerViewOwnPost";

const setting = {
  width: "100%",
  height: ["450px", "170px"],
  layout: [1, 3],
  photos: [], // Placeholder for photos
  showNumOfRemainingPhotos: true,
};

const OwnerViewOwnPost = () => {
  const { currentUser } = useAuth();

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [userId, setUserId] = useState("");
  const [show, setShow] = useState(false);
  const [warehouseFields, setWarehouseFields] = useState({});
  const [warehouseRentalFields, setWarehouseRentalFields] = useState({});
  const [warehouseSpecificationFields, setWarehouseSpecificationFields] =
    useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const itemsPerPage = Constants.paginationPostPerPage;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [paginationId, setpaginationId] = useState();

  const handleImageClose = () => setShowImage(false);

  const handleImageShow = () => setShowImage(true);

  const handleClose = () => {
    setShow(false),
      setWarehouseFields({}),
      setWarehouseRentalFields({}),
      setWarehouseSpecificationFields({});
  };

  const handleShow = () => setShow(true);

  const getRecordsSize = async (id: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await axios.get(
          Constants.local_api_gateway_host +
            `/basicDetailsSize/?OWNER_ENTITY_ID=${id}`
        );

        const data = res.data;
        console.log("get record size")
        console.log(data);

        const totalCount = data.response[0].count;
        console.log(Math.ceil(totalCount / itemsPerPage));
        console.log(data.response[0].min);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
        setpaginationId(data.response[0].min);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const getUserPostsBasicDetails = (id) => {
    return new Promise<void>((resolve, reject) => {
      axios
        .get(
          Constants.local_api_gateway_host +
            `/basicDetails/?OWNER_ENTITY_ID=${id}`,
          {
            params: {
              PAGINATION_ID: paginationId,
            },
          }
        )
        .then((response) => {
          console.log(response);
          const userData = response.data;
          console.log(userData.response);
          setData(userData.response);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    });
  };

  const getUserPostsRentalDetails = (id: string) => {
    //        .get(Constants.api_gateway_host + `/wh_basic_details/?OWNER_ENTITY_ID=${id}&IS_ACTIVE=true`)
    axios
      .get(Constants.api_gateway_host + `/wh_rental_information/?WH_ID=${id}`)
      .then((response) => {
        const userData = response.data;
        console.log(userData.response[0]);
        setWarehouseRentalFields(userData.response[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getUserPostsSpecificationDetails = (id: string) => {
    //        .get(Constants.api_gateway_host + `/wh_basic_details/?OWNER_ENTITY_ID=${id}&IS_ACTIVE=true`))
    axios
      .get(
        Constants.api_gateway_host + `/wh_building_specification/?WH_ID=${id}`
      )
      .then((response) => {
        const userData = response.data;
        console.log(userData.response[0]);
        setWarehouseSpecificationFields(userData.response[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(currentUser);
    try {
      if (currentUser) {
        const userId = currentUser.userID;
        setUserId(userId);
        console.log("userId " + userId);
        // getRecordsSize(userId);
        // getUserPostsBasicDetails(userId)
        getRecordsSize(userId)
          .then((recordsSize) => {
            return getUserPostsBasicDetails(userId);
          })
          .then((userPostsDetails) => {})
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentPage]);

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select a row to delete");
      return;
    }
    console.log(selectedRows);
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        console.log("Selected warehouse IDs:", selectedRows);
        selectedRows.forEach((id) => {
          axios
            .delete(
              Constants.api_gateway_host + `/wh_basic_details/?WH_ID=${id}`
            )
            .then((response) => {
              if (response.status === 200) {
                getUserPostsBasicDetails(userId);
                console.log(userId);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    });
    setIsLoading(false);
    setSelectedRows([]);
  };

  const handleShowDetails = (row: object) => {
    // getUserPostsRentalDetails(row.wh_id)
    // getUserPostsSpecificationDetails(row.wh_id)
    setEditedData(row);
    setWarehouseFields(row);
    setShow(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setWarehouseFields((prev) => ({
      ...prev,
      [name]: value,
    }));
    setWarehouseRentalFields((prev) => ({
      ...prev,
      [name]: value,
    }));
    setWarehouseSpecificationFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(warehouseFields);
    console.log(warehouseRentalFields);
    console.log(warehouseSpecificationFields);

    try {
      const warehouseId = warehouseFields.wh_id;

      const updated_wh_string =
        "&WH_NAME=" +
        warehouseFields.wh_name +
        "&WH_TOTAL_SPACE=" +
        warehouseFields.wh_total_space +
        "&WH_LAND_AREA=" +
        warehouseFields.wh_land_area +
        "&WH_ADDRESS=" +
        warehouseFields.wh_address +
        "&WH_TYPE=" +
        warehouseFields.wh_type;

      const updated_rental_details =
        "&WBH_RENTAL_AVAILABLE_DATE=" +
        warehouseRentalFields.wh_rental_available_date +
        "&WH_MIN_LEASE=" +
        warehouseRentalFields.wh_min_lease +
        "&WH_MAX_LEASE=" +
        warehouseRentalFields.wh_max_lease +
        "&WH_RENTAL_RATE=" +
        warehouseRentalFields.wh_rental_rate +
        "& WH_RENTAL_UNIT=" +
        warehouseRentalFields.wh_rental_unit;

      const updated_specification_details = "";

      axios
        .put(
          Constants.api_gateway_host +
            "/wh_basic_details/?WH_ID=" +
            warehouseId +
            updated_wh_string
        )
        .then((response) => {
          console.log("Warehouse data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating warehouse data:", error);
        });
      handleClose();
      getUserPostsBasicDetails("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleRowSelection = (id: any) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
    console.log("selectedRows: " + selectedRows);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);

    // If "Select All" is checked, select all rows; otherwise, clear the selection.
    if (!selectAll) {
      const allWhIds = data.map((row) => row.wh_id);
      setSelectedRows(allWhIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleViewImages = (id) => {
    handleImageShow();
    console.log(id);
    try {
      axios
        .get(Constants.api_gateway_host + `/wh_rental_information/?WH_ID=` + id)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotosChange = (updatedPhotos) => {
    setPhotos(updatedPhotos);
  };

  const handlePublish = (str: string) => {
    if (selectedRows.length === 0) {
      alert("Please select a row to delete");
      return;
    }
    const confirmText = str === "true" ? "Publish!" : "Unpublish!";
    console.log(selectedRows);
    Swal.fire({
      title: "Are you sure?",
      text: "You will be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, " + confirmText,
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        console.log("Selected warehouse IDs:", selectedRows);
        selectedRows.forEach((id) => {
          axios
            .put(
              Constants.local_api_gateway_host +
                `/basicDetails/?WH_ID=${id}&IS_ACTIVE=${str}`
            )
            .then((response) => {
              if (response.status === 200) {
                getUserPostsBasicDetails(userId);
                console.log(userId);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    });
    setIsLoading(false);
    setSelectedRows([]);
  };

  const handlePageChange = (newPage: any) => {
    console.log(currentPage);
    console.log(totalPages);
    console.log(newPage);

    if (newPage > 1) {
      const newPaginationId = newPage * Constants.paginationPostPerPage;
      setpaginationId(newPaginationId);
      console.log(newPaginationId);
      setCurrentPage(newPage);
    } else {
      setpaginationId(1);
      setCurrentPage(newPage);
    }
  };

  const handleNextPageChange = (newPage: any) => {
    console.log(currentPage);
    console.log(totalPages);
    if (newPage >= 1) {
      setCurrentPage(newPage);
      console.log(data);
      setpaginationId(data[data.length - 1]?.pagination_id);
      console.log(data[data.length - 1]?.pagination_id);
    }
  };

  const handlePrevPageChange = (newPage: any) => {
    console.log(currentPage);
    console.log(totalPages);
    if (newPage >= 1) {
      setCurrentPage(newPage);
      setpaginationId(
        data[0]?.pagination_id - 1 - Constants.paginationPostPerPage
      );
      console.log(data[0]?.pagination_id - Constants.paginationPostPerPage);
    }
  };

  const handleCheckboxChange = (postId, isChecked) => {
    if (isChecked) {
      setSelectedRows([...selectedRows, postId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== postId));
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <div className="column d-flex align-items-xl-center justify-content-center">
            <h3 className="m-3 p-3">
              <ReactLoading type="spinningBubbles" color="#1a152e" />
            </h3>
          </div>
        </>
      ) : (
        <>
          <div className="m-3 p-3">
            <Row className="d-flex justify-content-between align-items-center top-0 bg-white mt-4">
              <Col>
                <Button
                  onClick={() => handlePublish("true")}
                  className="btn btn-success m-2"
                >
                  Publish Selected
                </Button>
                <Button
                  onClick={() => handlePublish("false")}
                  className="btn btn-warning m-2"
                >
                  Unpublish Selected
                </Button>
                <Button onClick={handleDelete} className="btn btn-danger m-2">
                  Delete Selected
                </Button>
              </Col>
              <Col className="d-flex justify-content-end align-items-end">
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
                  <Col
                    xs="12"
                    sm="6"
                    md="4"
                    lg="4"
                    style={{
                      backgroundColor: selectedRows.includes(e.wh_id)
                        ? "#a1a09f"
                        : "transparent",
                      borderRadius: "10px",
                      padding: "10px",
                      boxShadow: selectedRows.includes(e.wh_id)
                        ? "0 0 10px rgba(0, 0, 0, 0.2)"
                        : "none",
                      transition: "background-color 0.3s, box-shadow 0.3s",
                    }}
                    key={i}
                  >
                    <GalleryComponentOwnerViewOwnPost
                      style={{
                        backgroundColor: selectedRows.includes(e.wh_id)
                          ? "#a1a09f"
                          : "transparent",
                        borderRadius: "10px",
                        padding: "10px",
                        boxShadow: selectedRows.includes(e.wh_id)
                          ? "0 0 10px rgba(0, 0, 0, 0.2)"
                          : "none",
                        transition: "background-color 0.3s, box-shadow 0.3s",
                      }}
                      details={e}
                      onCheckboxChange={handleCheckboxChange}
                    />
                  </Col>
                ))
              )}
            </Row>
            {totalPages > 0 && (
              <Row className="mx-auto justify-content-md-center">
                <div className="col-md-auto">
                  <nav aria-label="Page navigation">
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePrevPageChange(currentPage - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {totalPages >= 1 &&
                        Array.from({ length: totalPages }, (_, index) => {
                          const page = index + 1;
                          const isCurrentPage = currentPage === page;
                          const isNearCurrentPage =
                            Math.abs(page - currentPage) <= 2;

                          if (
                            isCurrentPage ||
                            page === 1 ||
                            page === totalPages ||
                            isNearCurrentPage
                          ) {
                            return (
                              <li
                                className={`page-item ${
                                  isCurrentPage ? "active" : ""
                                }`}
                                key={index}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(page)}
                                >
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
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handleNextPageChange(currentPage + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Row>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default OwnerViewOwnPost;

{
  /* <table className="table m-4">
<thead>
    <tr>
        <th>
            <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
            />
        </th>
        <th>WH ID</th>
        <th>Name</th>
        <th>Address</th>
    </tr>
</thead>
<tbody>
    {data?.map((row) => (

        <tr key={row.wh_id}
            style={{
                fontSize: row.is_active === 'true' ? 'inherit bold' : '14px',
                color: row.is_active === 'true' ? 'inherit' : 'grey'
            }}>
            <td>
                <input
                    type="checkbox"
                    checked={selectedRows.includes(row.wh_id)}
                    onChange={() => toggleRowSelection(row.wh_id)}
                />
            </td>
            <td onClick={() => handleShowDetails(row)}>{row.wh_id}</td>
            <td onClick={() => handleShowDetails(row)}>{row.wh_name}</td>
            <td onClick={() => handleShowDetails(row)}>{row.wh_address}</td>

        </tr>
    ))}
</tbody>
</table> */
}
// {
//     <Modal fullscreen={false} show={show} onHide={handleClose}>
//     <Modal.Header closeButton>
//         <Modal.Title>Warehouse Details</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
//         <div >

//             <Form onSubmit={handleSubmit}>
//                 {/* WHarehouse Basic Details */}
//                 <Form.Text class="lead mb-3">
//                     <h4>
//                         Basic Details
//                     </h4>
//                 </Form.Text>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Wharehouse Name"
//                         name='wh_name'
//                         onChange={handleChange}
//                         value={warehouseFields.wh_name}
//                     />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Address</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Wharehouse Address"
//                         name='wh_address'
//                         onChange={handleChange}
//                         value={warehouseFields.wh_address}

//                     />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Land Area</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Wharehouse Land Area"
//                         name='wh_land_area'
//                         onChange={handleChange}
//                         value={warehouseFields.wh_land_area}

//                     />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Total Space</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Wharehouse Total Space"
//                         name='wh_total_space'
//                         onChange={handleChange}
//                         value={warehouseFields.wh_total_space}
//                     />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Type</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Wharehouse Type"
//                         name='wh_type'
//                         onChange={handleChange}
//                         value={warehouseFields.wh_type}

//                     />
//                 </Form.Group>

//                 {
//                     detailsLoading ?
//                         <>
//                             <div className="column d-flex align-items-xl-center justify-content-center">
//                                 <h3 className="m-3 p-3">
//                                     <ReactLoading type="spinningBubbles" color="#1a152e" />
//                                 </h3>
//                             </div>
//                         </>
//                         :
//                         <>
//                             {/* wharehouse Rental Details */}
//                             <Form.Text class="lead mb-3">
//                                 <h4>
//                                     Rental Details
//                                 </h4>
//                             </Form.Text>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Wharehouse Available Date</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Available Date"
//                                     name='wh_rental_available_date'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_rental_available_date}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Min Lease</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Min Lease"
//                                     name='wh_min_lease'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_min_lease}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Max Lease</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Max Lease"
//                                     name='wh_max_lease'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_max_lease}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Rental Rate Unit</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Rental Rate Unit"
//                                     name='wh_rental_unit'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_rental_unit}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Rental Rate</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Rental Rate"
//                                     name='wh_rental_rate'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_rental_rate}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Security Deposit</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Security Deposit"
//                                     name='wh_security_deposit'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_security_deposit}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Lock In Period</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Lock In Period"
//                                     name='wh_lock_in_period'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_lock_in_period}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Rental Increment</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Rental Increment"
//                                     name='wh_rental_increment'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_rental_increment}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Notice Period</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Notice Period"
//                                     name='wh_notice_period'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_notice_period}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Rent Free Period</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Rent Free Period"
//                                     name='wh_rent_free_period'
//                                     onChange={handleChange}
//                                     value={warehouseRentalFields.wh_rent_free_period}

//                                 />
//                             </Form.Group>

//                             {/* Wharehouse Specification Details */}
//                             <Form.Text class="lead mb-3">
//                                 <h4>
//                                     Specification Details
//                                 </h4>
//                             </Form.Text>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Roof Height</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Roof Height"
//                                     name='wh_roof_height'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_roof_height}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Roof Type</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Roof Type"
//                                     name='wh_roof_type'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_roof_type}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Electrical</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Electrical"
//                                     name='wh_electrical'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_electrical}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Flooring Type</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Flooring Type"
//                                     name='wh_flooring_type'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_flooring_type}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Loading Dock Count</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Loading Dock Count"
//                                     name='wh_loading_dock_count'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_loading_dock_count}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Loading Dock Height</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Loading Dock Count"
//                                     name='wh_loading_dock_height'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_loading_dock_height}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Loading Dock Size</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Loading Dock Size"
//                                     name='wh_loading_dock_size'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_loading_dock_size}

//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Age</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Wharehouse Age"
//                                     name='wh_age'
//                                     onChange={handleChange}
//                                     value={warehouseSpecificationFields.wh_age}

//                                 />
//                             </Form.Group>
//                         </>
//                 }

//                 <Button className='m-1' type='submit' variant="primary">
//                     Save Changes
//                 </Button>
//                 <Button onClick={() => (handleViewImages(warehouseFields.wh_id))} className='m-1' n type='button' variant="info">
//                     Edit Images
//                 </Button>
//             </Form>

//             {showImage && <div className='col-md-6'>
//                 <Modal size='xl' centered show={showImage} onHide={handleImageClose}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Wharehouse Images</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <ImageEditor initialPhotos={setting.photos} onSave={handlePhotosChange} />
//                     </Modal.Body>
//                     <Modal.Footer>

//                     </Modal.Footer>
//                 </Modal>
//             </div>}

//         </div>
//     </Modal.Body>
//     <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>
//             Close
//         </Button>
//     </Modal.Footer>
// </Modal>
// }
