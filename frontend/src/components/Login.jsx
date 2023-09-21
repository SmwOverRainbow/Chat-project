import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
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
    <Container>
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand href="#">Hexlet Chat</Navbar.Brand>
          <Button className="btn btn-primary">Войти</Button>
        </Container>
      </Navbar>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values, actions) => {
          try {
            const responce = await axios.post('/api/v1/login', values);
            localStorage.setItem('token', responce.token);
            navigate('/', { replace: false })
          } catch (e) {
            setState({ ...state, authError: true });
          }
          actions.setSubmitting(false);
        }}
      >
      {({ errors, touched }) => (
        <Container className="card shadow-sm">
          <Col className="col-12 col-md-6 d-flex justify-content-center align-items-center container-fluid">
            <Image src={image} width={250} height={250} roundedCircle />
          </Col>
          <Form className="col-12 col-md-3 mt-3 mt-mb-0 container-fluid">
            <h1 class="text-center mb-4">Войти</h1>
            <div className="form-floating mb-4">
              <label htmlFor="username" className="col-sm-2 col-form-label"></label>
              <div class="col-sm-10 offset-sm-1">
                <Field name="username" className={classNameField} placeholder="Ваш ник" />
                {errors.username && touched.username ? (
                  <div>{errors.username}</div>
                ) : null}
              </div>
            </div>
            <div className="form-floating mb-4">
              <label htmlFor="password" className="col-sm-2 col-form-label"></label>
              <div class="col-sm-10 offset-sm-1">
                <Field type="password" name="password" className={classNameField} placeholder="Пароль" />
                {errors.password && touched.password ? (
                  <div>{errors.password}</div>
                ) : null}
                {state.authError && (<div className="invalid-tooltip">Неверные имя пользователя или пароль</div>)}
              </div>
            </div>
            <div className="form-floating mb-4">
              <div className="col-sm-10 offset-sm-1">
                <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
              </div>
            </div>
          </Form>
        </Container>
      )}
    </Formik>
  </Container>
    
  );
};

export default Login;