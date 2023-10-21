import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { SocketEmitContext } from '../../socketEmitContext.js';
import { notifySuccess, notifyError } from '../../utils/toasts.js';
import { closeWindow } from '../../slices/modalSlice.js';
import { addOneChannel, setCurrentChannelId } from '../../slices/channelsSlice.js';
import { isProfanity } from '../../utils/helpers.js';

const AddChannel = () => {
  const channelsNames = useSelector((state) => (
    state.channels.ids.map((id) => state.channels.entities[id].name)));
  const { show } = useSelector((state) => state.modal);

  const [isFormDisabled, setFormDisabled] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const clarify = useContext(SocketEmitContext);

  const schema = yup.object({
    name: yup.string().required(t('modal.errors.notEmpty'))
      .min(3, t('modal.errors.minLength'))
      .max(20, t('modal.errors.maxLength'))
      .notOneOf(channelsNames, t('modal.errors.unique'))
      .test({
        name: 'isProfanity',
        skipAbsent: true,
        test(value, ctx) {
          return isProfanity(value) ? ctx.createError({ message: t('modal.errors.obsceneLexicon') }) : true;
        },
      }),
  });

  const handleSubmit = (nameChannel) => {
    setFormDisabled(true);
    return clarify('newChannel', { name: nameChannel })
      .then((respData) => {
        dispatch(closeWindow());
        notifySuccess(t('toasts.createChannel'));
        dispatch(addOneChannel(respData));
        dispatch(setCurrentChannelId(respData.id));
      })
      .catch(() => notifyError(t('toasts.serverErr')))
      .finally(() => setFormDisabled(false));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema,
    onSubmit: async (values, actions) => {
      await handleSubmit(values.name);
      actions.resetForm();
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleClose = () => {
    dispatch(closeWindow());
    formik.resetForm();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addChannelTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mt-3 mt-mb-0">
            <Form.Label htmlFor="nameChannelInput" hidden>{t('modal.label')}</Form.Label>
            <Form.Control
              autoFocus
              id="nameChannelInput"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              className={`w-100 ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
              disabled={isFormDisabled}
            />
            <Form.Control.Feedback className="invalid-feedback">{formik.errors.name && formik.touched.name ? formik.errors.name : null}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modal.btnCancel')}
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit} disabled={isFormDisabled}>
          {t('modal.btnSubmit')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddChannel;
