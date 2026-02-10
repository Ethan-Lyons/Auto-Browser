from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

def test_init():
    routine = Routine()
    assert routine.steps == []

def test_add_step():
    routine = Routine()
    new_action = routine.createDefaultAG()
    assert len(routine.steps) == 1
    assert routine.steps[0] == new_action

def test_remove_step():
    routine = Routine()
    newAction = routine.createDefaultAG()
    routine.removeStep(newAction)
    assert len(routine.steps) == 0

def test_get_steps():
    routine = Routine()
    action1 = routine.createDefaultAG()
    action2 = routine.createDefaultAG()
    assert routine.getSteps() == [action1, action2]

def test_move_step():
    routine = Routine()
    action1 = routine.createDefaultAG()
    action2 = routine.createDefaultAG()
    routine.moveAction(0, 1)
    assert routine.getSteps() == [action2, action1]

"""def test_argument_copy():
    argument = Argument("test")
    argument.setValue("testValue")
    argument2 = argument.copy()

    assert argument == argument2
    assert argument.getValue() == argument2.getValue()
    assert argument.getDescription() == argument2.getDescription()
    assert id(argument) != id(argument2)

def test_argument_setValue():
    argument = Argument("test")
    argument.setValue("testValue")
    assert argument.getValue() == "testValue"

def test_action_copy():
    action = Action(name="test", args=[Argument("testArg")], description="testDescription")
    action2 = action.copy()

    assert str(action) == str(action2)
    assert action.getArgs() == action2.getArgs()
    assert action.getDescription() == action2.getDescription()

    assert id(action) != id(action2)
    assert id(action.getArgs()[0]) != id(action2.getArgs()[0])
    assert id(action.getArgs()) != id(action2.getArgs())

def test_action_group_copy():
    testAction = Action(name="Action Name", args=[Argument("testArg")], description="Action Description")
    actionGroup = ActionGroup(name="Group Name", args=[testAction], description="Group Description")
    actionGroup2 = actionGroup.copy()

    assert str(actionGroup) == str(actionGroup2)
    assert len(actionGroup.getArgs()) == len(actionGroup2.getArgs())
    assert actionGroup.getDescription() == actionGroup2.getDescription()

    assert id(actionGroup) != id(actionGroup2)
    assert actionGroup.getArgs() != actionGroup2.getArgs()
    assert id(actionGroup.getArgs()) != id(actionGroup2.getArgs())
    assert id(actionGroup.getArgs()[0]) != id(actionGroup2.getArgs()[0])


def test_find_action_in_group():
    testName = "ActionName"
    testAction = Action(name=testName, args=[Argument("testArg")], description="Action Description")
    actionGroup = ActionGroup(name="GroupName", args=[testAction], description="Group Description")

    with pytest.raises(KeyError):
        actionGroup.get("Wrong_Name")

    assert str(actionGroup.get(testName)) == str(testAction)
    assert actionGroup.get(testName) == testAction

def test_set_value_in_action_group():
    testName = "ActionName"
    testArg = Argument("testArg")
    testAction = Action(name=testName, args=[testArg])
    subGroup1 = ActionGroup(name="Group1", args=[testAction])
    subGroup2 = ActionGroup(name="Group2", args=[testAction])
    subGroup3 = subGroup1.copy()

    assert subGroup1.getArgs()[0] == subGroup2.getArgs()[0]
    assert subGroup1.getArgs()[0] != subGroup3.getArgs()[0]
    subGroup1.getArgs()[0].getArgs()[0].setValue("testValue")
    assert str(subGroup1.getArgs()[0].getArgs()[0].getValue()) == "testValue"
    assert str(subGroup1.getArgs()[0].getArgs()[0].getValue()) != str(subGroup3.getArgs()[0].getArgs()[0].getValue())

def test_set_value():
    argument = Argument("xpath")
    selectors = ActionGroup(name="Selectors", args=[argument])
    action1 = Action(name="Action1", args=[selectors])
    action2 = Action(name="Action2", args=[selectors])
    userGroup = ActionGroup(name="User Group", args=[action1, action2])

    userCopy = userGroup.copy()

    setSelector = userCopy.getArgs()[0].getArgs()[0]
    setArg = setSelector.getArgs()[0]
    unsetSelector = userCopy.getArgs()[1].getArgs()[0]
    unsetArg = unsetSelector.getArgs()[0]

    assert setSelector != unsetSelector
    setSelector.getArgs()[0].setValue("testValue")
    assert str(setArg.getValue()) != str(unsetArg.getValue())
    """