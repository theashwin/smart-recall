console.log("Popup Loaded")

// Adds on click listener for single, double and triple clicks. Double click disabled due to conflicts with triple clicks.
window.addEventListener('click', function (evt) {
    if (evt.detail === 3) {
        let selection = document.getSelection().toString()//.anchorNode.parentElement.innerHTML
        let info = getSelectionInfo(evt)
        getRelatedNotes(selection, info, evt)
    } else if (evt.detail === 2) {
        // let selection = document.getSelection().toString()//.anchorNode.parentElement.innerHTML
        // let info = getSelectionInfo(evt)
        // getRelatedNotes(selection, info, evt)
    } else if (evt.detail === 1) {
        removePopup(evt);
    }
});

// Removes popup if the single click is outside the popup.
function removePopup(evt) {
    let element = evt.target;
    if (!element.classList.contains("dictionaryDiv")) {
        document.querySelectorAll(".dictionaryDiv").forEach(function (Node) {
            Node.remove();
        });
    }
}

// Returns the coordinates of the selection to place the popup on the screen.
function getSelectionCoords(selection) {
    var oRange = selection.getRangeAt(0); //get the text range
    var oRect = oRange.getBoundingClientRect();
    return oRect;
}

// Gets the bounds for selection window
function getSelectionInfo(event) {
    var word;
    var boundingRect;

    if (window.getSelection().toString().length > 1) {
        word = window.getSelection().toString();
        boundingRect = getSelectionCoords(window.getSelection());
    } else {
        return null;
    }

    var top = boundingRect.top + window.scrollY,
        bottom = boundingRect.bottom + window.scrollY,
        left = boundingRect.left + window.scrollX;

    if (boundingRect.height == 0) {
        top = event.pageY;
        bottom = event.pageY;
        left = event.pageX;
    }

    return {
        top: top,
        bottom: bottom,
        left: left,
        word: word,
        clientY: event.clientY,
        height: boundingRect.height
    };
}

function getRelatedNotes(selection, info, evt) {
    if (selection == null || selection.length === 0) {
        return null
    }
    // Sends the request to a background javascript function to fetch data from the REST API
    browser.runtime.sendMessage({selection: selection, time: Date.now()}).then(data => {
        removePopup(evt);
        createPopup(data, info)
    }).catch(err => {
        console.log("ERROR: Exception occurred while creating the popup.", err)
    });
}

function createPopup(data, info) {
    let notes = JSON.parse(data['data']).notes
    console.log(notes)
    if (notes.length > 0) {
        let div = createDiv(info, notes)
    } else {
        let div = createDiv(info, notes)
    }
}

// Create the popup with required CSS
function createDiv(info, notes) {
    var hostDiv = document.createElement("div");
    hostDiv.className = "dictionaryDiv";
    hostDiv.style.left = info.left - 10 + "px";
    hostDiv.style.position = "absolute";
    hostDiv.style.zIndex = "1000000"
    hostDiv.attachShadow({mode: 'open'});

    var shadow = hostDiv.shadowRoot;
    var style = document.createElement("style");
    style.textContent = ".mwe-popups{background:#e7f0f6;border: 1px solid #abccfc;position:absolute;z-index:110;padding:0;font-size:14px;}.mwe-popups.mwe-popups-is-not-tall{width:450px; height: 300px; overflow: hidden;}.mwe-popups .mwe-popups-container{color:#222;margin-top:-9px;padding-top:9px;text-decoration:none;height:100%; overflow: hidden;}.mwe-popups.mwe-popups-is-not-tall .mwe-popups-extract{overflow:hidden}.mwe-popups .mwe-popups-extract{display:block;color:#222;text-decoration:none;position:relative} .mwe-popups.flipped_y:before{content:'';position:absolute;border:8px solid transparent;border-bottom:0;border-top: 8px solid #a2a9b1;bottom:-8px;left:10px}.mwe-popups.flipped_y:after{content:'';position:absolute;border:11px solid transparent;border-bottom:0;border-top:11px solid transparent;bottom:-7px;left:7px} .mwe-popups.mwe-popups-no-image-tri:before{content:'';position:absolute;border:8px solid transparent;border-top:0;border-bottom: 8px solid #a2a9b1;top:-8px;left:10px}.mwe-popups.mwe-popups-no-image-tri:after{content:'';position:absolute;border:11px solid transparent;border-top:0;border-bottom:11px solid transparent;top:-7px;left:7px}s";
    shadow.appendChild(style);

    var css = document.createElement("style")
    css.textContent = " .slideshow-container {position: relative;background: #e7f0f6 ;overflow-y: scroll;height: 100%;}.mySlides {display: none;margin-bottom: 75px;height: 100%; width: 100%;}.prev, .next {cursor: pointer;position: absolute;top: 50%;width: auto;margin-top: -30px;padding: 16px;color: #888;font-weight: bold;font-size: 20px;border-radius: 0 3px 3px 0;user-select: none;}.next {position: absolute;right: 0;border-radius: 3px 0 0 3px;}.prev:hover, .next:hover {background-color: rgba(0,0,0,0.8);color: white;}.dot-container {text-align: center;padding: 15px 0 8px 0;background: #b2d7ef;position:absolute; width:100%; bottom:0; z-index: 100;}.dot {cursor: pointer;height: 15px;width: 15px;margin: 0 2px;background-color: #8abee3;border-radius: 50%;display: inline-block;transition: background-color 0.6s ease;}.active, .dot:hover {background-color: #6aabd9;}q {font-style: italic;}.author {color: cornflowerblue;}";
    shadow.appendChild(css);

    var encapsulateDiv = document.createElement("div");
    encapsulateDiv.style = "all: initial;";
    shadow.appendChild(encapsulateDiv);

    var popupDiv = document.createElement("div");
    popupDiv.style = "font-family: 'Open Sans',arial,sans-serif; border-radius: 5px; 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)";
    encapsulateDiv.appendChild(popupDiv);

    var contentContainer = document.createElement("div");
    contentContainer.className = "mwe-popups-container";
    popupDiv.appendChild(contentContainer);

    var content = document.createElement("div");
    content.className = "mwe-popups-extract";
    content.style = "line-height: 1.4; margin-top: 0px;height:100%";
    contentContainer.appendChild(content);


    if (notes.length === 0) {
        var h2 = document.createElement("h2");
        h2.style = "display:inline-block;margin: 30px 35px 0 35px";
        h2.textContent = "No related notes found!";
        content.appendChild(h2);

        var note = document.createElement("div");
        note.style = "margin:20px 35px 35px 35px;";
        note.innerHTML = "Looking for related notes? We couldn't find any. <br><br> Good time as any to start taking notes on this topic.";
        content.appendChild(note)
    } else {
        let carousel = document.createElement("div")
        carousel.className = "slideshow-container"
        let cards = []
        for (let i = 0; i < notes.length; i++) {
            let card = document.createElement("div")
            card.className = "mySlides"
            var h2 = document.createElement("h2");
            h2.style = "display:inline-block;margin: 30px 35px 0 35px";
            h2.textContent = notes[i][0];

            var sim = document.createElement("div");
            sim.style = "z-index:2;background-color:#b2d7ef;;border-radius:2px;width:fit-content;padding:5px 10px;display:block;position:absolute;right:10px;top:10px;text-transform:uppercase;font-size:12px;font-weight:400";
            sim.textContent = notes[i][2];

            var note = document.createElement("div");
            note.style = "margin:20px 35px 35px 35px;";
            note.innerHTML = notes[i][1];

            card.appendChild(h2)
            card.appendChild(sim)
            card.appendChild(note)
            cards[i] = card
            carousel.appendChild(card)
        }
        content.appendChild(carousel)

        let dot = document.createElement("div")
        dot.className = "dot-container"
        let dots = []
        for (let i = 0; i < notes.length; i++) {
            let span = document.createElement("span")
            span.className = "dot"
            span.id = i.toString()
            dots[i] = span
            span.onclick = function () {
                let x = parseInt(span.id)
                for (let j = 0; j < notes.length; j++) {
                    if (j !== x) {
                        cards[j].style = "display: none;";
                        dots[j].className = "dot"
                    }
                }
                dots[x].className += " active";
                cards[x].style = "display: inline-block;";
            }
            dot.appendChild(span)
        }
        contentContainer.appendChild(dot)

        cards[0].style = "display: inline-block;"
        dots[0].className += " active";
        for (let i = 1; i < notes.length; i++) {
            cards[i].style = "display: none;"
        }
    }

    document.body.appendChild(hostDiv);

    if (info.clientY < window.innerHeight / 2) {
        popupDiv.className = "mwe-popups mwe-popups-no-image-tri mwe-popups-is-not-tall";
        hostDiv.style.top = info.bottom + 10 + "px";
        if (info.height == 0) {
            hostDiv.style.top = parseInt(hostDiv.style.top) + 8 + "px";
        }
    } else {
        popupDiv.className = "mwe-popups flipped_y mwe-popups-is-not-tall";
        hostDiv.style.top = info.top - 10 - popupDiv.clientHeight + "px";

        if (info.height == 0) {
            hostDiv.style.top = parseInt(hostDiv.style.top) - 8 + "px";
        }
    }
}
