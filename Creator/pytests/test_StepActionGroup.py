from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

# Values used for creating a generic action group object
GROUP_NAME = "group_name"
GROUP_DESCRIPTION = "group_description"

# Values used for creating a generic action object
ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

# Values used for creating a generic argument object
ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

def test_init_values():
    """Tests that ActionGroup values are set correctly upon creation"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getName() == GROUP_NAME
    assert actionGroup.getArgs() == [ARG]
    assert actionGroup.getDescription() == GROUP_DESCRIPTION
    assert actionGroup.getSelected() == ARG

def test_str():
    """Tests that ActionGroup string representation is correct"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert str(actionGroup) == "ActionGroup: " + GROUP_NAME + "\nSelected: " + str(ARG) + "\nArgs: " + str([ARG]) + "\nDescription: " + GROUP_DESCRIPTION

def test_setName():
    """Tests that ActionGroup name is set by setName"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    
    actionGroup.setName("new_name")
    assert actionGroup.getName() == "new_name"

def test_getName():
    """Tests that ActionGroup name is returned by getName"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getName() == GROUP_NAME

def test_setSelected():
    """Tests that ActionGroup selected is set by setSelected"""
    arg2 = Argument("arg2_name", "arg2_value", "arg2_description")
    actionGroup = ActionGroup(GROUP_NAME, [ARG, arg2], GROUP_DESCRIPTION)

    actionGroup.setSelected(arg2)
    assert actionGroup.getSelected() == arg2

def test_getSelected():
    """Tests that ActionGroup selected is returned by getSelected"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getSelected() == ARG

def test_copy_value():
    """Tests that copy returns an object with the same values"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)

    copy = actionGroup.copy()
    assert copy == actionGroup

def test_copy_id():
    """Tests that copy returns a new object with a unique id"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)

    copy = actionGroup.copy()
    assert copy is not actionGroup

def test_setArgs():
    """Tests that ActionGroup args are set by setArgs"""
    arg2 = Argument("arg2_name", "arg2_value", "arg2_description")
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)

    actionGroup.setArgs([arg2])
    assert actionGroup.getArgs() == [arg2]

def test_getArgs():
    """Tests that ActionGroup args are returned by getArgs"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getArgs() == [ARG]

def test_setDescription():
    """Tests that ActionGroup description is set by setDescription"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)

    actionGroup.setDescription("new_description")
    assert actionGroup.getDescription() == "new_description"

def test_getDescription():
    """Tests that ActionGroup description is returned by getDescription"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.getDescription() == GROUP_DESCRIPTION

def test_get_found_arg():
    """Tests that ActionGroup args can be found by get"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    assert actionGroup.get(ARG_NAME) == ARG

def test_get_found_action():
    """Tests that ActionGroup actions can be found by get"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    actionGroup = ActionGroup(GROUP_NAME, [action], GROUP_DESCRIPTION)

    assert actionGroup.get(ACTION_NAME) == action

def test_get_found_multiple():
    """Tests that a valid Argument can be found by get when there are multiple args in the action"""
    arg2Name = "arg2_name"
    arg2 = Argument(arg2Name, "arg2_value", "arg2_description")
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)

    actionGroup = ActionGroup(GROUP_NAME, [ARG, action, arg2], GROUP_DESCRIPTION)
    assert actionGroup.get(arg2Name) == arg2

def test_get_not_found():
    """Tests that KeyError is raised when an argument is not found by get"""
    actionGroup = ActionGroup(GROUP_NAME, [ARG], GROUP_DESCRIPTION)
    with pytest.raises(KeyError):
        actionGroup.get("not_found")

def test_get_not_found_empty():
    """Tests that KeyError is raised when an argument is not found by get when there are no args in the action group"""
    actionGroup = ActionGroup(GROUP_NAME, [], GROUP_DESCRIPTION)
    with pytest.raises(KeyError):
        actionGroup.get("not_found")