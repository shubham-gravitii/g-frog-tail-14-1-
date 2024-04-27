// @ts-nocheck
import Link from 'next/link';
import React, { useState } from 'react';
import {
   signInAuthUserWithEmailAndPassword,
   signInWithGooglePopup,
   createUserDocumentFromAuth,
   getUserByPhone,
   auth,
   checkUserExistsByPhone,
   createAuthUserWithEmailAndPassword,
   checkUserExistsByEmail,
   createUserDocumentFromPhoneAuth
} from "../../firebase/firebase";

import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/UserContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Button, Input } from 'reactstrap';
import { toast } from 'react-toastify';
import { Label } from "reactstrap"
import Select from "react-select"
import { faL } from '@fortawesome/free-solid-svg-icons';

const LoginArea1 = () => {
   // const {handleGoogleSignIn,loginUser,passwordResetEmail} = useAuth();
   // const [email,setEmail] = useState('')

   // const { register, handleSubmit,reset } = useForm();
   // const onSubmit = data => {
   //    loginUser(data.email,data.password,reset)
   // }

   const [emailOrPhone, setEmailOrPhone] = useState<string>("");
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [phoneNumber, setPhoneNumber] = useState<string>("");
   const [verificationCode, setVerificationCode] = useState<string>("");
   const [username, setUsername] = useState<string>("");
   const [OTP, setOTP] = useState<string>("");
   const [confirmPassword, setConfirmPassword] = useState<string>("");
   const [show, setShow] = useState(false);
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   // const [showOTP, setShowOTP] = useState(false);
   const [showLogInOTP, setShowLogInOTP] = useState(false);
   const [showSignUpOTP, setShowSignUpOTP] = useState(false);
   const [showGoBack, setShowGoBack] = useState(false);
   const [showPhoneSignUp, setShowPhoneSignUp] = useState(false);
   const [showEmailSignUp, setShowEmailSignUp] = useState(false);
   const [showSignUpOptions, setShowSignUpOptions] = useState(false);
   const [showContinue, setShowContinue] = useState(true);
   const [showSelectedRole, setShowSelectedRole] = useState(true);
   const [showLogin, setShowLogin] = useState(true);
   const [selectedRole, setSelectedRole] = useState("")
   const [selectedRoleButton, setSelectedRoleButton] = useState(true)

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   const router = useRouter();
   // const { forgotPassword, updateUser } = useAuth()

   const { logIn } = useAuth()

   const notifySuccess = (message: string) => toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
   });
   const notifyError = (message: string) => toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
   });


   // handleForgotPassword
   const handleForgotPassword = () => {
      console.log(emailOrPhone)
      if (!emailOrPhone) {
         notifyError("please enter in the field");
      }
      if (emailOrPhone) {
         try {
            forgotPassword(emailOrPhone).then(() => {
               setEmailOrPhone("")
               notifySuccess("email has been sent your email");
            });
         } catch (error: any) {
            if (error.code === "auth/user-not-found") {
               notifyError("email doesn't exists");
            }
            console.log(error)
         }
      }
   };

   const resetFormFields = () => {
      setEmailOrPhone("");
      setPassword("");
      setConfirmPassword("")
      setPhoneNumber("")
   };

   const handleSignUpSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      if (password !== confirmPassword) {
         notifyError("Passwords do not match");
         return;
      }

      try {
         const userExists = await checkUserExistsByEmail(email);

         if (userExists) {
            notifyError("Cannot create user, email already in use");
            return;
         }

         const user = await createAuthUserWithEmailAndPassword(
            email,
            password
         );
         console.log(user);
         await createUserDocumentFromAuth(user, {
            selectedRole
         });




         console.log("User Created")
         resetFormFields();
         router.push('/');
         notifySuccess("SignUp Successfull")

      } catch (error: any) {
         if (error.code === 'auth/email-already-in-use') {
            notifyError("Cannot create user, email already in use");
         } else {
            notifyError("user creation encountered an error");
            console.log('User creation encountered an error', error);
         }
      } finally {
         setLoading(false);
      }
   };

   const handleLogInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);


      try {
         await signInAuthUserWithEmailAndPassword(emailOrPhone, password);
         console.log("login complete");
         resetFormFields();
         router.push('/');
         notifySuccess("Login Successfull");
      } catch (error: any) {
         if (error.code === "auth/email-already-in-use") {
            notifyError("Cannot create user, email already in use");
         } else if (error.code === "auth/user-not-found") {
            notifyError("Wrong email or password");
         } else if (error.code === "auth/wrong-password") {
            notifyError("Wrong email or password");
         } else {
            notifyError("user creation encountered an error");
            console.log("user creation encountered an error", error);
         }
      } finally {
         setLoading(false);
      }

   };

   const signInWithGoogle = async () => {
      try {

         const user = await signInWithGooglePopup();
         console.log("SignUp complete");
         logIn(user);

         router.push('/');
         notifySuccess("SignUp Successfull")

      } catch (error) {
         if (error.code === "auth/email-already-in-use") {
            notifyError("Cannot create user, email already in use");
         } else {
            notifyError("user creation encountered an error");
            console.log("user creation encountered an error", error);
         }
      }

   };


   const generateRecaptcha = () => {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
         'size': 'visible',
         'hl': 'en',
         'callback': (response) => {
         }
      }, auth);
   }

   // const requestOTP = async (e: React.FormEvent<HTMLFormElement>) => {
   //    e.preventDefault();

   //    try {
   //       await checkPhoneNumberAndEmailMatch(phoneNumber, email)
   //       .then((match) => {
   //         if (match) {
   //           alert('Phone number and email match in the same document');
   //         } else {
   //           alert('Phone number and email do not match in the same document');
   //           return;
   //         }
   //       })
   //       .catch((error) => {
   //         console.error('Error checking phone number and email match:', error);
   //       });
   //       generateRecaptcha();
   //       let appVerifier = window.recaptchaVerifier;
   //       const ph = "+91" + phoneNumber;
   //       console.log(ph)
   //       signInWithPhoneNumber(auth, ph, appVerifier)
   //          .then((confirmationResult) => {
   //             window.confirmationResult = confirmationResult;
   //          })
   //          .catch((error) => {
   //             console.log("Phone auth " + error)
   //          });
   //    } catch (error) {
   //       console.log('User creation encountered an error during OTP request', error);
   //    }
   // }
   // const requestOTP = async (e: React.FormEvent<HTMLFormElement>) => {
   //    try {
   //       // await checkPhoneNumberAndEmailMatch(phoneNumber, email)
   //       //    .then((match) => {
   //       //       if (match) {
   //       //          generateRecaptcha();
   //       //          let appVerifier = window.recaptchaVerifier;
   //       //          const ph = "+91" + phoneNumber;
   //       //          console.log(ph);
   //       //          signInWithPhoneNumber(auth, ph, appVerifier)
   //       //             .then((confirmationResult) => {
   //       //                window.confirmationResult = confirmationResult;
   //       //                notifySuccess("OPT sent to your phone number");
   //       //             })
   //       //             .catch((error) => {
   //       //                notifyError("Error while sending OTP");
   //       //                console.log("Phone auth " + error);
   //       //             });
   //       //       }
   //       //       if (!match) {
   //       //          notifyError("Phone number or email doesn't exist");
   //       //          return;
   //       //       }
   //       //    })
   //       //    .catch((error) => {
   //       //       console.error('Error checking phone number and email match:', error);
   //       //    });
   //    } catch (error) {
   //       notifyError("user creation encountered an error during OTP request");
   //       console.log('User creation encountered an error during OTP request', error);
   //    }

   // };

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
               notifySuccess("OTP sent to your phone number");
            })
            .catch((error) => {
               notifyError("Error while sending OTP");
               console.log("Phone auth error: ", error);
            });
      } catch (error) {
         console.log("Request OTP error: ", error);
      }
   };

   // const verifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
   //    e.preventDefault();
   //    console.log(OTP)
   //    let confirmationResult  = window.confirmationResult
   //    confirmationResult.confirm(OTP).then(async (result) => {
   //       const user = result.user;
   //       console.log(user);
   //       await createUserDocumentFromAuth(user);
   //       console.log("User Created")
   //       router.push('/');
   //     }).catch((error) => {
   //       console.log("Phone auth " + error)
   //     });
   // }
   const verifyLogInOTP = async (e: React.FormEvent<HTMLFormElement>) => {
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
         notifySuccess("Login Successfull");
      } catch (error) {
         notifyError("Phone Login encountered error");
         console.log('Phone auth error:', error);
      } finally {
         setLoading(false);
      }
   };

   const verifySignUpOTP = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      console.log(OTP);
      const confirmationResult = window.confirmationResult;

      try {
         const cUser = await getUserByPhone(phoneNumber)
         if (cUser) {
            notifyError("Phone already exists");
            return;
         }
         const user = await confirmationResult.confirm(OTP);
         console.log(user);
         console.log(phoneNumber);
         console.log(selectedRole)
         await createUserDocumentFromPhoneAuth(user, {
            selectedRole
         });
         // console.log(nuser);
         // updateUser(nuser.userId);
         console.log('User Created');
         router.push('/');
         notifySuccess("Login Successfull");
      } catch (error) {
         notifyError("Phone Login encountered error");
         console.log('Phone auth error:', error);
      } finally {
         setLoading(false);
      }
   };

   const checkEmailOrPhoneNumber = (text: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
      const phoneRegex = /^\d+$/; // Regular expression for phone number validation (only digits)

      if (emailRegex.test(text)) {
         return 'email';
      } else if (phoneRegex.test(text)) {
         return 'phone';
      } else {
         return 'unknown';
      }
   }

   const handleContinue = async (value: string) => {
      try {
         if (value === "") {
            notifyError("Please enter valid email or phone number")
            return;
         }
         const result = checkEmailOrPhoneNumber(value);
         setShowGoBack(true)
         setShowSignUpOptions(false)
         setShowSelectedRole(false)
         setSelectedRoleButton(false)
         if (result === 'email') {
            const userExits = await checkUserExistsByEmail(value);
            if (userExits) {
               setShowPassword(true);
               setShowContinue(false)
               setPassword(value);
            } else {
               notifyError("User doesn't exits")
               setSelectedRoleButton(true)
               setShowSelectedRole(true)
            }
         } else if (result === 'phone') {
            notifyError(value)
            const userExits = await checkUserExistsByPhone(value);
            if (userExits) {
               console.log(value)
               requestOTP(value);
               setPhoneNumber(value)
               setShowLogInOTP(true)
               setShowContinue(false)
            } else {
               notifyError("User doesn't exits")
               setSelectedRoleButton(true)
               setShowSelectedRole(true)
            }
         } else {
            notifyError("Invalid Value")
            setShowSignUpOptions(true)
         }
      } catch (error) {

      }
   }
   // const handleGoBack = () => {
   //    resetFormFields();
   //    setShowPassword(false)
   //    setShowOTP(false)
   //    setShowContinue(true)
   // }
   const handleEmailSignUp = () => {
      setShowEmailSignUp(true)
      setShowPhoneSignUp(false)
      setShowSignUpOptions(false)
      setShowLogin(false)

   }
   const handlePhoneSignUp = () => {
      setShowPhoneSignUp(true)
      setShowContinue(true)
      setShowEmailSignUp(false)
      setShowSignUpOptions(false)
      setShowLogin(false)

   }
   const handleGoBack = () => {
      resetFormFields();
      setShowPassword(false)
      setShowContinue(true)
      setShowSignUpOptions(false)
      setShowLogin(true)
      setShowEmailSignUp(false);
      setShowPhoneSignUp(false);
      setShowSignUpOTP(false)
      setShowLogInOTP(false)
      setShowSelectedRole(true);
      setSelectedRoleButton(true)
   }
   const handlePhoneContinue = async (value: string) => {
      setShowGoBack(true)
      const userExits = await checkUserExistsByPhone(value);

      console.log(value)

      console.log(userExits)
      if (!userExits) {
         requestOTP(value);
         setPhoneNumber(value)
         console.log(phoneNumber)
         setShowSignUpOTP(true)
         setShowContinue(false)
      } else {
         if (value === "") {
            notifyError("Please enter valid number without gap")

         } else {
            notifyError("User already exits")
         }

      }
      // resetFormFields();
   }
   const handleContinueAsGuest = () => {
      router.push("/ViewListing")
   }
   const handleSelectedRoleButton = () => {
      if (selectedRole === '') {
         notifyError('Select role');
      } else {
         setShowSelectedRole(false)
         setSelectedRoleButton(false)
         setShowSignUpOptions(true)
         setShowLogin(false)
      }
   }
   const roleOptions = [
      'Owner',
      'Customer',
   ];
   const handleRoleChange = (event: string) => {
      setSelectedRole(event.target.value);
      console.log(selectedRole)
   };
   const handleSelectedRoleButtonBack = () => {
      setShowLogin(true)
      setShowSignUpOptions(false)
      setShowSelectedRole(true)
      setSelectedRoleButton(true)
   }
   return (
      <>
         <section className="white-bg signup__area pt-100 pb-145">

            <div className="container">
               <div className="row">
                  <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                     <div className="sign__wrapper white-bg">

                        <div className="sign__form ">
                           {showLogin && <>
                              <form onSubmit={handleLogInSubmit}>
                                 <div className="sign__input-wrapper mb-25">
                                    <h5>What&apos;s your phone number or email?</h5>
                                    <div className="sign__input">
                                       <input type="text"
                                          maxLength={30}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                             setEmailOrPhone(event.target.value)
                                          }
                                          placeholder="Enter phone number or email"
                                          name="emailOrPhone"
                                          id="emailOrPhone"
                                          required />
                                       <i className="fal fa-user"></i>
                                    </div>
                                 </div>
                                 {showContinue && <button onClick={() => handleContinue(emailOrPhone)} type="button" className=" m-btn m-btn-4 w-100">
                                    {loading ? 'Loading...' : 'Continue'}
                                 </button>}


                                 {showPassword && <>
                                    <div className="sign__input-wrapper mb-10">
                                       <h5>Password</h5>
                                       <div className="sign__input">
                                          <input type="password"
                                             maxLength={50}
                                             onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                setPassword(event.target.value)
                                             }
                                             placeholder="password"
                                             name="password"
                                             id="password"
                                             required />
                                          <i className="fal fa-lock"></i>
                                       </div>
                                    </div>
                                    <div className="sign__action d-sm-flex justify-content-between mb-30">
                                       {/* <div className="sign__agree d-flex align-items-center">
                                    <input required className="m-check-input" type="checkbox" id="m-agree" />
                                    <label className="m-check-label" htmlFor="m-agree">Keep me signed in
                                    </label>
                                 </div> */}
                                       <div className="sign__forgot">
                                          <button type="button" style={{ cursor: 'pointer', background: 'transparent' }} onClick={handleForgotPassword}>
                                             Forgot your password?</button>

                                       </div>
                                       <button type="button" style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => handleGoBack()}>
                                          Go Back</button>
                                    </div>

                                    <button type='submit' className="m-btn m-btn-4 w-100">{loading ? 'Loading...' : 'LogIn'}</button>

                                 </>
                                 }

                              </form>

                           </>}

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

                                       <button type="button" style={{ cursor: 'pointer', background: 'transparent' }} onClick={() => handleGoBack()}>
                                          Go Back</button>
                                    </div>

                                    <button type='submit' className="m-btn m-btn-4 w-100"> <span></span> {loading ? 'Loading...' : 'SignUp'}</button>
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
                                       <button onClick={() => handlePhoneContinue(phoneNumber)} type="button" className=" m-btn m-btn-4 w-100">
                                          {loading ? 'Loading...' : 'Continue'}
                                       </button>
                                    </>}
                                 </form>
                              </div>
                           </>}
                           <div id='recaptcha-container'></div>
                           {showLogInOTP && <>
                              <form onSubmit={verifyLogInOTP} >
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
                                 <button type='submit' className="m-btn m-btn-4 w-100">{loading ? 'Loading...' : 'LogIn'}</button>

                              </form></>}
                           {showSignUpOTP && <>
                              <form onSubmit={verifySignUpOTP} >
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
                                 <button type='submit' className="m-btn m-btn-4 w-100">{loading ? 'Loading...' : 'SignUp'}</button>

                              </form></>}


                           {showSelectedRole && <>
                              <div className="d-flex align-items-center mt-3">
                                 <hr className="flex-grow-1 m-0"></hr>
                                 <span className="px-2">or</span>
                                 <hr className="flex-grow-1 m-0"></hr>
                              </div>
                              <div className="sign__new text-center m-3">
                                 <p>New to Gravitii?</p>
                                 {/* <p>New to Gravitii? <Link href="/sign-up"><a >Sign Up</a></Link></p> */}
                              </div>

                              <div>
                                 <select
                                    className="form-select"
                                    id="roleSelect"
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    required
                                 >
                                    <option value="">Select your role</option>
                                    {roleOptions.map((role, index) => (
                                       <option key={index} value={role}>
                                          {role}
                                       </option>
                                    ))}
                                 </select>

                              </div>
                              {selectedRoleButton && <button onClick={() => handleSelectedRoleButton()} type="button" className="mt-4 m-btn m-btn-4 w-100">
                                 {loading ? 'Loading...' : 'Continue'}
                              </button>}

                           </>}
                           {showSignUpOptions && <>
                              <div className="sign__header">
                                 <label>Role Selected: </label>
                                 <Input
                                    type="text"
                                    defaultValue={selectedRole}
                                    name="selectedRole"
                                    id="selectedRole"
                                    maxLength={50}
                                    readOnly={true}
                                 />
                              </div>
                              <div className="sign__header">
                                 <div onClick={handleEmailSignUp} className="sign__in text-center">
                                    <p> <span></span> </p>
                                    <a className="sign__social text-start"><i className="fa fa-envelope"></i>Continue with Email</a>
                                 </div>
                              </div>
                              <div className="sign__header">
                                 <div onClick={handlePhoneSignUp} className="sign__in text-center">
                                    <p> <span></span> </p>
                                    <a className="sign__social text-start"><i className="fa fa-phone"></i>Continue with Phone Number</a>
                                 </div>
                              </div>

                              <div className="sign__header">
                                 <div onClick={signInWithGoogle} className="sign__in text-center">
                                    <p> <span></span> </p>

                                    <a className="sign__social g-plus text-start"><i className="fab fa-google-plus-g"></i>Continue with Google</a>
                                 </div>

                              </div>
                              {/* <div className="sign__header">
                                 <div className="sign__in text-center">
                                    <button style={{"background-color": "#dd4b39"}} onClick={signInWithGoogle} className="btn btn-lg btn-block btn-primary"
                                    ><i className="fab fa-google me-2"></i> Sign in with google</button>
                                 </div>

                              </div> */}
                              <div className="sign__header">
                                 <button type="button" style={{ cursor: 'pointer', background: 'transparent' }} className='mt-2' onClick={handleSelectedRoleButtonBack}>
                                    Go Back</button>

                              </div>


                           </>}

                           <div className="sign__header d-flex justify-content-between mt-15">
                              <div className="sign__agree d-flex align-items-center">

                                 <input required className="m-check-input" type="checkbox" id="m-agree" defaultChecked={true} />
                                 <label className="m-check-label" htmlFor="m-agree">I agree to the
                                    <a href="#">Terms & Conditions</a>
                                 </label>
                              </div>

                           </div>
                           <div className="d-flex align-items-center mt-3">
                              <hr className="flex-grow-1 m-0"></hr>
                              <span className="px-2">or</span>
                              <hr className="flex-grow-1 m-0"></hr>
                           </div>
                           <div className="sign__header m-4 d-flex justify-content-between">

                              <button type="button" className="btn btn-primary m-btn-4 m-1 w-100" onClick={handleContinueAsGuest}>Continue as guest</button>
                           </div>

                           {/* <Modal show={show} onHide={handleClose}>
                              <Modal.Header closeButton>
                                 <Modal.Title> Sign In with Phone Number</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>

                                 <form onSubmit={requestOTP}>
                                    <div className="sign__input-wrapper mb-25">
                                       <h5>Email</h5>
                                       <div className="sign__input">
                                          <input type="email"
                                             maxLength={30}
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
                                       <h5>Phone Number</h5>
                                       <div className="sign__input">
                                          <input type="text"
                                             maxLength={10}
                                             onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                setPhoneNumber(event.target.value)
                                             }
                                             placeholder="Enter your phone number"
                                             value={phoneNumber}
                                             id="phoneNumber"
                                             required />

                                          <i className="fal fa-phone"></i>
                                       </div>
                                       <Button className="mt-2" type="submit" variant="secondary">
                                          Send Verification Code
                                       </Button>
                                    </div>
                                 </form>

                                 <form onSubmit={verifyOTP}>
                                    <div className="sign__input-wrapper mb-25">
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
                                       <Button className="mt-2" type="submit" variant="primary">
                                          {loading ? 'Loading...' : 'Verify'}
                                       </Button>
                                    </div>
                                 </form>
                                 <div id='recaptcha-container'></div>
                              </Modal.Body>
                              <Modal.Footer>
                                 <Button variant="secondary" onClick={handleClose}>
                                    Close
                                 </Button>
                              </Modal.Footer>
                           </Modal> */}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default LoginArea1;
