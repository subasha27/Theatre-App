import { Request, Response, NextFunction } from 'express';
import Joi from "@hapi/joi";

function validateSchema(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }

    next();
  };
}
class Schema {

  public adminSchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(8).required()
  });
  public adminLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  public ownerCreationSchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(8).required()
  });
  public ownerInitialLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(8).required(),
    newPassword: Joi.string().min(4).max(8).required()
  });
  public ownerLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(8).required()
  });
  public theatreCreation = Joi.object({
    theatreName: Joi.string().required(),
    totalScreen: Joi.number().required(),
    capacity: Joi.number().required(),
    location: Joi.string().required(),
    bookingLimit: Joi.number().required(),
    totalSession: Joi.number().required()
  })
  public movieCreation = Joi.object({
    theatreName: Joi.string().required(),
    screenName: Joi.string().required(),
    movie: Joi.string().required(),
    date: Joi.date().required(),
    session: Joi.date().required(),
    totalSeats: Joi.number().required(),
    budgetClass: Joi.number().required(),
    executiveClass: Joi.number().required(),
    firstClass: Joi.number().required(),
  })
  public userRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(8).required()
  });
  public userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(8).required()
  });
  public theatreLocationSchema = Joi.object({
    location: Joi.string().required()
  });
  public bookingDataSchema = Joi.object({
    movieId: Joi.number().integer().required(),
    tickets: Joi.array()
      .items(Joi.object({
        budgetClass: Joi.number().integer().min(0),
        executiveClass: Joi.number().integer().min(0),
        firstClass: Joi.number().integer().min(0)
      }))
      .min(1)
      .max(6)
      .required(),
  });

}

const schema = new Schema();
export { validateSchema, schema };