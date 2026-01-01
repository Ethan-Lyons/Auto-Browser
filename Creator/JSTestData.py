import InputOutput
from Routine import Routine
from UserActionBuilder import UserActionBuilder
from Steps import Action
from Steps import ActionGroup

def _saveRoutine(routine, name):
    routine.saveRoutine(filePath="./TestData/" + name + ".json")

def testBlank():
    routine = Routine(inputOutput=InputOutput)
    routine.createDefaultAG()
    _saveRoutine(routine, "testBlank")

def testNav():
    routine = Routine(inputOutput=InputOutput)
    userAG = routine.createDefaultAG()

    navA = userAG.find("URL_NAV")
    userAG.setSelected(navA)
    urlArg = navA.find("url")
    urlArg.setValue("https://www.google.com")

    _saveRoutine(routine, "testNav")

def testClick():
    routine = Routine(inputOutput=InputOutput)
    userAG1 = routine.createDefaultAG()
    userAG2 = routine.createDefaultAG()

    navA = userAG1.find("URL_NAV")
    userAG1.setSelected(navA)
    urlArg = navA.find("url")
    urlArg.setValue("https://www.google.com")   # base navigation

    clickA = userAG2.find("CLICK")
    find = clickA.find("find")
    selector = find.find("selector")
    xpath = selector.find("xpath")  # finding click action parts

    userAG2.setSelected(clickA)
    selector.setSelected(xpath)
    xpath.setValue("/html/body/div[1]/div[6]/div/div[1]/div[3]/a[1]")   # setting click action parts

    _saveRoutine(routine, "testClick")

def testNewTab():
    routine = Routine(inputOutput=InputOutput)
    userAG = routine.createDefaultAG()

    newTabA = userAG.find("NEW_TAB")
    userAG.setSelected(newTabA)

    _saveRoutine(routine, "testNewTab")

def generateTestData():
    testBlank()
    testNav()
    testClick()
    testNewTab()

generateTestData()

