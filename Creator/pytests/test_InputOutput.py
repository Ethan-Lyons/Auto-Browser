from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument
import Creator.RoutineMaker.InputOutput as InputOutput

import os

FOLDER_NAME = "tmp"
TMP_DIR = os.path.join(os.path.dirname(__file__), FOLDER_NAME)

expectedArgD = {
    "type": "Argument",
    "name": "name",
    "value": "value",
    "description": "description"
}
expectedActionD = {
    "type": "Action",
    "name": "name",
    "args": [expectedArgD],
    "description": "description"
}

expectedGroupD = {
    "type": "ActionGroup",
    "name": "name",
    "selected": expectedActionD,
    "allArgs": [expectedActionD],
    "description": "description"
}

emptyGroupD = {
    "type": "ActionGroup",
    "name": "name",
    "selected": None,
    "allArgs": [],
    "description": "description"
}

emptyRoutineD = {
    "type": "Routine",
    "steps": []
}

defArg = Argument("name", "value", "description")
defAction = Action("name", [defArg], "description")
defGroup = ActionGroup("name", [defAction], "description")
emptyGroup = ActionGroup("name", [], "description")
emptyRoutine = Routine()


def test_save():
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    routine = Routine(inputOutput=InputOutput)
    routine.createDefaultAG()
    routine.saveRoutine(filePath)

    assert os.path.exists(filePath)
    os.remove(filePath)

def test_load():
    filePath = os.path.join(TMP_DIR, "testRoutine.json")

    originalRoutine = Routine(inputOutput=InputOutput)
    originalRoutine.addStep(defGroup)
    originalRoutine.saveRoutine(filePath)

    blankRoutine = Routine(inputOutput=InputOutput)
    blankRoutine.loadRoutine(filePath)
    
    assert originalRoutine == blankRoutine

    originalRoutine.createDefaultAG()
    assert originalRoutine != blankRoutine

    os.remove(filePath)

def test_outputRoutine():
    rData = {
        "type": "Routine",
        "steps": [expectedGroupD]
    }
    addr = os.path.join(TMP_DIR, "testRoutine.json")
    InputOutput.outputRoutine(rData, addr)
    assert os.path.exists(addr)
    os.remove(addr)

def test_actionsToDict_arg():
    arg = defArg
    assert InputOutput.actionsToDict(arg) == expectedArgD

def test_actionsToDict_action():
    action = defAction
    assert InputOutput.actionsToDict(action) == expectedActionD

def test_actionsToDict_actionGroup():
    result = InputOutput.actionsToDict(defGroup)
    assert result == expectedGroupD

def test_actionsToDict_actionGroup_empty():
    result = InputOutput.actionsToDict(emptyGroup)
    assert result == emptyGroupD

def test_actionsToDict_routine_empty():
    assert InputOutput.actionsToDict(emptyRoutine) == emptyRoutineD

def test_actionsToDict_nested():
    routine = Routine()
    routine.addStep(defGroup)

    assert InputOutput.actionsToDict(routine) == {
        "type": "Routine",
        "steps": [expectedGroupD]
    }

def test_dictToActions_arg():
    result = InputOutput.dictToActions(expectedArgD) 
    assert result == defArg

def test_dictToActions_action():
    result = InputOutput.dictToActions(expectedActionD)
    assert result == defAction

def test_dictToActions_actionGroup():
    result = InputOutput.dictToActions(expectedGroupD)
    assert result == defGroup

def test_dictToActions_actionGroup_empty():
    result = InputOutput.dictToActions(emptyGroupD)
    assert result == emptyGroup

def test_dictToActions_routine_empty():
    result = InputOutput.dictToActions(emptyRoutineD)
    assert result == emptyRoutine

def test_dictToActions_nested():
    expected = Routine()
    expected.addStep(defGroup)

    assert InputOutput.dictToActions({
        "type": "Routine",
        "steps": [expectedGroupD]
    }) == expected

def test_dictToActions_actionsToDict():
    assert InputOutput.actionsToDict(InputOutput.dictToActions(expectedGroupD)) == expectedGroupD

def test_actionsToDict_dictToActions():
    assert InputOutput.dictToActions(InputOutput.actionsToDict(defGroup)) == defGroup

def test_dictToActions_actionsToDict_emptyG():
    assert InputOutput.actionsToDict(InputOutput.dictToActions(emptyGroupD)) == emptyGroupD

def test_actionsToDict_dictToActions_emptyG():
    assert InputOutput.dictToActions(InputOutput.actionsToDict(emptyGroup)) == emptyGroup

