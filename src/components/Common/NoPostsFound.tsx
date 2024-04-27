import Link from 'next/link';
import React from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import { Button } from 'reactstrap';

const NoPostsFound = () => {


    return (
        <Container style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Row>
                <Col>
                    <Alert  style={{
                        backgroundColor: "white",
                        width: '500px',
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h4 className='mb-3'>No warehouses were found.</h4>
                        <p>Oops! It seems there are no matching warehouses for the filter.</p>
                        <p>Try adjusting your filter criteria and checking again.</p>
                        <Link href="/">    
                        <Button  className="w-25 bg-blue-500"> Go Back </Button>
                        </Link>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
};

export default NoPostsFound;
