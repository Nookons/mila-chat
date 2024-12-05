import React, {useEffect, useState} from 'react';
import {Col, Row, Spin, message} from "antd";
import Button from "antd/es/button";
import TextArea from "antd/es/input/TextArea";
import {ArrowUpOutlined} from '@ant-design/icons';
import {useAppSelector} from "../../hooks/storeHooks";
import {collection, getFirestore, addDoc, setDoc, doc} from 'firebase/firestore';
import {db} from "../../firebase";
import dayjs from "dayjs";

const ChatInput = () => {
    const user = useAppSelector(state => state.user.user);
    const [body_value, setBody_value] = useState<string>("");
    const [isInput, setIsInput] = useState<boolean>(false);


    useEffect(() => {
        if (body_value.length > 0) {
            setIsInput(true);
        } else {
            setIsInput(false);
        }
    }, [body_value]);

    if ('Notification' in window) {
        // Проверяем, поддерживает ли браузер уведомления
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permission granted for notifications');
            } else {
                console.log('Permission denied for notifications');
            }
        });
    }

    const onSendMessage = async () => {
        if (!user) {
            message.warning("You need to be logged in to send a message.");
            return;
        }

        const message_id = Date.now();

        try {
            await setDoc(doc(db, `chat_room/${message_id}`), {
                body: body_value,
                createdAt: dayjs().valueOf(),
                message_id: message_id,
                user: user?.uid,
                user_name: user.first_name
            });
            setBody_value(""); // Reset the input after sending

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            }

        } catch (err) {
            message.error("Error sending message. Please try again.");
            console.log(err);
        }
    }

    return (
        <Row style={{justifyContent: "center", alignItems: "center", position: "fixed", bottom: 0}}>
            <Col span={24}>
                <TextArea
                    style={{resize: "none", width: "100vw"}}
                    value={body_value}
                    onChange={(e) => setBody_value(e.target.value)}
                    rows={2}
                />
            </Col>
            {isInput &&
                <Col style={{position: "fixed", bottom: 10, right: 10}}>
                    <Button
                        onClick={onSendMessage}
                        shape="circle"
                        type="primary"
                        htmlType="submit"
                    >
                        <ArrowUpOutlined/>
                    </Button>
                </Col>
            }
        </Row>
    );
};

export default ChatInput;
