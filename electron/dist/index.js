"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 700
    });
    win.loadFile('index.html');
};
//# sourceMappingURL=index.js.map