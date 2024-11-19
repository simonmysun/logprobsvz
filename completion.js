function complete(state, resultDom, logger, prompt) {
  const abortController = new AbortController();
  const completionDom = document.createElement('div');
  completionDom.classList.add('completion');
  resultDom.insertBefore(completionDom, resultDom.firstChild);
  const payload = {
    messages: [
      {
        role: 'user',
        content: prompt,
      }
    ],
  };
  for (const param in state.params) {
    if (param !== 'api_url' && param !== 'api_key') {
      if (state.params[param] !== '' && state.params[param] !== null && state.params[param] !== undefined && state.params[param] !== NaN)
        payload[param] = state.params[param];
    }
  }
  fetch(`${state.params.api_url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.params.api_key} `
    },
    body: JSON.stringify(payload),
    signal: abortController.signal,
  }).then((res) => {
    if (payload.stream !== true) {
      res.json().then(content => {
        if (content.choices.length > 0 && content.choices[0].finish_reason === 'stop') {
          if (content.choices[0].logprobs) {
            for (const token of content.choices[0].logprobs.content) {
              completionDom.appendChild(constructTokenDomWithLogprobs(token));
            }
          } else {
            const tokenDom = document.createElement('span');
            tokenDom.classList.add('token');
            tokenDom.innerText = content.choices[0].message.content;
            completionDom.appendChild(tokenDom);
          }
        } else {
          if (content.choices.length <= 0) {
            logger.error(`No completion detected: ${JSON.stringify(content, null, 2)}`);
          } else if (content.choices[0].finish_reason !== 'stop') {
            logger.error(`Completion finished with reason: ${content.choices[0].finish_reason}: ${JSON.stringify(content, null, 2)}`);
          }
        }
        logger.info(`success. usage{prompt_tokens=${content.usage.prompt_tokens},completion_tokens=${content.usage.completion_tokens},total_tokens=${content.usage.total_tokens}}`);
      });
    } else {
      const decoder = new TextDecoder();
      const reader = res.body.getReader();
      let unprocessedParts = '';
      reader.read().then(function processResult({ done, value }) {
        const lines = done ? unprocessedParts.split('\n') : (unprocessedParts + decoder.decode(value)).split('\n');
        unprocessedParts = lines.pop();
        for (const line of lines) {
          if (line.length === 0 || line === 'data: [DONE]') {
            continue;
          }
          const content = JSON.parse(line.replace('data: ', ''));
          if (content.choices.length > 0 && content.choices[0].finish_reason !== 'stop') {
            if (content.choices[0].logprobs) {
              for (const token of content.choices[0].logprobs.content) {
                completionDom.appendChild(constructTokenDomWithLogprobs(token));
              }
            } else {
              const tokenDom = document.createElement('span');
              tokenDom.classList.add('token');
              tokenDom.innerText = content.choices[0].delta.content;
              completionDom.appendChild(tokenDom);
            }
          }
          if (content.usage) {
            logger.info(`success. usage{prompt_tokens=${content.usage.prompt_tokens},completion_tokens=${content.usage.completion_tokens},total_tokens=${content.usage.total_tokens}}`);
          }
        }
        return done ? undefined : reader.read().then(processResult);
      });
    }
  });
}

function constructTokenDomWithLogprobs(token) {
  const tokenDom = document.createElement('span');
  tokenDom.classList.add('token');
  tokenDom.classList.add('token-with-logprobs');
  tokenDom.innerText = token.token.replaceAll('\n', '↵\n').replaceAll(' ', '␣').replaceAll('\t', '⇥');
  tokenDom.setAttribute('logprob', token.logprob);
  tokenDom.style.backgroundPositionY = `${100 - Math.exp(token.logprob) * 100}%`;
  logprobsDom = document.createElement('div');
  logprobsDom.classList.add('logprobs');
  logprobsDom.innerHTML = `
    <table>
      ${token.top_logprobs.map((logprob_token) => `
        <tr>
          <td>${logprob_token.token.replaceAll('\n', '↵\n').replaceAll(' ', '␣').replaceAll('\t', '⇥')}</td>
          <td style="background: linear-gradient(to right, #efe3af ${Math.exp(logprob_token.logprob) * 100}%,#ffffff ${Math.exp(logprob_token.logprob) * 100}%);">${logprob_token.logprob}</td>
        </tr>
      </div>`).join('')}
    </table>`;
  tokenDom.appendChild(logprobsDom);
  return tokenDom;
}