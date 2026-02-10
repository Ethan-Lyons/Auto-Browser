from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument

def createAction(name: str, args=[], description=""):
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
    
def createActionGroup(name: str, actions=[], description=""):
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
    
def createArgument(name: str, description=""):
    """Creates a new argument object

    Args:
        name (str): The name of the argument
        description (str): A description of the argument

    Returns:
        Argument: The newly created argument
    """
    newArgument = Argument(name=name, description=description)
    return newArgument