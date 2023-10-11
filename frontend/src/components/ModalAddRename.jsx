// import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalAddRename = (props) => {
  const channelsNames = useSelector((state) => {
    return state.channels.ids.map((id) => state.channels.entities[id].name);
  });

  const { show, closeFn, title, actionSubmit, nameChannel } = props;
  const { t } = useTranslation();
  // console.log('nameChannel', nameChannel);
  const schema = yup.object({
    name: yup.string().required(t('modalAddRename.errors.notEmpty'))
            .min(3, t('modalAddRename.errors.minLength'))
            .max(20, t('modalAddRename.errors.maxLength'))
            .notOneOf(channelsNames, t('modalAddRename.errors.unique')),
  });

  const handleClose = () => closeFn();
  const formik = useFormik({
    initialValues: {
      name: nameChannel,
    },
    validationSchema: schema,
    onSubmit: (values, actions) => {
      // console.log('values formik', values);
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
              <Form.Label hidden>{t('modalAddRename.label')}</Form.Label>
              <Form.Control
                autoFocus={true}
                id="nameChannel"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
                className={`w-100 ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
              />
              <Form.Control.Feedback className="invalid-feedback">{formik.errors.name && formik.touched.name ? formik.errors.name : null}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('modalAddRename.btnCancel')}
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            {t('modalAddRename.btnSubmit')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAddRename;
