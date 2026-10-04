import zod from 'zod';

export const signUpValidation = zod.object({
    fname:zod.string(),
    lname:zod.string(),
    email:zod.email(),
    password:zod.string().min(8)
})

export const signInValidation = zod.object({
    email:zod.email(),
    password:zod.string().min(8)
})