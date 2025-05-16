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
    email?: string;
    profile_pict?: string;
    new_password?: string;
    old_password?: string; // Required if changing password
}
