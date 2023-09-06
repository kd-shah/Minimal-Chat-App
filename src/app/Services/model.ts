export class RegisterRequest {
    name!: string;
    email!: string;
    password!: string
}

export class RegisterResponse {
    message!: string;
    UserInfo!: {
        userId: number;
        name: string;
        email: string

    }
}

export class LoginRequest {
    email!: string;
    password!: string
}

export class LoginResponse {
    message!: string;
    userInfo!: {
        userId: any;
        name: string;
        email: string

    }
    token!: string;
}

export class MessageResponse {
    id!: number;
    senderId!: any;
    receiverId!: number;
    content!: string;
    timestamp!: string;
  }
  
  export class SendMessageRequest{
    id!: number;
    requestBody! : {
        content : string
    }
}
export class EditMessageRequest{
    messageId!: number;
    requestBody!: {
        content : string;
    }
}
