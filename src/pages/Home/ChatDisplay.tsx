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
                        <div
                            key={doc.id}
                            className={user.uid === messageData.user ? "user_message" : "not_user_message"}
                        >
                            <Row gutter={[16, 16]}>
                                <Col style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center"
                                }}>
                                    <article style={{fontSize: 14}}>{messageData.body}</article>
                                </Col>
                                <Col  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end"
                                }}>
                                    <span style={{fontSize: 12, textWrap: "nowrap"}}>{dayjs(messageData.createdAt * 1000).format("HH:mm")}</span>
                                </Col>
                            </Row>
                        </div>
                    );
                })}
            </Col>
        </Row>
    );
};

export default ChatDisplay;
