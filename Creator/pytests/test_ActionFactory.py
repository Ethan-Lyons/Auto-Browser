from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

# Values used for creating a generic action object
ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

# Values used for creating a generic action group object
GROUP_NAME = "group_name"
GROUP_DESCRIPTION = "group_description"

# Values used for creating a generic argument object
ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)


def test_createAction():
    """Tests that Action values are set correctly upon creation"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert type(action) == Action

    assert action.getName() == ACTION_NAME
    assert action.getArgs() == [ARG]
    assert action.getDescription() == ACTION_DESCRIPTION

def test_createActionGroup():
    """Tests that Action Group values are set correctly upon creation"""
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    actionGroup = ActionGroup(GROUP_NAME, [action], GROUP_DESCRIPTION)
    assert type(actionGroup) == ActionGroup

    assert actionGroup.getName() == GROUP_NAME
    assert actionGroup.getArgs() == [action]
    assert actionGroup.getDescription() == GROUP_DESCRIPTION

    assert actionGroup.getSelected() == action

def test_createArgument():
    """Tests that Argument values are set correctly upon creation"""
    argument = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert type(argument) == Argument

    assert argument.getName() == ARG_NAME
    assert argument.getValue() == ARG_VALUE
    assert argument.getDescription() == ARG_DESCRIPTION