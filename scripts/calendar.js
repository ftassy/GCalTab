/******************************************************/
/* Initiliazation sequence */
/******************************************************/

/* Get head document. Script tags will be added there. */
let head = document.getElementsByTagName("head")[0];

/* Append DarkReader script to the page. Once appended, 
depending on the value in local sotrage, it will 
trigger or not the DarkReader activation. */
loadScript("https://unpkg.com/darkreader")
    .then(() => {
        let gettingItem = browser.storage.local.get("darkModeGCalTab");
        gettingItem.then(onGot, onError);
    })
    .catch(() => {
        console.error("DarkReader script loading failed.");
    });

/******************************************************/
/* Function definitions */
/******************************************************/

/** Function that load a remote library and returns a promise
 * Source: https://stackoverflow.com/a/53744331
 * param: a string representing the url (local or remote) to load
 * */
function loadScript(scriptUrl) {
    const script = document.createElement("script");
    script.src = scriptUrl;
    document.body.appendChild(script);

    return new Promise((res, rej) => {
        script.onload = function () {
            res();
        };
        script.onerror = function () {
            rej();
        };
    });
}

/** Function that append a script tag activating DarkReader.
 * Requires DarkReader to be part of the page already.
 * */
function activateDarkReader() {
    // Remove existing node
    if (document.getElementById("GCalTab") !== null) {
        document.getElementById("GCalTab").remove();
    }

    let code = `
    DarkReader.enable({
        brightness: 120,
        contrast: 90,
        sepia: 10,
      });
      `;
    var scriptActivate = document.createElement("script");
    scriptActivate.type = "text/javascript";
    scriptActivate.id = "GCalTab";
    scriptActivate.appendChild(document.createTextNode(code));
    if (head) {
        head.appendChild(scriptActivate);
    }
    console.log("DarkReader enabled.");
}

/** Function that append a script tag activating DarkReader.
 * Requires DarkReader to be part of the page already.
 * */
function inactivateDarkReader() {
    // Remove existing node
    if (document.getElementById("GCalTab") !== null) {
        document.getElementById("GCalTab").remove();
    }

    let code = `
      DarkReader.disable();
      `;
    var scriptInactivate = document.createElement("script");
    scriptInactivate.type = "text/javascript";
    scriptInactivate.id = "GCalTab";
    scriptInactivate.appendChild(document.createTextNode(code));
    if (head) {
        head.appendChild(scriptInactivate);
    }
    console.log("DarkReader disabled.");
}

/** Function that gets dark mode value in local storage.
 * Called if local storage value retrieve succeeded.
 * */
function onGot(item) {
    browser.storage.onChanged.addListener(onGot);
    for (let key in item) {
        if (key === "darkModeGCalTab") {
            let darkMode = null;
            item[key].newValue === undefined ? (darkMode = item[key]) : (darkMode = item[key].newValue);
            if (darkMode) {
                activateDarkReader();
            }
            if (!darkMode) {
                inactivateDarkReader();
            }
        }
    }
}

/** Function that log error in console.
 * Called if local storage value retrieve failed.
 * */
function onError(error) {
    console.log(`Error: ${error}`);
}