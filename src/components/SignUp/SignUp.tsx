// @ts-nocheck
import { useState } from "react";
import { auth, createUserDocumentFromAuth, checkUserExistsByPhone, createAuthUserWithEmailAndPassword, signInWithGooglePopup, checkUserExistsByEmail } from "../../firebase/firebase";
import { useRouter } from 'next/router';
import { useAuth } from "../../contexts/UserContext";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";


const SignUp = () => {
   // const { handleGoogleSignIn, handleRegister } = useAuth();

   // // handleSubmit
   // const { register, handleSubmit, reset } = useForm();
   // const onSubmit = data => {
   //    if (data.password !== data.re_password) {
   //       return Swal.fire({
   //          icon: 'error',
   //          title: 'Does Not Match Password',
   //          text: 'Please provide a currect value',
   //       })
   //    }
   //    if (data.password.length < 6) {
   //       return Swal.fire({
   //          icon: 'error',
   //          // title: 'Does Not Password',
   //          text: 'Password Must be at least 6 character',
   //       })
   //    }
   //    handleRegister(data.name, data.email, data.password, reset)
   // };


   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [confirmPassword, setConfirmPassword] = useState<string>("");
   const [phoneNumber, setPhoneNumber] = useState<string>("");
   const [OTP, setOTP] = useState<string>("");
   const [loading, setLoading] = useState(false);
   const [showOTP, setShowOTP] = useState(false);
   const [showPhoneSignUp, setShowPhoneSignUp] = useState(false);
   const [showEmailSignUp, setShowEmailSignUp] = useState(false);
   const [showGoBack, setShowGoBack] = useState(false);
   const [showOptions, setShowOptions] = useState(true);
   const [showContinue, setShowContinue] = useState(true);


   const { updateUser } = useAuth();
   const router = useRouter();

   //toastify notification for SignUp
   const notifySignUpSuccess = (message: string) => toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
   });
   const notifySignUpError = (message: string) => toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
   });

   const resetFormFields = () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("")
      setPhoneNumber("")
   };

   const handleSignUpSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      if (password !== confirmPassword) {
         notifySignUpError("Passwords do not match");
         return;
      }

      try {
         const userExists = await checkUserExistsByEmail(email);

         if (userExists) {
            notifySignUpError("Cannot create user, email already in use");
            return;
         }

         const user = await createAuthUserWithEmailAndPassword(
            email,
            password
         );

         await createUserDocumentFromAuth(user, {

         });
         console.log("User Created")
         resetFormFields();
         router.push('/');
         notifySignUpSuccess("SignUp Successfull")

      } catch (error: any) {
         if (error.code === 'auth/email-already-in-use') {
            notifySignUpError("Cannot create user, email already in use");
         } else {
            notifySignUpError("user creation encountered an error");
            console.log('User creation encountered an error', error);
         }
      } finally {
         setLoading(false);
      }
   };
   const signInWithGoogle = async () => {
      try {

         const user = await signInWithGooglePopup();
         console.log("SignUp complete");
         await createUserDocumentFromAuth(user, {
            
         });
         router.push('/');
         notifySignUpSuccess("SignUp Successfull")

      } catch (error) {
         if (error.code === "auth/email-already-in-use") {
            notifySignUpError("Cannot create user, email already in use");
         } else {
            notifySignUpError("user creation encountered an error");
            console.log("user creation encountered an error", error);
         }
      }

   };
   const generateRecaptcha = () => {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
         'size': 'invisible',
         'callback': (response) => {
         }
      }, auth);
   }
   const requestOTP = async (number: string) => {
      try {

         console.log(number);
         generateRecaptcha();
         const appVerifier = window.recaptchaVerifier;
         const ph = "+91" + number;
         console.log(ph);
         await signInWithPhoneNumber(auth, ph, appVerifier)
            .then((confirmationResult) => {
               window.confirmationResult = confirmationResult;
               notifySignUpSuccess("OTP sent to your phone number");
            })
            .catch((error) => {
               notifySignUpError("Error while sending OTP");
               console.log("Phone auth error: ", error);
            });
      } catch (error) {
         console.log("Request OTP error: ", error);
      }
   };
   const verifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      console.log(OTP);
      const confirmationResult = window.confirmationResult;

      try {
         const result = await confirmationResult.confirm(OTP);
         const user = result.user;
         console.log(user);
         const cUser = await getUserByPhone(phoneNumber)
         console.log(cUser);
         updateUser(cUser)
         console.log('User Created');
         router.push('/');
         notifySignUpSuccess("Login Successfull");
      } catch (error) {
         notifySignUpError("Phone Login encountered error");
         console.log('Phone auth error:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleContinue = async (value: string) => {
      setShowGoBack(true)
      const userExits = await checkUserExistsByPhone(value);

      console.log(value)

      console.log(userExits)
      if (!userExits) {
         requestOTP(value);
         setPhoneNumber(value)
         setShowOTP(true)
         setShowContinue(false)
      } else {
         if(value === ""){
            notifySignUpError("Please enter valid number without gap")

         }else{
            notifySignUpError("User already exits")
         }
        
      }
      resetFormFields();
   }
   const handleEmailSignUp = () => {
      setShowEmailSignUp(true)
      setShowPhoneSignUp(false)
      setShowOptions(false)

   }
   const handlePhoneSignUp = () => {
      setShowPhoneSignUp(true)
      setShowContinue(true)
      setShowEmailSignUp(false)
      setShowOptions(false)

   }
   const handleGoBack = () => {
      resetFormFields();
      setShowOptions(true)
      setShowEmailSignUp(false);
      setShowPhoneSignUp(false);
      setShowOTP(false)

   }
   return (
      <>
         <section className="signup__area po-rel-z1 pt-100 pb-145">
            <div className="sign__shape">
               <img className="man-1" src="assets/img/icon/sign/man-3.png" alt="" />
               <img className="man-2 man-22" src="assets/img/icon/sign/man-2.png" alt="" />
               <img className="circle" src="assets/img/icon/sign/circle.png" alt="" />
               <img className="zigzag" src="assets/img/icon/sign/zigzag.png" alt="" />
               <img className="dot" src="assets/img/icon/sign/dot.png" alt="" />
               <img className="bg" src="assets/img/icon/sign/sign-up.png" alt="" />
               <img className="flower" src="assets/img/icon/sign/flower.png" alt="" />
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-xxl-8 offset-xxl-2 col-xl-8 offset-xl-2">
                     <div className="page__title-wrapper text-center mb-55">
                        <h2 className="page__title-2">Create a free <br /> Account</h2>
                        <p>{"I'm a subhead that goes with a story."}</p>
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                     <div className="sign__wrapper white-bg">
                        {showEmailSignUp && <>
                           <div className="sign__form">
                              <form onSubmit={handleSignUpSubmit}>
                                 <div className="sign__input-wrapper mb-25">
                                    <h5>Email</h5>
                                    <div className="sign__input">
                                       <input type="email"
                                          maxLength={50}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                             setEmail(event.target.value)
                                          }
                                          placeholder="email"
                                          name="email"
                                          id="email"
                                          required />
                                       <i className="fal fa-envelope"></i>
                                    </div>
                                 </div>
                                 <div className="sign__input-wrapper mb-25">
                                    <h5>Password</h5>
                                    <div className="sign__input">
                                       <input type="password"
                                          maxLength={50}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                             setPassword(event.target.value)
                                          }
                                          placeholder="Password"
                                          name="password"
                                          id="password"
                                          required />
                                       <i className="fal fa-lock"></i>
                                    </div>
                                 </div>
                                 <div className="sign__input-wrapper mb-10">
                                    <h5>Confirm Password</h5>
                                    <div className="sign__input">
                                       <input type="password"
                                          maxLength={50}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                             setConfirmPassword(event.target.value)
                                          }
                                          placeholder="Confirm Password"
                                          name="confirmPassword"
                                          id="confirmPassword"
                                          required />
                                       <i className="fal fa-lock"></i>
                                    </div>
                                 </div>
                                 <div className="sign__action d-flex justify-content-between mb-30">
                                    <div className="sign__agree d-flex align-items-center">
                                       <input required className="m-check-input" type="checkbox" id="m-agree" defaultChecked={true} />
                                       <label className="m-check-label" htmlFor="m-agree">I agree to the
                                          <a href="#">Terms & Conditions</a>
                                       </label>
                                    </div>
                                    <button type="button" style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => handleGoBack()}>
                                       Go Back</button>
                                 </div>

                                 <button type='submit' className="m-btn m-btn-4 w-100"> <span></span> {loading ? 'Loading...' : 'Submit'}</button>
                              </form>
                           </div>
                        </>}
                        {showPhoneSignUp && <>
                           <div className="sign__form ">
                              <form onSubmit={handleSignUpSubmit}>
                                 <div className="sign__input-wrapper mb-25">
                                    <div className="sign__input">
                                       <input type="number"
                                          maxLength={10}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                             setPhoneNumber(event.target.value)
                                          }
                                          placeholder="Enter phone number"
                                          name="Phone"
                                          id="Phone"
                                          required />
                                       <i className="fal fa-phone"></i>
                                    </div>
                                 </div>
                                 {showContinue && <>
                                    <button type="button mb-15" style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => handleGoBack()}>
                                       Go Back</button>
                                    <button onClick={() => handleContinue(phoneNumber)} type="button" className=" m-btn m-btn-4 w-100">
                                    {loading ? 'Loading...' : 'Continue'}
                                 </button>
                                 </>}
                              </form>
                           </div>
                        </>}
                        <div id='recaptcha-container'></div>
                        {showOTP && <>
                           <form onSubmit={verifyOTP} >
                              <div className="sign__input-wrapper mb-10">
                                 <h5>Verification Code</h5>
                                 <div className="sign__input">
                                    <input type="text"
                                       maxLength={6}
                                       value={OTP}
                                       onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                          setOTP(event.target.value)
                                       }
                                       placeholder="Enter the verification code"
                                       required />
                                    <i className="fal fa-phone"></i>
                                 </div>
                                 <button type="button" style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => handleGoBack()}>
                                    Go Back</button>
                              </div>
                              <button type='submit' className="m-btn m-btn-4 w-100">{loading ? 'Loading...' : 'Submit'}</button>

                           </form></>}
                        {showOptions && <>
                           <div className="sign__header">
                              <div onClick={handleEmailSignUp} className="sign__in text-center">
                                 <p> <span></span> </p>
                                 <a className="sign__social text-start"><i className="fa fa-envelope"></i>Sign Up with Email</a>
                              </div>
                           </div>
                           <div className="sign__header">
                              <div onClick={handlePhoneSignUp} className="sign__in text-center">
                                 <p> <span></span> </p>
                                 <a className="sign__social text-start"><i className="fa fa-phone"></i>Sign Up with Phone Number</a>
                              </div>
                           </div>
                           <div className="sign__header">
                              <div onClick={signInWithGoogle} className="sign__in text-center">
                                 <p> <span></span> </p>
                                 <a className="sign__social g-plus text-start"><i className="fab fa-google-plus-g"></i>Sign Up with Google</a>
                              </div>
                           </div>

                           <div className="sign__header d-flex justify-content-between mt-15">
                              <div className="sign__agree d-flex align-items-center">
                                 <input required className="m-check-input" type="checkbox" id="m-agree" defaultChecked={true} />
                                 <label className="m-check-label" htmlFor="m-agree">I agree to the
                                    <a href="#">Terms & Conditions</a>
                                 </label>
                              </div>

                           </div>
                           <div className="sign__new text-center mt-20">
                              <p>Already in Gravitii ? <Link href="login"><a > Sign In</a></Link></p>
                           </div>
                        </>}

                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default SignUp;