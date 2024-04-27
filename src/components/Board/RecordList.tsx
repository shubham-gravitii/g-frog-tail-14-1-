// @ts-nocheck
import React, { useEffect } from "react"
import { Col, Container, Row, Modal} from "reactstrap"
import PropTypes from "prop-types"
import { map } from "lodash"
import { useSelector, useDispatch } from "react-redux"

import RecordCards from "./RecordCardCarrier"

//Import Breadcrumb
import Breadcrumbs from "../Common/Breadcrumb"

//get the list from API call
const list_of_posts = [
    {
      id: 1,
      name: "ABC Enterprise",
      source: "Chicago",
      target: "Rockford",
      startdate: "2022/09/28",
      rate: "4000",
      capacity:"4600"
    },
  
    {
      id: 2,
      name: "DEF Enterprise",
      source: "Annapolis",
      target: "Rockford",
      startdate: "2022/09/05",
      rate: "7000",
      capacity:"100"
    },
  
    {
      id: 3,
      name: "DGH Enterprise",
      source: "Hanover",
      target: "Columbia",
      startdate: "2022/10/01",
      rate: "1000",
      capacity:"700"
    },
    {
      id: 4,
      name: "IJK Enterprise",
      source: "Rockford",
      target: "Chicago",
      startdate: "2022/09/25",
      rate: "2000",
      capacity:"3000"
    },
  
    {
      id: 5,
      name: "LMN Enterprise",
      source: "Annapolis",
      target: "Rockford",
      startdate: "2022/09/05",
      rate: "7500",
      capacity:"200"
    },
  
    {
      id: 6,
      name: "OPQ Enterprise",
      source: "Hanover",
      target: "Columbia",
      startdate: "2022/10/01",
      rate: "900",
      capacity:"400"
    }
  ]

  const RecordList= ({data,datas}) => {

  const dispatch = useDispatch()

  console.log("data is home" , data)
  console.log("data is ", datas)

  return (
    <React.Fragment>  
      <div className="page-content">
        <Container fluid={true} className="black-bg"> 
        <br></br>
          <Row>
            {data.map((e,i)=>{
              return  <RecordCards type={e.carrier_mot_equipment_type} distance={e.carrier_mot_total_distance} destination={e.carrier_mot_destination
              } origin={e.carrier_mot_origin} key={"_list_of_post_" + i} />
              
            })}
            {/* {datas.map((e,i)=>{
              return  <RecordCards datas={e} key={"_list_of_post_" + i} />
              
            })} */}

            {/* {map(list_of_posts, (list_of_post, key) => (
              <RecordCards data={list_of_post} key={"_list_of_post_" + key} />
            ))} */}
          </Row>
          <Row>
            <Col xs="12">
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

RecordList.propTypes = {
  list_of_posts: PropTypes.array
}

export default RecordList;