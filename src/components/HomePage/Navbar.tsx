// @ts-nocheck
import React from "react";
import Link from "next/link";
import {
  Navbar as RSNavbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
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
import useSticky from "../../hooks/useSticky";
import { WiDaySunny } from "react-icons/wi";

const Navbar = () => {
  
  const { sticky } = useSticky();
  const gradientBackground = {
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'radial-gradient(circle closest-corner at center 125px,#222,black 40%) no-repeat',
    backgroundColor:'black',
     // Change colors as needed
  };
  return (
    <header >
      <div style={gradientBackground} className= "header__area black-bg" >
        <div className="container ">
          <Row>
            <Col>
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-6 mt-2">
              <div className="logo ">
                <Link href="/home-page">
                <a>
                  <img  src="assets/img/logo/cropped-logo.png" alt="logo" width="50" />
                </a>
                </Link>
              </div>
            </div>
            </Col>

            <Col>
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-end mt-2 mb-2">

                        <Link href="/login">
                        <div className="btn btn-outline-light btn-md px-3 me-sm-2 mb-1" href="/login">Sign Up</div>
                        </Link>
                        <Link href="/login">
                        <div className="btn btn-outline-light btn-md px-3 mb-1" href="/login">Sign In</div>
                        </Link>
                       
            </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
