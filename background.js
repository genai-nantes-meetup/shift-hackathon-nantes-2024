chrome.runtime.onInstalled.addListener(() => {
    console.log('Google Meet HTML Parser Extension installed.');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});
