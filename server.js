const webdriver = require('selenium-webdriver'),
    Condition = webdriver.Condition,
    By = webdriver.By,
    until = webdriver.until;
const axios = require('axios');

var chrome = require("selenium-webdriver/chrome");
var options = new chrome.Options();

const getResult = async () => {
    //game.gua567.com/api/power_result.php
    const results = await axios.get('https://game.gua567.com/api/power_result.php').then(res => res.data);
    if (results && results.data && results.data.length > 0) {
        return results.data[0];
    } else {
        return null;
    }
}

let gameBetting = {
    1: [0, 0, 0, 0],
    2: [0, 0, 0, 0],
    3: [0, 0, 0, 0],
    4: [0, 0, 0, 0],
    5: [0, 0, 0, 0],
    6: [0, 0, 0, 0],
    7: [0, 0, 0, 0],
    8: [0, 0, 0, 0],
};

options.addArguments("user-data-dir=C:\\Users\\Judy\\AppData\\Local\\Google\\Chrome\\User Data")

options.addArguments("profile-directory=Profile 1");

until.elementIsNotPresent = function elementIsNotPresent(locator) {
    return new Condition('for no element to be located ' + locator, function (driver) {
        return driver.findElements(locator).then(function (elements) {
            return elements.length != 0;
        });
    });
};

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

let bettedIndex = 0;

driver.get('http://va-55.com/users/login').then(async function () {
    driver.findElement(By.id('UserUsername')).sendKeys('ksw1500\n').then(function () {
        driver.findElement(By.id('UserPassword')).sendKeys('ksw1500@@\n').then(async function () {
            console.log('Logging');
            await driver.sleep(20);
            console.log('Logged In');
            // driver.findElement(By.className('btn-light')).click().then(function () {
            //     console.log('Logged In');
            // });
        });
    });
    try {
        await driver.wait(until.elementIsNotPresent(By.className("bet-amount")), 20000);
        console.log('found element');
        const pickBtns = await driver.findElements(By.className('pick-btn'));
        const oddBtn = pickBtns[0];
        const evenBtn = pickBtns[1];
        const goBtns = await driver.findElements(By.className('btn-block'));
        setInterval(async () => {
            await driver.findElements(By.className('btn-close-ok')).then(elements => {
                console.log('found Close Elements: ', elements);
                if(elements && elements.length > 0) {
                    for (let i in elements) {
                        elements[i].click();
                    }
                }
            });
            
            // const buttons = await driver.findElements(By.xpath('//div[@class="modal popup-banner-modal show]/button'));
            // console.log('found Buttons: ', buttons.length);
            // if(buttons && buttons.length) {
            //     for (let i in buttons) {
            //         buttons[i].click();
            //     }
            // }

            const betEndStr = await driver.findElement(By.className('bet-end-count')).getText();
            if (betEndStr) {
                const betTimer = betEndStr.split(' ')[1];
                if (betTimer) {
                    const betSeconds = betTimer.split(':')[0] * 60 + betTimer.split(':')[1] * 1;
                    if (betSeconds === 200) {
                        const lastResult = await getResult();
                        const sumBalls = lastResult.ball_1 * 1 + lastResult.ball_2 * 1;
                        if (sumBalls % 2 == 0) {
                            evenBtn.click();
                        } else {
                            oddBtn.click();
                        }
                        driver.findElement(By.className('bet-amount')).sendKeys('500');
                        goBtns[0].click();
                        goBtns[1].click();
                    }
                }
            }
        }, 1000);
    } catch (err) {
        console.log('ERROR: ' + err);
    }
    // driver.quit();
});