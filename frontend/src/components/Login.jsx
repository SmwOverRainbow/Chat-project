import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Col, Row, Card, Image, Form, FloatingLabel, Button,
} from 'react-bootstrap';
import { AuthContext } from '../authContext.js';
import image from '../images/logoChat.jpeg';

const Login = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    username: yup.mixed().required(t('loginPage.errors.required')),
    password: yup.mixed().required(t('loginPage.errors.required')),
  });
  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);

  const [authErr, setAuthErr] = useState(null);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      username: '',
      password: null,
    },
    onSubmit: async (values, actions) => {
      try {
        const responce = await axios.post('/api/v1/login', values);
        const { token } = responce.data;
        logIn(token);
        navigate('/', { replace: false })
      } catch (e) {
        if (e.code === 'ERR_NETWORK') {
          alert('Server disconnect');
        }
        setAuthErr(t('loginPage.errors.notExist'));
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
                    <h1 className="text-center mb-4">{t('loginPage.logIn')}</h1>
                    <FloatingLabel
                      controlId="username"
                      label={t('loginPage.username')}
                      className="mb-3"
                    >
                      <Form.Control
                        autoFocus={true}
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        isInvalid={(formik.touched.username && formik.errors.username) || authErr}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.username}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="password"
                      label={t('loginPage.password')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        isInvalid={(formik.touched.password && formik.errors.password) || authErr}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.password || authErr}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                      {t('loginPage.logIn')}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('loginPage.noAcc')}</span>
                <a href="/signup">{t('loginPage.toSignup')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;