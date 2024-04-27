// @ts-nocheck
import { useState } from "react";
import { createUserDocumentFromAuth, createAuthUserWithEmailAndPassword } from "../../firebase/firebase";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody } from "reactstrap";

import { useRouter } from 'next/router';


const SignUpForm = (props: Props) => {
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const router = useRouter();

    const resetFormFields = () => {
        setDisplayName("")
        setEmail("");
        setPassword("");
        setConfirmPassword("")
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const user = await createAuthUserWithEmailAndPassword(
                email,
                password
            );

            await createUserDocumentFromAuth(user, {
                displayName,
            });
            console.log("User Created")
            resetFormFields();
            router.push('/');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Cannot create user, email already in use');
            } else {
                console.log('User creation encountered an error', error);
            }
        }
    };
    return (
        <>
            <Container fluid={true} className="header__area black-bg">
                <form onSubmit={handleSubmit}>
                    <Row className="justify-content-center align-self-center">
                        <Col lg="4">
                            <Card>
                                <CardBody>
                                    <h4 className="card-title">Sign Up</h4>
                                    <p className="card-title-desc"></p>
                                    <FormGroup className="mb-4">
                                        <div className="mt-3">
                                            <Input
                                                type="text"
                                                maxLength={30}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    setDisplayName(event.target.value)
                                                }
                                                placeholder="name"
                                                name="name"
                                                id="name"
                                                required
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <Input
                                                type="email"
                                                maxLength={50}
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
                                        <div className="mt-3">
                                            <Input
                                                type="password"
                                                maxLength={50}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    setConfirmPassword(event.target.value)
                                                }
                                                placeholder="confirm password"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                required
                                            />
                                        </div>

                                    </FormGroup>
                                </CardBody>
                                <div className="mt-3">
                                    <Button type="submit" className="m-btn m-btn-4 w-100">
                                        <span>Sign In</span>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </form>
            </Container></>
    )
}
export default SignUpForm;