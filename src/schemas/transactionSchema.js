import joi from "joi";

export const transactionSchema = joi.object({
  type: joi.string().required().valid("income", "outcome"),
  description: joi.string().required(),
  amount: joi.number().required(),
});
