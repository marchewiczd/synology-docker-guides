function redirectToPort(element) {
    let port = getPortFromTable(element);
    
    if (!port) {
        console.warn('Port is empty - skipping redirection.')
        return
    }

    if (window.location.port) {
        window.location.href = window.location.origin.replace(window.location.port, port)
    }
    else {
        window.location.href = `${window.location.origin}:${port}/`
    }
}

function getPortFromTable(element){
    return element.parentElement.parentElement.querySelector('[data-label="Port"]').innerText
}