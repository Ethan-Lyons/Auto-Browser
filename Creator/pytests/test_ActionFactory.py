from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

GROUP_NAME = "group_name"
GROUP_DESCRIPTION = "group_description"

ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)


def test_createAction():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert type(action) == Action

    assert action.getName() == ACTION_NAME
    assert action.getArgs() == [ARG]
    assert action.getDescription() == ACTION_DESCRIPTION

def test_createActionGroup():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    actionGroup = ActionGroup(GROUP_NAME, [action], GROUP_DESCRIPTION)
    assert type(actionGroup) == ActionGroup

    assert actionGroup.getName() == GROUP_NAME
    assert actionGroup.getArgs() == [action]
    assert actionGroup.getDescription() == GROUP_DESCRIPTION

    assert actionGroup.getSelected() == action

def test_createArgument():
    argument = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert type(argument) == Argument

    assert argument.getName() == ARG_NAME
    assert argument.getValue() == ARG_VALUE
    assert argument.getDescription() == ARG_DESCRIPTION