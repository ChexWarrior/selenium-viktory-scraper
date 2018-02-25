'use strict';

const waitForElementLoad = function waitForElementLoad (counterSelector, selectors) {
  let lastCount = document.querySelector(counterSelector);
  let currentCount = 0;

  for (let selector of selectors) {
    currentCount += document.querySelectorAll(selector).length;
  }

  if (lastCount.value > 0 && lastCount.value == currentCount) return true;

  lastCount.value = currentCount;

  return false;
};

const createCounterInput = function createCounterInput() {
  let lastCount = document.createElement('input');
  lastCount.type = 'hidden';
  lastCount.className = 'counterInput';
  lastCount.value = 0;
  document.querySelector('body').appendChild(lastCount);
};

const getPlayerInfo = function getPlayerInfo() {
  let playerInfoList = document.querySelectorAll('h4');
  let playerInfo = [];

  for(let player of playerInfoList) {
    playerInfo.push(player.innerHTML);
  }

  return playerInfo;
};

const scrapeInfo = function scrapeInfo(selector) {
  let rawHTML = document.querySelectorAll(selector);
  let info = [];

  for (let item of rawHTML) {
    info.push(item.innerHTML);
  }

  return info;
}

module.exports = {
  waitForElementLoad: waitForElementLoad,
  createCounterInput: createCounterInput,
  scrapeInfo: scrapeInfo
};