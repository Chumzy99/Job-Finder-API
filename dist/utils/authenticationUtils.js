"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
const auth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new AppError("No auth found in", 401);
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = { userId: payload.userId, name: payload.name };
  }
);

export default auth;
*/
