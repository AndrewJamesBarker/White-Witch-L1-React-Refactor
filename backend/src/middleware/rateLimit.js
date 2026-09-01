const ONE_MINUTE_MS = 60 * 1000;

const buildClientKey = (req, keyGenerator) => {
  const generatedKey = keyGenerator?.(req);
  if (generatedKey) {
    return generatedKey;
  }

  return req.ip || req.headers['x-forwarded-for'] || 'unknown';
};

const buildEmailAwareKey = (prefix) => (req) => {
  const email = typeof req.body?.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : '';

  return `${prefix}:${req.ip}:${email || 'no-email'}`;
};

export const createRateLimiter = ({
  windowMs,
  maxRequests,
  message,
  keyGenerator,
}) => {
  const store = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = buildClientKey(req, keyGenerator);
    const currentEntry = store.get(key);

    const entry =
      currentEntry && currentEntry.resetAt > now
        ? currentEntry
        : { count: 0, resetAt: now + windowMs };

    if (entry.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((entry.resetAt - now) / 1000)
      );

      res.set('Retry-After', String(retryAfterSeconds));
      res.status(429).json({ message });
      return;
    }

    entry.count += 1;
    store.set(key, entry);

    for (const [storedKey, storedEntry] of store.entries()) {
      if (storedEntry.resetAt <= now) {
        store.delete(storedKey);
      }
    }

    next();
  };
};

export const authRateLimiters = {
  login: createRateLimiter({
    windowMs: 15 * ONE_MINUTE_MS,
    maxRequests: 10,
    message: 'Too many login attempts. Please wait a few minutes and try again.',
    keyGenerator: buildEmailAwareKey('login'),
  }),
  register: createRateLimiter({
    windowMs: 60 * ONE_MINUTE_MS,
    maxRequests: 5,
    message: 'Too many registration attempts. Please try again later.',
    keyGenerator: buildEmailAwareKey('register'),
  }),
  forgotPassword: createRateLimiter({
    windowMs: 30 * ONE_MINUTE_MS,
    maxRequests: 5,
    message: 'Too many password reset requests. Please try again later.',
    keyGenerator: buildEmailAwareKey('forgot-password'),
  }),
  resetPassword: createRateLimiter({
    windowMs: 30 * ONE_MINUTE_MS,
    maxRequests: 10,
    message: 'Too many password reset attempts. Please try again later.',
  }),
  resendVerification: createRateLimiter({
    windowMs: 30 * ONE_MINUTE_MS,
    maxRequests: 5,
    message: 'Too many verification email requests. Please try again later.',
    keyGenerator: buildEmailAwareKey('resend-verification'),
  }),
};