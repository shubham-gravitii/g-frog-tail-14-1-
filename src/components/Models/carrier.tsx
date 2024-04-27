import React, { useState } from "react";
import PropTypes from "prop-types"
import { useRouter } from 'next/router'
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap"

function CarrierModel({isOpen=false , togglemodal=()=>{}}) {
    
    const [modalData ,setModalData] = useState({firstName:"" , lastname:"" , email:"" , password:""})
    const router  = useRouter()


    const handleClick = ()=>{
      if(modalData.firstName && modalData.lastname && modalData.email && modalData.password){
        console.log("modal data is" ,modalData)
        router.push("/")
        togglemodal()


      }
      else{
        alert("enter the details correctly")
      }
    }
  return (
    <>
    <Modal
                isOpen={isOpen}
                role="dialog"
                size="lg"
                autoFocus={true}
                centered
                id="verificationModal"
                toggle={togglemodal}>
                <div className="modal-content">
                  <ModalHeader toggle={togglemodal}>
                    Details For Carrier
                  </ModalHeader>
                  <ModalBody> 
                    <div id="kyc-verify-wizard" className="wizard clearfix">
                      <div className="steps clearfix">
                        First Name:  <input onChange={(e)=>{setModalData((prev)=>{
                          return {...prev , firstName:e.target.value}
                        })}} type="text"  value={modalData.firstName}
                         />
                        <br>
                        </br>
                        Last Name: <input  onChange={(e)=>{setModalData((prev)=>{
                          return {...prev , lastname:e.target.value}
                        })}}  type="text"  value={modalData.lastname}
                        />
                        <br></br>
                        Email:    <input  onChange={(e)=>{setModalData((prev)=>{
                          return {...prev , email:e.target.value}
                        })}}  type="text"  value={modalData.email}
                        />
                        <br></br>
                        Password: <input  onChange={(e)=>{setModalData((prev)=>{
                          return {...prev , password:e.target.value}
                        })}}  type="text"  value={modalData.password}
                        />
                      
                        <br></br>
                      </div>

                      <Button onClick={()=> handleClick()} color="success" className="btn-rounded ">
                        Create Account 
                      </Button>
                    </div>
                  </ModalBody>
                </div>
              </Modal>
              </>
  )
}

export default CarrierModel