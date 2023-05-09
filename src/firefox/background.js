console.log("Plugin loaded!");

const BOOKMARK_MENU_ITEM_ID = "bookmark-menu-item";

function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

createRootMenuItems();

let infos = null

function createRootMenuItems() {
    browser.menus.create({
        id: "selection",

        title: "Recall",
        contexts: ["selection", "browser_action"]
    }, onCreated);
}

browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "selection":
            console.log(info.selectionText);
            getRelatedNotes(info.selectionText)
            console.log(info)
            infos = info
            break;
    }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (sender.envType === "content_child") {
        console.log("From Selection");
        let results = 10
        const {selection} = request, url = `http://127.0.0.1:8000/recall/?id=` + selection + '&results=' + results;
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(data => {
                sendResponse({data});
            }).catch(err => {
            console.log("Error", err)
        })
        return true;
    } else {
        console.log("From Popup");

        const {selection, title, desc, results} = request;
        console.log(results)
        const url = `http://127.0.0.1:8000/graph/?title=` + title + '&desc=' + desc + '&selection=' + selection + '&results=' + results;

        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(data => {
                sendResponse({data});
            }).catch(err => {
            console.log("Error", err)
        })
        return true;
    }

});