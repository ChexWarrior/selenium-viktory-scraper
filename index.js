'use strict';

const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const helper = require('./helper.js');
const fs = require('fs');
const _ = require('lodash/array');
const { By, until } = webdriver;
const binary = new firefox.Binary(firefox.Channel.NIGHTLY);
const gameBaseURL = 'http://gamesbyemail.com/Games/Play?';

binary.addArguments("-headless");

const waitForElement = async function(options) {
  let loadFinished = false;
  let timeElapsed = 0;
  let { selectors, timeout, inputSelector, delay } = options;

  if(!timeout) timeout = 10000;
  if(!delay) delay = 500;

  if(!selectors || !inputSelector) {
    console.log('options.selectors and options.inputSelector are required!');
    return false;
  }
  
  await driver.executeScript(helper.createCounterInput);

  while(!loadFinished) {
    await driver.sleep(delay);
    loadFinished = await driver.executeScript(
      helper.waitForElementLoad, inputSelector, selectors
    );
    timeElapsed += delay;

    if(timeElapsed > timeout) {
      console.log(`Element did not load within ${delay}!`);
      return false;
    }
  }
};

const switchToLatestWindowHandle = async function(currentHandles) {
  let [latestHandle] = 
    _.difference(await driver.getAllWindowHandles(), currentHandles);
  await driver.switchTo().window(latestHandle);

  return latestHandle;
};

// handle command line args
const cmdArgs = process.argv;

if(cmdArgs.length <= 2) {
  console.log('You must pass the game ID!');
  process.exit(1);
}

const gameID = cmdArgs[2];
const remoteServer = cmdArgs[3] ? cmdArgs[3] : 'http://selenium-hub:4444/wd/hub';

console.log(`Game ID: ${gameID}`);
console.log(`Remote Server: ${remoteServer}`);

const driver = new webdriver
  .Builder()
  .usingServer(remoteServer)
  .forBrowser('firefox')
  .setFirefoxOptions(
    new firefox.Options().setBinary(binary)
  ).build();

(async function() {
  try {
    let windowHandles = await driver.getAllWindowHandles();
    let gameURL = gameBaseURL + gameID;

    driver.get(gameURL);
    console.log('Navigate to Game URL...');
    driver.wait(until.elementLocated(By.css('#Foundation_Elemental_2_openLog')));
    console.log('Wait for game board to finish loading...');
    
    await waitForElement({
      inputSelector: 'input.counterInput',
      selectors: [
        '#Foundation_Elemental_2_pieces img', 
        '#Foundation_Elemental_2_pieces div'
      ]
    });

    console.log('Check if spectator anchor exists...');

    const spectatorLinkExists = await driver.executeScript(
      `let anchor = document.querySelector('#Foundation_Elemental_2_spectatorAnchor');
        return anchor === null;`
    );

    if (!spectatorLinkExists) {
      console.log('Spectator anchor exists, stopping script...');
      process.exit(1);
    }

    console.log('Open Game Log Window...');

    const gameLogLink = 
      await driver.findElement(By.css('#Foundation_Elemental_2_openLog'));

    await gameLogLink.click();
    windowHandles.push(await switchToLatestWindowHandle(windowHandles));

    console.log('Wait for game log to finish loading...');

    await waitForElement({
      inputSelector: 'input.counterInput',
      selectors: ['#Foundation_Elemental_1_log tr']
    });

    const printerLogLink = 
      await driver.findElement(By.css('#Foundation_Elemental_1_printerFriendlyLog'));

    console.log('Open printer friendly log...');

    await printerLogLink.click();
    windowHandles.push(await switchToLatestWindowHandle(windowHandles));

    console.log('Wait for game log to finish loading...');

    await waitForElement({
      inputSelector: 'input.counterInput',
      selectors: ['body > div > table tr']
    });

    console.log('Scrape player information...');
    
    const playerInfoHTML = 
      await driver.executeScript(
        helper.scrapeInfo,
        'h4'
      );

    console.log(playerInfoHTML);
    console.log('Scrape game log...');

    const gameLog = 
      await driver.executeScript(
        helper.scrapeInfo, 
        'body > div > table > tbody > tr > td:last-child'
      );

    fs.writeFileSync(`logs/raw-${gameID}.log`, gameLog);
  } finally {
    driver.quit();
  }
}());