import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
// import Container from 'react-bootstrap/Container';
import { Container, Col, Row, Card, Image } from 'react-bootstrap';
// import Image from 'react-bootstrap/Image';
// import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
import image from '../images/logoChat.jpeg';

const Login = () => {
  const schema = yup.object().shape({
    username: yup.mixed().required(),
    password: yup.mixed().required(),
  });
  const navigate = useNavigate();

  const [state, setState] = useState({
    authError: null,
  });
  // const defaultCNField = 'form-control';
  const classNameField = `form-control ${state.authError ? 'is-invalid' : ''}`;

  return (
    <Container className="h-100" fluid>
      <Row className="justify-content-md-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <Row>
                <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <Image src={image} width={250} height={250} roundedCircle />
                </Col>
                <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={schema}
                    onSubmit={async (values, actions) => {
                      try {
                        const responce = await axios.post('/api/v1/login', values);
                        const { token } = responce.data;
                        localStorage.setItem('token', token);
                        navigate('/', { replace: false })
                      } catch (e) {
                        setState({ ...state, authError: true });
                      }
                      actions.setSubmitting(false);
                    }}
                    >
                    {() => (
                    <Form className="col-12 col-md-12 mt-3 mt-mb-0">
                      <h1 class="text-center mb-4">Войти</h1>
                      <div className="form-floating mb-3">
                        <label htmlFor="username" className="col-sm-2 col-form-label"/ >
                        <Field name="username" className={classNameField} placeholder="Ваш ник" required />
                      </div>
                      <div className="form-floating mb-3">
                        <label htmlFor="password" className="col-sm-2 col-form-label" />
                        <Field type="password" name="password" className={classNameField} placeholder="Пароль" required />
                        {state.authError && (<div className="invalid-tooltip">Неверные имя пользователя или пароль</div>)}
                      </div>
                      <button type="submit" className="w-100 mb-3 btn btn-outline-primary">{'Войти'}</button>
                    </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?  </span>
                <a href="/">Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;