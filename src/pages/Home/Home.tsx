import React from 'react';
import {Divider, Skeleton} from "antd";
import ChatDisplay from "./ChatDisplay";
import ChatInput from "./ChatInput";
import {useAppSelector} from "../../hooks/storeHooks";
import {useNavigate} from "react-router-dom";
import {SIGN_IN_ROUTE} from "../../utils/const";

const Home = () => {
    const navigate = useNavigate();
    const {user, loading, error} = useAppSelector(state => state.user)

    if (loading) {
        return <Skeleton />
    }

    if (user === null) {
        navigate(SIGN_IN_ROUTE);
    }

    return (
        <div>
            <ChatDisplay />
            <ChatInput />
        </div>
    );
};

export default Home;