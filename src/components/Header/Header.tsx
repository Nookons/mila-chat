import React, { useState } from 'react';
import { Modal, Space, Upload, message } from 'antd';
import Button from 'antd/es/button';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { userLogout } from '../../store/reducers/user';
import { InboxOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const Header = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    const [isModal, setIsModal] = useState<boolean>(false);


    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 14 }}>
            <Modal
                title="Chat settings"
                open={isModal}
                onCancel={() => setIsModal(false)}
                footer={[]}
            >
            </Modal>
            <Space direction="horizontal">
                {user && (
                    <Button shape={'circle'} onClick={() => dispatch(userLogout())} type="default">
                        <LogoutOutlined />
                    </Button>
                )}
                {user && (
                    <Button shape={'circle'} onClick={() => setIsModal(true)} type="default">
                        <SettingOutlined />
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default Header;
