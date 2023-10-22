import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown, ButtonGroup, Nav, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { showWindow } from '../slices/modalSlice.js';
import { setCurrentChannelId } from '../slices/channelsSlice.js';

const Channels = () => {
  const channels = useSelector((state) => state.channels);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Nav id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.ids.map((id) => {
        const channel = channels.entities[id];
        const classNamesActive = channel.id === channels.currentChannelId ? 'btn-secondary' : '';
        return (
          <Nav.Item className="w-100" key={id}>
            <Dropdown as={ButtonGroup} className="d-flex mt-1">
              <Button variant="" className={`w-100 rounded-0 text-start text-truncate ${classNamesActive}`} onClick={() => dispatch(setCurrentChannelId(channel.id))}>
                <span className="me-1">#</span>
                {channel.name}
              </Button>
              {channel.removable && (
                <>
                  <Dropdown.Toggle aria-expanded="false" variant="" className={`flex-grow-0 dropdown-toggle-split ${classNamesActive}`}>
                    <span className="visually-hidden">{t('channels.labelManage')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => dispatch(showWindow({ type: 'removeChannel', channelId: id }))}>
                      {t('channels.deleteDropdownBtn')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => dispatch(showWindow({ type: 'renameChannel', channelId: id }))}>
                      {t('channels.renameDropdownBtn')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

export default Channels;
