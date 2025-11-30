import InputOutput
from Routine import Routine
from UserActionBuilder import UserActionBuilder
from Action import Action
from Action import ActionGroup

def _saveRoutine(routine, name):
    routine.saveRoutine(filePath="./TestData/" + name + ".json")

def testBlank():
    routine = Routine(inputOutput=InputOutput)
    routine.createDefaultAG()
    _saveRoutine(routine, "testBlank")

def testNav():
    routine = Routine(inputOutput=InputOutput)
    userAG = routine.createDefaultAG()

    navA = userAG.findAction("URL_NAV")
    userAG.setSelected(navA)
    urlArg = navA.findArg("url")
    #navArgs[0].setValue("https://www.google.com")
    urlArg.setValue("https://www.google.com")

    _saveRoutine(routine, "testNav")

def generateTestData():
    testBlank()
    testNav()

generateTestData()

