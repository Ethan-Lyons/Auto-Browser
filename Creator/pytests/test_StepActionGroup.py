from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

GROUP_NAME = "group_name"
GROUP_DESCRIPTION = "group_description"

ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

def test_init():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert type(actionGroup) == ActionGroup

def test_init_values():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getName() == GROUP_NAME
    assert actionGroup.getArgs() == [ARG]
    assert actionGroup.getDescription() == GROUP_DESCRIPTION
    assert actionGroup.getSelected() == ARG

def test_str():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert str(actionGroup) == "ActionGroup: " + GROUP_NAME + "\nSelected: " + str(ARG) + "\nArgs: " + str([ARG]) + "\nDescription: " + GROUP_DESCRIPTION

def test_setName():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    actionGroup.setName("new_name")
    assert actionGroup.getName() == "new_name"

def test_getName():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getName() == GROUP_NAME

def test_setSelected():
    arg2 = Argument("arg2_name", "arg2_value", "arg2_description")
    actionGroup = ActionGroup(GROUP_NAME, [ARG, arg2], GROUP_DESCRIPTION)
    actionGroup.setSelected(arg2)
    assert actionGroup.getSelected() == arg2

def test_getSelected():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getSelected() == ARG

def test_copy_value():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    copy = actionGroup.copy()
    assert copy == actionGroup

def test_copy_id():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    copy = actionGroup.copy()
    assert copy is not actionGroup

def test_setArgs():
    arg2 = Argument("arg2_name", "arg2_value", "arg2_description")
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    actionGroup.setArgs([arg2])
    assert actionGroup.getArgs() == [arg2]

def test_getArgs():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getArgs() == [ARG]

def test_setDescription():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    actionGroup.setDescription("new_description")
    assert actionGroup.getDescription() == "new_description"

def test_getDescription():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getDescription() == GROUP_DESCRIPTION

def test_get_found_arg():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.get(ARG_NAME) == ARG

def test_get_found_action():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    actionGroup = ActionGroup(GROUP_NAME, [action], GROUP_DESCRIPTION)
    assert actionGroup.get(ACTION_NAME) == action

def test_get_found_multiple():
    arg2Name = "arg2_name"
    arg2 = Argument(arg2Name, "arg2_value", "arg2_description")
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)

    actionGroup = ActionGroup(GROUP_NAME, [ARG, action, arg2], GROUP_DESCRIPTION)
    assert actionGroup.get(arg2Name) == arg2

def test_get_not_found():
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    with pytest.raises(KeyError):
        actionGroup.get("not_found")

def test_get_not_found_empty():
    actionGroup = ActionGroup(GROUP_NAME, [], GROUP_DESCRIPTION)
    with pytest.raises(KeyError):
        actionGroup.get("not_found")