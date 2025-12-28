from Steps import Action
from Steps import ActionGroup
from Steps import Argument

def createAction(name, args=[], description=""):
    """Creates a new action object and adds it to the list of actions

    Args:
        name (str): The name of the action
        args (list): A list of arguments for the action
        description (str): A description of the action

    Returns:
        Action: The newly created action
    """
    newAction = Action(name=name, args=args, description=description)
    return newAction
    
def createActionGroup(name, actions=[], description=""):
    """Creates a new action group object and adds it to the list of actions

    Args:
        name (str): The name of the action group
        actions (list): A list of actions for the action group args
        description (str): A description of the action group

    Returns:
        ActionGroup: The newly created action group
    """
    newActionGroup = ActionGroup(name=name, args=actions, description=description)
    return newActionGroup
    
def createArgument(name, description=""):
    """Creates a new argument object

    Args:
        name (str): The name of the argument
        description (str): A description of the argument

    Returns:
        Argument: The newly created argument
    """
    newArgument = Argument(name=name, description=description)
    return newArgument