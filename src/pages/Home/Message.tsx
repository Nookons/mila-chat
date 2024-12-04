import React, { FC } from 'react';
import { Col, Row } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IMessage } from "../../types/Message";
import { useAppSelector } from "../../hooks/storeHooks";

dayjs.extend(relativeTime);

interface MessageProps {
    messageData: IMessage;
}

const Message: FC<MessageProps> = ({ messageData }) => {
    const { user } = useAppSelector(state => state.user);

    if (!user) {
        return null;
    }

    const messageTime = dayjs(messageData.createdAt);
    const relativeTime = dayjs().to(messageTime); // Выводит "5 минут назад" или подобное

    return (
        <div
            key={messageData.message_id}
            className={user.uid === messageData.user ? "user_message" : "not_user_message"}
        >
            <Row style={{flexWrap: "nowrap"}} gutter={[16, 16]}>
                <Col style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}>
                    <article style={{ fontSize: 14 }}>{messageData.body}</article>
                </Col>
                <Col style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end"
                }}>
                    <span style={{
                        fontSize: 12,
                        whiteSpace: "nowrap"
                    }}>{relativeTime}</span>
                </Col>
            </Row>
        </div>
    );
};

export default Message;
