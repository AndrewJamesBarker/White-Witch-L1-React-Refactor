import axios from 'axios';

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 12 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';

const deriveAllowedRecaptchaHostnames = () => {
  const configuredHostnames = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || '')
    .split(',')
    .map((hostname) => hostname.trim())
    .filter(Boolean);

  const derivedHostnames = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN]
    .filter(Boolean)
    .flatMap((value) => {
      try {
        return [new URL(value).hostname];
      } catch {
        return [];
      }
    });

  if (process.env.NODE_ENV !== 'production') {
    derivedHostnames.push('localhost', '127.0.0.1');
  }

  return new Set([...configuredHostnames, ...derivedHostnames]);
};

export const passwordPolicyMessage = PASSWORD_POLICY_MESSAGE;

export const validatePasswordPolicy = (password) => {
  if (typeof password !== 'string') {
    return PASSWORD_POLICY_MESSAGE;
  }

  const hasMinimumLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  if (
    hasMinimumLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialCharacter
  ) {
    return null;
  }

  return PASSWORD_POLICY_MESSAGE;
};

export const verifyRecaptcha = async ({ token, expectedAction }) => {
  if (!token) {
    return {
      ok: false,
      message: 'reCAPTCHA token is required',
    };
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    throw new Error('RECAPTCHA_SECRET_KEY is not configured');
  }

  const requestBody = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY,
    response: token,
  });

  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    requestBody.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const recaptchaData = response.data;

  if (!recaptchaData.success) {
    return {
      ok: false,
      message: 'reCAPTCHA verification failed',
      details: recaptchaData,
    };
  }

  if (!recaptchaData.action || recaptchaData.action !== expectedAction) {
    return {
      ok: false,
      message: 'reCAPTCHA verification failed',
      details: recaptchaData,
    };
  }

  const allowedHostnames = deriveAllowedRecaptchaHostnames();
  if (
    allowedHostnames.size > 0 &&
    recaptchaData.hostname &&
    !allowedHostnames.has(recaptchaData.hostname)
  ) {
    return {
      ok: false,
      message: 'reCAPTCHA verification failed',
      details: recaptchaData,
    };
  }

  const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
  if (
    Number.isFinite(minimumScore) &&
    typeof recaptchaData.score === 'number' &&
    recaptchaData.score < minimumScore
  ) {
    return {
      ok: false,
      message: 'reCAPTCHA verification failed',
      details: recaptchaData,
    };
  }

  return {
    ok: true,
    data: recaptchaData,
  };
};