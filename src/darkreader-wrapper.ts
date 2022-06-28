import DarkReader from "darkreader";
import type { Browser, StoredDarkModeGCalTab } from "./interfaces";
import { switchDarkReader, retrieveLocalStorageValue } from "./functions";

export default DarkReader;

// Define a synonym for browser so that Typescript does not 
// panic.
//@ts-ignore
let browserApi: Browser = browser;

/** Initialize DarkReader as per local storage value */
retrieveLocalStorageValue().then(storedDarkMode => {
    if (typeof storedDarkMode.darkModeGCalTab === "boolean") {
        switchDarkReader(storedDarkMode.darkModeGCalTab);
    }
});

/** Listen to localStorage change */
browserApi.storage.onChanged.addListener(onStoredDarkModeGCalTabChanged);

/** Function that gets dark mode value in local storage.
 * Called if local storage value retrieve succeeded.
 * */
function onStoredDarkModeGCalTabChanged(item: StoredDarkModeGCalTab) {
    let darkMode: boolean = typeof item.darkModeGCalTab === "object" ? item.darkModeGCalTab.newValue : item.darkModeGCalTab;
    switchDarkReader(darkMode);
}
