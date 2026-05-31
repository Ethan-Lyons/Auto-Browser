# A generic argument in dictionary form
from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
from Creator.RoutineMaker.RoutineIOConverter import stepsToDict, dictToSteps, routineToDict, dictToRoutine

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
def test_stepsToDict_arg():
    """Ensures that stepsToDict can convert a generic argument into a dictionary"""
    #assert RoutineIO.stepsToDict(defArg) == expectedArgD
    assert stepsToDict(defArg) == expectedArgD

def test_stepsToDict_action():
    """Ensures that stepsToDict can convert a generic action into a dictionary"""
    #assert RoutineIO.stepsToDict(defAction) == expectedActionD
    assert stepsToDict(defAction) == expectedActionD

def test_stepsToDict_actionGroup():
    """Ensures that stepsToDict can convert a generic action group into a dictionary"""
    #assert RoutineIO.stepsToDict(defGroup) == expectedGroupD
    assert stepsToDict(defGroup) == expectedGroupD

def test_stepsToDict_actionGroup_empty():
    """Ensures that stepsToDict can convert an empty action group into a dictionary"""
    assert stepsToDict(emptyGroup) == emptyGroupD

def test_stepsToDict_routine_empty():
    """Ensures that stepsToDict can convert an empty routine into a dictionary"""
    assert routineToDict(emptyRoutine) == emptyRoutineD

def test_routineToDict_nested():
    """Ensures that routineToDict can convert a routine with nested steps into a dictionary"""
    routine = Routine()
    routine.addStep(defGroup)

    expectedRoutine = {
        "type": "Routine",
        "steps": [expectedGroupD]
    }

    assert routineToDict(routine) == expectedRoutine

def test_dictToSteps_arg():
    """Ensures that dictToSteps can convert a dictionary into a generic argument"""
    assert dictToSteps(expectedArgD)  == defArg

def test_dictToSteps_action():
    """Ensures that dictToSteps can convert a dictionary into a generic action"""
    assert dictToSteps(expectedActionD) == defAction

def test_dictToSteps_actionGroup():
    """Ensures that dictToSteps can convert a dictionary into a generic action group"""
    assert dictToSteps(expectedGroupD) == defGroup

def test_dictToSteps_actionGroup_empty():
    """Ensures that dictToSteps can convert a dictionary into an empty action group"""
    assert dictToSteps(emptyGroupD) == emptyGroup

def test_dictToRoutine_routine_empty():
    """Ensures that dictToRoutine can convert a dictionary into an empty routine"""
    assert dictToRoutine(emptyRoutineD) == emptyRoutine

def test_dictToRoutine_nested():
    """Ensures that dictToRoutine can convert a dictionary into a routine with nested steps"""
    expected = Routine()
    expected.addStep(defGroup)

    assert dictToRoutine({
        "type": "Routine",
        "steps": [expectedGroupD]
    }) == expected

def test_dictToSteps_stepsToDict():
    """Ensures that stepsToDict and dictToSteps are inverse functions in opposite order"""
    assert stepsToDict(dictToSteps(expectedGroupD)) == expectedGroupD

def test_stepsToDict_dictToSteps():
    """Ensures that stepsToDict and dictToSteps are inverse functions"""
    assert dictToSteps(stepsToDict(defGroup)) == defGroup

def test_dictToSteps_stepsToDict_emptyG():
    """Ensures that stepsToDict and dictToSteps are inverse functions in opposite order
    when there is an empty action group"""
    assert stepsToDict(dictToSteps(emptyGroupD)) == emptyGroupD

def test_stepsToDict_dictToSteps_emptyG():
    """Ensures that stepsToDict and dictToSteps are inverse functions when there is an
    empty action group"""
    assert dictToSteps(stepsToDict(emptyGroup)) == emptyGroup