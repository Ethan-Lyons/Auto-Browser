from Creator.RoutineMaker.Steps import Argument

import pytest as pytest

# Values used for creating a generic argument object
GROUP_NAME = "group_name"
group_description = "group_description"

# Values used for creating a generic action object
ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

# Values used for creating a generic argument object
ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

def test_init_values():
    """Tests that Argument values are set correctly upon creation"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getName() == ARG_NAME
    assert arg.getValue() == ARG_VALUE
    assert arg.getDescription() == ARG_DESCRIPTION

def test_str():
    """Tests that Argument string representation is correct"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert str(arg) == "Argument: " + ARG_NAME + "\nValue: " + ARG_VALUE + "\nDescription: " + ARG_DESCRIPTION

def test_setName():
    """Tests that Argument name is set by setName"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

    arg.setName("new_name")
    assert arg.getName() == "new_name"

def test_getName():
    """Tests that Argument name is returned by getName"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getName() == ARG_NAME

def test_copy_value():
    """Tests that copy returns an object with the same values"""

    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    argCopy = arg.copy()
    assert argCopy == arg

def test_copy_id():
    """Tests that copy returns a new object with a unique id"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

    argCopy = arg.copy()
    assert argCopy is not arg

def test_setValue():
    """Tests that Argument value is set by setValue"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

    arg.setValue("new_value")
    assert arg.getValue() == "new_value"

def test_getValue():
    """Tests that Argument value is returned by getValue"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getValue() == ARG_VALUE

def test_setDescription():
    """Tests that Argument description is set by setDescription"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

    arg.setDescription("new_description")
    assert arg.getDescription() == "new_description"

def test_getDescription():
    """Tests that Argument description is returned by getDescription"""
    arg = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)
    assert arg.getDescription() == ARG_DESCRIPTION