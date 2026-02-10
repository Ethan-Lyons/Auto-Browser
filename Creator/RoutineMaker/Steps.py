class Action:
    """
    The Action class represents an action that can be performed in a routine.
    It has a name, a list of arguments, and a description.
    """
    def __init__(self, name: str, args=[], description=""):
        self.name = name
        self.description = description
        self.args = args

    def __eq__(self, other):
        return (
            isinstance(other, Action)
            and self.name == other.name
            and self.args == other.args
            and self.description == other.description
        )
    
    def __hash__ (self):
        return hash((self.name, tuple(self.args), self.description))
    
    def __str__(self):
        return "Action: " + str(self.name) + "\nArgs: " + str(self.args) + "\nDescription: " + str(self.description)
    
    def setName(self, newName: str):
        """Sets the name of the action"""
        self.name = newName
    def getName(self):
        """Returns the name of the action"""
        return self.name
    
    def setArgs(self, newArgs: list):
        """Sets the arguments of the action"""
        self.args = newArgs
    def getArgs(self):
        """Returns the arguments of the action"""
        return self.args
    
    def setDescription(self, newDesc: str):
        """Sets the description of the action"""
        self.description = newDesc
    def getDescription(self):
        """Returns the description of the action"""
        return self.description
    
    def get(self, stepName: str):
        """Finds and returns a step in the named action's arguments by name string. Returns None if no argument found"""
        for step in self.args:
            if step.getName().lower() == stepName.lower():
                return step
            
        raise KeyError("Argument \'" + str(stepName) + "\' not found in action: " + str(self.name))
    
    def copy(self):
        """Returns a deep copy of the action"""
        return fullCopy(self)


class ActionGroup:
    """
    The ActionGroup class represents a group of actions where only one action can be selected at a time.
    It has a name, a selected action, a list of arguments, and a description.
    """
    def __init__(self, name: str, args=[], description=""):
        self.name = name
        self.args = args
        self.description = description
        if len(args) > 0:
            self.selected = args[0]
        else:
            self.selected = None
    
    def __eq__(self, other):
        """
        Compares two ActionGroups for equality.
        Two ActionGroups are considered equal if they have the same name, selected action, arguments, and description.
        """
        return (
            isinstance(other, ActionGroup)
            and self.name == other.name
            and self.selected == other.selected
            and self.args == other.args
            and self.description == other.description
        )
    
    def __hash__(self):
        """Returns a hash of the action group"""
        return hash((self.name, self.selected or None, tuple(self.args), self.description))

    def __str__(self):
        return "ActionGroup: " + str(self.name) + "\nSelected: " + str(self.selected) + "\nArgs: " + str(self.args) + "\nDescription: " + str(self.description)

    def setName(self, newName: str):
        """Sets the name of the action group"""
        self.name = newName
    def getName(self):
        """Returns the name of the action group"""
        return self.name

    def setDescription(self, newDesc: str):
        """Sets the description of the action group"""
        self.description = newDesc
    def getDescription(self):
        """Returns the description of the action group"""
        return self.description

    def setArgs(self, newArgs: list):
        """Sets the args of the action group"""
        self.args = newArgs
    def getArgs(self):
        """Returns the args of the action group"""
        return self.args
    
    def getSelected(self):
        """Returns the selected action from the action group"""
        return self.selected
    def setSelected(self, action: Action):
        """Sets the selected action for the action group"""
        self.selected = action
    
    def get(self, stepName: str):
        """Finds and returns an arg (action, actionGroup, or argument) in the
        action group by its name string. Returns None if no action found"""
        for step in self.args:
            if step.getName().upper() == stepName.upper():
                return step
        raise KeyError("Action \'" + str(stepName) + "\' not found in action group: " + str(self))
    
    def copy(self):
        """Returns a deep copy of the action group"""
        return fullCopy(self)


class Argument:
    """
    The Argument class represents an argument that can be passed to an action or action group.
    It has a name, a value, and a description.
    """
    def __init__(self, name: str, value=None, description=""):
        self.name = name
        self.value = value
        self.description = description or ""

    def __eq__(self, other):
        """
        Compares two Argument objects for equality.
        Two Argument objects are considered equal if they have the same name, value, and description.
        """
        return (
            isinstance(other, Argument)
            and self.name == other.name
            and self.value == other.value
            and self.description == other.description
        )
    
    def __hash__ (self):
        """Returns a hash of the argument"""
        return hash((self.name, self.value, self.description))

    def __str__(self):
        return "Argument: " + str(self.name) + "\nValue: " + str(self.value) + "\nDescription: " + str(self.description)

    def setName(self, newName: str):
        """Sets the name of the argument"""
        self.name = newName
    def getName(self):
        """Returns the name of the argument"""
        return self.name

    def setDescription(self, newDesc: str):
        """Sets the description of the argument"""
        self.description = newDesc or ""
    def getDescription(self):
        """Returns the description of the argument"""
        return self.description

    def setValue(self, newValue: str):
        """Sets the value of the argument"""
        self.value = newValue
    def getValue(self):
        """Returns the value of the argument"""
        return self.value

    def copy(self):
        """Returns a deep copy of the argument"""
        return Argument(self.name, self.value, self.description)


def fullCopy(step):
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
    if isinstance(step, ActionGroup): # ActionGroup
        args = [fullCopy(arg) for arg in step.getArgs()]
        return ActionGroup(name=step.getName(), args=args, description=step.getDescription())
    
    elif isinstance(step, Action):    # Action
        args = [fullCopy(arg) for arg in step.getArgs()]
        return Action(name=step.getName(), args=args, description=step.getDescription())
    
    elif isinstance(step, Argument):  # Argument
        return step.copy()
    
    else:                               # Unknown
        print("Unknown action type in fullCopy: " + str(type(step)))