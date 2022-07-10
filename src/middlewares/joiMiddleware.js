import {
  signInSchema,
  signUpSchema,
  cartSchema,
  dataSchema,
} from "../database/models/joiSchemas.js";

export function userValidation(req, res, next) {
  const data = res.locals.cleanData;
  let validation;

  switch (true) {
    case data.name !== undefined:
      validation = signUpSchema.validate(data, { abortEarly: true });
      if (validation.error) {
        return res.sendStatus(422);
      }
      break;
    case data.address !== undefined:
      validation = cartSchema.validate(data, { abortEarly: true });
      let arrayValidation;
      for (let i = 0; i < data.data.length; i++) {
        arrayValidation = dataSchema.validate(data.data[i], {
          abortEarly: false,
        });
      }
      if (validation.error || arrayValidation.error) {
        return res.sendStatus(422);
      }
      break;
    default:
      validation = signInSchema.validate(data, { abortEarly: true });
      if (validation.error) {
        return res.sendStatus(422);
      }
      break;
  }

  next();
}
