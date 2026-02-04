import { urlNavStep } from "../../StepFactory.js";
import { parseUrlNav, exeUrlNav, urlNav }  from '../../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';

test ('blank test', async () => {
    
});

/*test('loadUrlNav', async () => {
    await WebHelpers.newTab(context);
    testRoutinePath = './TestData/testNav.json'
    routine = await WebHelpers.jsonToRoutineStack(testRoutinePath);
    urlActionGroup = routine.steps[0];
    urlAction = urlActionGroup.selected;    

    await WebHelpers.urlNav(context, urlAction);
});

test('urlNav', async () => {
    await WebHelpers.newTab(context);
    url = {name: 'url', value : 'google.com'}
    navAction = {name : 'URL_NAV', args: [url]}
    await WebHelpers.urlNav(context, navAction);
// });*/