const AppError = require('./appError');

module.exports = (user) => {
  if (!user.emailVerified)
    throw new AppError(
      'Please verify your email before accessing the system.',
      401,
    );
  if (!user.isApproved)
    throw new AppError(
      'Your account is pending approval by an admin or super admin.',
      403,
    );
  if (user.status === 'pending')
    throw new AppError('Your account is still under review', 403);
  if (user.status === 'deleted')
    throw new AppError(
      'Your account has been deleted. Please contact support',
      403,
    );
};
