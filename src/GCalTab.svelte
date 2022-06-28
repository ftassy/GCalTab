<script lang="ts">
	import { onMount } from "svelte";

	import { switchDarkReader, retrieveLocalStorageValue } from "./functions";
	import RoundButton from "./RoundButton.svelte";
	import type { Browser, Tab } from "./interfaces";

	// Define a synonym for browser so that Typescript does not 
	// panic.
	//@ts-ignore
	let browserApi: Browser = browser;

	let gCalButtonLabel: string = "Open";
	let modeSwitcherLabel: string = "Dark";

	let isDarkMode: boolean = true;

	// Initialize id of active Google Calendar tab
	let tabsId: Number | null = null;

	onMount(async () => {
		// UI internationalization 
		gCalButtonLabel = browserApi.i18n.getMessage("gCalButton");
		modeSwitcherLabel = browserApi.i18n.getMessage("modeSwitcher");

		/** Initialize DarkReader as per local storage value */
		retrieveLocalStorageValue().then(storedDarkMode => {
			if (typeof storedDarkMode.darkModeGCalTab === "boolean") {
				isDarkMode = storedDarkMode.darkModeGCalTab
			} else {
				isDarkMode = false;
			}
			switchDarkReader(isDarkMode);
		});

		queryGoogleCalendarTabId();
	});

	/** Function that opens a Thunderbird tab.
	 * */
	async function openOrUpdateTab(url: string) {
		const tabProperties = {
			active: true,
			url: url,
		};

		queryGoogleCalendarTabId();

		if (tabsId === null) {
			let newTab: Tab = await browserApi.tabs.create(tabProperties);
			tabsId = newTab.id;
		} else {
			browserApi.tabs.update(tabsId, tabProperties);
		}
	}

	/** Wraps openOrUpdateTab for opening the tab */
	function openGoogleCalendar() {
		openOrUpdateTab("https://www.google.com/calendar");
	}

	/** Wraps openOrUpdateTab for connecting to a new
	 * account
	 * */
	function addAccount() {
		openOrUpdateTab("https://accounts.google.com/AddSession?sacu=1&continue=https%3A%2F%2Fwww.google.com%2Fcalendar");
	}

	/** Wraps openOrUpdateTab for switching to another
	 * account
	 * */
	function switchAccount() {
		openOrUpdateTab("https://accounts.google.com/AccountChooser?continue=https%3A%2F%2Fwww.google.com%2Fcalendar");
	}

	/** Wraps openOrUpdateTab for disconnecting from the
	 * account(s)
	 * */
	function signOut() {
		openOrUpdateTab("https://accounts.google.com/Logout?continue=https://calendar.google.com/");
	}

	/** Function executed after a Google Calendar tab is
	 * sought. If there is one, it returns the corresponding
	 * tab id. If there is none, it returns null.
	 * */
	function processRetrievedTabs(tabs: Tab[]): void {
		if (tabs.length >= 1) {
			for (let tab of tabs) {
				tabsId = tab.id;
			}
		} else {
			tabsId = null;
		}
	}

	/** Function that looks for an open Google Calendar
	 * tab in Thunderbird
	 * */
	async function queryGoogleCalendarTabId() {
		const urlGCalTab = [
			"https://calendar.google.com/*", 
			"https://accounts.google.com/*", 
			"https://google.com/calendar*"];

		const tabs: Tab[] = await browserApi.tabs.query({ url: urlGCalTab, currentWindow: true });
		processRetrievedTabs(tabs);
	}

	/** Function triggered when "Dark" button is switched on/off
	 * */
	function switchMode() {
		browserApi.storage.local.set({
			"darkModeGCalTab": isDarkMode,
		});
	}

	$: if (isDarkMode) {
		document.getElementsByTagName("body")[0]!.removeAttribute("style");
	} else {
		document.getElementsByTagName("body")[0].style.backgroundColor = "#dcdcdc";
	}
</script>

<div class="container">

	<div class="row">
		<img src="icons/gcaltab.png" alt="GCalTab icon" class="logo-GCalTab" />
		<h1 class="name-GCalTab">
			GCalTab
		</h1>
	</div>

	<div class="row">
		<hr class="visible" />
	</div>

	<div class="row">
		<button id="gcal" class="primary-button" on:click={openGoogleCalendar}>
			{gCalButtonLabel}
		</button>
		<label class="mode-switcher">
			<input id="switchMode" type="checkbox" bind:checked={isDarkMode}
			on:change={switchMode}>
			<span class="slider"></span>
		</label>
		<div id="switchModeLabel" class={isDarkMode ? "" : "gray-font"}>{modeSwitcherLabel}</div>
	</div>

	<div class="row">
		<hr />
	</div>

	<div class="row">
		<RoundButton onClick={addAccount} labelNameAndDivId={"addAccount"} 
			cssClass={"primary-button"} iconSrc={"icons/user-plus-solid.svg"}/>

		<RoundButton onClick={switchAccount} labelNameAndDivId={"switchAccount"} 
			cssClass={"primary-button"} iconSrc={"icons/user-friends-solid.svg"}/>

		<RoundButton onClick={signOut} labelNameAndDivId={"signOut"} 
			cssClass={"disconnect-button"} iconSrc={"icons/sign-out-alt-solid.svg"}/>
	</div>

</div>

<style>
	.gray-font {
		color: #333333;
	}
</style>