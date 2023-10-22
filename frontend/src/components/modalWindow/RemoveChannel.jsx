import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { SocketEmitContext } from '../../context/socketEmitContext.js';
import { notifySuccess, notifyError } from '../../utils/toasts.js';
import { closeWindow } from '../../slices/modalSlice.js';
import { setCurrentChannelId } from '../../slices/channelsSlice.js';

const RemoveChannel = () => {
  const dispatch = useDispatch();
  const { show, channelId } = useSelector((state) => state.modal);
  const { t } = useTranslation();
  const clarify = useContext(SocketEmitContext);
  const defaultChannelId = 1;

  const [isRemoveBtnDisabled, setRemoveBtnDisabled] = useState(false);

  const handleClose = () => dispatch(closeWindow());
  const handleClickRemove = () => {
    setRemoveBtnDisabled(true);
    clarify('removeChannel', { id: channelId })
      .then(() => {
        dispatch(closeWindow());
        dispatch(setCurrentChannelId(defaultChannelId));
        notifySuccess(t('toasts.deleteChannel'));
      })
      .catch(() => notifyError(t('toasts.serverErr')))
      .finally(() => setRemoveBtnDisabled(false));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeChannelTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('modal.areYouSure')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modal.btnCancel')}
        </Button>
        <Button variant="danger" onClick={handleClickRemove} disabled={isRemoveBtnDisabled}>
          {t('modal.btnDelete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannel;
