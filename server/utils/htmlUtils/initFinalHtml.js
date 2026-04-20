import {getTime} from "../getTime.js";
import {DAYS} from "../../constants/index.js";

export function initFinalHtml(tableHtml) {
    const {now} = getTime();

    const day = DAYS[now.getDay()];
    const date = now.getDate();
    const modifiedDate = date <= 9 ? `0${date}` : date;
    const month = now.getMonth() + 1;
    const modifiedMonth = month <= 9 ? `0${month}` : month;
    const year = now.getFullYear();

    return `
        <html lang="ua">
          <head>
            <title>Расписание</title>
            <link rel="stylesheet" href="/main.css"/>
          </head>
          <body style="background: #242424; display: flex; width: 100%; height: 100%; flex-direction: column">
            <h1 style="color: white; text-align: center; display: inline-flex; justify-content: center; align-items: center; border: 2px solid white; padding: .3rem; border-radius: .5rem;">Статус отключений на ${day} ${modifiedDate}.${modifiedMonth}.${year}</h1>
            ${tableHtml}
            <script src="/main.js"></script>
          </body>
        </html>
    `
}