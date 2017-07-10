import React from 'react';
import ReactDOM from 'react-dom';
import History from './History';

const LIMIT = 10000;
const START = 4 * 7 * 24 * 60 * 60 * 1000;

console.time('getHistory');

getHistory(LIMIT).then(historyItems => {
    console.timeEnd('getHistory');
    console.time('getVisitsByUrl');

    const historyTree = {};
    let visitsCounter = 0;
    Promise.all(
        // По каждой ссылке собираем визиты, чтобы получить даты посещений.
        historyItems.map(historyItem => {
            return getVisitsByUrl(historyItem.url).then(visitItems => {
                visitItems.map(visitItem => {
                    // Тут будет перебран каждый визит, посчитаем для интереса
                    visitsCounter++;

                    // Добавляем в визиты ссылку (изначально отсутствует в visitItem)
                    visitItem.url = historyItem.url;

                    // Выясняем, как будем группировать (по хосту и дням)
                    const host = getUrlKey(historyItem.url);
                    const day = getPeriodKey(visitItem.visitTime);

                    // Достраиваем дерево визитов, сгруппированных по хостам и дням
                    historyTree[host] = historyTree[host] || {};
                    historyTree[host][day] = historyTree[host][day] || [];
                    historyTree[host][day].push(visitItem);
                });
            });
        })
    ).then(() => {
        console.timeEnd('getVisitsByUrl');

        render(historyTree, historyItems, visitsCounter);
    });
});

/**
 * Рендер представления данных
 * @param {object} hostsTree
 * @param {array} historyItems
 * @param {number} visitsCounter
 */
function render(hostsTree, historyItems, visitsCounter) {
    ReactDOM.render(
        <div>
            <h1>Статистика истории</h1>
            <p>
                Данные за последние <b>{START / 24 / 60 / 60 / 1000} дней</b> ,
                но не более <b>{LIMIT}</b> страниц (historyItems). Сгруппирована
                по <b>protocol+hostname</b> и <b>дням</b>.
            </p>
            <p>
                Было просмотрено {Object.keys(hostsTree).length} сайтов и{' '}
                {historyItems.length} разных страниц. Всего {visitsCounter}{' '}
                посещений.<br />
            </p>

            <History hosts={hostsTree || {}} />
        </div>,
        document.querySelector('#root')
    );
}

/**
 * Получение списка посещенных уникальных ссыло
 * @param {number} maxResults
 * @param {string} text
 * @return Promise.<HistoryItem[]>
 */
function getHistory(maxResults, text = '') {
    return new Promise(resolve => {
        // https://developer.chrome.com/extensions/history
        chrome.history.search(
            {
                text: text,
                startTime: Date.now() - START,
                endTime: Date.now(),
                maxResults: maxResults,
            },
            historyItems => {
                resolve(historyItems);
            }
        );
    });
}

/**
 * Получение всех визитов определенной ссылки
 * @param {string} url
 * @return Promise.<VisitItem[]>
 */
function getVisitsByUrl(url) {
    return new Promise(resolve => {
        // https://developer.chrome.com/extensions/history
        chrome.history.getVisits(
            {
                url: url,
            },
            visitItems => {
                resolve(visitItems);
            }
        );
    });
}

/**
 * Ключ для группировки ссылок: только протокол + хост
 * @param {string} url
 * @return {string}
 */
function getUrlKey(url) {
    const linkElement = document.createElement('a');
    linkElement.href = url;
    return linkElement.protocol + '//' + linkElement.hostname;
}

/**
 * Ключ для группировки по периоду: по дням
 * @param {number} timestamp
 * @return {string}
 */
function getPeriodKey(timestamp) {
    const date = new Date(timestamp);
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
}
