from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineIOConverter import dictToRoutine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument
#import Creator.RoutineMaker.RoutineIO as RoutineIO
from Creator.RoutineMaker.RoutineIO import stepsToDict, dictToSteps, outputDictRoutine, routineToDict, saveRoutine, loadRoutine

import os

# Specifies a folder to be used for storing temporary test output data
FOLDER_NAME = "tmp"
TMP_DIR = os.path.join(os.path.dirname(__file__), FOLDER_NAME)

# A generic argument in dictionary form
expectedArgD = {
    "type": "Argument",
    "name": "name",
    "value": "value",
    "description": "description"
}
# A generic action in dictionary form
expectedActionD = {
    "type": "Action",
    "name": "name",
    "args": [expectedArgD],
    "description": "description"
}
# A generic action group in dictionary form
expectedGroupD = {
    "type": "ActionGroup",
    "name": "name",
    "selected": expectedActionD,
    "allArgs": [expectedActionD],
    "description": "description"
}
# An empty action group in dictionary form
emptyGroupD = {
    "type": "ActionGroup",
    "name": "name",
    "selected": None,
    "allArgs": [],
    "description": "description"
}
# An empty routine in dictionary form
emptyRoutineD = {
    "type": "Routine",
    "steps": []
}

# Counterparts to dictionaries in their respective types
defArg = Argument("name", "value", "description")
defAction = Action("name", [defArg], "description")
defGroup = ActionGroup("name", [defAction], "description")
emptyGroup = ActionGroup("name", [], "description")
emptyRoutine = Routine()


def test_save():
    """Checks for an existing filepath after saving a routine"""
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    routine = Routine()
    routine.createDefStep()   # Create routine object

    #routine.save(filePath)
    saveRoutine(routine, filePath)   # Save routine to file

    assert os.path.exists(filePath)

    # Clean up
    os.remove(filePath)

def test_load_values():
    """Checks for matching values of a saved and loaded routine"""
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    originalRoutine = Routine()
    originalRoutine.addStep(defGroup)
    saveRoutine(originalRoutine, filePath)

    loadedRoutine = loadRoutine(filePath)
    
    assert originalRoutine == loadedRoutine

    # Clean up
    os.remove(filePath)

def test_load_unique():
    """Checks that routine values are not linked by a load"""
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    originalRoutine = Routine()
    originalRoutine.addStep(defGroup)
    saveRoutine(originalRoutine, filePath)

    loadedRoutine = loadRoutine(filePath)

    originalRoutine.createDefStep()   # Alter original routine

    assert originalRoutine != loadedRoutine

    # Clean up
    os.remove(filePath)

def test_outputRoutine():
    """Checks for an existing filepath after outputting a routine"""
    addr = os.path.join(TMP_DIR, "testRoutine.json")

    rData = {   # Routine to output in dictionary form
        "type": "Routine",
        "steps": [expectedGroupD]
    }

    #RoutineIO.outputDictRoutine(rData, addr)
    outputDictRoutine(rData, addr)
    assert os.path.exists(addr)

    # Clean up
    os.remove(addr)

