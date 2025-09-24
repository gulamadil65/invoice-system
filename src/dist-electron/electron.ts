import { app, BrowserWindow } from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // Dev mode → runs Next.js server
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    // Production → load from "out" folder
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
