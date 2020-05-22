/******************************************************/
/* Initiliazation sequence */
/******************************************************/
// Retrieve buttons
let gCalButton = document.getElementById("gcal");
let modeSwitcher = document.getElementById("switch");
let signOutButton = document.getElementById("signout");

// Initialize the switch button per local storage value
let gettingItem = browser.storage.local.get("darkModeGCalTab");
gettingItem.then(onGot, onError);

// Initialize number of active tabs
let nbTabs = null;

// Add click listeners to page
gCalButton.addEventListener("click", openGoogleCalendar);
modeSwitcher.addEventListener("click", switchMode);
signOutButton.addEventListener("click", disconnect);

keepTabUnique();

/******************************************************/
/* Function definitions */
/******************************************************/

/** Function that opens a Google Calendar tab.
 * Triggered when "Open" button in clicked
 * */
function openOrUpdateTab(url) {
    tabProperties = {
        active: true,
        url: url,
    };

    if (nbTabs === null) {
        console.log(nbTabs);
        browser.tabs.create(tabProperties);
        keepTabUnique();
    } else {
        console.log(nbTabs);
        browser.tabs.update(nbTabs, tabProperties);
        keepTabUnique();
    }
}

function openGoogleCalendar() {
    openOrUpdateTab("https://www.google.com/calendar");
}

function disconnect() {
    openOrUpdateTab("https://accounts.google.com/Logout?continue=https://calendar.google.com/");
}

//***

function keepTabUnique() {
    const urlGCalTab = [
        "https://calendar.google.com/*",
        "https://accounts.google.com/*",
        "https://google.com/calendar*"
    ];
    
    let querying = browser.tabs.query({url: urlGCalTab, currentWindow: true});
    querying.then(retrieveGCalTab, onError);
}


function retrieveGCalTab(tabs) {
    if (tabs.length >= 1) {
        for (let tab of tabs) {
            nbTabs = tab.id;
          }
    } else {
        return nbTabs = null;
    }
}
  
function onError(error) {
    console.log(`Error: ${error}`);
}

//***

/** Function that synchronizes the switch button with
 * the dark mode value in local storage.
 * Called if local storage value retrieve succeeded.
 * */
function onGot(item) {
    for (let key in item) {
        if (key === "darkModeGCalTab") {
            let darkMode = item[key];
            modeSwitcher.checked = darkMode;
            if (darkMode) {
                setDarkMode();
            }
            if (!darkMode) {
                setLightMode();
            }
        }
    }
}

/** Function that log error in console.
 * Called if local storage value retrieve succeeded.
 * */
function onError(error) {
    console.log(`Error: ${error}`);
}

/** Function triggered when "Dark" button is switched on/off
 * */
function switchMode() {
    let buttonValue = document.getElementById("switch").checked ? true : false;
    browser.storage.local.set({
        darkModeGCalTab: buttonValue,
    });
    if (buttonValue) {
        setDarkMode();
    }
    if (!buttonValue) {
        setLightMode();
    }
}

/** Function that sets the popup to its light mode
 * */
function setLightMode() {
    document.body.style.setProperty("color", "#323232");
    document.body.style.setProperty("background-color", "#dcdcdc");
}

/** Function that sets the popup to its dark mode
 * */
function setDarkMode() {
    document.body.style.setProperty("color", "#dcdcdc");
    document.body.style.setProperty("background-color", "#323232");
}