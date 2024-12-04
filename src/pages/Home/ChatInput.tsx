import React, { useEffect, useState } from 'react';
import { Col, Row, Spin, message } from "antd";
import Button from "antd/es/button";
import TextArea from "antd/es/input/TextArea";
import { ArrowUpOutlined } from '@ant-design/icons';
import { useAppSelector } from "../../hooks/storeHooks";
import { collection, getFirestore, addDoc } from 'firebase/firestore';
import {db} from "../../firebase";

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

    const onSendMessage = async () => {
        if (!user) {
            message.warning("You need to be logged in to send a message.");
            return;
        }

        try {
            await addDoc(collection(db, 'chat_room'), {
                body: body_value,
                createdAt: new Date(),
                message_id: Date.now(),
                user: user?.uid,
                user_name: user.first_name
            });
            setBody_value(""); // Reset the input after sending
        } catch (err) {
            message.error("Error sending message. Please try again.");
        }
    }

    return (
        <Row style={{ justifyContent: "center", alignItems: "center" }} gutter={[16, 16]}>
            <Col span={isInput ? 20 : 24}>
                <TextArea
                    value={body_value}
                    onChange={(e) => setBody_value(e.target.value)}
                    rows={2}
                />
            </Col>
            {isInput &&
                <Col span={4}>
                    <Button
                        onClick={onSendMessage}
                        shape="circle"
                        type="primary"
                        htmlType="submit"
                    >
                        <ArrowUpOutlined />
                    </Button>
                </Col>
            }
        </Row>
    );
};

export default ChatInput;
