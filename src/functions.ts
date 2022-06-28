import type { DarkReaderApi, StoredDarkModeGCalTab, Browser } from "./interfaces";

// Define a synonym for browser so that Typescript does not 
// panic.
//@ts-ignore
let browserApi: Browser = browser;

//@ts-ignore
let DarkReaderApi: DarkReaderApi = DarkReader;
    
/** Function that activates DarkReader.
* */
function activateDarkReader() {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable({
        brightness: 120,
        contrast: 90,
        sepia: 10,
    });
}

/** Function that inactivates DarkReader.
 * */
function inactivateDarkReader() {
    DarkReader.disable();
}

/** Function that retrieves darkModeGCalTab from local storage.
 * */
export async function retrieveLocalStorageValue(): Promise<StoredDarkModeGCalTab> {
    let gettingItem: StoredDarkModeGCalTab = await browserApi.storage.local.get("darkModeGCalTab");
    return gettingItem;
}

/** Function that enable or disable DarkReader */
export function switchDarkReader(darkMode: boolean) {
    if (darkMode) {
        activateDarkReader();
    }
    if (!darkMode) {
        inactivateDarkReader();
    }
}