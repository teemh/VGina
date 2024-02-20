import { setupIpcHandlers } from "./ipcHandlers.js";
import { setupAppLifecycle } from "./appLifecycle.js";
import { getBidsListeners } from "./bidListeners.js";
import { getTimerListeners } from "./timerListeners.js";
import { getSoundsListeners } from "./soundsListeners.js";
import { getItemDetailsListeners } from "./itemDetailsListeners.js";
import { generalListeners } from "./generalListeners.js";
import { ginaListeners } from "./ginaImportListeners.js";
import { getTrackerListeners } from "./ipcTrackerListeners.js";

ginaListeners();
generalListeners();
getItemDetailsListeners();
getSoundsListeners();
getTimerListeners();
getBidsListeners();
setupIpcHandlers();
setupAppLifecycle();
getTrackerListeners();