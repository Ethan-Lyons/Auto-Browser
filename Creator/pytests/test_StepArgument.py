from RoutineMaker.Routine import Routine
from RoutineMaker.Steps import ActionGroup
from RoutineMaker.Steps import Action
from RoutineMaker.Steps import Argument

import pytest as pytest

GROUP_NAME = "group_name"
group_description = "group_description"

ACTION_NAME = "action_name"
ACTION_DESCRIPTION = "action_description"

ARG_NAME = "arg_name"
ARG_VALUE = "arg_value"
ARG_DESCRIPTION = "arg_description"
ARG = Argument(ARG_NAME, ARG_VALUE, ARG_DESCRIPTION)

"""
def __new__(cls, name, value=None, description=None):

        obj = super().__new__(cls, name)    # call the str constructor
        obj.value = value
        obj.description = description
        return obj
    
    def __init__(self, name, value=None, description=None):
        self.name = name
        self.value = value
        self.description = description
    
    def __str__(self):
        return self.name
    
    
    def getName(self):
        return self.name

    def setDescription(self, description):
        self.description = description
    def getDescription(self):
        return self.description

    def setValue(self, value):
        self.value = value
    def getValue(self):
        return self.value
    
    def copy(self):
        return fullCopy(self)

"""
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
    assert str(action) == ACTION_NAME

def test_getName():
    action = Action(ACTION_NAME, [ARG], ACTION_DESCRIPTION)
    assert action.getName() == ACTION_NAME

def test_copy_value():
    pass

def test_copy_id():
    pass

def test_getArgs():
    pass

def test_getDescription():
    pass

def test_get_found():
    pass

def test_get_not_found():
    pass