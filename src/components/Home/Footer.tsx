//@ts-nocheck
import '@fortawesome/fontawesome-free/css/all.css';

const Footer = () => {
   return (

      <footer>
         <div className="footer__area footer-bg">
            <div className="footer__top pt-30 pb-10">
               <div className="container">
                  <div className="row d-flex justify-content-center ">
                     <div className="col-xxl-12 col-xl-12 col-lg-9 col-md-10 col-sm-12 col-10 d-flex justify-content-center ">
                        <div className="footer__widget  wow fadeInUp " data-wow-delay=".3s">
                           <div className="footer__widget-head mb-35 ">
                              <h4 className="footer__widget-title text-center" style={{color:"#058283"}}>Follow our Socials</h4>
                           </div>
                           <div className="footer__widget-content">
                              <div className="footer__social mb-30">
                                 <ul className='d-flex  align-items-center justify-content-center'>
                                    <li><a href="#" className="tw" target='_blank'><i className="fab fa-twitter"></i></a></li>
                                    <li><a href="https://www.linkedin.com/company/team-gravitii/posts" className='fb' target='_blank'><i className="fab fa-linkedin-in"></i></a></li>
                                    <li><a href="#" style={{ background: "linear-gradient(115deg, #f9ce34, #ee2a7b, #6228d7)" }} target='_blank'><i className="fab fa-instagram"></i></a></li>
                                 </ul>
                              </div>
                              {/* <div className="footer__lang">
                                 <span><a href="#">US</a> English</span>
                                 
                              </div> */}
                           </div>
                        </div>
                     </div>
                     <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-4 col-4 d-flex justify-content-center ">
                        <div className="footer__widget  wow fadeInUp " data-wow-delay=".5s">
                           <div className="footer__widget-head">
                              <h4 className="footer__widget-title" style={{color:"#058283"}}>Company</h4>
                           </div>
                           <div className="footer__widget-content">
                              <div className="footer__link">
                                 <ul className='d-flex flex-column px-0 align-items-center'>
                                    <li><a href="/about-us">About us </a></li>
                                    {/* <li><a href="#">News </a></li> */}
                                 </ul>
                              </div>
                           </div>
                           <div className="footer__widget-content">
                              <div className="footer__link">
                                 <ul className='d-flex flex-column px-0 align-items-center'>
                                    <li><a href="/contact-us">Contact us </a></li>
                                    {/* <li><a href="#">News </a></li> */}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-4 col-4 d-flex justify-content-center ">
                        <div className="footer__widget wow fadeInUp" data-wow-delay=".5s">
                           <div className="footer__widget-head">
                              <h4 className="footer__widget-title" style={{color:"#058283"}}>Product</h4>
                           </div>
                           <div className="footer__widget-content">
                              <div className="footer__link">
                                 <ul className='px-0 d-flex flex-column align-items-center'>
                                    <li><a href="/about-us/#faq-1-u2djpAZyU7">FAQ </a></li>
                                    <li><a href='./Terms/Cookie_Policy.pdf' target='_blank' rel="noopener noreferrer">Terms</a></li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-4 col-5 d-flex justify-content-center ">
                        <div className="footer__widget wow fadeInUp" data-wow-delay="1.2s">
                           <div className="footer__widget-head">
                              <h4 className="footer__widget-title" style={{color:"#058283"}}>Community</h4>
                           </div>
                           <div className="footer__widget-content">
                              <div className="footer__link">
                                 <ul className='px-0 d-flex flex-column align-items-center' >
                                    <li><a href="#">Blogs</a></li>
                                    {/* <li><a href="#">Meetups</a></li> */}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="footer__bottom ">
               <div className="container">
                  <div className="footer__bottom-inner  d-flex justify-content-center py-4">


                     <div className="footer__copyright wow fadeInUp " data-wow-delay=".5s">
                        <p className='text-center my-0'>Copyright © 2022 All Rights Reserved, <a href="#">Gravitii</a></p>

                     </div>

                     {/* <div className="col-xxl-6 col-xl-6 col-md-6">
                           <div className="footer__bottom-link wow fadeInUp text-md-end" data-wow-delay=".8s">

                           </div>
                        </div> */}

                  </div>
               </div>
            </div>
         </div>
         {/* working on another footer */}
         {/* <div className="footerMain footer-bg ">
            <div className="footer_top1 d-flex justify-content-center flex-wrap ">
               <div className="elements1 px-5 mx-3">
                  <div className="footer__widget-head mb-35">
                     <h4 className="footer__widget-title">Follow our Socials</h4>
                  </div>
                  <div className="footer__widget-content">
                     <div className="footer__social mb-30">
                        <ul className='d-flex '>
                           <li><a href="#" className="tw"><i className="fab fa-twitter"></i></a></li>
                           <li><a href="https://www.linkedin.com/company/team-gravitii/posts" className="fb"><i className="fab fa-linkedin-in"></i></a></li>
                        </ul>
                     </div>
                     
                  </div>
               </div>
               <div className="elements1 px-3 ">
                  <div className="footer__widget-head">
                     <h4 className="footer__widget-title">Company</h4>
                  </div>
                  <div className="footer__widget-content">
                     <div className="footer__link">
                        <ul>
                           <li><a href="/about-us">About us </a></li>
                           <li><a href="#">News </a></li>
                        </ul>
                     </div>
                  </div>
               </div>
               <div className="elements1 px-3 ">
                  <div className="footer__widget-head">
                     <h4 className="footer__widget-title">Product</h4>
                  </div>
                  <div className="footer__widget-content">
                     <div className="footer__link">
                        <ul>
                           <li><a href="#">FAQ </a></li>
                           <li><a href="#">Terms</a></li>
                        </ul>
                     </div>
                  </div>
               </div>
               <div className="elements1 px-3 ">
                  <div className="footer__widget-head">
                     <h4 className="footer__widget-title">Community</h4>
                  </div>
                  <div className="footer__widget-content">
                     <div className="footer__link">
                        <ul>
                           <li><a href="#">Blogs</a></li>
                           <li><a href="#">Meetups</a></li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
            <div className="footer_down1">
               <div className="footer__copyright wow fadeInUp " data-wow-delay=".5s">
                  <p>Copyright © 2022 All Rights Reserved, <a href="#">Gravitii</a></p>

               </div>
            </div>
         </div> */}

      </footer>

   );
};

export default Footer;