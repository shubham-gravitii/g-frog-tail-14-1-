// @ts-nocheck
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { useSelector } from 'react-redux';
// import useAuth from '../../hooks/useAuth';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { RequestAirdrop } from '../Airdrop/RequestAirdrop';
import { FaUser, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Nav } from 'react-bootstrap';
import { FaBlog } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';
import Airtable from 'airtable';
import { useAuth } from '../../contexts/UserContext';




const SidebarMenu = ({ show, handleClose }) => {

  const totalCartQuantity = useSelector(state => state.products.cartTotalQuantity);
  const { user, logout } = useAuth();
  const [userObject,setuserObject]=useState({});
  const [showDrop, setShowDrop] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const [isOwner, setIsOwner] = useState(true)
  const { currentUser } = useAuth();
  const [userrole,setuserrole]=useState(false);
  

  const handleLinkClick = () => {
    handleClose(); // Close the sidebar by toggling the `show` state
  };
  const openFeedbackForm = () => {
    setShowFeedbackForm(true);
  };
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };
  const cancelFeedback = () => {
    setShowFeedbackForm(false);
  };


  const submitFeedback = () => {
    const base = new Airtable({ apiKey: 'YOUR_API_KEY' }).base('YOUR_BASE_ID');
    base('Feedback').create({
      Feedback: feedback,
      Timestamp: new Date().toISOString()
    }, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Feedback submitted:', record.getId());
    });
    setFeedback('');
    setShowFeedbackForm(false);
  };

  useEffect(()=>{
    try { 
    currentUser?.userRole==="Owner"?setuserrole(true):setuserrole(false);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
      <div className="custom-body">
        <Offcanvas show={show} onHide={handleClose} placement='end' style={{ width: '100%' }} className='side__bar'>
          <Offcanvas.Header closeButton className='custom-header'>
          </Offcanvas.Header>

          <Offcanvas.Body className='custom-body'>
            <div className="">
              <div className="sidebar__content">
                <div className="mobile-menu">
                  <Nav id="mobile-menu">
                    <ul className='nounderline'>
                      <div className='single_link option iconAdd'>
                        <li>
                          <Link  href="/create-profile">
                            <a  onClick={handleLinkClick} st yle={{ color: 'white' }}>
                              <FaUser /> Create Profile  
                            </a>
                          </Link>
                        </li>
                      </div>
                      <div className='single_link option iconAdd'>
                        <li>
                          <Link href="/">
                            <a onClick={() => setShowDrop(!showDrop)}  style={{ color: 'white' }}>
                              <FaPlus /> Post {showDrop ? <FaChevronUp /> : <FaChevronDown />}
                            </a>
                          </Link>
                        </li>
                      </div>
                      {showDrop && (
                        <ul>
                          <li className="suboption" style={{ marginBottom: '10px' }}>
                            <Link href="/posty">
                              <a onClick={handleLinkClick} className='option' style={{ color: 'white' }}>Create New Post</a>
                            </Link>
                          </li>

                           
                          <li className="suboption" style={{ marginBottom: '10px' }}>
                            <Link href="/ViewOwnPost">
                              <a onClick={handleLinkClick} style={{ color: 'white' }}>View Your Posts</a>
                            </Link>
                          </li>
                            
                           {userrole && (
                          <li className="suboption" style={{ marginBottom: '10px' }}>
                            <Link href="/ViewListing">
                             <a onClick={handleLinkClick} style={{ color: 'white' }}>View Listing</a>
                            </Link>
                          </li>)
                          }


                          { !userrole && (
                          <li className="suboption" style={{ marginBottom: '10px' }}>
                            <Link href="/ViewPost">
                              <a onClick={handleLinkClick} style={{ color: 'white' }}>View Post</a>
                            </Link>
                          </li>)
                           }
                        </ul>
                      )}
                      <div className='single_link option iconAdd'>
                        <li>
                          <Link  href="/blog">
                            <a onClick={handleLinkClick} style={{ color: 'white' }}>
                              <FaBlog /> Blog
                            </a>
                          </Link>
                        </li>
                      </div>
                      <div className='single_link option iconAdd'>
                        <li>
                          <a onClick={openFeedbackForm} style={{ color: 'white' }}>
                            <FaComment /> Give Feedback
                          </a>
                        </li>
                      </div>
                      {showFeedbackForm && (
                        <div className="feedback-form">
                          <h3>Give Feedback</h3>
                          <textarea value={feedback} onChange={handleFeedbackChange} />
                          <button onClick={submitFeedback}>Submit</button>
                          <button className="cancel-button" onClick={cancelFeedback}>Cancel</button>
                        </div>
                      )}
                    </ul>
                  </Nav>
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};


export default SidebarMenu;
