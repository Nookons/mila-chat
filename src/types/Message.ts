
export interface IMessage {
    body: string;
    createdAt: number;
    message_id: number;
    user: string;
    user_name: string;
    isRead?: string[];
}