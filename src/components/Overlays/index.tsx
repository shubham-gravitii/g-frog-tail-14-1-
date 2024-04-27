import React from 'react';
import { OverlayTrigger, Button, Tooltip } from 'react-bootstrap';

const OverlayTriggerExample = ({message}) => {
  const renderTooltip = (props) => (
    <Tooltip id="overlay-example" {...props} >
      {message}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Button variant=" border-primary position-relative" style={{borderRadius:"100%",height:"23px",width:"23px",fontSize:"14px", padding:"0px",fontWeight:"900",border:"2.5px solid"}} className='ml-3 text-primary ' >
        <span className='position-absolute ' style={{left:"7.2px",top:"-1.5px"}}>i</span>
      </Button>
    </OverlayTrigger>
  );
};

export default OverlayTriggerExample;
