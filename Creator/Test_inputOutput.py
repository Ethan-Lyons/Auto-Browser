from Routine import Routine
from Steps import ActionGroup
from Steps import Action
from Steps import Argument
import InputOutput
import os


def test_save():
    initialDir = os.path.join(os.path.dirname(__file__), "Routines")
    filePath = os.path.join(initialDir, "testRoutine.json")
    routine = Routine(inputOutput=InputOutput)
    routine.createDefaultAG()
    routine.saveRoutine(filePath)
    assert os.path.exists(filePath)
    os.remove(filePath)

def test_load():
    testArg = Argument("test")
    testArg.setValue("testValue")
    testAction = Action(name="Action Name", args=[testArg], description="Action Description")
    testGroup = ActionGroup(name="Group Name", args=[testAction], description="Group Description")

    initialDir = os.path.join(os.path.dirname(__file__), "Routines")
    filePath = os.path.join(initialDir, "testRoutine.json")
    originalRoutine = Routine(inputOutput=InputOutput)
    originalRoutine.addStep(testGroup)
    originalRoutine.saveRoutine(filePath)

    blankRoutine = Routine(inputOutput=InputOutput)
    blankRoutine.loadRoutine(filePath)
    
    assert str(originalRoutine) == str(blankRoutine)

    originalRoutine.createDefaultAG()
    assert str(originalRoutine) != str(blankRoutine)

    os.remove(filePath)