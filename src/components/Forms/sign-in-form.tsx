"use client"
// @ts-nocheck
import { useState } from "react";
import { signInAuthUserWithEmailAndPassword, signInWithGooglePopup, createUserDocumentFromAuth } from "../../firebase/firebase";
import { Alert, Button, Card, CardBody, Col, Container, Spinner, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";

const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const resetFormFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInAuthUserWithEmailAndPassword(email, password);
      console.log("login complete");
      resetFormFields();
      router.push('/');
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else if (error.code === "auth/user-not-found") {
        alert("Wrong email or password");
      } else if (error.code === "auth/wrong-password") {
        alert("Wrong email or password");
      } else {
        console.log("user creation encountered an error", error);
      }
    }

  };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithGooglePopup();
      console.log("login complete");
      router.push('/');
      await createUserDocumentFromAuth(user);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else if (error.code === "auth/user-not-found") {
        alert("Wrong email or password");
      } else {
        console.log("user creation encountered an error", error);
      }
    }

  };

  return (

    <Container fluid={true} className="header__area black-bg">
      <form onSubmit={handleSubmit}>
        <Row className="justify-content-center align-self-center">
          <Col lg="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Sign In</h4>
                <p className="card-title-desc"></p>
                <FormGroup className="mb-4">
                  <div className="mt-3">
                    <Input
                      type="email"
                      maxLength={30}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(event.target.value)
                      }
                      placeholder="email"
                      name="email"
                      id="email"
                      required
                    />
                  </div>
                  <div className="mt-3">
                    <Input
                      type="password"
                      maxLength={50}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(event.target.value)
                      }
                      placeholder="password"
                      name="password"
                      id="password"
                      required
                    />
                  </div>
                </FormGroup>
              </CardBody>
              <div className="mt-3 d-grid gap-2 col-12 mx-auto">
                <Button type="button" class="btn btn-outline-danger w-100" onClick={signInWithGoogle}>
                  Google
                </Button>
                <button type="submit" className="m-btn m-btn-4 w-100">
                  <span>Sign In</span>
                </button>
              </div>
            </Card>
          </Col>
        </Row>
      </form>
    </Container>

  );
};

export default SignInForm;