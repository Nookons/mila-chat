import React, { useEffect, useRef } from 'react';
import { Row, Col, Skeleton, Alert, FloatButton } from "antd";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getFirestore, query, orderBy } from "firebase/firestore";
import { app } from "../../firebase";
import { useAppSelector } from "../../hooks/storeHooks";
import "./Messages.css"
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import Button from "antd/es/button";
import {CommentOutlined, DashOutlined} from '@ant-design/icons';
import Message from "./Message";
import {IMessage} from "../../types/Message";

const ChatDisplay = () => {
    const user = useAppSelector((state) => state.user.user);
    const chatContainerRef = useRef<HTMLDivElement>(null); // Reference to the chat container

    const [value, loading, error] = useCollection(
        query(collection(getFirestore(app), 'chat_room'), orderBy('createdAt', 'asc')), // Sort messages by createdAt field
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [value]); // Depend on `value` to trigger when messages change

    if (loading) {
        return (
            <Row
                style={{
                    border: "1px solid #ededed",
                    boxShadow: "0 0 2px rgba(0,0,0, 0.15)",
                    padding: 14,
                    margin: "14px 0",
                    borderRadius: 4,
                    maxHeight: '400px',
                }}
                gutter={[16, 16]}
            >
                <Skeleton />
            </Row>
        );
    }

    if (error) {
        return <Alert message="Error loading messages" type="error" />;
    }

    if (!user) {
        return <Alert message="Error loading messages" type="error" />;
    }

    return (
        <Row
            className={"chat_block"}
            gutter={[16, 16]}
        >
            <Col span={24} ref={chatContainerRef}> {/* Use the ref here */}
                {value?.docs.map((doc) => {
                    const messageData = doc.data();
                    return (
                        <Message messageData={messageData as IMessage}/>
                    );
                })}
            </Col>
        </Row>
    );
};

export default ChatDisplay;
