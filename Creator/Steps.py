import tkinter as tk

class Action:
    def __init__(self, name, args=[], description=""):
        self.name = name
        self.description = description
        self.args = args
    
    def __str__(self):
        return self.name
    def copy(self):
        """Returns a deep copy of the action"""
        return fullCopy(self)
    def getName(self):
        """Returns the name of the action"""
        return self.name
    def getArgs(self):
        """Returns the arguments of the action"""
        return self.args
    def find(self, argName):
        """Finds and returns an argument in the action by name string. Returns None if no argument found"""
        for arg in self.args:
            if str(arg).lower() == argName.lower():
                return arg
        return None
    def getDescription(self):
        """Returns the description of the action"""
        return self.description


class ActionGroup:
    def __init__(self, name, args=[], description=""):
        self.name = name
        self.args = args
        self.description = description
        self.selected = args[0]

    def __str__(self):
        return self.name
    def copy(self):
        """Returns a deep copy of the action"""
        return fullCopy(self)
    def getName(self):
        """Returns the name of the action group"""
        return self.name
    def getArgs(self):
        """Returns the args in the action group"""
        return self.args
    def getDescription(self):
        """Returns the description of the action group"""
        return self.description
    
    def getSelected(self):
        """Returns the selected action from the action group"""
        return self.selected
    def setSelected(self, action):
        """Sets the selected action for the action group"""
        self.selected = action
    
    def find(self, actionName):
        """Finds and returns an arg (action, actionGroup, or argument) in the action group by name string. Returns None if no action found"""
        for action in self.args:
            if str(action).lower() == actionName.lower():
                return action
        return None

class Argument(str):
    def __new__(cls, name, value=None, description=None):
        """
        Constructor for Argument class.

        This is necessary because we subclass from str, and the str class
        does not allow for additional arguments in its constructor.

        Parameters:
            name (str): The name of the argument used as the string value.
            value: The stored value of the argument.
            description (str): A description of the argument.
        """
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
        """Returns the name of the argument"""
        return self.name

    def setDescription(self, description):
        """Sets the description of the argument"""
        self.description = description
    def getDescription(self):
        """Returns the description of the argument"""
        return self.description

    def setValue(self, value):
        """Sets the value of the argument"""
        self.value = value
    def getValue(self):
        """Returns the value of the argument"""
        return self.value
    
    def copy(self):
        """Returns a deep copy of the argument"""
        return fullCopy(self)

def fullCopy(action):
    """Returns a deep copy of the given Action, ActionGroup, or Argument.

    This function uses recursion to copy all the arguments of an Action,
    and all the actions of an ActionGroup.
    If the same object is found under multiple arguments, each instance
    will have its own copy.

    Args:
        action (Action, ActionGroup, or Argument): The object to be copied.

    Returns:
        A deep copy of the given Action, ActionGroup, or Argument.
    """
    if isinstance(action, ActionGroup): # ActionGroup
        args = [fullCopy(arg) for arg in action.getArgs()]
        return ActionGroup(name=action.getName(), args=args, description=action.getDescription())
    
    elif isinstance(action, Action):    # Action
        args = [fullCopy(arg) for arg in action.getArgs()]
        return Action(name=action.getName(), args=args, description=action.getDescription())
    
    elif isinstance(action, Argument):  # Argument
        return Argument(action, value=action.value, description=action.description)
    
    else:                               # Unknown
        print("Unknown action type in fullCopy: " + str(type(action)))