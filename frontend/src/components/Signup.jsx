import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Container, Col, Row, Card, Image, Form, Button, FloatingLabel } from 'react-bootstrap';
import image from '../images/logoChat.jpeg';

const Signup = () => {
  const schema = yup.object().shape({
    username: yup.string().required('Обязательное поле').min(3, 'Не менее 3 символов').max(20, 'Не более 20 символов'),
    password: yup.string().required('Обязательное поле').min(6, 'Не менее 6 символов'),
    repeatPassword: yup.string().required('Обязательное поле').min(6, 'Не менее 6 символов').oneOf([yup.ref('password'), null], 'Passwords must match'),
  });
  const navigate = useNavigate();
  const [serverErrMessage, setServerErrMessage] = useState('');

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      username: '',
      password: null,
      repeatPassword: null,
    },
    onSubmit: async (values, actions) => {
      try {
        setServerErrMessage('');
        const { username, password } = values;
        const response = await axios.post('/api/v1/signup', { username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/', { replace: false })
      } catch (e) {
        console.log('error', e);
        if (e.response && e.response.status === 409) {
          setServerErrMessage('Такой пользователь уже существует');
        }
        if (e.code === 'ERR_NETWORK') {
          alert('Server disconnect');
        }
      }
      actions.setSubmitting(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

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
                  <Form className="col-12 col-md-12 mt-3 mt-mb-0" onSubmit={formik.handleSubmit} noValidate>
                    <h1 class="text-center mb-4">Регистрация</h1>
                    <FloatingLabel
                      controlId="username"
                      label="Имя пользователя"
                      className="mb-3"
                    >
                      <Form.Control
                        autoFocus={true}
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        isInvalid={(formik.touched.username && formik.errors.username) || serverErrMessage}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.username}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="password"
                      label="Пароль"
                      className="mb-3"
                    >
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        isInvalid={(formik.touched.password && formik.errors.password) || serverErrMessage}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="repeatPassword"
                      label="Подтвердите пароль"
                      className="mb-3"
                    >
                      <Form.Control
                        placeholder="repeatPassword"
                        name="repeatPassword"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.repeatPassword}
                        isInvalid={(formik.touched.repeatPassword && formik.errors.repeatPassword) || serverErrMessage}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.repeatPassword || serverErrMessage}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                      Зарегистрироваться
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;