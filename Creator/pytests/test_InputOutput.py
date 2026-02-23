from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument
import Creator.RoutineMaker.InputOutput as InputOutput

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

    routine = Routine(inputOutput=InputOutput)
    routine.createDefStep()   # Create routine object

    routine.saveRoutine(filePath)

    assert os.path.exists(filePath)

    # Clean up
    os.remove(filePath)

def test_load_values():
    """Checks for matching values of a saved and loaded routine"""
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    originalRoutine = Routine(inputOutput=InputOutput)
    originalRoutine.addStep(defGroup)
    originalRoutine.saveRoutine(filePath)   # Create and save a routine

    blankRoutine = Routine(inputOutput=InputOutput)
    blankRoutine.loadRoutine(filePath)  # Load the new routine
    
    assert originalRoutine == blankRoutine

    # Clean up
    os.remove(filePath)

def test_load_unique():
    """Checks that routine values are not linked by a load"""
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    originalRoutine = Routine(inputOutput=InputOutput)
    originalRoutine.addStep(defGroup)
    originalRoutine.saveRoutine(filePath)   # Create and save a routine

    blankRoutine = Routine(inputOutput=InputOutput)
    blankRoutine.loadRoutine(filePath)  # Load the new routine

    originalRoutine.createDefStep()   # Alter original routine

    assert originalRoutine != blankRoutine

    # Clean up
    os.remove(filePath)

def test_outputRoutine():
    """Checks for an existing filepath after outputting a routine"""
    addr = os.path.join(TMP_DIR, "testRoutine.json")

    rData = {   # Routine to output in dictionary form
        "type": "Routine",
        "steps": [expectedGroupD]
    }

    InputOutput.outputRoutine(rData, addr)
    assert os.path.exists(addr)

    # Clean up
    os.remove(addr)

def test_actionsToDict_arg():
    """Ensures that actionsToDict can convert a generic argument into a dictionary"""
    assert InputOutput.actionsToDict(defArg) == expectedArgD

def test_actionsToDict_action():
    """Ensures that actionsToDict can convert a generic action into a dictionary"""
    assert InputOutput.actionsToDict(defAction) == expectedActionD

def test_actionsToDict_actionGroup():
    """Ensures that actionsToDict can convert a generic action group into a dictionary"""
    assert InputOutput.actionsToDict(defGroup) == expectedGroupD

def test_actionsToDict_actionGroup_empty():
    """Ensures that actionsToDict can convert an empty action group into a dictionary"""
    assert InputOutput.actionsToDict(emptyGroup) == emptyGroupD

def test_actionsToDict_routine_empty():
    """Ensures that actionsToDict can convert an empty routine into a dictionary"""
    assert InputOutput.actionsToDict(emptyRoutine) == emptyRoutineD

def test_actionsToDict_nested():
    """Ensures that actionsToDict can convert a routine with nested steps into a dictionary"""
    routine = Routine()
    routine.addStep(defGroup)

    expectedRoutine = {
        "type": "Routine",
        "steps": [expectedGroupD]
    }

    assert InputOutput.actionsToDict(routine) == expectedRoutine

def test_dictToActions_arg():
    """Ensures that dictToActions can convert a dictionary into a generic argument"""
    assert InputOutput.dictToActions(expectedArgD)  == defArg

def test_dictToActions_action():
    """Ensures that dictToActions can convert a dictionary into a generic action"""
    assert InputOutput.dictToActions(expectedActionD) == defAction

def test_dictToActions_actionGroup():
    """Ensures that dictToActions can convert a dictionary into a generic action group"""
    assert InputOutput.dictToActions(expectedGroupD) == defGroup

def test_dictToActions_actionGroup_empty():
    """Ensures that dictToActions can convert a dictionary into an empty action group"""
    assert InputOutput.dictToActions(emptyGroupD) == emptyGroup

def test_dictToActions_routine_empty():
    """Ensures that dictToActions can convert a dictionary into an empty routine"""
    assert InputOutput.dictToActions(emptyRoutineD) == emptyRoutine

def test_dictToActions_nested():
    """Ensures that dictToActions can convert a dictionary into a routine with nested steps"""
    expected = Routine()
    expected.addStep(defGroup)

    assert InputOutput.dictToActions({
        "type": "Routine",
        "steps": [expectedGroupD]
    }) == expected

def test_dictToActions_actionsToDict():
    """Ensures that actionsToDict and dictToActions are inverse functions in opposite order"""
    assert InputOutput.actionsToDict(InputOutput.dictToActions(expectedGroupD)) == expectedGroupD

def test_actionsToDict_dictToActions():
    """Ensures that actionsToDict and dictToActions are inverse functions"""
    assert InputOutput.dictToActions(InputOutput.actionsToDict(defGroup)) == defGroup

def test_dictToActions_actionsToDict_emptyG():
    """Ensures that actionsToDict and dictToActions are inverse functions in opposite order
    when there is an empty action group"""
    assert InputOutput.actionsToDict(InputOutput.dictToActions(emptyGroupD)) == emptyGroupD

def test_actionsToDict_dictToActions_emptyG():
    """Ensures that actionsToDict and dictToActions are inverse functions when there is an
    empty action group"""
    assert InputOutput.dictToActions(InputOutput.actionsToDict(emptyGroup)) == emptyGroup