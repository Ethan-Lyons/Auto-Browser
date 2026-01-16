/*  This should replace getGroupByAttribute but just one $ i think
export async function findByAttribute(page, type, attribute, value, strict = false) {
    try {
        //const elements = await getGroupByAttribute(page, type, attribute, value, strict);
        //console.log("Matching elements found: " + elements.length + " returning first");
        //return elements[0];
    } catch (err) {
        console.error('Navigation (getObjectByAttribute) error:\n', err);
        process.exit(1);
    }
}*/ 

/*  might be useful
const allTexts = await page.$$eval(
    '.item-class', // CSS selector
    elements => elements.map(el => el.textContent) // Map over all elements and return their text
    );
    console.log(allTexts); // This will be an array of strings

 */

async function getGroupByAttribute(page, type, attribute, value, strict=false) {
    if (strict) {   // strict
        try {
            // 'xpath/' means to locate elements by XPath
            //The Dot (.) means the current context (aka the children of the current element)
            //The type is ?
            //The attribute is ?
            //The value is ?
            const fullXPath = 'xpath/.' + `//${type}[@${attribute}="${value}"]`;
            const elements = await page.$$(fullXPath);
            return elements;
        } catch (err) {
            console.error('Find (getObjectByAttribute strict) error:\n', err);
            process.exit(1);
        }
    }
    else {  // non-strict
        try {
            const fullXPath = 'xpath/.' + `//${type}[contains(@${attribute}, "${value}")]`;
            const elements = await page.$$(fullXPath);
            return elements;
        } catch (err) {
            console.error('Find (getObjectByAttribute non-strict) error:\n', err);
            process.exit(1);
        }
    }
}

export async function groupGetByAttribute(parents, type, attribute, value, strict = false) {
    try {
        const newList = [];
        for (let i = 0; i < parents.length; i++) {
            const currentParent = parents[i];
            const newItem = await findByAttribute(currentParent, type, attribute, value, strict);
            newList[i] = newItem;
        }
        return newList;    
    } catch (err) {
        throw new Error('Navigation (getAllParentsAttribute) error:\n' + err);
    }
}