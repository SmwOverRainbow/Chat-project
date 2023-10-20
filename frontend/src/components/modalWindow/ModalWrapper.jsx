import { useSelector } from 'react-redux';
import AddChannel from './AddChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const ModalWrapper = () => {

  const modalTypes = {
    addChannel: AddChannel,
    removeChannel: RemoveChannel,
    renameChannel: RenameChannel,
  };

  const typeWindow = useSelector((state) => state.modal.type);
  const ModalElement = modalTypes[typeWindow];

  if (!ModalElement) {
    return null;
  }
  return (
    <ModalElement />
  );
};

export default ModalWrapper