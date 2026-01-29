from RoutineMaker.Routine import Routine
from RoutineMaker.Steps import ActionGroup
from RoutineMaker.Steps import Action
from RoutineMaker.Steps import Argument
import RoutineMaker.InputOutput as InputOutput

import os

FOLDER_NAME = "tmp"
TMP_DIR = os.path.join(os.path.dirname(__file__), FOLDER_NAME)

def test_save():
    initialDir = TMP_DIR
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

    initialDir = TMP_DIR
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