window.onload = function() {
    document.getElementById("row-selected")
        .scrollIntoView({ behavior: "smooth", inline: "center" })
}

const evtSource = new EventSource("/events");
evtSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    document.querySelector("table").outerHTML = data.html;
}

evtSource.onerror = () => {
    window.location.reload();
}