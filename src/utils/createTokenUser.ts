
export const createTokenUser = (user: {
  _id: string; lastName: string; firstName:string; email: string;
}) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id,
  };
};