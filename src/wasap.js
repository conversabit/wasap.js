'use strict';

const RE_SELECTOR = /([.#]?[^\s#.]+)/;

const WHATSAPP_API_PROTOCOL = 'whatsapp://send';
const WHATSAPP_API_URL = 'https://api.whatsapp.com/api/send';

const defaults = {
  enableIf: /android|iphone|ipad/i,
  protocolIf: /android|iphone|ipad/i,
  uaString: window.navigator.userAgent,
  openCallback: null,
  elementCallback: null,
  newNodeSelector: 'a.whatsapp-link',
};

function checkIfCallback(value, config) {
  if (value instanceof RegExp) {
    return value.test(config.uaString);
  }

  if (typeof value === 'function') {
    return value();
  }

  return !!value;
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

function buildLink(config, baseURI) {
  const params = [];

  Object.keys(config).forEach(prop => {
    if (config[prop]) {
      params.push(`${prop}=${encodeURIComponent(config[prop])}`);
    }
  });

  return `${baseURI}${params.length ? `?${params.join('&')}` : ''}`;
}

function setupLink(node, newEl, config) {
  const baseURI = checkIfCallback(config.protocolIf, config)
    ? WHATSAPP_API_PROTOCOL
    : WHATSAPP_API_URL;

  const options = {
    text: node.dataset.whatsappMessage,
    phone: node.dataset.whatsapp,
  };

  if (newEl.tagName === 'A') {
    newEl.href = buildLink(options, baseURI);
  }

  if (typeof config.elementCallback === 'function') {
    config.elementCallback(node, params => {
      if (typeof params === 'string') {
        params = { text: params };
      }

      const url = buildLink(assign({}, options, params), baseURI);
      const open = config.openCallback || window.open;

      open(url);
    });
  }
}

function makeEl(config) {
  const parts = config.newNodeSelector
    .split(RE_SELECTOR)
    .filter(Boolean);

  const target = document.createElement(parts[0]);

  for (let i = 1; i < parts.length; i += 1) {
    if (parts[i]) {
      if (parts[i].charAt() === '.') {
        target.classList.add(parts[i].substr(1));
      }

      if (parts[i].charAt() === '#') {
        target.id = parts[i].substr(1);
      }
    }
  }

  return target;
}

function append(node, config) {
  const newEl = makeEl(config);
  const body = node.innerHTML;

  node.innerHTML = '';
  node.appendChild(newEl);

  newEl.innerHTML = body;

  setupLink(node, newEl, config);
}

function init(options) {
  const config = assign({}, defaults, options);
  const isEnabled = checkIfCallback(config.enableIf, config);

  if (isEnabled) {
    const matchedElements = document.querySelectorAll('[data-whatsapp]');

    for (let i = 0; i < matchedElements.length; i += 1) {
      append(matchedElements[i], config);
    }
  }
}

export default {
  init,
};
