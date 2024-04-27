// @ts-nocheck
import React, { useState } from 'react'
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import * as Constants from "../../../utils/constants"

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(form)
    if (!form.name || !form.email || !form.message || !form.phone) {
      notifyError('Please fill out all required fields');
      return;
    }

    try {
      const adminResponse = await emailjs.send(
        Constants.emailjsServiceId,
        Constants.emailjsTemplateID,
        {
          from_name: form.name,
          to_name: "Admin",
          from_email: form.email,
          to_email: Constants.adminEmail,
          message: form.message,
        },
        Constants.emailjsPublicKey
      );
      if (adminResponse.status === 200) {
        notifySuccess("Message sent successfully");
        setForm({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        console.error("Failed to send the message");
        notifyError("Failed to send the message");
      }
    } catch (error) {
      console.log(error)
      notifyError("Failed to send the message");
    }
    setLoading(false)
  }
  return (
    <>
      <div className="contact3 py-5 m-3">
        <div className="row no-gutters">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 text-white" >
                <div className="card-shadow">
                  {/* <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/2.jpg" className="img-fluid" /> */}
                  <div className="card mt-4 border-0 mb-4" style={{ backgroundColor: "#532f91" }}>
                    <div className="col">
                      <div className="row-lg-4 row-md-4">
                        <div className="card-body d-flex align-items-center c-detail pl-0">
                          <div className="m-3 align-self-center">
                            <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon1.png" />
                          </div>
                          <div className="">
                            <h6 className="font-weight-medium">Address</h6>
                            <p className="">601 Sherwood Ave.
                              <br /> San Bernandino</p>
                          </div>
                        </div>
                      </div>
                      <div className="row-lg-4 row-md-4">
                        <div className="card-body d-flex align-items-center c-detail">
                          <div className="m-3 align-self-center">
                            <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon2.png" />
                          </div>
                          <div className="">
                            <h6 className="font-weight-medium">Phone</h6>
                            <p className="">251 546 9442
                              <br /> 630 446 8851</p>
                          </div>
                        </div>
                      </div>
                      <div className="row-lg-4 row-md-4">
                        <div className="card-body d-flex align-items-center c-detail">
                          <div className="m-3 align-self-center">
                            <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon3.png" />
                          </div>
                          <div className="">
                            <h6 className="font-weight-medium">Email</h6>
                            <p className="">
                              info@wrappixel.com
                              <br /> 123@wrappixel.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="contact-box m-3">
                  <h1 className="font-weight-light mt-2">Quick Contact</h1>
                  <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input className="form-control" type="text" name='name' placeholder="name" value={form.name} onChange={handleFormChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input className="form-control" type="email" name='email' placeholder="email address" value={form.email} onChange={handleFormChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input className="form-control" type="text" name='phone' placeholder="phone" value={form.phone} onChange={handleFormChange} required />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <textarea className="form-control" rows="3" name='message' placeholder="message" value={form.message} onChange={handleFormChange} required></textarea>
                        </div>
                      </div>
                      <div className="col-lg-12">

                        <button type="submit" className="btn btn-info link-primary  mt-3 text-white border-0 px-3 py-2" style={{ backgroundColor: "#6F42C1" }}>
                          <span>
                            {loading ? "Sending..." : "Send"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactForm
