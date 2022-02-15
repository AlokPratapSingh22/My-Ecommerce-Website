import React, { useState } from 'react';
import { Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBox() {

    const [keyword, setKeyword] = useState('')

    let navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`)
        }
        else {
            navigate(0)
        }
    }

    return (
        <Form onSubmit={submitHandler} className='search'>
            <Row>
                <Col md={10} className='p-0'>
                    <Form.Control
                        type='text'
                        name='q'
                        onChange={e => setKeyword(e.target.value)}
                        className='my-auto w-100'
                    />
                </Col>
                <Col md={2}>
                    <Button
                        type='submit'
                        className='bg-transparent px-0 m-0'
                    >
                        🔍
                    </Button>
                </Col>
            </Row>
        </Form>

    );
}

export default SearchBox;