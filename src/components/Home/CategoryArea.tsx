import Link from "next/link";

// import Particles from "react-particles-js";
// import particlesConfig from './particles.js';
// import animation from "./animation2.mov";
const ducumentData1 = [
   {
      id: 1,
      title: 'Non-Transparency',
      bgClass: 'gradient-purple'
   },
   {
      id: 2,
      title: 'Fragmented Users',
      bgClass: 'gradient-pink'
   },   
   {
      id: 3,
      title: 'Clerical Errors ',
      bgClass: 'gradient-orange'
   },
   {
      id: 4,
      title: 'Slow Workflow',
      bgClass: 'gradient-blue'
   },
]

const featuresData = [

   {
      id: 1,
      title: 'Easy Negotiations',
      bgClass: 'gradient-orange'
   },
   {
      id: 2,
      title: 'Data Interoperability',
      bgClass: 'gradient-blue'
   },
   {
      id: 3,
      title: 'Paperless Transactions',
      bgClass: 'gradient-pink'
   },
   {
      id: 4,
      title: 'Streamlined Processes',
      bgClass: 'gradient-purple'
   },

]

const categoryData = [
   {
      id: 1,
      img: 'assets/img/fillers/saturn.png',
      title: 'About Us'
   },


]



const CategoryArea = () => {
   return (
      <>
         
        <section className="category__area black-bg pt-105 pb-135"
          style={{backgroundSize:'cover',backgroundPosition:'center', }}>  
             {/* <section>
          <video autoPlay loop muted > 
            <source src={animation} type="video/mp4"/>         
         </video>   */}
            {/* <div className="App" style={{ position: 'relative', overflow: "hidden" }}>
      <div style={{ position: 'absolute'}}>
        <Particles height="100vh" width="100vw" params={particlesConfig} />
      </div>  */}
              
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="section__title-wrapper text-center mb-60">

                     </div>
                  </div>
               </div>
      
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">

                     <div className="section__title-wrapper text-center mb-45">
                        <h2 className="section__title wow fadeInUp" data-wow-delay=".3s"><span>One Stop Solution For All Stakeholders In The Logistics Domain</span></h2>
                        <br></br>
                        <p style={{color:"White"}}>Gravitii is a DApp Built on Solana Ecosystem</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="category__area black-bg pt-105 pb-135"
         style={{backgroundSize:'cover',backgroundPosition:'center'}}>
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="section__title-wrapper text-center mb-60">

                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">

                     <div className="section__title-wrapper text-center mb-45">
                        <h2 className="section__title wow fadeInUp" data-wow-delay=".3s"><span>What problems are we solving?</span></h2>
                     </div>   
                  </div>

               </div>
               <div className="row">

                  {
                     ducumentData1.map((item, index) => {
                        return <div key={index} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                           <div className={`documentation__item ${item.bgClass} mb-30 transition-3 text-center`}>
                              <div className="documentation__content">
                                 <h3 className="documentation__title">
                                    <a >{item.title}</a>
                                 </h3>
                                 
                              </div>
                           </div>
                        </div>
                     })
                  }

               </div>

            </div>
         </section>
         <section className="category__area black-bg pt-105 pb-135"
         style={{backgroundSize:'cover',backgroundPosition:'center'}}>
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="section__title-wrapper text-center mb-60">

                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">

                     <div className="section__title-wrapper text-center mb-45">
                        <h2 className="section__title wow fadeInUp" data-wow-delay=".3s"><span>Features</span></h2>
                     </div>   
                  </div>

               </div>
               <div className="row">

                  {
                     featuresData.map((item, index) => {
                        return <div key={index} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                           <div className={`documentation__item ${item.bgClass} mb-30 transition-3 text-center`}>
                              <div className="documentation__content">
                                 <h3 className="documentation__title">
                                    <a >{item.title}</a>
                                 </h3>
                                 
                              </div>
                           </div>
                        </div>
                     })
                  }

               </div>

            </div>
         </section>

         {/* <section className="category__area black-bg pt-105 pb-135"
         style={{backgroundSize:'cover',backgroundPosition:'center'}}>
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="section__title-wrapper text-center mb-60">

                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">

                     <div className="section__title-wrapper text-center mb-45">
                        <h2 className="section__title wow fadeInUp" data-wow-delay=".3s"><span>Features</span></h2>
                     </div>   
                  </div>

               </div>
               <div className="row">

                  {
                     featuresData.map((item, index) => {
                        return <div key={index} className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                           <div className={`documentation__item ${item.bgClass} mb-30 transition-3 text-center`}>
                              <div className="documentation__icon mb-30">

                              </div>
                              <div className="documentation__content">
                                 <h3 className="documentation__title">
                                    <Link href="/"><a >{item.title}</a></Link>
                                 </h3>
                                 
                              </div>
                           </div>
                        </div>
                     })
                  }

               </div>

            </div>
         </section> */}


         <section className="category__area black-bg pt-105 pb-135"
         style={{backgroundSize:'cover',backgroundPosition:'center'}}>
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="section__title-wrapper text-center mb-60">

                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">


                     <div className="section__title-wrapper text-center mb-45">
                     <a href="#"><img src="assets/img/fillers/black-hole.png" alt="" /></a>
                        <h3 className="section__title wow fadeInUp" data-wow-delay=".3s"><span style={{color:'White'}} >We are launching soon!</span></h3>
                     </div>   
                  </div>

                  <div className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                     <div className="section__title-wrapper text-center mb-45">
                        <p style={{color:'White'}} className="wow fadeInUp" data-wow-delay=".5s">Contact us at connect@gravitii.xyz</p>
                     </div>   
                  </div>

               </div>

            </div>
         </section>

         {/* <section className="category__area black-bg pt-105 pb-135"
         style={{backgroundSize:'cover',backgroundPosition:'center'}}>
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="section__title-wrapper text-center mb-60">

                     </div>
                  </div>
               </div>
               <div className="row">

               </div>
               <div className="row">

                  {
                     categoryData.map((category, index) => {
                        return <div key={index} className="col-xxl-6 offset-xxl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
                           <div className="category__item transition-3 text-center white-bg mb-30 wow fadeInUp" data-wow-delay=".3s" >
                              <div className="category__icon mb-25">
                                 <a href="/about-us"><img src={category.img} alt="" /></a>
                              </div>
                              <div className="category__content">
                                 <h3 className="category__title">
                                    <Link href="/about-us"><a >{category.title}</a></Link>
                                 </h3>

                              </div>
                           </div>
                        </div>
                     })
                  }

                  </div>
 
            </div>
         </section> */}
         
      </>
   );
};

export default CategoryArea;