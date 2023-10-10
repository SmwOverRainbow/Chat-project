// import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalAddRename = (props) => {
  const channelsNames = useSelector((state) => {
    return state.channels.ids.map((id) => state.channels.entities[id].name);
  });

  const { show, closeFn, title, actionSubmit, nameChannel } = props;
  // console.log('nameChannel', nameChannel);
  const schema = yup.object({
    name: yup.string().required('Поле не должно быть пустым')
            .min(3, 'Не менее трех символов')
            .max(20, 'Не более 20 символов').notOneOf(channelsNames, 'Должно быть уникально'),
  });

  const handleClose = () => closeFn();
  const formik = useFormik({
    initialValues: {
      name: nameChannel,
    },
    validationSchema: schema,
    onSubmit: (values, actions) => {
      console.log('values formik', values);
      actionSubmit(values.name);
      actions.resetForm();
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mt-3 mt-mb-0">
              <Form.Label hidden>nameChannel</Form.Label>
              <Form.Control
                autoFocus={true}
                id="nameChannel"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
                className={`form-control w-100 ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
              />
              <Form.Control.Feedback className="invalid-feedback">{formik.errors.name && formik.touched.name ? formik.errors.name : null}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAddRename;
