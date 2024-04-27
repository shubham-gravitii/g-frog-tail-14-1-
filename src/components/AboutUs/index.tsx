import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from '../../styles/About.module.css'

import whoWeAreImg from "../../assets/images/aboutus/whoWeAre2.jpg"

import whyChooseUs from "../../assets/images/aboutus/whyChooseUs.svg"
import profile from '../../assets/images/aboutus/profile.jpg'
// import Inter_Tight from 'next/font/google'
// import { w1, w2, w3, w4, w5, w6, w7, w8 } from '../../assets/images/aboutus/wareHouseGallery'
import AddIcon from '@mui/icons-material/Add';
const About = () => {
    return (
        <>
            <Head >
                {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" /> */}
                <title>Gravitii | About-Us</title>
            </Head>
            {/* <section className="header18 cid-u2djpAWuq8 mbr-fullscreen" data-bg-video="https://www.youtube.com/embed/I3fUvD-qCF0?autoplay&#x3D;1&amp;loop&#x3D;1&amp;playlist&#x3D;I3fUvD-qCF0&amp;t&#x3D;20&amp;mute&#x3D;1&amp;playsinline&#x3D;1&amp;controls&#x3D;0&amp;showinfo&#x3D;0&amp;autohide&#x3D;1&amp;allowfullscreen&#x3D;true&amp;mode&#x3D;transparent" id="hero-16-u2djpAWuq8">
        <div className="mbr-overlay" style={{"opacity": 0.3, "backgroundColor": "rgb(0, 0, 0)"}}></div>
        <div className="container-fluid">
          <div className="row">
            <div className="content-wrap col-12 col-md-10">
              <h1 className="mbr-section-title text-center mbr-white mb-4 display-1">
                <strong>Find Warehouses</strong>
              </h1>
              <p className="text-center mbr-text mbr-white mb-4 display-7">Discover and rent warehouses in your area with ease. No more hassle, just space!</p>
              <div className="mbr-section-btn">
                <a className="btn btn-white-outline display-7" href="#">Explore Now</a>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            {/* <div className={`${styles.first}`} id='bgImage'>
        <div className={`${styles.content}`}>
          <h1 className={`${styles.mainHeading}`}>Find Warehouses</h1>
          <p className={`${styles.subHeading}`}>Discover and rent warehouses in your area with ease. No more hassle, just space!</p>
          <Link href="#" >
            <a href="#" className={`${styles.button}`}>Explore Now</a></Link>
        </div>
      </div> */}
            <section className={`article05 cid-u2djpAWs48 ${styles.bgGreen}`} id="about-us-5-u2djpAWs48">
                <div className="container ">
                    <div className="row justify-content-center align-items-center ">
                        <div className="col-12 ">
                            <div className="card-wrapper rounded-5 ">
                                <div className="row d-flex">
                                    <div className="col-12 col-md-12 col-lg-5 image-wrapper align-self-stretch">
                                        <img className="w-100 rounded-5 h-100" src={whoWeAreImg.src} />
                                        {/* <Image src={whoWeAreImg} className=" w-100 rounded-5 h-100" height={10000} /> */}
                                    </div>
                                    <div className="col-12 col-lg-7 col-md-12">
                                        <div className="text-wrapper align-left">
                                            <h1 className="mbr-section-title text-center mb-4 ">
                                                <strong className='display-3'>Who We Are ?</strong>
                                            </h1>
                                            <p className="mbr-text mb-3 display-7">Gravitii aims to ease and facilitate the process of renting the warehouses. Our platform makes it convenient for warehouse owners and customers to list their offering and requirements respectively, thereby helping them to find the perfect storage solution.</p>
                                            <p className="mbr-text mb-3 display-7">We believe that the process of finding a storage space should be simple and relaxed. We are excited about closing the gap between stakeholders, thereby easing the process of renting a warehouse.</p>
                                            <p className="mbr-text mb-3 display-7">At Gravitii, we do not aim to be just a platform. We are all about our warehouse owners and customers. You can now say good bye to the old and conventional ways of searching a warehouse after switching to us.</p>
                                            <p className="mbr-text  display-7">Join us in transforming the way customers find the warehouse. Happy Searching…</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="features03 cid-u2djpAWvSi" id="events-1-u2djpAWvSi">
        <div className="container-fluid">
          <div className="row justify-content-center mb-5">
            <div className="col-12 content-head">
              <div className="mbr-section-head">
                <h4 className="mbr-section-title text-center align-center mb-0 display-2">
                  <strong>Upcoming Events</strong>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="item features-image col-12 col-md-6 col-lg-3 active">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="assets/images/photo-1589792923962-537704632910.jpeg"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle text-center mb-3 display-5">
                    <strong><a className="text-black fw-bold" href="#">Warehouse Showcase</a></strong>
                  </h6>
                  <p className="mbr-text text-center mb-3 display-7">February 15, 2024</p>
                  <p className="mbr-text text-center mb-3 display-7">Join us for an exclusive showcase of the latest warehouses available for rent in your area.</p>
                  <div className="mbr-section-btn item-footer"><a href="#" className="btn item-btn btn-primary display-7">Attend</a></div>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="assets/images/photo-1586528116691-012ff3ac0fec.jpeg" data-slide-to="1" data-bs-slide-to="1"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle text-center mb-3 display-5">
                    <strong><a className="text-black fw-bold" href="#">Warehouse Open House</a></strong>
                  </h6>
                  <p className="mbr-text text-center mb-3 display-7">March 10, 2024</p>
                  <p className="mbr-text text-center mb-3 display-7">Get a firsthand look at the top warehouse listings and meet the owners in person at our open house event.</p>
                  <div className="mbr-section-btn item-footer"><a href="#" className="btn item-btn btn-primary display-7">Attend</a></div>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="assets/images/photo-1622127739239-1905bbaa21b8.jpeg" data-slide-to="2" data-bs-slide-to="2"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle text-center mt-0 mb-3 display-5">
                    <strong><a className="text-black fw-bold" href="#">Storage Solutions Seminar</a></strong>
                  </h6>
                  <p className="mbr-text text-center mb-3 display-7">April 5, 2024</p>
                  <p className="mbr-text text-center mb-3 display-7">Learn about the latest trends and innovations in warehouse storage solutions at our informative seminar.</p>
                  <div className="mbr-section-btn item-footer"><a href="#" className="btn item-btn btn-primary display-7">Attend</a></div>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-3">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src="assets/images/photo-1586528116493-a029325540fa.jpeg" data-slide-to="3" data-bs-slide-to="3"/>
                </div>
                <div className="item-content align-left">
                  <h6 className="item-subtitle text-center mt-0 mb-3 display-5">
                    <strong><a className="text-black fw-bold" href="#">Warehouse Networking Mixer</a></strong>
                  </h6>
                  <p className="mbr-text text-center mb-3 display-7">May 20, 2024</p>
                  <p className="mbr-text text-center mb-3 display-7">Connect with warehouse owners, customers, and industry experts at our networking mixer event.</p>
                  <div className="mbr-section-btn item-footer"><a href="#" className="btn item-btn btn-primary display-7">Attend</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            {/* <section className="features03 cid-u2djpAXl9S" id="features-7-u2djpAXl9S">
        <div className="container-fluid">
          <div className="row">
            <div className="item features-image col-12 col-md-6 col-lg-4 active">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src={easyListing.src} className='rounded-5' />
                </div>
                <div className="item-content align-left">
                  <h5 className="item-title text-center mt-0 mb-2 display-5">
                    <strong>Easy Listings</strong>
                  </h5>
                  <p className="mbr-text text-center mb-3 display-7">
                    Owners can list warehouses with just a few clicks.
                  </p>
                  <div className="mbr-section-btn item-footer">
                    <Link href={"/login"}>
                      <a className={`${styles.bgOrange} btn item-btn  display-7 rounded-5 px-4 py-3`}>
                        Get Started
                      </a></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src={smartSearch.src} data-slide-to="1" data-bs-slide-to="1" className='rounded-5' />
                </div>
                <div className="item-content align-left">
                  <h5 className="item-title text-center mb-2 mt-0 display-5">
                    <strong>Smart Search</strong>
                  </h5>
                  <p className="mbr-text text-center mb-3 display-7">
                    Customers can find the perfect warehouse with advanced search filters.
                  </p>
                  <div className="mbr-section-btn item-footer">
                    <Link href={"/login"}>
                      <a className={`${styles.bgOrange} btn item-btn  display-7 rounded-5 px-4 py-3`}>
                        Get Started
                      </a></Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="item features-image col-12 col-md-6 col-lg-4">
              <div className="item-wrapper">
                <div className="item-img mb-3">
                  <img src={secureTransactions.src} data-slide-to="2" data-bs-slide-to="2" className='rounded-5' />
                </div>
                <div className="item-content align-left">
                  <h5 className="item-title text-center mb-2 mt-0 display-5">
                    <strong>Secure Transactions</strong>
                  </h5>
                  <p className="mbr-text text-center mb-3 display-7">
                    Enjoy peace of mind with secure rental transactions.
                  </p>
                  <div className="mbr-section-btn item-footer">
                    <Link href={"/login"}>
                      <a className={`${styles.bgOrange} btn item-btn  display-7 rounded-5 px-4 py-3`}>
                        Get Started
                      </a></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            <section className="article2 cid-u2djpAXSub p-4 " id="generic-text-2-u2djpAXSub">
                <div className="container bg-white rounded-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-12 col-lg-5 image-wrapper p-0">
                            <img className="w-100 rounded-5" src={whyChooseUs.src} />
                        </div>
                        <div className="col-12 col-md-12 col-lg px-3 p-md-5 ">
                            <div className="text-wrapper align-left ">
                                <h1 className="mbr-section-title mb-4 display-2 text-center">
                                    <strong>Why Choose Us ?</strong>
                                </h1>
                                <p className="mbr-text align-left  mb-0 display-7">Our user-friendly platform will help you to:</p>
                                <div className=" mbr-text align-left  mb-3 display-7 ">
                                    <ul className='p-3 pt-0 ulListStyleBullets'>
                                        <li className=''>List your warehouse and/or storage requirement.</li>
                                        <li>Highlight your warehouse on a national level.</li>
                                        <li>Search and post warehouses across India.</li>
                                        <li>Select a list of features that you either want or provide in a warehouse.</li>
                                        <li>Provide the feedback to stakeholders.</li>
                                    </ul>
                                </div>


                                <p className="mbr-text align-left  mb-3 display-7">Join us in our mission to revolutionize the warehouse rental industry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="header2 cid-u2djpAX5oq" id="subscription-form-1-u2djpAX5oq">
        <div className="container">
          <div className="row content-wrapper justify-content-center">
            <div className="col-lg-8 mbr-form">
              <div className="">
                <h1 className="mbr-section-title text-center mb-5 display-1">
                  <strong>Stay Updated with the Latest Listings</strong>
                </h1>
              </div>
              <div className="text-wrapper align-left" data-form-type="formoid">
                <form action="https://mobirise.eu/" method="POST" className="mbr-form form-with-styler" data-form-title="Form Name"><input type="hidden" name="email" data-form-email="true" value="">
                  <div className="row">
                    <div hidden="hidden" data-form-alert="" className="alert alert-success col-12">Thanks for filling out the form!</div>
                    <div hidden="hidden" data-form-alert-danger="" className="alert alert-danger col-12">
                      Oops...! some problem!
                    </div>
                  </div>
                  <div className="dragArea row">
                    <div data-for="email" className="col-lg-6 col-md-6 col-sm-12 form-group">
                      <input type="email" name="email" placeholder="test@email.com" data-form-field="email" className="form-control display-7" value="" id="email-header02-0">
                    </div>
                    <div className="col-auto mbr-section-btn"><button type="submit" className="w-100 btn btn-primary display-7">Subscribe Now</button></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            {/* testimonials */}
            {/* <section className="people06 cid-u2djpAXVPI" id="testimonials-7-u2djpAXVPI">
        <div className="container">
          <div className="row justify-content-center">
            <div className="card col-12 col-md-12 col-lg-8">
              <div className="card-wrapper">
                <div className="card-box align-center">
                  <p className="card-text text-center display-5">
                    WareHub made it so easy to find the perfect warehouse for my business. Highly recommended!
                  </p>
                  <div className="img-wrapper mt-3 justify-content-center">
                    <img src={p1.src} data-slide-to="0" data-bs-slide-to="0" />
                  </div>
                  <p className="card-title text-center mt-3 display-7">
                    <strong>John Smith</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            <section className="people03 cid-u2djpAYqTN px-4 px-sm-5" id="team-1-u2djpAYqTN">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 content-head">
                            <div className="mbr-section-head mb-5 pb-4">
                                <h4 className="mbr-section-title text-center align-center mb-4 pb-2 display-2">
                                    <strong>Our Team</strong>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 d-flex justify-content-center align-items-center">
                        <div className="item features-image col-12 col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                            <div className="item-wrapper">
                                <div className="item-img mb-3 ">
                                    <img src={profile.src} className='rounded-5 rounded-circle hover-zoom' />
                                </div>
                                <div className="item-content align-left">
                                    <h6 className="item-subtitle text-center display-5">
                                        <strong>Pranav</strong></h6>
                                    <p className="mbr-text text-center display-7">Co-founder</p>
                                </div>
                            </div>
                        </div>
                        <div className="item features-image col-12 col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                            <div className="item-wrapper">
                                <div className="item-img mb-3 ">
                                    <img src={profile.src} className='rounded-5 rounded-circle hover-zoom' />
                                </div>
                                <div className="item-content align-left">
                                    <h6 className="item-subtitle text-center display-5">
                                        <strong>Kartik</strong></h6>
                                    <p className="mbr-text text-center display-7">Co-founder</p>
                                </div>
                            </div>
                        </div>
                        <div className="item features-image col-12 col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                            <div className="item-wrapper">
                                <div className="item-img mb-3 ">
                                    <img src={profile.src} className='rounded-5 rounded-circle hover-zoom' />
                                </div>
                                <div className="item-content align-left">
                                    <h6 className="item-subtitle text-center display-5">
                                        <strong>Prateek</strong></h6>
                                    <p className="mbr-text text-center display-7">Co-founder</p>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="row mt-5  d-flex justify-content-center align-items-center">
                        <div className="item features-image col-12 col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                            <div className="item-wrapper">
                                <div className="item-img mb-3 ">
                                    <img src={profile.src} className='rounded-5 rounded-circle hover-zoom' />
                                </div>
                                <div className="item-content align-left">
                                    <h6 className="item-subtitle text-center display-5">
                                        <strong>Sarthak</strong></h6>
                                    <p className="mbr-text text-center display-7">Developer</p>
                                </div>
                            </div>
                        </div>
                        <div className="item features-image col-12 col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                            <div className="item-wrapper">
                                <div className="item-img mb-3 ">
                                    <img src={profile.src} className='rounded-5 rounded-circle hover-zoom' />
                                </div>
                                <div className="item-content align-left">
                                    <h6 className="item-subtitle text-center display-5">
                                        <strong>Toheed</strong></h6>
                                    <p className="mbr-text text-center display-7">Developer</p>
                                </div>
                            </div>
                        </div>
                        <div className="item features-image col-12 col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                            <div className="item-wrapper">
                                <div className="item-img mb-3 ">
                                    <img src={profile.src} className='rounded-5 rounded-circle hover-zoom' />
                                </div>
                                <div className="item-content align-left">
                                    <h6 className="item-subtitle text-center display-5">
                                        <strong>Shubham</strong></h6>
                                    <p className="mbr-text text-center display-7">Developer</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>
            {/* <section className="features023 cid-u2djpAYCJJ" id="metrics-1-u2djpAYCJJ">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 content-head">
              <div className="card-wrapper mb-5">
                <div className="card-box align-center">
                </div>
              </div>
            </div>
          </div>
          <div className="row content-row">
            <div className="item features-without-image col-12 col-md-6 col-lg-4 item-mb">
              <div className="item-wrapper">
                <div className="title mb-3">
                  <span className="num text-center display-1"><strong>1000+</strong></span>
                </div>
                <h4 className="card-title text-center display-5">
                  <strong>Listings Available</strong>
                </h4>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4 item-mb">
              <div className="item-wrapper">
                <div className="title mb-3">
                  <span className="num text-center display-1"><strong>500+</strong></span>
                </div>
                <h4 className="card-title text-center display-5">
                  <strong>Happy Customers</strong>
                </h4>
              </div>
            </div>
            <div className="item features-without-image col-12 col-md-6 col-lg-4 item-mb">
              <div className="item-wrapper">
                <div className="title mb-3">
                  <span className="num text-center display-1"><strong>95%</strong></span>
                </div>
                <h4 className="card-title text-center display-5">
                  <strong>Customer Satisfaction</strong>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            {/* <section className="pricing04 cid-u2djpAY7MV" id="product-list-7-u2djpAY7MV">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div className="col-12 col-md-12">
                <h5 className="mbr-section-title text-center mt-0 mb-4 display-2">
                  <strong>Featured Warehouses</strong>
                </h5>
                <h6 className="mbr-section-subtitle text-center mt-0 mb-4 display-7">
                  Check out our top warehouse listings and find the perfect space for your needs.
                </h6>
                <div className="mbr-section-btn mt-3 main-button">
                  <a href="" className="btn btn-primary display-7">Get Started</a>
                </div>
              </div>
            </div>
            <div className="col-lg-8 side-features">
              <div className="item features-without-image col-12 col-md-6 col-lg-6 item-mb active">
                <div className="item-wrapper">
                  <div className="item-head">
                    <h5 className="item-title text-center mb-0 display-5">
                      <strong>Standard Plan</strong>
                    </h5>
                    <h6 className="item-subtitle text-center mb-0 display-7">
                      <strong>$99/month</strong>
                    </h6>
                  </div>
                  <div className="item-content">
                    <p className="mbr-text text-center display-7">
                      Ideal for small businesses and startups.
                    </p>
                    <div className="mb-4">
                    </div>
                    <div className="counter-container mbr-text text-center display-7">
                      <ul>
                        <li>24/7 Access</li>
                        <li>Security Cameras</li>
                        <li>Loading Dock</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mbr-section-btn item-footer">
                    <a href="" className="btn item-btn btn-primary display-7">Rent Now</a>
                  </div>
                </div>
              </div>
              <div className="item features-without-image col-12 col-md-6 col-lg-6 item-mb">
                <div className="item-wrapper">
                  <div className="item-head">
                    <h5 className="item-title text-center mb-0 display-5">
                      <strong>Premium Plan</strong>
                    </h5>
                    <h6 className="item-subtitle text-center mb-0 display-7">
                      <strong>$199/month</strong>
                    </h6>
                  </div>
                  <div className="item-content">
                    <p className="mbr-text text-center display-7">
                      Perfect for growing businesses with larger storage needs.
                    </p>
                    <div className="mb-4">
                    </div>
                    <div className="counter-container mbr-text text-center display-7">
                      <ul>
                        <li>Climate Control</li>
                        <li>Office Space</li>
                        <li>Custom Layout</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mbr-section-btn item-footer">
                    <a href="" className="btn item-btn btn-primary display-7">Rent Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            <section className="list1 cid-u2djpAZyU7" id="faq-1-u2djpAZyU7">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-12 col-lg-10 m-auto">
                            <div className="content">
                                <div className="mbr-section-head align-left mb-5">
                                    <h3 className="mbr-section-title mb-4 text-center display-2">
                                        <strong>FAQs</strong>
                                    </h3>
                                </div>
                                <div id="bootstrap-accordion_0" className="panel-group accordionStyles accordion" role="tablist" aria-multiselectable="true">
                                    <div className="card mb-3">
                                        <div className="card-header" role="tab" id="headingOne">
                                            <a role="button" className="panel-title collapsed" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse1_0" aria-expanded="false" aria-controls="collapse1">
                                                <h6 className="panel-title-edit mbr-semibold  mb-0 display-6">
                                                    How do I list my warehouse?
                                                </h6>
                                                <span className="sign mbr-iconfont mobi-mbri-arrow-down"><ArrowDropDownIcon fontSize='large' /></span>
                                            </a>
                                        </div>
                                        <div id="collapse1_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
                                            <div className="panel-body">
                                                <p className=" panel-text display-7">
                                                    Listing your warehouse is easy! Simply create an account, go to the &#x27;List Warehouse&#x27; section, and fill in the details of your space.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" role="tab" id="headingOne">
                                            <a role="button" className="panel-title collapsed" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse2_0" aria-expanded="false" aria-controls="collapse2">
                                                <h6 className="panel-title-edit mbr-semibold  mb-0 display-6">
                                                    Can I visit a warehouse before renting?
                                                </h6>
                                                <span className="sign mbr-iconfont mobi-mbri-arrow-down"><ArrowDropDownIcon fontSize='large' /></span>
                                            </a>
                                        </div>
                                        <div id="collapse2_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
                                            <div className="panel-body">
                                                <p className=" panel-text display-7">
                                                    Yes, you can schedule a visit to any warehouse before making a rental decision. Contact the owner to arrange a viewing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" role="tab" id="headingOne">
                                            <a role="button" className="panel-title collapsed" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse3_0" aria-expanded="false" aria-controls="collapse3">
                                                <h6 className="panel-title-edit mbr-semibold mb-0 display-6">
                                                    What if I need a larger space?
                                                </h6>
                                                <span className="sign mbr-iconfont mobi-mbri-arrow-down"><ArrowDropDownIcon fontSize='large' /></span>
                                            </a>
                                        </div>
                                        <div id="collapse3_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
                                            <div className="panel-body">
                                                <p className="panel-text display-7">
                                                    If you need a larger space, simply upgrade to our Premium Plan or contact us for custom solutions tailored to your needs.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" role="tab" id="headingOne">
                                            <a role="button" className="panel-title collapsed" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse4_0" aria-expanded="false" aria-controls="collapse4">
                                                <h6 className="panel-title-edit mbr-semibold  mb-0 display-6">
                                                    Is my rental transaction secure?
                                                </h6>
                                                <span className="sign mbr-iconfont mobi-mbri-arrow-down"> <ArrowDropDownIcon fontSize='large' /></span>
                                            </a>
                                        </div>
                                        <div id="collapse4_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
                                            <div className="panel-body">
                                                <p className=" panel-text display-7">
                                                    Absolutely! We prioritize the security of all rental transactions on our platform. Your peace of mind is our top priority.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" role="tab" id="headingOne">
                                            <a role="button" className="panel-title collapsed" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse5_0" aria-expanded="false" aria-controls="collapse5">
                                                <h6 className="panel-title-edit mbr-semibold  mb-0 display-6">
                                                    How do I contact customer support?
                                                </h6>
                                                <span className="sign mbr-iconfont mobi-mbri-arrow-down">
                                                    <ArrowDropDownIcon fontSize='large' />
                                                </span>
                                            </a>
                                        </div>
                                        <div id="collapse5_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
                                            <div className="panel-body">
                                                <p className=" panel-text display-7">
                                                    You can reach our customer support team via email, phone, or by filling out the contact form on our website.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="article13 cid-u2djpAZjFn" id="call-to-action-3-u2djpAZjFn">
        <div className="container">
          <div className="row justify-content-center">
            <div className="card col-md-12 col-lg-10">
              <div className="card-wrapper">
                <div className="card-box align-left">
                  <h4 className="card-title text-center display-2">
                    <strong>Ready to Get Started?</strong>
                  </h4>
                  <div className="mbr-section-btn mt-4">
                    <a className="btn btn-primary display-4" href="https://mobiri.se">Find Your Warehouse</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
            {/* <section className="gallery1 mbr-gallery cid-u2djpAZL5u" id="gallery-10-u2djpAZL5u">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 content-head">
              <div className="mb-4">
                <h3 className="mbr-section-title text-center align-center display-2"><strong>Warehouse Gallery</strong></h3>
              </div>
            </div>
          </div>
          <div className="row mbr-gallery">
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w1.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w8.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w2.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w3.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w4.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w5.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w6.src} />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 item gallery-image">
              <div className="item-wrapper mb-3">
                <img className="w-100 rounded-5" src={w7.src} />
              </div>
            </div>
          </div>
        </div>
      </section> */}

        </>

    )
}

export default About



// import React from 'react'
// import Image from 'next/image'
// import styles from '../../styles/About.module.css'
// import Link from 'next/link'
// import backgroundImg from '../../assets/images/aboutus/photo-1565891741441-64926e441838.jpeg'
// import rightImage from '../../assets/images/aboutus/photo-1599452390941-251da594d7e3.jpeg'
// import featureImage from '../../assets/images/aboutus/photo-1624927637280-f033784c1279.jpeg'
// import whyChooseUsImg from '../../assets/images/aboutus/photo-1589792923962-537704632910.jpeg'
// import { p1, p2, p3, p4 } from '../../assets/images/aboutus/ourTeamImages'
// const index = () => {
//   const featureImageStyle = {
//     "border-radius": "30px",
//     "flexGrow": 1
//   }
//   return (
//     <>

{/* <div className="backgroundImage postion-relative" style={{ height: '88vh' }}>
        <Image src={backgroundImg} alt="Background Image" layout="fill" objectFit="cover" style={{ height: '88vh' }} />
        <div className="container position-absolute " style={{bottom:"1%"}}>
          <div className="row">
            <div className="content-wrap col-12 col-md-10 ">
              <h1 className="mbr-section-title text-center mbr-white mb-4 display-1">
                <strong>Find Warehouses</strong>
              </h1>
              <p className="text-center mbr-text mbr-white mb-4 display-7">Discover and rent warehouses in your area with ease. No more hassle, just space!</p>
              <div className="mbr-section-btn">
                <a className="btn btn-white-outline display-7" href="#">Explore Now</a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
//       <div className={`${styles.cont}`}>
//         <div className={`${styles.first}`}>
//           <div className={`${styles.content}`}>
//             <h1 className={`${styles.mainHeading}`}>Find Warehouses</h1>
//             <p className={`${styles.subHeading}`}>Discover and rent warehouses in your area with ease. No more hassle, just space!</p>
//             <Link href="#" >
//               <a href="#" className={`${styles.button}`}>Explore Now</a></Link>
//           </div>
//         </div>
//         <div className={`${styles.whoWeAre} `}>
//           <div className={`d-flex flex-column-reverse flex-lg-row gap-3 align-items-center`}>
//             <div className={`col-lg-5  flex-grow-1  `}>
//               <h2 className={`${styles.mainHeading} text-black `}>Who we are</h2>
//               <p className={`${styles.subHeading} text-black ${styles.fontBeVietnam}`}>At WareHub, we connect warehouse owners with customers in need of storage space. Our platform makes it easy for owners to list their warehouses and for customers to find the perfect storage solution. <br />
//                 <br />
//                 We believe in making the process of finding and renting warehouses as simple and stress-free as possible. Say goodbye to the headache of searching for storage space! <br />
//                 <br />
//                 Join us in revolutionizing the way people find and rent warehouses.</p>
//             </div>

//             <div className='col-lg-5  flex-grow-1 h-sm-100'>
//               <img src={rightImage.src} style={featureImageStyle} className=''></img>
//             </div>

//           </div>
//         </div>
//         {/* <div className={`${styles.featuresParent}`}>
//           <div className={`${styles.features}`}>
//             <div className={`${styles.feature} `}>
//               <Image src={featureImage} width={"500px"} height={"300px"} style={featureImageStyle} />
//               <h5 className={`${styles.featureHeading}`}>Easy Listing</h5>
//               <p className={`${styles.featureSubHeading}`}>
//                 Owners can list warehouses with just a few clicks.
//               </p>
//               <button>
//                 <Link href={"/login"}>
//                   <span className={`${styles.getStartedBtn}`}>Get started</span>
//                 </Link>
//               </button>
//               <br /> <br />
//             </div>
//             <div className={`${styles.feature}`}>
//               <Image src={featureImage} width={"500x"} height={"300px"} style={featureImageStyle} />
//               <h5 className={`${styles.featureHeading}`}>Easy Listing</h5>
//               <p className={`${styles.featureSubHeading}`}>
//                 Owners can list warehouses with just a few clicks.
//               </p>
//               <button>
//                 <Link href={"/login"}>
//                   <span className={`${styles.getStartedBtn}`}>Get started</span>
//                 </Link>
//               </button>
//               <br /> <br />
//             </div>
//             <div className={`${styles.feature}`} >
//               <Image src={featureImage} width={"500px"} height={"300px"} style={featureImageStyle} />
//               <h5 className={`${styles.featureHeading}`}>Easy Listing</h5>
//               <p className={`${styles.featureSubHeading}`}>
//                 Owners can list warehouses with just a few clicks.
//               </p>
//               <button>
//                 <Link href={"/login"}>
//                   <span className={`${styles.getStartedBtn}`}>Get started</span>
//                 </Link>
//               </button>
//               <br /> <br />
//             </div>
//           </div>
//           <div className={`${styles.whyChooseUs}`}>
//             <div className={`${styles.left1}`}>
//               <img src={whyChooseUsImg.src} className={`${styles.whyChooseUsImg}`} />
//             </div>
//             <div className={`${styles.right} `}>
//               <h5 className={`${styles.whyChooseUsMainHeading}`}>Why Choose Us</h5>
//               <p className={`${styles.whyChooseUsSubHeading}`}>At WareHub, we're not just about warehouses; we're about simplifying your storage needs. With our user-friendly platform, finding and renting warehouses has never been easier.
//                 <br /><br />
//                 We're passionate about connecting owners and customers, and we're committed to providing a seamless experience for everyone involved.
//                 <br /> <br />
//                 Join us in our mission to revolutionize the warehouse rental industry.</p>
//             </div>
//           </div>
//         </div> */}
//         <div className="m-4 m-lg-5">
//           <div
//             className="d-flex flex-column flex-sm-row flex-wrap justify-content-center gap-4 "
//           >
//             <div className="d-flex flex-column align-items-center col-sm-6 col-md-5 col-lg-3 col-xl-3 flex-lg-grow-1 ">
//               <img
//                 src={featureImage.src}
//                 alt=""
//                 className="w-100 rounded-5 "
//               />
//               <h5 className={`${styles.featureHeading}`}>Easy Listing</h5>
//               <p className={`${styles.featureSubHeading} text-center`}>Owners can list warehouses with just a few clicks.</p>

//               <Link href={'/login'}>
//                 <a href="/login" className={`${styles.getStartedBtn}  mb-3`}>
//                   Get started
//                 </a>
//               </Link>
//             </div>
//             <div className="d-flex flex-column align-items-center col-sm-6 col-md-5 col-lg-3 col-xl-3 flex-lg-grow-1 ">
//               <img
//                 src={featureImage.src}
//                 alt=""
//                 className="w-100 rounded-5 "
//               />
//               <h5 className={`${styles.featureHeading}`}>Easy Listing</h5>
//               <p className={`${styles.featureSubHeading} text-center`}>Owners can list warehouses with just a few clicks.</p>

//               <Link href={'/login'}>
//                 <a href="/login" className={`${styles.getStartedBtn}  mb-3`}>
//                   Get started
//                 </a>
//               </Link>
//             </div>
//             <div className="d-flex flex-column align-items-center col-sm-6 col-md-5 col-lg-3 col-xl-3 flex-lg-grow-1 ">
//               <img
//                 src={featureImage.src}
//                 alt=""
//                 className="w-100 rounded-5 "
//               />
//               <h5 className={`${styles.featureHeading}`}>Easy Listing</h5>
//               <p className={`${styles.featureSubHeading} text-center`}>Owners can list warehouses with just a few clicks.</p>

//               <Link href={'/login'}>
//                 <a href="/login" className={`${styles.getStartedBtn}  mb-3`}>
//                   Get started
//                 </a>
//               </Link>
//             </div>


//           </div>
//           <div className={`${styles.whyChooseUs} m-lg-3 `}>
//             <div className={`${styles.left1}`}>
//               <img src={whyChooseUsImg.src} className={`${styles.whyChooseUsImg}`} />
//             </div>
//             <div className={`${styles.right} `}>
//               <h5 className={`${styles.whyChooseUsMainHeading} text-center`}>Why Choose Us</h5>
//               <p className={`${styles.whyChooseUsSubHeading} `}>At WareHub, we're not just about warehouses; we're about simplifying your storage needs. With our user-friendly platform, finding and renting warehouses has never been easier.
//                 <br /><br />
//                 We're passionate about connecting owners and customers, and we're committed to providing a seamless experience for everyone involved.
//                 <br /> <br />
//                 Join us in our mission to revolutionize the warehouse rental industry.</p>
//             </div>
//           </div>

//         </div>

//         <section className={`${styles.cid_u2djpAZyU7} list1`} id="faq-1-u2djpAZyU7">
//           <div className="container">
//             <div className="row justify-content-center">
//               <div className="col-12 col-md-12 col-lg-10 m-auto">
//                 <div className="content">
//                   <div className="mbr-section-head align-left mb-5">
//                     <h3 className={`${styles.mbr_section_title} mb-2 text-center display-2`}>
//                       <strong>FAQ</strong>
//                     </h3>
//                   </div>
//                   <div id="bootstrap-accordion_0" className={`${styles.panel_group } accordionStyles accordion`} role="tablist" aria-multiselectable="true">
//                     <div className={`${styles.card} mb-3 card`}>
//                       <div className={`${styles.card_header}`} role="tab" id="headingOne">
//                         <a role="button" className={`${styles.collapsed} panel_title collapsed`} data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse1_0" aria-expanded="false" aria-controls="collapse1">
//                           <h6 className={`${styles.panel_title_edit} mbr-semibold text-center mb-0 display-5`}>
//                             How do I list my warehouse?
//                           </h6>
//                           <span className={`${styles.mbr_iconfont } mobi-mbri-arrow-down sign`}></span>
//                         </a>
//                       </div>
//                       <div id="collapse1_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
//                         <div className={`${styles.panel_body}`}>
//                           <p className={`${styles.panel_text } text-center display-7`}>
//                             Listing your warehouse is easy! Simply create an account, go to the &#x27;List Warehouse&#x27; section, and fill in the details of your space.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`${styles.card} mb-3 card`}>
//                       <div className={`${styles.card_header}`} role="tab" id="headingOne">
//                         <a role="button" className={`${styles.collapsed} panel_title collapsed`}  data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse2_0" aria-expanded="false" aria-controls="collapse2">
//                           <h6 className={`${styles.panel_title_edit} mbr-semibold text-center mb-0 display-5`}>
//                             Can I visit a warehouse before renting?
//                           </h6>
//                           <span className={`${styles.mbr_iconfont } mobi-mbri-arrow-down sign`}></span>
//                         </a>
//                       </div>
//                       <div id="collapse2_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
//                         <div className={`${styles.panel_body}`}>
//                           <p className={`${styles.panel_text } text-center display-7`}>
//                             Yes, you can schedule a visit to any warehouse before making a rental decision. Contact the owner to arrange a viewing.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`${styles.card} mb-3 card`}>
//                       <div className={`${styles.card_header}`} role="tab" id="headingOne">
//                         <a role="button" className={`${styles.collapsed} panel_title collapsed`}  data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse3_0" aria-expanded="false" aria-controls="collapse3">
//                           <h6 className={`${styles.panel_title_edit} mbr-semibold text-center mb-0 display-5`}>
//                             What if I need a larger space?
//                           </h6>
//                           <span className={`${styles.mbr_iconfont } mobi-mbri-arrow-down sign`}></span>
//                         </a>
//                       </div>
//                       <div id="collapse3_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
//                         <div className={`${styles.panel_body}`}>
//                           <p className={`${styles.panel_text } text-center display-7`}>
//                             If you need a larger space, simply upgrade to our Premium Plan or contact us for custom solutions tailored to your needs.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`${styles.card} mb-3 card`}>
//                       <div className={`${styles.card_header}`} role="tab" id="headingOne">
//                         <a role="button" className={`${styles.collapsed} panel_title collapsed`}  data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse4_0" aria-expanded="false" aria-controls="collapse4">
//                           <h6 className={`${styles.panel_title_edit} mbr-semibold text-center mb-0 display-5`}>
//                             Is my rental transaction secure?
//                           </h6>
//                           <span className={`${styles.mbr_iconfont } mobi-mbri-arrow-down sign`}></span>
//                         </a>
//                       </div>
//                       <div id="collapse4_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
//                         <div className={`${styles.panel_body}`}>
//                           <p className={`${styles.panel_text } text-center display-7`}>
//                             Absolutely! We prioritize the security of all rental transactions on our platform. Your peace of mind is our top priority.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`${styles.card} mb-3 card`}>
//                       <div className={`${styles.card_header}`} role="tab" id="headingOne">
//                         <a role="button" className={`${styles.collapsed} panel_title collapsed`}  data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse5_0" aria-expanded="false" aria-controls="collapse5">
//                           <h6 className={`${styles.panel_title_edit} mbr-semibold text-center mb-0 display-5`}>
//                             How do I contact customer support?
//                           </h6>
//                           <span className={`${styles.mbr_iconfont } mobi-mbri-arrow-down sign`}></span>
//                         </a>
//                       </div>
//                       <div id="collapse5_0" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion" data-bs-parent="#bootstrap-accordion_0">
//                         <div className={`${styles.panel_body}`}>
//                           <p className={`${styles.panel_text } text-center display-7`}>
//                             You can reach our customer support team via email, phone, or by filling out the contact form on our website.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>



//       </div>

//     </>
//   )
// }

// export default index