import React from 'react';
import {Space} from "antd";
import Button from "antd/es/button";
import {useNavigate} from "react-router-dom";
import {SIGN_IN_ROUTE} from "../../utils/const";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import {userLogout} from "../../store/reducers/user";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    return (
        <div style={{
            display: 'flex',
            justifyContent: "flex-end",
            padding: 14
        }}>
            <Space direction="horizontal">
                {user
                    ? <Button onClick={() => dispatch(userLogout())} type="default">Log Out</Button>
                    : <Button onClick={() => navigate(SIGN_IN_ROUTE)} type="default">Sign In</Button>
                }
            </Space>
        </div>
    );
};

export default Header;