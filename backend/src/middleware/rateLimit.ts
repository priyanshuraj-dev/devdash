// this middleware is to prevent signup, login or forgotPassword multiple times from a same ip

import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 10*60*1000,
    max: 5,
    message: "Too many login attempts. Try again later"
})

export const forgotPasswordLimiter = rateLimit({
    windowMs: 60*60*1000,
    max: 5,
    message: "Too many password reset requests. Try again later"
})

export const signupLimiter = rateLimit({
    windowMs: 10*60*1000,
    max: 5,
    message: "Too many signup attempts. Try again later"
})