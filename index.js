#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import fetch from 'node-fetch';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const path = 'https://hax.camp/assets/campfire.json';

function title(){
    const msg = '< h a x - c a m p f i r e >';

    /*
    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data));
    })
    console.log();
    */

    figlet.text(msg, {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }, function(err, data) {
        if (err) {
            console.log('Could not print title.');
            console.dir(err);
            return;
        }
        console.log(gradient.pastel.multiline(data));
    })
}

async function welcome() {
    const introduction = chalkAnimation.rainbow("welcome to CAMPFIRE -- the <hax-camp> CLI");
    introduction.stop();
    introduction.start();
    await sleep(2000);
    introduction.stop();
    console.log();
}

// @TODO make functional: remove 'path' state ref
async function getData() {
    //console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
    //sleep(3000);
    const spinner = createSpinner('Fetching event information...').start();
    await sleep(2500);
    const response = await fetch(path);
    const data = await response.json();
    if (data.name == 'HAXCamp') {
        spinner.success({text: 'Data retrieved!'});
        //console.log(data);
    } else {
        spinner.error('Could not retrieve hax-camp data.');
    }
    return showEvents(data);
}

async function showEvents(eventData) {
    const selected = await inquirer.prompt({
        name: 'eventName',
        type: 'list',
        message: 'SELECT the event that you\'re looking for:',
        choices: eventData.events
    });
    if (selected.eventName){
        console.log(`you selected ${selected.eventName}`);
        const eventIndex = eventData.events.findIndex(e => e.name === selected.eventName);
        const eventObject = eventData.events[eventIndex];

        return showEventData(eventObject);
    }
}

async function showEventData(haxEvent) {
    const dataFieldList = Object.keys(haxEvent);
    dataFieldList.shift();

    const dataField = await inquirer.prompt({
        name: 'fieldName',
        type: 'list',
        message: 'SELECT the data that you\'re looking for:',
        choices: dataFieldList
    });
    console.log(`${dataField.fieldName}: ${haxEvent[dataField.fieldName]}`);
    return showEventData(haxEvent);
}

//title();
console.log(gradient.pastel.multiline(figlet.textSync('<hax - campfire>', {
    font: '3D-ASCII',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    whitespaceBreak: true
})));
await getData();
