import { runAppleScript } from 'run-applescript';

const delimiter = "|||";
const selectionAsText = "window.getSelection().toString()"

const getInfoFromChromium = (browser) => `tell application "${browser}"
  set activeTab to active tab of front window
  set tabUrl to URL of activeTab
  set tabTitle to title of activeTab
  set excerpt to execute activeTab javascript \"${selectionAsText}\"
  return tabUrl & "${delimiter}" & tabTitle & "${delimiter}" & excerpt
end tell
`;

const getInfoFromWebkit = () => `tell application "Safari"
  set activeTab to current tab of front window
  set tabUrl to URL of activeTab
  set tabTitle to name of activeTab
  set excerpt to do JavaScript \"${selectionAsText}\" in activeTab
  return tabUrl & "${delimiter}" & tabTitle & "${delimiter}" & excerpt
end tell
`;

const getActiveTabInfoByBrowser = {
  "Google Chrome": getInfoFromChromium("Google Chrome"),
  "Google Chrome Canary": getInfoFromChromium("Google Chrome Canary"),
  Arc: getInfoFromChromium("Arc"),
  Safari: getInfoFromWebkit(),
};

const supportedBrowsers = Object.keys(getActiveTabInfoByBrowser);

async function getActiveWindow() {
  const activeWindow = await runAppleScript(`tell application "System Events" to get name of (processes whose frontmost is true) as text`);
  return activeWindow?.trim();
}

function extractTabInfo(input) {
  const output = input.trim();
  const [url, title, excerpt] = output.split(delimiter);

  return {
    url,
    title: title?.trim(),
    excerpt: excerpt?.trim(),
  };
}

export async function getActiveTab() {
  try {
    const activeWindow = await getActiveWindow();

    if (!supportedBrowsers.some((browser) => browser === activeWindow)) {
      return;
    }
    const script = getActiveTabInfoByBrowser[activeWindow];
    const activeTabInfo = await runAppleScript(script);
    if (!activeTabInfo) {
      return;
    }
    const { url, title, excerpt } = extractTabInfo(activeTabInfo);
    return { url, title, excerpt };
  } catch (error) {
    throw error;
  }
}

