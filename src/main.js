'use strict';

const defaults = {
  triggerIf: /android|ios|ipad/i,
  uaString: window.navigator.userAgent,
  mode: 'append',
  newNodeSelector: 'a',
  whatsappApiProtocol: 'whatsapp://send',
  whatsappApiUrl: 'https://api.whatsapp.com/api/send',
  promptMessage: 'What do you want to say?',
  elementCallback: null,
};

function checkIfSupported(config) {
  if (config.triggerIf instanceof RegExp) {
    return config.triggerIf.test(config.uaString);
  }

  if (typeof config.triggerIf === 'function') {
    return config.triggerIf();
  }

  return !!config.triggerIf;
}

function assign(target) {
  for (let i = 1; i < arguments.length; i += 1) {
    if (arguments[i]) {
      Object.keys(arguments[i]).forEach(key => {
        target[key] = arguments[i][key];
      });
    }
  }

  return target;
}

function setupLink(node, newEl, config, isSupported) {
  let fixedLink = isSupported
    ? config.whatsappApiProtocol
    : config.whatsappApiUrl;

  if (node.dataset.whatsapp) {
    fixedLink += `?phone=${node.dataset.whatsapp}`;
  }

  if (newEl.tagName === 'A') {
    newEl.href = fixedLink;
  }

  newEl.addEventListener('click', e => {
    if (!isSupported) {
      e.preventDefault();
    }

    const msg = (typeof node.dataset.whatsappPrompt !== 'undefined'
      ? prompt(node.dataset.whatsappPrompt || config.promptMessage) // eslint-disable-line no-alert
      : null) || node.dataset.whatsappMessage;

    const url = msg
      ? `${fixedLink}${fixedLink.indexOf('?') === -1 ? '?' : '&'}text=${msg}`
      : fixedLink;

    if (newEl.tagName === 'A') {
      newEl.href = url;
    }

    if (!isSupported) {
      window.open(url);
    }
  });
}

function makeEl(config) {
  // TODO: allow a#foo.bar syntax as shortcut
  const target = document.createElement(config.newNodeSelector);

  return target;
}

function replace(node, config, isSupported) {
  const newEl = makeEl(config);
  const body = node.innerHTML;

  node.parentNode.insertBefore(newEl, node);
  node.parentNode.removeChild(node);

  newEl.innerHTML = body;

  setupLink(node, newEl, config, isSupported);
}

function append(node, config, isSupported) {
  const newEl = makeEl(config);
  const body = node.innerHTML;

  node.innerHTML = '';
  node.appendChild(newEl);

  newEl.innerHTML = body;

  setupLink(node, newEl, config, isSupported);
}

function init(options) {
  const config = assign({}, defaults, options);

  let callback;

  if (config.mode === 'append') {
    callback = append;
  } else if (config.mode === 'replace') {
    callback = replace;
  } else {
    throw new Error(`Unsupported mode '${config.mode}'`);
  }

  const isSupported = checkIfSupported(config);
  const matchedElements = document.querySelectorAll('[data-whatsapp]');

  for (let i = 0; i < matchedElements.length; i += 1) {
    if (typeof config.elementCallback === 'function') {
      config.elementCallback(matchedElements[i]);
    }

    callback(matchedElements[i], config, isSupported);
  }
}

export default {
  init,
};
