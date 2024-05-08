// @ts-nocheck
import React, { useState, useEffect } from "react";
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
import { Link, Outlet } from "react-router-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/UserContext";
import axios from "axios";

const SearchBoards = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    Location: "",
    Warehouse_Distance: 50,
  });
  const [names, setNames] = useState([]);
  const [addressSearch, setaddressSearch] = useState("");

  const [showlist, setshowlist] = useState(false);

  //functions to display autosuggestions
  const handleAdressSearch = async (e: any) => {
    const query = e.target.value;
    setshowlist(true);
    setaddressSearch(e.target.value);
    setNames((prevNames) => prevNames.splice(0, prevNames.length));
    if (query.length) {
      try {
        // Secure server-side call to fetch suggestions
        const response = await axios.post('/api/addressSearch', { query });
        setNames(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNames([]);
      }
    } else {
      setNames([]);
    }
  };

 

  useEffect(() => {
    console.log(formData.Location);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    formData[name] = value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser === null) {
      router.push({ pathname: "/login" });
    } else if (currentUser.userRole == "Customer") {
      router.push({
        pathname: "/ViewPost",
        query: { data: JSON.stringify(formData) },
      });
    } else {
      console.log("Sending data to viewlisting");
      router.push({
        pathname: "/ViewListing",
        query: { data: JSON.stringify(formData) },
      });
    }
    console.log(formData);
  };

  return (
    <>
      <div className="mt-3"> 
        <Form onSubmit={handleSubmit}>
          <InputGroup>
          <div className="w-100">
              <div className="d-sm-flex justify-content-sm-center align-items-sm-flex-start" style={{gap:"15px"}}>
                <div className="mb-3" style={{flex:"0 0 60%"}}>
                  <div>
                    <Label style={{fontWeight:"bold", fontSize:"1.2rem"}}>Location</Label>
                    <Input
                        type="text"
                        placeholder="Enter Location"
                        name="Location"
                        value={formData.Location}
                        required
                        onChange={(e) => {
                          handleAdressSearch(e);
                          handleChange(e);
                        }}
                      ></Input>
                  </div>
                  {showlist && (
                      <div className="row">
                        <ul 
                        //className="col-lg-11 col-md-10 col-sm-9 "
                        className='list-group-item p-3 mb-2 d-block' 
                        style={{cursor:"pointer"}} 
                        >
                          {names.map((result) => (
                            <li
                              className=" d-block p-2 mb-3 w-90"
                              style={{backgroundColor:"white", borderRadius:"10px"}}
                              onClick={() => {
                                const name =
                                  result.placeName + " " + result.placeAddress;
                                setshowlist(false);
                                setaddressSearch(name);
                                setFormData((prev) => ({
                                  ...prev,
                                  Location: name,
                                }));
                              }}
                              key={result.eLoc}
                            >
                              {result.placeName},{result.placeAddress}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                <div className="mb-3" style={{flex:"0 0 35%"}}>
                  <Label style={{fontWeight:"bold", fontSize:"1.2rem"}}>Distance(in kms)</Label>
                  <Input
                      type="number"
                      name="Warehouse_Distance"
                      defaultValue={formData.Warehouse_Distance}
                      onChange={handleChange}
                    ></Input>
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" className="m-btn m-btn-4 w-100" style={{ fontWeight: 'semi-bold', fontSize:"1.2rem" }}>
                        Search
                </Button>
              </div>
          </div>
          </InputGroup>
        </Form>
      </div>
    </>
  );
};

export default SearchBoards;
