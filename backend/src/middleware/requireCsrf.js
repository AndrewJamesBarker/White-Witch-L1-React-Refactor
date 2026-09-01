const CSRF_HEADER_NAME = 'x-csrf-token';

const normalizeOrigin = (value = '') => value.replace(/\/$/, '');

const requireCsrf = (req, res, next) => {
  const requestToken = req.headers[CSRF_HEADER_NAME];
  const sessionToken = req.userData?.csrfToken;
  const allowedOrigin = normalizeOrigin(process.env.CORS_ORIGIN || '');
  const requestOrigin = normalizeOrigin(req.get('origin') || '');

  if (!sessionToken || !requestToken || requestToken !== sessionToken) {
    return res.status(403).json({
      message: 'CSRF validation failed',
    });
  }

  if (!allowedOrigin || !requestOrigin || requestOrigin !== allowedOrigin) {
    return res.status(403).json({
      message: 'Origin not allowed',
    });
  }

  next();
};

export default requireCsrf;