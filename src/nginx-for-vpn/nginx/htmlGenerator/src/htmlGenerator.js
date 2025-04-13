import fs from 'fs'

const htmlFileName = 'index.html'

export function generateHtml(filePath, descriptors) {
    let htmlContent = head + upperBody

    for (let i = 0; i < descriptors.length; i++) {
        htmlContent += String.format(
            tableRowTemplate,
            descriptors[i].name,
            descriptors[i].image,
            descriptors[i].port === -1 ? '' : descriptors[i].port)
    }
    htmlContent += lowerBody

    fs.writeFileSync(`${filePath}/${htmlFileName}`, htmlContent)
}

String.format = function() {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        let reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

export const head = `
<!DOCTYPE html>
<html>

<head>
    <title>Container list</title>
    <link href="style/style.css" rel="stylesheet"/>
    <script src="src/script.js"></script>
</head>`

export const upperBody = `
<body>
<div class="container">
    <h2>Containers</h2>
    <ul class="responsive-table">
        <li class="table-header">
            <div class="col col-1">Name</div>
            <div class="col col-2">Container Name</div>
            <div class="col col-3">Port</div>
            <div class="col col-4">Redirect</div>
        </li>`

export const tableRowTemplate = `
        <li class="table-row">
            <div class="col col-1" data-label="Name">{0}</div>
            <div class="col col-2" data-label="Container Name">{1}</div>
            <div class="col col-3" data-label="Port">{2}</div>
            <div class="col col-4" data-label="Redirect"><img onclick="redirectToPort(this)"
                                                              src="resource/icons8-link-24.png"/></div>
        </li>`

export const lowerBody = `
</ul>
</div>
</body>
</html>`