from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

def test_init():
    action = Action(ACTION_NAME, [], ACTION_DESCRIPTION)
    assert type(action) == Action

def test_init_values():
    action = Action(ACTION_NAME, [], ACTION_DESCRIPTION)
    assert action.name == ACTION_NAME
    assert action.args == []
    assert action.description == ACTION_DESCRIPTION

def test_str():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert str(action) == "Action: " + ACTION_NAME + "\nArgs: " + str([ARG]) + "\nDescription: " + ACTION_DESCRIPTION

def test_setName():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    action.setName("new_name")
    assert action.getName() == "new_name"

def test_getName():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getName() == ACTION_NAME

def test_copy_value():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.copy() == action

def test_copy_id():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.copy() is not action

def test_setArgs():
    newArg = Argument("new_arg", "new_arg_value", "new_arg_description")
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    action.setArgs([newArg])
    assert action.getArgs() == [newArg]

def test_getArgs():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getArgs() == [ARG]

def test_setDescription():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    action.setDescription("new_description")
    assert action.getDescription() == "new_description"

def test_getDescription():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getDescription() == ACTION_DESCRIPTION

def test_get_found():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.get(ARG_NAME) == ARG

def test_get_found_multiple():
    arg2Name = "arg2_name"
    arg2 = Argument(arg2Name, "arg2_value", "arg2_description")
    action = Action(ACTION_NAME, [ARG, arg2], ACTION_DESCRIPTION)
    assert action.get(arg2Name) == arg2

def test_get_not_found():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    with pytest.raises(KeyError):
        action.get("not_found")

def test_get_not_found_empty():
    action = Action(ACTION_NAME, [], ACTION_DESCRIPTION)
    with pytest.raises(KeyError):
        action.get("not_found")