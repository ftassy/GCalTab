export interface Tab {
    active: boolean,
    height: number,
    highlighted: boolean,
    id: number,
    index: number,
    mailTab: boolean,
    status: string,
    title: string,
    type: string,
    url: string,
    width: number,
    windowId: number,
}

export interface Browser {
    tabs: {
        create: Function,
        update: Function,
        query: Function,
        sendMessage: Function
    },
    storage: {
        local: {
            get: Function,
            set: Function,
        },
        onChanged: {
            addListener: Function,
            removeListener: Function
        }
    },
    i18n: {
        getMessage: Function
    },
    runtime: {
        onMessage: {
            addListener: Function
        },
        sendMessage: Function
    }
}

export interface StoredDarkModeGCalTab {
    darkModeGCalTab: { oldValue: boolean, newValue: boolean } | boolean;
}

export interface DarkReaderApi {
    enable: Function,
    disable: Function,
    isEnabled: Function,
    setFetchMethod: Function
}