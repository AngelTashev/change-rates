const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR,ETHEUR,ETCEUR,BCHEUR,XBTUSD,ETHUSD,ETCUSD,BCHUSD';
const time = krakenEndpoint + 'Time';
const percentage = 0.10;
const template = document.getElementById('container-template');
const templateHTML = template.innerHTML;
const priceArticlesContainer = document.getElementsByClassName('price-articles')[0];
const refreshBtn = document.getElementById('refresh-btn');

// exchange prices container
const exchanges = {};

async function displayInfo() {

    await loadData();

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

// function attachListeners() {

//     convertBtn.addEventListener('click', e => {
//         e.preventDefault();
//         resultField.value = calculateAndChangeRate('buy');
//     });

// }

// function calculateAndChangeRate() {
//     let rate = 0;
//     let result = 0;
//     let currency = currencyValue.value;
//     const transaction = currency.charAt(0);
//     currency = currency.substring(1);
//     const amount = inputValue.value;

//     switch (transaction) {
//         case '0':
//             rate = exchanges[currency].sellRate;
//             result = Number(rate * amount).toFixed(2);
//             break;
//         case '1':
//             rate = exchanges[currency].buyRate;
//             result = Number(amount / rate).toFixed(8);
//             break;
//     }

//     const strCurrency = String(currency);
//     currentRate.innerHTML = `${rate} ${strCurrency.substr(strCurrency.length - 3)}`;

//     return result;

// }


// async function getTime() {
//     let timeResult = {};
//     await fetch(time)
//         .then(res => res.json())
//         .then(data => timeResult = data);
//     console.log(JSON.stringify(timeResult.result.rfc1123));
// }

displayInfo();
attachRefreshListener();