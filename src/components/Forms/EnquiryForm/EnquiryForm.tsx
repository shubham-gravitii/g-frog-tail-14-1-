// @ts-nocheck

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'reactstrap';
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import * as Constants from "../../../utils/constants"
import axios from 'axios';


const EnquiryForm = ({ onSubmit, userRole, user_id }) => {

  const [loading, setLoading] = useState(false);
  const [recieverEmail, setRecieverEmail] = useState("")
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    phone_number: ""
  });

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

  const handleFormChange = (e) => {

    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const getCustomerEmail = async (user_id) => {
    try {
      const response = await axios.get(Constants.api_gateway_host + `/wh_customer_details/?CUSTOMER_ID=${user_id}`);
      const userData = response.data.response[0];
      setRecieverEmail(userData.customer_email_id)
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const getOwnerEmail = async (post_id) => {
    try {
      const response1 = await axios.get(Constants.api_gateway_host + `/wh_basic_details/?wh_id=${post_id}`);
      const postData = response1.data.response[0];
      const owner_entity_id = postData.owner_entity_id
      const respons2 = await axios.get(Constants.api_gateway_host + `/wh_owner_details/?OWNER_ENTITY_ID=${owner_entity_id}`);
      const userData = respons2.data.response[0];
      setRecieverEmail(userData.owner_email_id)
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const sendEmail = async () => {
    try {

      const ownerResponse = await emailjs.send(
        Constants.emailjsServiceId,
        Constants.emailjsTemplateID,
        {
          from_name: form.name,
          to_name: "Toheed",
          from_email: form.email,
          from_phone_number: form.phone_number,
          to_email: recieverEmail,
          message: form.message,
        },
        Constants.emailjsPublicKey
      );

      // Sending to admin also
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

      if (ownerResponse.status === 200 && adminResponse.status === 200) {
        setLoading(false);
        notifySuccess("Message sent successfully");
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setLoading(false);
        console.error("Failed to send the message");
        notifyError("Failed to send the message");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error sending email:", error);
      notifyError("Failed to send the message");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.clear()

    if (!form.name || !form.email || !form.message) {
      notifyError('Please fill out all required fields');
      return;
    }

    if (userRole === "Customer") {
      await getCustomerEmail(user_id);
      await sendEmail();
    } else if (userRole === "Owner") {
      await getOwnerEmail(user_id); //post_id
      await sendEmail();
    }

    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          maxLength={50}
          defaultValue={form.name}
          onChange={handleFormChange}
          name="name"
          id="name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          maxLength={50}
          defaultValue={form.email}
          onChange={handleFormChange}
          name="email"
          id="email"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="number"
          maxLength={50}
          defaultValue={form.phone_number}
          onChange={handleFormChange}
          name="phone_number"
          id="phone_number"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          maxLength={100}
          defaultValue={form.message}
          onChange={handleFormChange}
          name="message"
          id="message"
        />
      </Form.Group>

      <Button color="primary" type="submit">
        {loading ? "Sending..." : "Send"}
      </Button>
    </Form>
  );
};

export default EnquiryForm;
