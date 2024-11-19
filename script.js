const logger = {
  el: document.getElementById('logs-wrapper'),
  error: (msg) => {
    console.error(msg);
    logger.el.innerHTML += `<span class="log-error">error</span> ${msg}<br>`;
  },
  info: (msg) => {
    console.info(msg);
    logger.el.innerHTML += `<span class="log-info">info</span> ${msg}<br>`;
  },
  debug: (msg) => {
    console.log(msg);
    logger.el.innerHTML += `<span class="log-debug">debug</span> ${msg}<br>`;
  },
  clear: () => {
    logger.el.innerHTML = '';
  }
};

// JSON.stringify(Array.from(temp2.querySelectorAll('.param-row')).map(row => ({name: Array.from(row.querySelectorAll('.param-name'))[0].innerText, type: Array.from(row.querySelectorAll('.param-type'))[0].innerText, desc: Array.from(row.querySelectorAll('.param-desc'))[0].innerHTML})), null, 2) // https://platform.openai.com/docs/api-reference/chat/create
let params = [
  // {
  //   "name": "messages",
  //   "type": "array",
  //   "desc": "<div class=\"markdown-content\"><p>A list of messages comprising the conversation so far. Depending on the\n<a href=\"https://platform.openai.com/docs/models\">model</a> you use, different message types (modalities) are\nsupported, like <a href=\"https://platform.openai.com/docs/guides/text-generation\">text</a>,\n<a href=\"https://platform.openai.com/docs/guides/vision\">images</a>, and <a href=\"https://platform.openai.com/docs/guides/audio\">audio</a>.</p></div>"
  // },
  {
    "name": "model",
    "type": "string",
    "desc": "<div class=\"markdown-content\"><p>ID of the model to use. See the <a href=\"https://platform.openai.com/docs/models#model-endpoint-compatibility\">model endpoint compatibility</a> table for details on which models work with the Chat API.</p></div>"
  },
  {
    "name": "store",
    "type": "boolean or null",
    "desc": "<div class=\"markdown-content\"><p>Whether or not to store the output of this chat completion request\nfor use in our <a href=\"https://platform.openai.com/docs/guides/distillation\">model distillation</a> or <a href=\"https://platform.openai.com/docs/guides/evals\">evals</a> products.</p></div>"
  },
  {
    "name": "metadata",
    "type": "object or null",
    "desc": "<div class=\"markdown-content\"><p>Developer-defined tags and values used for filtering completions\nin the <a href=\"https://platform.openai.com/chat-completions\" target=\"_blank\" rel=\"noopener noreferrer\">dashboard</a>.</p></div>"
  },
  {
    "name": "frequency_penalty",
    "type": "number or null",
    "desc": "<div class=\"markdown-content\"><p>Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.</p>\n<p><a href=\"https://platform.openai.com/docs/guides/text-generation\">See more information about frequency and presence penalties.</a></p></div>"
  },
  {
    "name": "logit_bias",
    "type": "map",
    "desc": "<div class=\"markdown-content\"><p>Modify the likelihood of specified tokens appearing in the completion.</p>\n<p>Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.</p></div>"
  },
  {
    "name": "logprobs",
    "type": "boolean or null",
    "desc": "<div class=\"markdown-content\"><p>Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the <code>content</code> of <code>message</code>.</p></div>"
  },
  {
    "name": "top_logprobs",
    "type": "integer or null",
    "desc": "<div class=\"markdown-content\"><p>An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. <code>logprobs</code> must be set to <code>true</code> if this parameter is used.</p></div>"
  },
  {
    "name": "max_tokens",
    "type": "integer or null",
    "desc": "<div class=\"markdown-content\"><p>The maximum number of <a href=\"https://platform.openai.com/tokenizer\">tokens</a> that can be generated in the chat completion. This value can be used to control <a href=\"https://openai.com/api/pricing/\" target=\"_blank\" rel=\"noopener noreferrer\">costs</a> for text generated via API.</p>\n<p>This value is now deprecated in favor of <code>max_completion_tokens</code>, and is not compatible with <a href=\"https://platform.openai.com/docs/guides/reasoning\">o1 series models</a>.</p></div>"
  },
  {
    "name": "max_completion_tokens",
    "type": "integer or null",
    "desc": "<div class=\"markdown-content\"><p>An upper bound for the number of tokens that can be generated for a completion, including visible output tokens and <a href=\"https://platform.openai.com/docs/guides/reasoning\">reasoning tokens</a>.</p></div>"
  },
  {
    "name": "n",
    "type": "integer or null",
    "desc": "<div class=\"markdown-content\"><p>How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep <code>n</code> as <code>1</code> to minimize costs.</p></div>"
  },
  {
    "name": "modalities",
    "type": "array or null",
    "desc": "<div class=\"markdown-content\"><p>Output types that you would like the model to generate for this request.\nMost models are capable of generating text, which is the default:</p>\n<p><code>[\"text\"]</code></p>\n<p>The <code>gpt-4o-audio-preview</code> model can also be used to <a href=\"https://platform.openai.com/docs/guides/audio\">generate audio</a>. To\nrequest that this model generate both text and audio responses, you can\nuse:</p>\n<p><code>[\"text\", \"audio\"]</code></p></div>"
  },
  {
    "name": "prediction",
    "type": "object",
    "desc": "<div class=\"markdown-content\"><p>Configuration for a <a href=\"https://platform.openai.com/docs/guides/predicted-outputs\">Predicted Output</a>,\nwhich can greatly improve response times when large parts of the model\nresponse are known ahead of time. This is most common when you are\nregenerating a file with only minor changes to most of the content.</p></div>"
  },
  {
    "name": "audio",
    "type": "object or null",
    "desc": "<div class=\"markdown-content\"><p>Parameters for audio output. Required when audio output is requested with\n<code>modalities: [\"audio\"]</code>. <a href=\"https://platform.openai.com/docs/guides/audio\">Learn more</a>.</p></div>"
  },
  {
    "name": "presence_penalty",
    "type": "number or null",
    "desc": "<div class=\"markdown-content\"><p>Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.</p>\n<p><a href=\"https://platform.openai.com/docs/guides/text-generation\">See more information about frequency and presence penalties.</a></p></div>"
  },
  {
    "name": "response_format",
    "type": "object",
    "desc": "<div class=\"markdown-content\"><p>An object specifying the format that the model must output. Compatible with <a href=\"https://platform.openai.com/docs/models#gpt-4o\">GPT-4o</a>, <a href=\"https://platform.openai.com/docs/models#gpt-4o-mini\">GPT-4o mini</a>, <a href=\"https://platform.openai.com/docs/models#gpt-4-turbo-and-gpt-4\">GPT-4 Turbo</a> and all GPT-3.5 Turbo models newer than <code>gpt-3.5-turbo-1106</code>.</p>\n<p>Setting to <code>{ \"type\": \"json_schema\", \"json_schema\": {...} }</code> enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the <a href=\"https://platform.openai.com/docs/guides/structured-outputs\">Structured Outputs guide</a>.</p>\n<p>Setting to <code>{ \"type\": \"json_object\" }</code> enables JSON mode, which ensures the message the model generates is valid JSON.</p>\n<p><strong>Important:</strong> when using JSON mode, you <strong>must</strong> also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly \"stuck\" request. Also note that the message content may be partially cut off if <code>finish_reason=\"length\"</code>, which indicates the generation exceeded <code>max_tokens</code> or the conversation exceeded the max context length.</p></div>"
  },
  {
    "name": "seed",
    "type": "integer or null",
    "desc": "<div class=\"markdown-content\"><p>This feature is in Beta.\nIf specified, our system will make a best effort to sample deterministically, such that repeated requests with the same <code>seed</code> and parameters should return the same result.\nDeterminism is not guaranteed, and you should refer to the <code>system_fingerprint</code> response parameter to monitor changes in the backend.</p></div>"
  },
  {
    "name": "service_tier",
    "type": "string or null",
    "desc": "<div class=\"markdown-content\"><p>Specifies the latency tier to use for processing the request. This parameter is relevant for customers subscribed to the scale tier service:</p>\n<ul>\n<li>If set to 'auto', and the Project is Scale tier enabled, the system will utilize scale tier credits until they are exhausted.</li>\n<li>If set to 'auto', and the Project is not Scale tier enabled, the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee.</li>\n<li>If set to 'default', the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee.</li>\n<li>When not set, the default behavior is 'auto'.</li>\n</ul>\n<p>When this parameter is set, the response body will include the <code>service_tier</code> utilized.</p></div>"
  },
  {
    "name": "stop",
    "type": "string / array / null",
    "desc": "<div class=\"markdown-content\"><p>Up to 4 sequences where the API will stop generating further tokens.</p></div>"
  },
  {
    "name": "stream",
    "type": "boolean or null",
    "desc": "<div class=\"markdown-content\"><p>If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only <a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format\" target=\"_blank\" rel=\"noopener noreferrer\">server-sent events</a> as they become available, with the stream terminated by a <code>data: [DONE]</code> message. <a href=\"https://cookbook.openai.com/examples/how_to_stream_completions\" target=\"_blank\" rel=\"noopener noreferrer\">Example Python code</a>.</p></div>"
  },
  {
    "name": "stream_options",
    "type": "object or null",
    "desc": "<div class=\"markdown-content\"><p>Options for streaming response. Only set this when you set <code>stream: true</code>.</p></div>"
  },
  {
    "name": "temperature",
    "type": "number or null",
    "desc": "<div class=\"markdown-content\"><p>What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.</p>\n<p>We generally recommend altering this or <code>top_p</code> but not both.</p></div>"
  },
  {
    "name": "top_p",
    "type": "number or null",
    "desc": "<div class=\"markdown-content\"><p>An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.</p>\n<p>We generally recommend altering this or <code>temperature</code> but not both.</p></div>"
  },
  {
    "name": "tools",
    "type": "array",
    "desc": "<div class=\"markdown-content\"><p>A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.</p></div>"
  },
  {
    "name": "tool_choice",
    "type": "string or object",
    "desc": "<div class=\"markdown-content\"><p>Controls which (if any) tool is called by the model.\n<code>none</code> means the model will not call any tool and instead generates a message.\n<code>auto</code> means the model can pick between generating a message or calling one or more tools.\n<code>required</code> means the model must call one or more tools.\nSpecifying a particular tool via <code>{\"type\": \"function\", \"function\": {\"name\": \"my_function\"}}</code> forces the model to call that tool.</p>\n<p><code>none</code> is the default when no tools are present. <code>auto</code> is the default if tools are present.</p></div>"
  },
  {
    "name": "parallel_tool_calls",
    "type": "boolean",
    "desc": "<div class=\"markdown-content\"><p>Whether to enable <a href=\"https://platform.openai.com/docs/guides/function-calling#configuring-parallel-function-calling\">parallel function calling</a> during tool use.</p></div>"
  },
  {
    "name": "user",
    "type": "string",
    "desc": "<div class=\"markdown-content\"><p>A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. <a href=\"https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids\">Learn more</a>.</p></div>"
  },
  {
    "name": "function_call",
    "type": "string or object",
    "desc": "<div class=\"markdown-content\"><p>Deprecated in favor of <code>tool_choice</code>.</p>\n<p>Controls which (if any) function is called by the model.\n<code>none</code> means the model will not call a function and instead generates a message.\n<code>auto</code> means the model can pick between generating a message or calling a function.\nSpecifying a particular function via <code>{\"name\": \"my_function\"}</code> forces the model to call that function.</p>\n<p><code>none</code> is the default when no functions are present. <code>auto</code> is the default if functions are present.</p></div>"
  },
  {
    "name": "functions",
    "type": "array",
    "desc": "<div class=\"markdown-content\"><p>Deprecated in favor of <code>tools</code>.</p>\n<p>A list of functions the model may generate JSON inputs for.</p></div>"
  }
];

params = [
  {
    "name": "api_url",
    "type": "string",
    "desc": "The URL of the API endpoint, usually <code>https://api.openai.com/v1/chat/completions</code>"
  },
  {
    "name": "api_key",
    "type": "string",
    "desc": "Your API key"
  }
].concat(params);

let state = {};

// Load saved values on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.config-section').innerHTML = params.map(param => `
  <label for="${param.name}">
    <div class="label-text">${param.name}
      <div class="label-desc">
        <pre>${param.type}</pre>
        ${param.desc}
      </div>
    </div>
    <div class="input-wrapper">${(() => {
      if (param.type.split(' ')[0] === 'number') {
        return `<input type="number" id="${param.name}" placeholder="" value="">`;
      } else if (param.type.split(' ')[0] === 'integer') {
        return `<input type="number" id="${param.name}" placeholder="" value="" min="0" step="1">`;
      } else if (param.type.split(' ')[0] === 'boolean') {
        return `<input type="checkbox" id="${param.name}" value="">`;
      }
      return `<input type="text" id="${param.name}" placeholder="" value="">`;
    })()}
    </div>
  </label>`).join('');
  if (localStorage.getItem('__logprobsvz')) {
    try {
      state = JSON.parse(localStorage.getItem('__logprobsvz'));
    } catch (e) {
      logger.error(`Cannot parse state: ${e}`);
      logger.error(e);
    }
  }
  state.params = state.params || {};
  if (!state.params.api_url) {
    state.params.api_url = 'https://api.openai.com/v1/chat/completions';
  }
  Object.keys(state.params).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = state.params[key];
      } else if (el.type === 'text') {
        if (typeof state.params[key] === 'object') {
          el.value = JSON.stringify(state.params[key]);
        } else {
          el.value = state.params[key];
        }
      } else if (el.type === 'number') {
        el.value = state.params[key];
      } else if (el.tagName === 'SELECT') {
        el.value = state.params[key];
      } else if (el.tagName === 'TEXTAREA') {
        el.value = state.params[key];
      } else if (el.tagName === 'DIV') {
        el.innerHTML = state.params[key];
      }
    }
  });
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.type === 'checkbox') {
        state.params[input.id] = input.checked;
      } else if (input.type === 'number') {
        if (input.getAttribute('step') === '1') {
          state.params[input.id] = parseInt(input.value);
        } else {
          state.params[input.id] = parseFloat(input.value);
        }
      } else {
        try {
          state.params[input.id] = JSON.parse(input.value);
        } catch (e) {
          state.params[input.id] = input.value;
        }
      }
      localStorage.setItem('__logprobsvz', JSON.stringify(state));
    });
  });
});

document.getElementById('complete').addEventListener('click', async () => {
  state.params = state.params || {};
  complete(state, document.getElementById('logprobs-wrapper'), logger, document.getElementById('prompt').value);
});


document.getElementById('clear-config').addEventListener('click', async () => {
  localStorage.removeItem('__logprobsvz');
  state = {};
  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  });
});
