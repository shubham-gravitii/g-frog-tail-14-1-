//@ts-nocheck
import Link from "next/link";
import { useState } from "react";
import useSticky from "../../hooks/useSticky";

import { Offcanvas } from "react-bootstrap";
import {
  AiFillSwitcher,
  AiOutlineContainer,
  AiOutlineCopy,
} from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";



import {
  FaUser,
  FaSearch,
  FaUserEdit,

} from "react-icons/fa";
import { Nav } from "reactstrap";
import { useRouter } from 'next/navigation';

import { useAuth } from "../../contexts/UserContext";


import { signOut } from 'aws-amplify/auth';


const NewSidebar = () => {
  const { currentUser, logOut } = useAuth();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { sticky } = useSticky();

  const handleLinkClick = () => {
    handleClose(); // Close the sidebar by toggling the `show` state
  };
  const router = useRouter();
  const handleLogout = async () => {
    try {
      logOut();
      await signOut();
      router.push("/"); // Redirect to the login page after logout
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="custom-body ">
        <div
          className={
            sticky ? "sticky header__area" : "header__area"
          }
          style={{backgroundColor:"#058283"}}
          id="header-sticky"
        >
          <div className="container p-2">
            <div className="row align-items-center">
              <div className="col d-flex align-items-center">
                <div className="logo flex-grow-1">
                  <Link href="/">
                    {/* <a> */}
                      <img
                        src="assets/img/logo/cropped-logo.png"
                        alt="logo"
                        width="50"
                      />
                    {/* </a> */}
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
                            <Link href="/"
                            onClick={handleLinkClick}
                            style={{ color: "white", textDecoration:"none" }}>
                              {/* <a> */}
                                <FaSearch/> Search
                              {/* </a> */}
                            </Link>
                          </li>
                        </div>
                        <div className="single_link option iconAdd">
                          <li>
                            <Link href="/posty" 
                            onClick={handleLinkClick}
                            className="option"
                            style={{ color: "white", textDecoration:"none" }}>
                              {/* <a>                          */}
                                <AiFillSwitcher /> Create New Post
                              {/* </a> */}
                            </Link>
                          </li>
                        </div>

                        {currentUser && (currentUser.userRole === "Customer" || currentUser.nickname === "Customer") && (
                          <div className="single_link option iconAdd">
                            <li>
                              <Link href="/ViewPost" onClick={handleLinkClick}
                              onClick={handleLinkClick}
                              style={{ color: "white", textDecoration:"none" }}>
                                {/* <a> */}
                                 <AiOutlineCopy /> View Post
                                {/* </a> */}
                              </Link>
                            </li>
                          </div>

                        )}

                        <div className="single_link option iconAdd">
                          <li>
                            <Link href="/ViewOwnPost"
                            onClick={handleLinkClick}
                            style={{ color: "white", textDecoration:"none" }}>
                              {/* <a> */}
                                <AiOutlineContainer /> View Your Posts
                              {/* </a> */}
                            </Link>
                          </li>
                        </div>

                        {/* <div className="single_link option iconAdd">
                          <li>
                            <Link href="/about-us">
                              <a
                                onClick={handleLinkClick}
                                style={{ color: "white" }}
                              >
                                <FaQuestionCircle /> FAQ/Help
                              </a>
                            </Link>
                          </li>
                        </div> */}

                        <div className="single_link option iconAdd">
                          <li>
                            <Link href="/create-profile"
                            onClick={handleLinkClick}
                            style={{ color: "white", textDecoration:"none" }}>
                              {/* <a> */}
                                <FaUserEdit /> Edit Profile
                              {/* </a> */}
                            </Link>
                          </li>
                        </div>


                        {currentUser && (currentUser.userRole === "Owner" || currentUser.nickname === "Owner") && (
                          <div className="single_link option iconAdd">
                            <li>
                              <Link href="/ViewListing"
                              onClick={handleLinkClick}
                              style={{ color: "white", textDecoration: "none" }}>
                                {/* <a> */}
                                  {" "}
                                  <AiOutlineCopy /> View Listing
                                {/* </a> */}
                              </Link>
                            </li>
                          </div>
                        )}
                        

                        

                        {/* <div className="single_link option iconAdd">
                          <li>
                            <Link href="/blog">
                              <a
                                onClick={handleLinkClick}
                                style={{ color: "white" }}
                              >
                                <FaBlog /> Blog
                              </a>
                            </Link>
                          </li>
                        </div> */}


                        {/* <div className="single_link option iconAdd">
                          <li>
                            <Link href="/contact-us">
                              <a
                                onClick={handleLinkClick}
                                style={{ color: "white" }}
                              >
                                <FaEnvelope /> Contact us
                              </a>
                            </Link>
                          </li>
                        </div> */}

                        <div className="single_link option iconAdd">
                          <li>
                            <a
                              onClick={handleLogout}
                              style={{ color: "white", cursor: "pointer" }}
                            >
                              <FiLogOut /> Logout
                            </a>
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
