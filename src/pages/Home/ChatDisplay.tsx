import React, {useEffect, useRef, useState} from 'react';
import {Row, Col, Skeleton, Alert} from "antd";
import {useCollection} from "react-firebase-hooks/firestore";
import {collection, getFirestore, query, orderBy, onSnapshot, doc} from "firebase/firestore";
import {app, db} from "../../firebase";
import {useAppSelector} from "../../hooks/storeHooks";
import "./Messages.css"
import Message from "./Message";
import {IMessage} from "../../types/Message";
import {useNavigate} from "react-router-dom";
import {SIGN_IN_ROUTE} from "../../utils/const";
import Button from "antd/es/button";

const ChatDisplay = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user.user);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    const [background, setBackground] = useState<any | null>(null);

    const [value, loading, error] = useCollection(
        query(collection(getFirestore(app), 'chat_room'), orderBy('createdAt', 'asc')),
        {
            snapshotListenOptions: {includeMetadataChanges: true},
        }
    );

    useEffect(() => {
        if (isScrolledToBottom && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [value, isScrolledToBottom]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chat_settings", "background"), (doc) => {
            setBackground(doc.data());
        });
    }, []);

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const {scrollTop, scrollHeight, clientHeight} = chatContainerRef.current;
        setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10); // Allow a small threshold
    };


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
                <Skeleton/>
            </Row>
        );
    }

    if (error) {
        return <Alert message="Error loading messages" type="error"/>;
    }

    if (!user) {
        navigate(SIGN_IN_ROUTE);
    }

    return (
        <Row
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="chat_block"
            style={{
                background: `url(${background.url})`,
                backgroundSize: "contain",
            }}
            gutter={[16, 16]}
        >
            <Alert
                style={{margin: 34}}
                message={<span>Бұл жерде әлі хабарлар жоқ 😢</span>}
                description={<span>Бұл жерде әлі де бірнеше хабар жетіспейтін сияқты, бірақ оны түзету оңай емес пе?</span>}
                type="info"
            />
            <Col span={24}>
                {value?.docs.map((doc) => {
                    const messageData = doc.data();
                    return (
                        <Message key={doc.id} messageData={messageData as IMessage}/>
                    );
                })}
            </Col>
        </Row>
    );
};

export default ChatDisplay;
