import React, {
  useContext, useState, useRef, useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { SocketEmitContext } from '../../socketEmitContext.js';
import { renameChannel } from '../../slices/channelsSlice.js';
import { notifySuccess, notifyError } from '../../utils/toasts.js';
import { closeWindow } from '../../slices/modalSlice.js';
import { isProfanity } from '../../utils/helpers.js';

const RenameChannel = () => {
  const channelsNames = useSelector((state) => (
    state.channels.ids.map((id) => state.channels.entities[id].name)));
  const { show, data } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const clarify = useContext(SocketEmitContext);
  const [isFormDisabled, setFormDisabled] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.select();
    });
  }, []);

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
    return clarify('renameChannel', { name: nameChannel, id: data.id })
      .then(() => {
        dispatch(closeWindow());
        notifySuccess(t('toasts.renameChannel'));
        dispatch(renameChannel({ id: data.id, update: { name: nameChannel } }));
      })
      .catch(() => notifyError(t('toasts.serverErr')))
      .finally(() => setFormDisabled(false));
  };

  const formik = useFormik({
    initialValues: {
      name: data.name,
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
        <Modal.Title>{t('modal.renameChannelTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mt-3 mt-mb-0">
            <Form.Control
              id="nameChannelInput"
              name="name"
              type="text"
              ref={inputRef}
              onChange={formik.handleChange}
              value={formik.values.name}
              className={`w-100 ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
              disabled={isFormDisabled}
            />
            <Form.Label htmlFor="nameChannelInput" visuallyHidden>{t('modal.label')}</Form.Label>
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

export default RenameChannel;
