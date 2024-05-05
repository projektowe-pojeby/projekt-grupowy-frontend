export const Endpoints = {
    POSTS: '/posts',
    POST: '/posts/[id]',

    USER: '/users/[id]',

    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    EXTEND_SESSION: '/auth/extend-session',

    WHO_AM_I: '/who-am-i',

    SET_LIKE: '/posts/[id]/set-like',
} as const;

export type Endpoint = (typeof Endpoints)[keyof typeof Endpoints];
