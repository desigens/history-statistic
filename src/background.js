chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create(
        {
            // Deprecated since Chrome 58. Please use runtime.getURL.
            url: chrome.extension.getURL('history.html'),
        },
        function(tab) {
            // Tab opened.
        }
    );
});
