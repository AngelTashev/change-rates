const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR,ETHEUR,ETCEUR,BCHEUR,XBTUSD,ETHUSD,ETCUSD,BCHUSD';
const time = krakenEndpoint + 'Time';
const percentage = 0.10;
const template = document.getElementById('container-template');
const templateHTML = template.innerHTML;
const priceArticlesContainer = document.getElementsByClassName('price-articles')[0];
const refreshBtn = document.getElementById('refresh-btn');
const timeContainer = document.getElementById('last-refresh-text');
let seconds = 0;

let interval;

// exchange prices container
const exchanges = {};

async function displayInfo() {

    clearInterval(interval);
    await loadData();
    seconds = 0;
    interval = setInterval(setTime, 1000);
    setTime();

    priceArticlesContainer.innerHTML = generateHTML();
}

async function loadData() {

    await Promise.all([await fetch(ticker).then(res => res.json())])
        .then(res => {
            let data = res[0].result;

            for (let curr of Object.keys(data)) {
                const exchangePrice = res[0].result[curr].c[0];
                const buyRate = Number(exchangePrice * (1 + percentage));
                const sellRate = Number(exchangePrice * (1 - percentage));
                exchanges[curr] = { buyRate, sellRate };
            }
        });

}

function attachRefreshListener() {
    refreshBtn.addEventListener('click', e => {
        e.preventDefault();
        displayInfo();
    });
}

function generateHTML() {

    let map = {
        0: {
            'name': 'Bitcoin (BTC)',
            'buyEUR': exchanges.XXBTZEUR.buyRate,
            'sellEUR': exchanges.XXBTZEUR.sellRate,
            'buyUSD': exchanges.XXBTZUSD.buyRate,
            'sellUSD': exchanges.XXBTZUSD.sellRate,
        },
        1: {
            'name': 'Bitcoin Cash (BCH)',
            'buyEUR': exchanges.BCHEUR.buyRate,
            'sellEUR': exchanges.BCHEUR.sellRate,
            'buyUSD': exchanges.BCHUSD.buyRate,
            'sellUSD': exchanges.BCHUSD.sellRate,
        },
        2: {
            'name': 'Ethereum (ETH)',
            'buyEUR': exchanges.XETHZEUR.buyRate,
            'sellEUR': exchanges.XETHZEUR.sellRate,
            'buyUSD': exchanges.XETHZUSD.buyRate,
            'sellUSD': exchanges.XETHZUSD.sellRate,
        },
        3: {
            'name': 'Eth. Classic (ETC)',
            'buyEUR': exchanges.XETCZEUR.buyRate,
            'sellEUR': exchanges.XETCZEUR.sellRate,
            'buyUSD': exchanges.XETCZUSD.buyRate,
            'sellUSD': exchanges.XETCZUSD.sellRate,
        },

    }

    let sections = '<section class="price-articles-section">';

    for (let i = 0; i < 4; i++) {
        if (i == 2) {
            sections += '</section><section class="price-articles-section">';
        }
        sections += createArticle(map[i]);
    }
    section = '</section>';

    return sections;
}

function createArticle(currencyObject) {
    let article = templateHTML
            .replace(/{{name}}/g, currencyObject.name)
            .replace(/{{buyEUR}}/g, formatCurrency(currencyObject.buyEUR))
            .replace(/{{sellEUR}}/g, formatCurrency(currencyObject.sellEUR))
            .replace(/{{buyUSD}}/g, formatCurrency(currencyObject.buyUSD))
            .replace(/{{sellUSD}}/g, formatCurrency(currencyObject.sellUSD));
    return article;
}

function formatCurrency(number) {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    }).substring(1);
}

function setTime() {
    let minutes = parseInt(seconds / 60);
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    let displaySeconds = seconds;
    displaySeconds %= 60;
    if (displaySeconds < 10) {
        displaySeconds = '0' + displaySeconds;
    }
    timeContainer.innerHTML = `${minutes}:${displaySeconds}`;
    seconds++;
}

displayInfo();
attachRefreshListener();