document.addEventListener('DOMContentLoaded', function () {
    // document.getElementById('startRecord').addEventListener('click', () => {
    //     console.log('Record button clicked');
    //
    //     chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    //         const activeTab = tabs[0];
    //         console.log('Active tab:', activeTab);
    //
    //         if (!activeTab || !activeTab.id) {
    //             console.error('No active tab or tab ID found');
    //             return;
    //         }
    //
    //         chrome.tabs.sendMessage(activeTab.id, {action: 'recordSubtitles'}, response => {
    //             console.log('Message sent to content script');
    //
    //             if (chrome.runtime.lastError) {
    //                 console.error('Error:', chrome.runtime.lastError.message);
    //             } else {
    //                 console.log('Start recording', response);
    //             }
    //         });
    //     });
    // })
    document.getElementById('sendWebhook').addEventListener('click', () => {
        console.log('Record button clicked');

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const activeTab = tabs[0];
            console.log('Active tab:', activeTab);

            if (!activeTab || !activeTab.id) {
                console.error('No active tab or tab ID found');
                return;
            }

            chrome.tabs.sendMessage(activeTab.id, {action: 'sendwebhook'}, response => {
                console.log('Message sent to content script');

                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError.message);
                } else {
                    console.log('Start recording', response);
                }
            });
        });
    })
});
