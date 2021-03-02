const calculatorButton = document.getElementById('calculator-button-toggle');
const refreshButton = document.getElementById('refresh-btn');
const calculatorContainer = document.getElementsByClassName('calculator-container')[0];
const priceArticleContainers = document.getElementsByClassName('price-article-container');
const priceArticles = document.getElementsByClassName('price-articles')[0];
const priceArticlesSections = document.getElementsByClassName('price-articles-section');
const priceBlocks = document.getElementsByClassName('price-block');
const mainTag = document.getElementsByTagName('main')[0];

let resizeToggle = false;

calculatorButton.addEventListener('click', (e) => {
    e.preventDefault();
    resizeToggle = !resizeToggle;
    addCalculatorToView();
});

function addCalculatorToView() {
    resizeView();
}

function resizeView() {
    // no calc
    if (!resizeToggle) {
        refreshButton.style.display = 'block';
        priceArticles.style.flexBasis = '100%';
        calculatorContainer.style.display = 'none';

        for (let container of priceArticleContainers) {
            container.style.width = '40%';
        }

        for (let article of priceArticlesSections) {
            article.style.flexDirection = 'row';
            article.style.justifyContent = 'space-evenly';
            article.style.flexBasis = '50%';
        }

        for (let block of priceBlocks) {
            block.children[0].style.fontSize = '18px';
        }
    }
    // with calc
    else {
        refreshButton.style.display = 'none';
        priceArticles.style.flexBasis = '50%';
        calculatorContainer.style.display = 'flex';

        for (let container of priceArticleContainers) {
            container.style.width = '80%';
        }

        for (let article of priceArticlesSections) {
            article.style.flexDirection = 'column';
            article.style.justifyContent = 'center';
            article.style.flexBasis = '100%';
        }

        for (let block of priceBlocks) {
            block.children[0].style.fontSize = '16px';
        }
    }
}