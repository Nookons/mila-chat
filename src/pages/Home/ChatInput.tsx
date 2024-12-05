import React, {useEffect, useState} from 'react';
import {Col, Row, Spin, message, Input} from "antd";
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

    const [isSending, setIsSending] = useState<boolean>(false);


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
        setIsSending(true)

        const message_id = Date.now();

        try {
            await setDoc(doc(db, `chat_room/${message_id}`), {
                body: body_value,
                createdAt: dayjs().valueOf(),
                message_id: message_id,
                user: user?.uid,
                user_name: user.first_name
            });
        } catch (err) {
            message.error("Error sending message. Please try again.");
            console.log(err);
        } finally {
            setTimeout(() => {
                setBody_value("");
                setIsSending(false);
            }, 250)
        }
    }

    return (
        <Row style={{justifyContent: "center", alignItems: "center", position: "fixed", bottom: 0}}>
            <Col span={24}>
                <Input
                    disabled={isSending}
                    placeholder={"Жазғың келсе 🙈"}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isSending && body_value.length) onSendMessage();
                    }}
                    style={{
                        resize: "none",
                        width: "100vw",
                        padding: "24px 14px 34px 14px",
                        background: "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 25%)",
                        boxShadow: "0 -14px 8px rgba(0,0,0, 5)",
                        outline: "none",
                        border: "none",
                        borderRadius: "0"
                }}
                    value={body_value}
                    onChange={(e) => setBody_value(e.target.value)}
                />
            </Col>
            {isInput &&
                <Col style={{position: "fixed", bottom: 30, right: 10}}>
                    <Button
                        loading={isSending}
                        disabled={isSending}
                        onClick={onSendMessage}
                        type="primary"
                        htmlType="submit"
                    >
                        {!isSending && <ArrowUpOutlined/>}
                    </Button>
                </Col>
            }
        </Row>
    );
};

export default ChatInput;
