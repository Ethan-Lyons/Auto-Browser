import InputOutput
from Routine import Routine
from UserActionBuilder import UserActionBuilder
from Action import Action
from Action import ActionGroup

routine = Routine(inputOutput=InputOutput)
routine.createDefaultBranch()
userAG = routine.getBranches()[0]

testAction = userAG.findAction("URL_NAV")
userAG.setSelected(testAction)
testArgs = testAction.getArgs()
testArgs[0].setValue("https://www.google.com")

routine.saveRoutine(filePath="./TestData/testRoutine.json")
