export type RegisterParam = {
    email: string;
    password: string;
    name: string;
}

export type LoginParam = {
    email: string;
    password: string;
}

export type UpdateProfileParam = {
    name?: string;
    new_password?: string;
    old_password?: string; // Required if changing password
}
