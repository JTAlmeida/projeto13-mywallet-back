import joi from "joi";

export const authSignIn = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const authSignUp = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.ref("password"),
});
