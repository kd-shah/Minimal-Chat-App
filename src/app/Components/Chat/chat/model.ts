export class MessageResponse {
    id!: number;
    senderId!: number;
    receiverId!: number;
    content!: string;
    timestamp!: string;
}


export class Message {
    id!: number;
    senderId!: number | null;
    receiverId!: number;
    content!: string;
    timestamp!: string;
    isEditing!: boolean;
}
