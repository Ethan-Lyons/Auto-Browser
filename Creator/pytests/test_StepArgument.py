from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

GROUP_NAME = "group_name"
group_description = "group_description"

ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

def test_init():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert type(arg) == Argument

def test_init_values():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getName() == ARG_NAME
    assert arg.getValue() == ARG_VALUE
    assert arg.getDescription() == ARG_DESCRIPTION

def test_str():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert str(arg) == "Argument: " + ARG_NAME + "\nValue: " + ARG_VALUE + "\nDescription: " + ARG_DESCRIPTION

def test_setName():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    arg.setName("new_name")
    assert arg.getName() == "new_name"

def test_getName():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getName() == ARG_NAME

def test_copy_value():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    argCopy = arg.copy()
    assert argCopy == arg

def test_copy_id():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    argCopy = arg.copy()
    assert argCopy is not arg

def test_setValue():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    arg.setValue("new_value")
    assert arg.getValue() == "new_value"

def test_getValue():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getValue() == ARG_VALUE

def test_setDescription():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    arg.setDescription("new_description")
    assert arg.getDescription() == "new_description"

def test_getDescription():
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getDescription() == ARG_DESCRIPTION