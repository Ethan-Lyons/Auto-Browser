import tkinter
import tkinter.filedialog
from pathlib import Path
import json
import os

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument

def saveRoutine(routine, filePath=None):
    """
    Save a routine to a file.
    If a file path is not provided, a dialog box will appear to save the file.

    Args:
        routine (Routine): Routine to be saved.
        filePath (str): The path of the file (directory + file name) to save the routine to. Defaults to None.
    """
    if not filePath:    # Prompt the user to select file output
        routineDir = os.path.join(os.path.dirname(__file__), "../Routines") # Open to default directory
        routineDir = os.path.normpath(routineDir)

        os.makedirs(routineDir, exist_ok=True)

        filePath = tkinter.filedialog.asksaveasfilename(
            initialdir = routineDir,
            title = "Select file",
            filetypes = (("json files", "*.json"), ("all files", "*.*")),
            defaultextension = ".json"
        )
    if filePath:
        rTD = actionsToDict(routine)    # Convert and output routine
        outputRoutine(rTD, filePath)
        print("Saved routine to " + filePath)

def outputRoutine(routineData: dict, fullPath: str):
    """
    Outputs a routine as a JSON file to the address provided.
    
    Args:
        routineData (dict): The data dictionary of a Routine to be saved.
        fullPath (str): The path of the file (directory + file name) to save the routine to.
    """
    path = Path(fullPath)
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open('w', encoding='utf-8') as outfile:
        json.dump(routineData, outfile, indent=4)

def loadRoutine(filePath=None):
    """
    Create a Routine from a JSON file.
    If a file name is not provided, a dialog box will appear to select a file.

    Args:
        filePath (str): The path of the file to load the routine from. Defaults to None.

    Returns:
        Routine: The loaded routine.
    """
    if not filePath:    # Prompt the user to select file
        filePath = tkinter.filedialog.askopenfilename(
            initialdir = os.path.join(os.path.dirname(__file__), "Routines"),
            title = "Select file",
            filetypes = (("json files", "*.json"), ("all files", "*.*")),
            defaultextension = ".json"
        )
    if filePath:
        try:    # Try to load the file
            with open(filePath) as file:
                data = json.load(file)
        except:
            print("Error loading routine from " + filePath)
            return
        
        output = dictToActions(data)    # Convert and output
        print("Loaded routine from " + filePath)
        return output

def actionsToDict(entry: Action | ActionGroup | Argument):
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
            "args": [actionsToDict(arg) for arg in entry.getArgs()],
            "description": entry.getDescription()
            }
        return result
    elif isinstance(entry, ActionGroup):    # ActionGroup
        selected = entry.getSelected()
        if selected:    # Prevents calling actionsToDict on None
            selected = actionsToDict(selected)

        return {
            "type": "ActionGroup",
            "name": entry.getName(),
            "selected": selected,
            "allArgs": [actionsToDict(a) for a in entry.getArgs()],      # Saves input for all unused actions
            "description": entry.getDescription()
        }
    elif isinstance(entry, Routine):    # Routine
        return {
            "type": "Routine",
            "steps": [actionsToDict(a) for a in entry.getSteps()]
        }
    else:   # Unknown type
        raise TypeError(f"Unsupported type for actionToDict: {type(entry)}")
    
def dictToActions(actionDict: dict):
    """
    Recursively converts a dictionary into an Action or ActionGroup.
    
    Args:
        actionDict (dict): The dictionary to be converted.
    
    Returns:
        Action or ActionGroup: The converted action or action group.
    """
    if not isinstance(actionDict, dict):    # Check if the input is a dictionary
        raise TypeError(f"Expected dict, got {type(actionDict)}")

    if actionDict["type"] == "Argument":    # Argument
        return Argument(name=actionDict["name"],
                        value=actionDict["value"],
                        description=actionDict["description"])
    
    elif actionDict["type"] == "Action":    # Action
        return Action(name=actionDict["name"],
                      args=[dictToActions(a) for a in actionDict["args"]],
                      description=actionDict["description"])
    
    elif actionDict["type"] == "ActionGroup":   # ActionGroup
        newGroup = ActionGroup(name=actionDict["name"],
                               args=[dictToActions(a) for a in actionDict["allArgs"]],
                               description=actionDict["description"])
        
        selected = actionDict.get("selected")
        if selected is not None:
            selectedAction = newGroup.get(selected["name"])
            newGroup.setSelected(selectedAction)
        else :
            newGroup.setSelected(None)
            
        return newGroup
    
    elif actionDict["type"] == "Routine":   # Routine
        newRoutine = Routine()
        for step in actionDict["steps"]:
            newRoutine.addStep(dictToActions(step))
        return newRoutine
    
    else:   # Unknown type
        raise TypeError(f"Unsupported type for dictToActions: {actionDict['type']}")