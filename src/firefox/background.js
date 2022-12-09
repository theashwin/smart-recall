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
//
// function getRelatedNotes(selection) {
//     //let selection = window.getSelection().anchorNode.parentElement.innerHTML
//     if (selection == null || selection.length === 0) {
//         return null
//     }
//     fetch('http://127.0.0.1:8000/notes/', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ "selection": selection })
//     }).then(data => {
//         console.log(data);
//         data.forEach(displayNotes)
//     }).catch(err => {
//       console.log("Error bitch", err)
//     });
//     alert(selection)
// }


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let results = 10
    const { selection } = request, url = `http://127.0.0.1:8000/recall/?id=` + selection + '&results=' + results;
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(data => {
        sendResponse({ data });
    }).catch(err => {
        console.log("Haga", err)
    })
    // fetch(url, {
    //     method: 'POST',
    //     mode: 'no-cors',
    //     credentials: 'omit',
    //     referrerPolicy: "same-origin",
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ "selection": selection })
    // }).then(data => {
    //     console.log("here2?")
    //     sendResponse({ data });
    // }).catch(err => {
    //   console.log("Error bitch", err)
    // });
    return true;
});