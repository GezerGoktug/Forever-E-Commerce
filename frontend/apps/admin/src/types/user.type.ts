export type Role = "ADMIN" | "USER";

export type BasicUser = {
    _id: string;
    email: string;
    name: string;
    image: string;
}

export type ExtendedUser = BasicUser & {
    role: Role,
    lastLoggedIn: string
} 
