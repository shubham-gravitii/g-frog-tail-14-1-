// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Modal, ModalHeader, ModalBody, Button, Input, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Edit2, Trash2 } from 'react-feather';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Label } from 'reactstrap';
import * as Constants from "../../utils/constants";
import { useRefresh } from 'react-admin';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Swal from 'sweetalert2';
import styles from "./CustomTable.module.css";
import Footer from '../../components/Home/Footer';
import { useAuth } from '../../contexts/UserContext';
import ReactLoading from 'react-loading';

import ViewOwnPost from './page';

const ViewOwnPost1 = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const { currentUser } = useAuth()

  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouseFields, setWarehouseFields] = useState({});
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // new state variable
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [whidspecific, setWhidspecific] = useState("");
  const updatedWarehouse = {};
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState("");     //sarthak
  const [OwnerEntityId, setOwnerEntityId] = useState([]);     //sarthak
  const [user, setUser] = useState([]);                  //sarthak



  const selectRow = {
    mode: 'checkbox',
    onSelect: (row, isSelect, index) => {
      if (isSelect) {
        setTimeout(() => {
          setSelectedWarehouses(prevState => [...prevState, row]);
        }, 1);
        return true;
      } else {
        setTimeout(() => {
          setSelectedWarehouses(prevState => prevState.filter(item => item.wh_id !== row.wh_id));
        }, 1);
        return true;
      }
    },

  };
  console.log('Selected warehouses:', selectedWarehouses);
  const handleRowClick = (e, row) => {
    if (e.target.tagName !== 'INPUT' && row) {
      setWhidspecific(row.wh_id);
      setWarehouseFields({
        'Wh_total_space': row.wh_total_space,
        'Wh_land_area': row.wh_land_area,
        'GPS Coordinates': row.wh_gps_coordinates,
        'Warehouse Type': row.wh_type,
      });
      setModal(!modal);
      setEditMode(false);
      setShowDeleteWarning(false);

    }
  };


  const handleEditClick = () => {
    setEditMode(true);
  };
  const deletefirstclickhandle = () => {
    setShowDeleteWarning(true);
  }
  const handleDeleteConfirm = () => {
    setShowDeleteWarning(false);
    setModal(false);
    handleDeleteClick();
  };
  const handleDeleteCancel = () => {
    setShowDeleteWarning(false);
  };
  const rowEvents = {
    onClick: (e, column, columnIndex, row, rowIndex) => {
      handleRowClick(e, row);
    },
    onMouseEnter: (e, row, rowIndex) => {
      e.target.closest('tr').style.backgroundColor = 'lightgray';
    },
    onMouseLeave: (e, row, rowIndex) => {
      e.target.closest('tr').style.backgroundColor = '';
    },
  };
  const EditButton = () => {
    return (
      <button className="custom-button" onClick={() => handleEditClick()}>
        <FontAwesomeIcon icon={faEdit} /> Edit
      </button>
    );
  };
  const DeleteButton = () => {
    return (
      <button className="custom-button" onClick={() => deletefirstclickhandle()}>
        <FontAwesomeIcon icon={faTrash} /> Delete
      </button>
    );
  };

  // useEffect(() => {
  //   currentUser ? (
  //     setUserId(currentUser.userID.toString().substring(0, 26))

  //   ) : ('')
  //   console.log("userId " + userId);

  // }, []);


  // useEffect(() => {
  //   if (currentUser) {
  //     const userId = currentUser.userID.toString().substring(0, 26);
  //     setUserId(userId);
  //     console.log(userId)
  //     axios.get(Constants.api_gateway_host + `/wh_basic_details/?OWNER_ENTITY_ID=${userId}`)
  //       .then(response => {
  //         let data = response.data;
  //         if (typeof data === 'object') {
  //           data = Object.values(data);
  //         }
  //         if (Array.isArray(data)) {
  //           const filteredData = data[0].filter(row => row.is_active !== "false");

  //           // setWarehouseData(data);
  //           setWarehouseData(filteredData);
  //           setLoading(false);
  //           const filteredId = data[0].map(item => item.OWNER_ENTITY_ID);
  //           setOwnerEntityId(filteredId);

  //         } else {
  //           console.log('Invalid data format:', data);
  //           setLoading(false);
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         setLoading(false);
  //       });
  //       setLoading(false)

  //   }
  // }, [currentUser, count]);
  // console.log(warehouseData);

  // useEffect(() => {
  //   axios.get(Constants.api_gateway_host + `/wh_owner_details/?OWNER_ENTITY_ID=${userId}`)
  //     .then(response => {
  //       const userData = response.data;
  //       setUser(userData);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  //             setLoading(false)

  // }, []);

  const handleDeleteClick = () => {

    axios.put("https://g-badger.herokuapp.com/wh_basic_details/?WH_ID=" + whidspecific + "&IS_ACTIVE=false")
      .then(response => {
        console.log("response");
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    setCount(count + 1);
  }
  // const handleDeleteMultiple = () => {


  //   // console.log('Selected warehouses:', selectedWarehouses);
  //   const selectedIds = selectedWarehouses?.map(row => row.wh_id);
  //   console.log('Selected warehouse IDs:', selectedIds);
  //   selectedIds.forEach(id => {
  //     axios.put(`https://g-badger.herokuapp.com/wh_basic_details/?WH_ID=${id}&IS_ACTIVE=false`)
  //       .then(response => {
  //         console.log("response");
  //         console.log(response);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //        setTimeout(() => {
  //         setSelectedWarehouses(prevState => prevState.filter(item => item.wh_id !== id));
  //       }, 1);
  //   });

  //   setCount(count+1);

  //  }
  const handleDeleteMultiple = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Existing code for deleting multiple warehouses
        const selectedIds = selectedWarehouses?.map(row => row.wh_id);
        console.log('Selected warehouse IDs:', selectedIds);
        selectedIds.forEach(id => {
          axios.put(`https://g-badger.herokuapp.com/wh_basic_details/?WH_ID=${id}&IS_ACTIVE=false`)
            .then(response => {
              console.log("response");
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
          setTimeout(() => {
            setSelectedWarehouses(prevState => prevState.filter(item => item.wh_id !== id));
          }, 1);
        });

        setCount(count + 1);
      }
    });
  }

  const columns = [

    {
      dataField: 'wh_id',
      text: 'Warehouse ID',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          handleRowClick(e, row);
        },
      },
    },
    {
      dataField: 'wh_name',
      text: 'Warehouse Name',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          handleRowClick(e, row);
        },
      },
    },
    {
      dataField: 'wh_address',
      text: 'Warehouse Address',
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          handleRowClick(e, row);
        },
      },
    },
  ];

  const fetchWarehouses = () => {

    axios.get('https://g-badger.herokuapp.com/wh_basic_details')
      .then(response => {
        let data = response.data;
        if (typeof data === 'object') {
          data = Object.values(data);
        }
        if (Array.isArray(data)) {
          updatedWarehouse = data[0].find(warehouse => warehouse.wh_id === whidspecific);
          setWarehouseFields({
            'Wh_total_space': updatedWarehouse.wh_total_space,
            'Wh_land_area': updatedWarehouse.wh_land_area,
            'GPS Coordinates': updatedWarehouse.wh_gps_coordinates,
            'Warehouse Type': updatedWarehouse.wh_type,
          });
          // setWarehouseFields(prevState => ({
          //   ...prevState,
          //   'Wh_total_space': updatedWarehouse?.wh_total_space,
          //   'Wh_land_area': updatedWarehouse?.wh_land_area,
          //   'GPS Coordinates': updatedWarehouse?.wh_gps_coordinates,
          //   'Warehouse Type': updatedWarehouse?.wh_type,
          // }));
          // setWarehouseFields({
          //   'Wh_total_space': updatedWarehouse.wh_total_space,
          //   'Wh_land_area': updatedWarehouse.wh_land_area,
          //   'GPS Coordinates': updatedWarehouse.wh_gps_coordinates,
          //   'Warehouse Type': updatedWarehouse.wh_type,
          // });




          console.log("WarehouseFields in fetchWarehouses");
          console.log(warehouseFields);
          console.log(updatedWarehouse);
        } else {
          console.log('Invalid data format:', data);
        }
      })
      .catch(error => {
        console.log(error);
      });


  }
  // useEffect(() => {
  //   console.log("WarehouseFields after update:");
  //   console.log(warehouseFields);

  // }, [warehouseFields]);

  const handleSaveClick = () => {

    const updatedFields = {
      'Wh_total_space': document.getElementById('total-space-input').value,
      'Wh_land_area': document.getElementById('land-area-input').value,
      'GPS Coordinates': document.getElementById('gps-coordinates-input').value,
      'Warehouse Type': document.getElementById('warehouse-type-input').value,
    };
    setCount(count + 1);
    const updated_wh_string = "&WH_TOTAL_SPACE=" + updatedFields['Wh_total_space'] + "&WH_LAND_AREA=" + updatedFields['Wh_land_area'] + "&WH_GPS_COORDINATES=" + updatedFields['GPS Coordinates'] + "&WH_TYPE=" + updatedFields['Warehouse Type'];
    axios.put("https://g-badger.herokuapp.com/wh_basic_details/?WH_ID=" + whidspecific + updated_wh_string)
      .then(response => {

        setWarehouseFields(updatedFields);
        setEditMode(false);

        //fetchWarehouses();

      })
      .catch(error => {
        console.log(error);
      });



  }

  // useEffect(()=>{
  //   handleSaveClick();
  // }, []);

  const toggleModal = () => {
    setModal(!modal);
  };
  const deleteButtonStyle = {
    position: 'fixed',
    top: '140px',
    left: '20px',
    color: selectedWarehouses.length > 0 ? 'white' : 'rgba(0, 0, 0, 0.5)',
    backgroundColor: selectedWarehouses.length > 0 ? 'maroon' : 'transparent',
    zIndex: 9999,
  };
  // if (!currentUser) {
  //   return <>
  //     <div className="column d-flex align-items-xl-center justify-content-center">
  //       <h3 className="m-3 p-3"> <ReactLoading type="spinningBubbles" color="#1a152e" /></h3>
  //     </div>
  //   </> 

  // }
  return (

    // <div style={{ position: 'relative' }}>
    // <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'white', zIndex: 999 }}>

    // </div>
    // <div style={{ marginTop: '50px', height: 'calc(100vh - 50px)', overflow: 'auto' }}>
    //   <div className="fixed-row-container">
    //   <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Some text here</h3>
    //     <Button
    //       color="secondary"
    //       onClick={handleDeleteMultiple}
    //       disabled={selectedCount.length === 0}
    //       style={deleteButtonStyle}
    //     >
    //       Delete
    //     </Button>
    //   </div>
    <>
      <ViewOwnPost />
      <Footer />
    </>

  );
};
export default ViewOwnPost1;

{/* <>
      {
        currentUser ? <> <div>
          <h3 style={{ textAlign: 'center' }}>Kindly click on the rows to open modal</h3>
          <div className="fixed-row-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'white', zIndex: 999 }}>

            </div>
            <Button
              color="secondary"
              onClick={handleDeleteMultiple}
              disabled={selectedCount.length === 0}
              style={deleteButtonStyle}
            >
              Delete
            </Button>
          </div>
          <div style={{ marginTop: '50px', height: 'calc(100vh - 50px)', overflow: 'auto' }}>







            {loading ? (
              <p>Loading...</p>
            ) : (
              <BootstrapTable
                keyField="wh_id"
                data={warehouseData}
                columns={columns}
                selectRow={selectRow}
                rowEvents={rowEvents}
                headerClasses={`sticky-top ${styles["custom-table-header"]}`}

              />
            )}
          </div>
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Warehouse Details</ModalHeader>
            <ModalBody>
              {editMode ? (
                <>
                  <Label for="total-space-input">Warehouse total space:</Label>
                  <Input
                    type="text"
                    id="total-space-input"
                    defaultValue={warehouseFields['Wh_total_space']}
                  />
                  <Label for="land-area-input">Warehouse land area:</Label>
                  <Input
                    type="text"
                    id="land-area-input"
                    defaultValue={warehouseFields['Wh_land_area']}
                  />
                  <Label for="gps-coordinates-input">Warehouse GPS Coordinates:</Label>
                  <Input
                    type="text"
                    id="gps-coordinates-input"
                    defaultValue={warehouseFields['GPS Coordinates']}
                  />
                  <Label for="warehouse-type-input"> Warehouse Type:</Label>
                  <Input
                    type="text"
                    id="warehouse-type-input"
                    defaultValue={warehouseFields['Warehouse Type']}
                  />
                </>
              ) : (
                <>
                  <p>
                    <strong> Warehouse Total Space:</strong> {warehouseFields['Wh_total_space']}
                  </p>
                  <p>
                    <strong> Warehouse land area:</strong> {warehouseFields['Wh_land_area']}
                  </p>
                  <p>
                    <strong>Warehouse GPS Coordinates:</strong> {warehouseFields['GPS Coordinates']}
                  </p>
                  <p>
                    <strong> Warehouse Type:</strong> {warehouseFields['Warehouse Type']}
                  </p>
                </>
              )}
            </ModalBody>

            {editMode && (
              <div className="modal-footer">
                <button className="custom-button" onClick={() => handleSaveClick()}>
                  Save
                </button>
              </div>
            )}
            <EditButton />
            <DeleteButton />
            {showDeleteWarning ? (
              <>
                <ModalHeader>Delete Confirmation</ModalHeader>
                <ModalBody>
                  <p className="text-danger">Are you sure you want to delete the post?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={handleDeleteConfirm}>
                    Delete
                  </Button>
                  <Button color="success" onClick={handleDeleteCancel}>
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            ) : null}
          </Modal>
          <Footer />
        </div></> : <>
          <div className="column d-flex align-items-xl-center justify-content-center">
            <h3 className="m-3 p-3">Please LogIn to continue</h3>
          </div></>
      }
      </> */}