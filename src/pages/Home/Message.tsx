import React, {FC, useEffect, useRef, useState} from "react";
import {Badge, Col, message, Popconfirm, Row} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {IMessage} from "../../types/Message";
import {useAppSelector} from "../../hooks/storeHooks";
import {updateDoc, doc, getFirestore, collection, arrayUnion} from "firebase/firestore";
import {app} from "../../firebase";
import {ClockCircleOutlined, EyeOutlined} from "@ant-design/icons";

dayjs.extend(relativeTime);

interface MessageProps {
    messageData: IMessage;
}

const Message: FC<MessageProps> = ({messageData}) => {
    const {user} = useAppSelector((state) => state.user);
    const messageRef = useRef<HTMLDivElement>(null); // Ref for the message

    const [isReaded, setIsReaded] = useState<boolean>(false);

    useEffect(() => {
        if (messageData.isRead && user) {
            if (messageData.user === user.uid) {
                setIsReaded(true);
            }
        } else {
            return
        }
    }, [messageData]);

    useEffect(() => {
        if (!user || user.uid === messageData.user || messageData.isRead?.includes(user.uid)) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const firestore = getFirestore(app);
                    const messageDoc = doc(collection(firestore, "chat_room"), messageData.message_id.toString());

                    updateDoc(messageDoc, {
                        isRead: arrayUnion(user.uid),
                    })
                }
            },
            {threshold: 0.5} // At least 50% of the message should be visible
        );

        if (messageRef.current) {
            observer.observe(messageRef.current);
        }

        return () => {
            if (messageRef.current) {
                observer.unobserve(messageRef.current);
            }
        };
    }, [messageData, user]);

    if (!user) {
        return null;
    }

    const messageTime = dayjs(messageData.createdAt);
    const relativeTime = dayjs().to(messageTime);

    return (
        <div
            ref={messageRef}
            key={messageData.message_id}
            className={user.uid === messageData.user ? "user_message" : "not_user_message"}
        >
            <Row style={{flexWrap: "nowrap"}} gutter={[16, 16]}>
                <Col
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    {isReaded && (
                        <Badge  style={{marginRight: 14}} status="success"/>
                    )}
                    <article style={{fontSize: 14}}>{messageData.body}</article>
                </Col>

                <Col
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {relativeTime}
                    </span>
                </Col>
            </Row>
        </div>
    );
};

export default Message;
