//@ts-nocheck
import Link from "next/link";
import { useState } from "react";
// import useAuth from '../../hooks/useAuth';
import useSticky from "../../hooks/useSticky";

import { Offcanvas } from "react-bootstrap";

import {

  FaUser,
} from "react-icons/fa";
import { Nav } from "reactstrap";





const NewSidebar = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { sticky } = useSticky();

  const handleLinkClick = () => {
    handleClose(); // Close the sidebar by toggling the `show` state
  };

  return (
    <>
      <div className="custom-body ">
        <div
          className={
            sticky ? "sticky header__area black-bg" : "header__area black-bg"
          }
          id="header-sticky"
        >
          <div className="container p-2">
            <div className="row align-items-center">
              <div className="col d-flex align-items-center">
                <div className="logo flex-grow-1">
                  <Link href="/">
                      <img
                        src="assets/img/logo/cropped-logo.png"
                        alt="logo"
                        width="50"
                      />
                  </Link>
                </div>
                <div className="sidebar-toggle-btn w-10 ml-2" onClick={handleShow}>
                  <span className="line"></span>
                  <span className="line"></span>
                  <span className="line"></span>
                </div>
              </div>
            </div>
          </div>

          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            max-width="30%"
            className="side__bar w-20 w-sm-10-custom "
          >
            <Offcanvas.Header
              closeButton
              className="custom-header"
              style={{ height: "10%" }}
            ></Offcanvas.Header>
            <Offcanvas.Body className="custom-body">
              <div className="">
                <div className="sidebar__content ">
                  <div className="mobile-menu ">
                    <Nav id="mobile-menu">
                      <ul className="nounderline">
                        <div className="single_link option iconAdd">
                          <li>
                            <Link href="/login"
                            
                              onClick={handleLinkClick}
                              style={{ color: "white", textDecoration: "none" }}
                            >
                              {/* <a> */}
                                <FaUser />
                                Sign Up/Sign In
                              {/* </a> */}
                            </Link>
                          </li>
                        </div>

                      </ul>
                    </Nav>
                  </div>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </>
  );
};
export default NewSidebar;
