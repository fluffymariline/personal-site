class FSWindow extends HTMLElement {
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
  /** @type {number} */
  static windowsOpened = 0;
  /** @type {FSWindow | null} */
  static currentWindow = null;
  /** @type {FSWindow[]} */
  static minimizedWindows = [];
  /** @type {boolean} */
  minimized = false;
  /** @type {boolean} */
  maximized = false;
  /** @type {boolean} */
  resizing = false;
  /** @type {boolean} */
  moving = false;
  /** @type {number} */
  resize_side_x = 0;
  /** @type {number} */
  resize_side_y = 0;
  /** @type {number} */
  x = 0;
  /** @type {number} */
  y = 0;
  /** @type {number | null} */
  width = null;
  /** @type {number | null} */
  height = null;
  /** @type {boolean} */
  open = true;
  /** @type {any} */
  data = {};
  /** @type {any} */
  origData = {};
  /** @type {TouchList | null} */
  touches = null;
  /** @type {boolean} */
  initialStartup = true;
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
    FSWindow.currentWindow = this;
  }
  /** @param {MouseEvent} e */
  touchStartHandler(e) {
    this.touches = e.touches;
    this.resizing = true;
    const X = e.touches[0].pageX - this.offsetLeft;
    const Y = e.touches[0].pageY - this.offsetTop;
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
    FSWindow.currentWindow = this;
  }
  /**
   *
   * @param {TouchEvent} e
   */
  touchMoveHandler(e) {
    if (this.touches.length == 0) {
      this.touches = e.touches;
      return;
    }
    const prevX = this.touches[0].clientX;
    const prevY = this.touches[0].clientY;
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;
    const deltaX = curX - prevX;
    const deltaY = curY - prevY;
    this.touches = e.targetTouches;
    if (this.moving) {
      this.width = this.offsetWidth;
      this.height = this.offsetHeight;
      this.x = this.offsetLeft;
      this.y = this.offsetTop;
      if (this.width < e.targetTouches[0].clientX) {
        this.x = e.targetTouches[0].clientX - this.width / 2.0;
        this.style.left = `${this.x}px`;
      }
      this.x += deltaX;
      this.y += deltaY;
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
      const x_side = this.resize_side_x * deltaX;
      const y_side = this.resize_side_y * deltaY;
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
    }
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
  open() {
    const maxWidth = document.offsetWidth;
    const maxHeight = document.offsetHeight;
    const windowWidth = this.width;
    const windowHeight = this.height;
    let maxX = maxWidth - windowWidth;
    let maxY = maxHeight - windowHeight;
    if (maxX < 0) {
      maxX = 0;
    }
    if (maxY < 0) {
      maxY = 0;
    }
    const em = parseFloat(getComputedStyle(this).fontSize);
    const spacing = em * 2.0;
    let xPositions = Math.floor(maxX / spacing);
    let yPositions = Math.floor(maxY / spacing);
    const xPosition = FSWindow.windowsOpened % xPositions;
    const yPosition = FSWindow.windowsOpened % yPositions;
    FSWindow.windowsOpened += 1;
    if (xPosition == 0 && yPosition == 0 && FSWindow.windowsOpened > 65535) {
      FSWindow.windowsOpened = 0;
    }
    this.setAttribute("x", xPosition * spacing);
    this.setAttribute("y", yPosition * spacing);
    this.setAttribute("open", "true");
    this.setAttribute("minimized", "false");
  }
  connectedCallback() {
    this.origData = {
      maximized: this.getAttribute("maximized"),
      minimized: this.getAttribute("minimized"),
      x: this.getAttribute("x"),
      y: this.getAttribute("y"),
      width: this.getAttribute("width"),
      height: this.getAttribute("height"),
    };
    const em = parseFloat(getComputedStyle(this).fontSize);
    if (this.origData.width === null) {
      this.origData.width = em * 14;
    }
    if (this.origData.height === null) {
      this.origData.height = em * 10;
    }
    if (this.origData.maximized === null) {
      this.origData.maximized = "false";
    }
    if (this.origData.minimized === null) {
      this.origData.minimized = "false";
    }

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
    this.shadowRoot.querySelector(".window-resize-handle").addEventListener(
      "touchstart",
      (function (self) {
        return function (e) {
          self.touches = e.touches;
          self.moving = true;
          FSWindow.currentWindow = self;
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
          FSWindow.currentWindow = this;
        };
      })(this),
    );
    this.shadowRoot.querySelector(".titlebar").addEventListener(
      "touchstart",
      (function (self) {
        return function (e) {
          self.touches = e.touches;
          self.moving = true;
          FSWindow.currentWindow = self;
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
    this.shadowRoot.querySelector(".reset-btn").addEventListener(
      "click",
      (function (self) {
        return function (e) {
          self.data = structuredClone(self.origData);
          const dataKeys = Object.keys(self.data);
          for (let i = 0; i < dataKeys.length; i++) {
            self.setAttribute(dataKeys[i], self.data[dataKeys[i]]);
          }
        };
      })(this),
    );
    this.initialStartup = false;
    if (this.minimized || !this.open) {
      this.shadowRoot
        .querySelector(".window-resize-handle")
        .classList.add("window-already-minimized");
    } else {
      this.shadowRoot
        .querySelector(".window-resize-handle")
        .classList.add("window-already-open");
    }
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
      case "minimized":
        {
          this.data["minimized"] = newValue;
          if (newValue.toLowerCase() == "true") {
            this.minimized = true;
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.remove("window-already-minimized");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.add("window-minimized");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.remove("window-unminimized");

            FSWindow.minimizedWindows.push(this);
          } else {
            this.minimized = false;
            FSWindow.minimizedWindows.splice(
              FSWindow.minimizedWindows.indexOf(this),
              1,
            );
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.remove("window-minimized");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.add("window-unminimized");
          }
          this.shadowRoot
            .querySelector(".window-resize-handle")
            .classList.remove("window-already-open");
          this.shadowRoot
            .querySelector(".window-resize-handle")
            .classList.remove("window-already-minimized");
          FSMinimizedWindow.minimizedWindows[this]?.update();
          if (typeof this.id === "string") {
            window.localStorage.setItem(
              `window-data-${this.id}`,
              JSON.stringify(this.data),
            );
          }
        }
        break;
      case "open": {
        const will_be_open = newValue == "true";
        const was_open = this.open;
        if (will_be_open != was_open) {
          this.shadowRoot
            .querySelector(".window-resize-handle")
            .classList.remove("window-already-open");
          this.shadowRoot
            .querySelector(".window-resize-handle")
            .classList.remove("window-already-minimized");
          if (will_be_open) {
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.add("window-open");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.remove("window-close");
          } else {
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.remove("window-open");
            this.shadowRoot
              .querySelector(".window-resize-handle")
              .classList.add("window-close");
          }
        }
        this.open = will_be_open;
        this.data["open"] = this.open;
        if (typeof this.id === "string") {
          window.localStorage.setItem(
            `window-data-${this.id}`,
            JSON.stringify(this.data),
          );
        }
        FSMinimizedWindow.minimizedWindows[this]?.update();
      }
    }
  }
}
class FSMinimizedWindow extends HTMLElement {
  static observedAttributes = ["window-id"];
  static minimizedWindows = {};
  /** @type {FSWindow | null} */
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
          self.window.setAttribute(
            "minimized",
            self.window.minimized ? "false" : "true",
          );
          self.update();
        };
      })(this),
    );
    this.update();
    if (this.window.open) {
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.add("panel-window-already-open");
    } else {
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.add("panel-window-already-closed");
    }
  }
  update() {
    this.shadowRoot
      .querySelector(".minimized-window")
      .classList.remove("panel-window-already-closed");
    this.shadowRoot
      .querySelector(".minimized-window")
      .classList.remove("panel-window-already-open");
    this.shadowRoot.querySelector(".window-title").innerText =
      this.window.getAttribute("title");
    if (this.window.minimized) {
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.add("window-minimized");
    } else {
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.remove("window-minimized");
    }
    if (this.window.open) {
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.remove("panel-window-close");
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.add("panel-window-open");
    } else {
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.remove("panel-window-open");
      this.shadowRoot
        .querySelector(".minimized-window")
        .classList.add("panel-window-close");
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "window-id": {
        this.window = document.getElementById(newValue);
        FSMinimizedWindow.minimizedWindows[this.window] = this;
      }
    }
  }
}
window.customElements.define("fs-window", FSWindow);

window.customElements.define("fs-minimized-window", FSMinimizedWindow);

document.addEventListener("mousemove", function (e) {
  if (FSWindow.currentWindow !== null) {
    FSWindow.currentWindow.mouseMoveHandler(e);
  }
});
document.addEventListener("touchmove", function (e) {
  if (FSWindow.currentWindow !== null) {
    FSWindow.currentWindow.touchMoveHandler(e);
  }
});

document.addEventListener("mouseup", function (e) {
  if (FSWindow.currentWindow !== null) {
    FSWindow.currentWindow.resizing = false;
    FSWindow.currentWindow.moving = false;
  }
});
