wasap.js
====

### Installation

First, add the data-whatsapp attribute to the nodes you want to be clickable:

```
<span data-whatsapp="5210000000000">Reach me via WhatsApp!</span>
```

Then include the JS file and initialize it.

```
wasap.init();
```

### API

**➡ `enableIf`** (regex|function|boolean, defaults to `/android|iphone|ipad/i`)

Platforms supported currently, if regex, matches against window.navigator.userAgent. When used as a function it can be more modular, and the boolean disables or enables for every platform.

**➡ `protocolIf`** (regex|function|boolean, defaults to `/android|iphone|ipad/i`)

Todo

**➡ `openCallback`** (function, defaults to `window.open`)

If `elementCallback` enabled, you could prevent a click from triggering to do a custom action. After this custom behaviour, this function defines how the user will be redirected.

**➡ `elementCallback`** (function)

Callback made to each of the elements found, so you can customize its behaviour (click callbacks, other events, modify the node's content, etc.)

**➡ `newNodeSelector`** (string, defaults to a)

The element that will be added (either replacing or appending the target element), which tag name should it have? If a, it will create the href attribute. In the future it will support IDs and classes.
