import 'server-only';

import OpenAI from 'openai';

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedOpenAi: OpenAI;
}

export let openai: OpenAI;
if (process.env.NODE_ENV === 'production') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  if (!global.cachedOpenAi) {
    global.cachedOpenAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  openai = global.cachedOpenAi;
}
