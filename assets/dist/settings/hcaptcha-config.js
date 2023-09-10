// hcaptcha-config.js

import { loadHCaptcha } from 'https://hcaptcha.com/1/api.js';

const hcaptchaSiteKey = 'be2f837e-7ca8-47a0-b846-d01dab1f199f';

const hcaptchaContainer = document.querySelector('[data-hcaptcha-sitekey]');

loadHCaptcha(hcaptchaSiteKey, { language: 'es' }).then((hcaptchaInstance) => {
  hcaptchaInstance.render(hcaptchaContainer);
});
