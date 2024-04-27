"use client"
import React from 'react';
import { Amplify } from 'aws-amplify';
import { useState } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { CheckboxField, SelectField } from '@aws-amplify/ui-react';
import * as Constants from "../../utils/constants";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import awsExports from '../../aws-exports'
Amplify.configure(awsExports)


export default function LoginArea_N() {
  const [userRole, setUserRole] = useState('');

  

  const notifyInfo = (message: string) =>
    toast.info(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const components = {


    SignUp: {
      FormFields() {
        const { validationErrors } = useAuthenticator();

        return (
          <>

              <Authenticator.SignUp.FormFields />

              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="role-info-tooltip">
                    <div>Owner - I want to rent a warehouse</div>
                    <div>Customer - I am looking to rent a warehouse</div>
                  </Tooltip>
                }
              >


                <SelectField
                  label="Role"
                  name="custom:Role"
                  isRequired
                  onChange={(e) => {
                    e.preventDefault()
                    formFields.signUp['custom:Role'].value = e.target.value
                    console.log(formFields.signUp['custom:Role'].value)
                    // setUserRole(e.target.value);
                  }}
                >
                  <option value="Customer">Customer</option>
                  <option value="Owner">Owner</option>
                </SelectField>
              </OverlayTrigger>
              <CheckboxField
                errorMessage={validationErrors.acknowledgement as string}
                hasError={!!validationErrors.acknowledgement}
                name="acknowledgement"
                value="yes"
                label={<span>I agree with the <a href="/terms-and-conditions" target="_blank">Terms and Conditions</a></span>}
                required
              />


          </>
        );
      },

    },
  }

  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    signUp: {
      
      'custom:Role': {
        placeholder: 'Owner or Customer',
        value: userRole,
        hidden: true,
      },
    },
    forceNewPassword: {
      password: {
        placeholder: 'Enter your Password:',
      },
    },
    forgotPassword: {
      username: {
        placeholder: 'Enter your email:',
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        placeholder: 'Enter your Confirmation Code:',
        label: 'New Label',
        isRequired: false,
      },
      confirm_password: {
        placeholder: 'Enter your Password Please:',
      },
    },
    setupTotp: {
      QR: {
        totpIssuer: 'test issuer',
        totpUsername: 'amplify_qr_test_user',
      },
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },
    confirmSignIn: {
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },

  };

  return (
    <section className=" mt-100 mb-145">

      <div className="container">
        <div className="row">

          <div className="">
            <Authenticator formFields={formFields} components={components} socialProviders={[]} services={{
              async validateCustomSignUp(formData) {
                if (!formData.acknowledgement) {
                  return {
                    acknowledgement: 'You must agree to the Terms and Conditions',
                  };
                }

              },
            }} >
              {() => {
               window.location.href = '/create-profile';
               return null;
              }}
            </Authenticator>
          </div>

        </div>
      </div>
    </section>


  );
}