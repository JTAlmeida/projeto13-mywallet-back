import { transactionSchema } from "../schemas/transactionSchema.js";
import { authSignIn, authSignUp } from "../schemas/authSchemas.js";

export async function signInValidationMiddleware(req, res, next) {
  const user = req.body;

  const validation = authSignIn.validate(user, { abortEarly: false });

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(422).send({ message: err });
  }

  next();
}

export async function signUpValidationMiddleware(req, res, next) {
  const user = req.body;

  const validation = authSignUp.validate(user, { abortEarly: false });

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(422).send({ message: err });
  }

  next();
}

export async function transactionValidationMiddleware(req, res, next) {
  const { type, amount, description } = req.body;

  const validation = transactionSchema.validate(
    { type, amount, description },
    { abortEarly: false }
  );

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(422).send({ message: err });
  }

  next();
}
