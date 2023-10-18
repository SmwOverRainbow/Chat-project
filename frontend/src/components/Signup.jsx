import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Container, Col, Row, Card, Image, Form, Button, FloatingLabel,
} from 'react-bootstrap';
import { AuthContext } from '../authContext.js';
import { notifyError } from '../utils/toasts.js';
import { isProfanity } from '../utils/helpers.js';
import image from '../images/logoChat.jpeg';

const Signup = () => {
  const { logIn } = useContext(AuthContext);
  const { t } = useTranslation();
  const schema = yup.object().shape({
    username: yup.string()
                .required(t('signupPage.errors.required'))
                .min(3, t('signupPage.errors.minLengthName'))
                .max(20, t('signupPage.errors.maxLengthName'))
                .test({
                  name: 'isProfanity',
                  skipAbsent: true,
                  test(value, ctx) {
                    return isProfanity(value) ? ctx.createError({ message: t('signupPage.errors.obsceneLexicon') }) : true;
                  }
                }),
    password: yup.string()
                .required(t('signupPage.errors.required'))
                .min(6, t('signupPage.errors.minLengthPassword')),
    repeatPassword: yup.string()
                      .required(t('signupPage.errors.required'))
                      .min(6, t('signupPage.errors.minLengthPassword'))
                      .oneOf([yup.ref('password'), null], t('signupPage.errors.mustMatch')),
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
        const { token, username: responseUsername } = response.data;
        logIn(token, responseUsername);
        navigate('/', { replace: false })
      } catch (e) {
        if (e.response && e.response.status === 409) {
          setServerErrMessage(t('signupPage.errors.alreadyExists'));
        }
        if (e.code === 'ERR_NETWORK') {
          notifyError(t('signupPage.errors.errNetwork'));
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
                    <h1 class="text-center mb-4">{t('signupPage.signup')}</h1>
                    <FloatingLabel
                      controlId="username"
                      label={t('signupPage.usernameLabel')}
                      className="mb-3"
                    >
                      <Form.Control
                        autoFocus={true}
                        name="username"
                        type="text"
                        placeholder="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        isInvalid={(formik.touched.username && formik.errors.username) || serverErrMessage}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.username}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="password"
                      label={t('signupPage.passwordLabel')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        isInvalid={(formik.touched.password && formik.errors.password) || serverErrMessage}
                      />
                      <Form.Control.Feedback type="invalid" tooltip>{formik.errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="repeatPassword"
                      label={t('signupPage.repeatPassword')}
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
                      {t('signupPage.btnSignup')}
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