from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument

def routineToDict(routine: Routine) -> dict:
    """
    Converts a Routine into a dictionary.
    
    Args:
        routine (Routine): The routine to be converted.
    
    Returns:
        dict: The dictionary representation of the routine.
    """
    return {
        "type": "Routine",
        "steps": [stepsToDict(step) for step in routine.getSteps()]
    }

def stepsToDict(entry: Action | ActionGroup | Argument) -> dict:
    """
    Recursively converts an Action, ActionGroup, or Argument into a dictionary.
    
    Args:
        entry (Action or ActionGroup or Argument): The object to be converted.
    
    Returns:
        dict: The dictionary representation of the action or action group.
    """
    if isinstance(entry, Argument):  # Argument
        return {
            "type": "Argument",
            "name": entry.getName(),
            "value": entry.getValue(),
            "description": entry.getDescription()
        }
    elif isinstance(entry, Action): # Action
        result = {
            "type": "Action",
            "name": entry.getName(),
            "args": [stepsToDict(arg) for arg in entry.getArgs()],
            "description": entry.getDescription()
            }
        return result
    elif isinstance(entry, ActionGroup):    # ActionGroup
        selected = entry.getSelected()
        if selected:    # Prevents calling actionsToDict on None
            selected = stepsToDict(selected)

        return {
            "type": "ActionGroup",
            "name": entry.getName(),
            "selected": selected,
            "allArgs": [stepsToDict(a) for a in entry.getArgs()],      # Saves input for all unused actions
            "description": entry.getDescription()
        }
    else:   # Unknown type
        raise TypeError(f"Unsupported type for actionToDict: {type(entry)}")
    
def dictToRoutine(rDict: dict) -> Routine:
    """Converts a dictionary into a Routine.
    
    Args:
        rDict (dict): The dictionary to be converted.
    
    Returns:
        Routine: The converted routine.
    """
    newRoutine = Routine()
    if rDict["type"] == "Routine":   # If the input is already a routine type
        for subDict in rDict["steps"]:
            newRoutine.addStep(dictToSteps(subDict))
    else:  # If the input is not a routine type, try to convert it as a step and add it to the routine
        newRoutine.addStep(dictToSteps(rDict))
    return newRoutine
    
def dictToSteps(actionDict: dict) -> Action | ActionGroup | Argument:
    """
    Recursively converts a dictionary into an Action, ActionGroup, or Argument.
    
    Args:
        actionDict (dict): The dictionary to be converted.
    
    Returns:
        Action, ActionGroup, or Argument: The converted action or action group.
    """
    if not isinstance(actionDict, dict):    # Check if the input is a dictionary
        raise TypeError(f"Expected dict, got {type(actionDict)}")

    if actionDict["type"] == "Argument":    # Argument
        return Argument(name=actionDict["name"],
                        value=actionDict["value"],
                        description=actionDict["description"])
    
    elif actionDict["type"] == "Action":    # Action
        return Action(name=actionDict["name"],
                      args=[dictToSteps(a) for a in actionDict["args"]],
                      description=actionDict["description"])
    
    elif actionDict["type"] == "ActionGroup":   # ActionGroup
        newGroup = ActionGroup(name=actionDict["name"],
                               args=[dictToSteps(a) for a in actionDict["allArgs"]],
                               description=actionDict["description"])
        
        selected = actionDict.get("selected")
        if selected is not None:
            selectedAction = newGroup.get(selected["name"])
            newGroup.setSelected(selectedAction)
        else :
            newGroup.setSelected(None)
            
        return newGroup

    else:   # Unknown type
        raise TypeError(f"Unsupported type for dictToSteps: {actionDict['type']}")