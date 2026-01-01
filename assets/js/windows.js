class Window extends HTMLElement {
  static observedAttributes = [
    "title",
    "close-enabled",
    "maximized",
    "minimized",
    "x",
    "y",
    "width",
    "height",
    "open",
  ];
  static windowsOpened = 0;
  static currentWindow = null;
  /** @type {Window[]} */
  static minimizedWindows = [];
  minimized = false;
  maximized = false;
  resizing = false;
  moving = false;
  resize_side_x = 0;
  resize_side_y = 0;
  x = 0;
  y = 0;
  width = null;
  height = null;
  open = true;
  data = {};
  constructor() {
    super();
  }
  /** @param {MouseEvent} e */
  mouseDownHandler(e) {
    this.resizing = true;
    const X = e.offsetX;
    const Y = e.offsetY;
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;
    const cornerSize = parseFloat(getComputedStyle(this).fontSize) * 0.5;
    left = X < cornerSize;
    right = X >= width - cornerSize;
    top = Y < cornerSize;
    bottom = Y >= height - cornerSize;
    if (top && bottom) {
      top = false;
    }
    if (left && right) {
      left = false;
    }
    this.width = this.offsetWidth;
    this.height = this.offsetHeight;
    this.x = this.offsetLeft;
    this.y = this.offsetTop;
    this.resize_side_x = left ? -1 : right ? 1 : 0;
    this.resize_side_y = top ? -1 : bottom ? 1 : 0;
    Window.currentWindow = this;
  }
  /** @param {MouseEvent} e */
  mouseMoveHandler(e) {
    /** @type {HTMLElement} */
    const rootNode = this;
    if (this.moving) {
      this.width = this.offsetWidth;
      this.height = this.offsetHeight;
      this.x = this.offsetLeft;
      this.y = this.offsetTop;
      if (this.width < e.offsetX) {
        this.x = e.offsetX - this.width / 2.0;
        this.style.left = `${this.x}px`;
      }
      this.x += e.movementX;
      this.y += e.movementY;
      this.style.left = `${this.x}px`;
      this.style.top = `${this.y}px`;
      this.setAttribute("x", this.x);
      this.setAttribute("y", this.y);
      if (e.pageY <= 0) {
        this.setAttribute("maximized", "true");
      } else {
        this.setAttribute("maximized", "false");
      }
    } else if (this.resizing) {
      const x_side = this.resize_side_x * e.movementX;
      const y_side = this.resize_side_y * e.movementY;
      if (this.resize_side_x < 0) {
        this.x -= x_side;
        this.width += x_side;
        rootNode.style.left = `${this.x}px`;
        rootNode.style.width = `${this.width}px`;
      } else if (this.resize_side_x > 0) {
        this.width += x_side;
        rootNode.style.width = `${this.width}px`;
      }
      if (this.resize_side_y < 0) {
        this.y -= y_side;
        this.height += y_side;
        rootNode.style.top = `${this.y}px`;
        rootNode.style.height = `${this.height}px`;
      } else if (this.resize_side_y > 0) {
        this.height += y_side;
        rootNode.style.height = `${this.height}px`;
      }
      this.setAttribute("x", this.x);
      this.setAttribute("y", this.y);
      this.setAttribute("width", this.width);
      this.setAttribute("height", this.height);
    } else {
      const X = e.offsetX;
      const Y = e.offsetY;
      const width = this.offsetWidth;
      const height = this.offsetHeight;
      let left = false;
      let right = false;
      let top = false;
      let bottom = false;
      const cornerSize = parseFloat(getComputedStyle(this).fontSize) * 0.5;
      left = X < cornerSize;
      right = X >= width - cornerSize;
      top = Y < cornerSize;
      bottom = Y >= height - cornerSize;
      if (top && bottom) {
        top = false;
      }
      if (left && right) {
        left = false;
      }
      this.width = this.offsetWidth;
      this.height = this.offsetHeight;
      this.x = this.offsetLeft;
      this.y = this.offsetTop;
      const resize_side_x = left ? -1 : right ? 1 : 0;
      const resize_side_y = top ? -1 : bottom ? 1 : 0;
      const resizeHandle = this.shadowRoot.querySelector(
        ".window-resize-handle",
      );
      const xChar = resize_side_x === 0 ? "" : resize_side_x < 0 ? "w" : "e";
      const yChar = resize_side_y === 0 ? "" : resize_side_y < 0 ? "n" : "s";
      resizeHandle.style.cursor = `${yChar}${xChar}-resize`;
    }
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const templateContent = document.querySelector("#window-template").content;
    this.shadowRoot.appendChild(document.importNode(templateContent, true));
    if (typeof this.id === "string") {
      const data = window.localStorage.getItem(`window-data-${this.id}`);
      if (data !== null) {
        const parsed = JSON.parse(data);
        const parsedKeys = Object.keys(parsed);
        for (let i = 0; i < parsedKeys.length; i++) {
          this.setAttribute(parsedKeys[i], parsed[parsedKeys[i]]);
        }
        this.data = parsed;
      }
    }
    for (let i = 0; i < this.attributes.length; i++) {
      this.attributeChangedCallback(
        this.attributes.item(i).name,
        "",
        this.attributes.item(i).value,
      );
    }
    const root = this.shadowRoot.querySelector(".window-resize-handle");
    root.addEventListener(
      "mousedown",
      (function (self) {
        return function (e) {
          self.mouseDownHandler(e);
        };
      })(this),
    );
    root.addEventListener("mouseup", function (e) {
      this.resizing = false;
    });
    this.shadowRoot.querySelector(".titlebar").addEventListener(
      "mousedown",
      (function (self) {
        return function (e) {
          self.moving = true;
          Window.currentWindow = this;
        };
      })(this),
    );
    this.shadowRoot.querySelector(".titlebar").addEventListener(
      "dblclick",
      (function (self) {
        return function (e) {
          self.setAttribute("maximized", this.maximized ? "false" : "true");
        };
      })(this),
    );
    this.shadowRoot.querySelector(".max-btn").addEventListener(
      "click",
      (function (self) {
        return function (e) {
          self.setAttribute("maximized", self.maximized ? "false" : "true");
        };
      })(this),
    );
    this.shadowRoot.querySelector(".min-btn").addEventListener(
      "click",
      (function (self) {
        return function (e) {
          self.setAttribute("minimized", "true");
        };
      })(this),
    );
    this.shadowRoot.querySelector(".close-btn").addEventListener(
      "click",
      (function (self) {
        return function (e) {
          self.setAttribute("open", "false");
        };
      })(this),
    );
  }
  disconnectedCallback() {}
  connectedMoveCallback() {
    console.log("Custom element moved with moveBefore()");
  }

  adoptedCallback() {}

  /** @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        {
          this.shadowRoot.querySelector(".titlebar-title").innerText = newValue;
        }
        break;
      case "close-enabled":
        {
          /** @type {HTMLButtonElement} */
          const btn = this.shadowRoot.querySelector(".close-btn");
          btn.disabled = newValue.toLowerCase() == "true" ? false : true;
        }
        break;
      case "x":
        {
          this.data["x"] = newValue;
          this.x = parseFloat(newValue);
          this.style.left = `${this.x}px`;
          if (typeof this.id === "string") {
            window.localStorage.setItem(
              `window-data-${this.id}`,
              JSON.stringify(this.data),
            );
          }
        }
        break;
      case "y":
        {
          this.data["y"] = newValue;
          this.y = parseFloat(newValue);
          this.style.top = `${this.y}px`;
          if (typeof this.id === "string") {
            window.localStorage.setItem(
              `window-data-${this.id}`,
              JSON.stringify(this.data),
            );
          }
        }
        break;
      case "width":
        {
          this.data["width"] = newValue;
          this.width = parseFloat(newValue);
          this.style.width = `${this.width}px`;
          if (typeof this.id === "string") {
            window.localStorage.setItem(
              `window-data-${this.id}`,
              JSON.stringify(this.data),
            );
          }
        }
        break;
      case "height":
        {
          this.data["height"] = newValue;
          this.height = parseFloat(newValue);
          this.style.height = `${this.height}px`;
          if (typeof this.id === "string") {
            window.localStorage.setItem(
              `window-data-${this.id}`,
              JSON.stringify(this.data),
            );
          }
        }
        break;
      case "maximized":
        {
          this.data["maximized"] = newValue;
          if (newValue.toLowerCase() == "true") {
            this.maximized = true;
            this.classList.add("maximized");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.add("maximized");
          } else {
            this.maximized = false;
            this.classList.remove("maximized");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.remove("maximized");
          }
          if (typeof this.id === "string") {
            window.localStorage.setItem(
              `window-data-${this.id}`,
              JSON.stringify(this.data),
            );
          }
        }
        break;
      case "minimized": {
        this.data["minimized"] = newValue;
        if (newValue.toLowerCase() == "true") {
          this.minimized = true;
          this.classList.add("hidden");
          Window.minimizedWindows.push(this);
        } else {
          this.minimized = false;
          Window.minimizedWindows.splice(
            Window.minimizedWindows.indexOf(this),
            1,
          );
          this.classList.remove("hidden");
        }
        MinimizedWindow.minimizedWindows[this]?.update();
        if (typeof this.id === "string") {
          window.localStorage.setItem(
            `window-data-${this.id}`,
            JSON.stringify(this.data),
          );
        }
      }
    }
  }
}
class MinimizedWindow extends HTMLElement {
  static observedAttributes = ["window-id"];
  static minimizedWindows = {};
  window = null;
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    const template = document.querySelector("#minimized-window").content;
    this.shadowRoot.appendChild(document.importNode(template, true));
    const minimizedWindow = this.shadowRoot.querySelector(".minimized-window");
    minimizedWindow.addEventListener(
      "click",
      (function (self) {
        return function (e) {
          self.window.setAttribute("minimized", "false");
          self.update();
        };
      })(this),
    );
    this.update();
  }
  update() {
    this.shadowRoot.querySelector(".window-title").innerText =
      this.window.getAttribute("title");
    if (this.window.minimized) {
      this.classList.remove("hidden");
    } else {
      this.classList.add("hidden");
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "window-id": {
        this.window = document.getElementById(newValue);
        MinimizedWindow.minimizedWindows[this.window] = this;
      }
    }
  }
}
window.customElements.define("fs-window", Window);

window.customElements.define("fs-minimized-window", MinimizedWindow);

document.addEventListener("mousemove", function (e) {
  if (Window.currentWindow !== null) {
    Window.currentWindow.mouseMoveHandler(e);
  }
});

document.addEventListener("mouseup", function (e) {
  if (Window.currentWindow !== null) {
    Window.currentWindow.resizing = false;
    Window.currentWindow.moving = false;
  }
});
