export type Role = "ADMIN" | "USER";

export type BasicUserType = {
    _id: string;
    email: string;
    name: string;
    image: string;
}

export type ExtendedUserType = BasicUserType & {
    role: Role,
    lastLoggedIn: string
} 
