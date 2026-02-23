from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

# Values used for creating a generic action object
ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

# Values used for creating a generic argument object
ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

def test_init_values():
    """Tests that Action values are set correctly upon creation"""
    action = Action(ACTION_NAME, [], ACTION_DESCRIPTION)
    assert action.name == ACTION_NAME
    assert action.args == []
    assert action.description == ACTION_DESCRIPTION

def test_str():
    """Tests that Action string representation is correct"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert str(action) == "Action: " + ACTION_NAME + "\nArgs: " + str([ARG]) + "\nDescription: " + ACTION_DESCRIPTION

def test_setName():
    """Tests that Action name is set by setName"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    action.setName("new_name")
    assert action.getName() == "new_name"

def test_getName():
    """Tests that Action name is returned by getName"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getName() == ACTION_NAME

def test_copy_value():
    """Tests that copy returns an object with the same values"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.copy() == action

def test_copy_id():
    """Tests that copy returns a new object with a unique id"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.copy() is not action

def test_setArgs():
    """Tests that Action args are set by setArgs"""
    newArg = Argument("new_arg", "new_arg_value", "new_arg_description")
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)

    action.setArgs([newArg])
    assert action.getArgs() == [newArg]

def test_getArgs():
    """Tests that Action args are returned by getArgs"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getArgs() == [ARG]

def test_setDescription():
    """Tests that Action description is set by setDescription"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)

    action.setDescription("new_description")
    assert action.getDescription() == "new_description"

def test_getDescription():
    """Tests that Action description is returned by getDescription"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getDescription() == ACTION_DESCRIPTION

def test_get_found():
    """Tests that a valid Argument can be found by get"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.get(ARG_NAME) == ARG

def test_get_found_multiple():
    """Tests that a valid Argument can be found by get when there are multiple arguments in the action"""
    arg2Name = "arg2_name"
    arg2 = Argument(arg2Name, "arg2_value", "arg2_description")

    action = Action(ACTION_NAME, [ARG, arg2], ACTION_DESCRIPTION)
    assert action.get(arg2Name) == arg2

def test_get_not_found():
    """Tests that KeyError is raised when an argument is not found by get"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    with pytest.raises(KeyError):
        action.get("not_found")

def test_get_not_found_empty():
    """Tests that KeyError is raised when an argument is not found by get when there are no arguments in the action"""
    action = Action(ACTION_NAME, [], ACTION_DESCRIPTION)
    with pytest.raises(KeyError):
        action.get("not_found")