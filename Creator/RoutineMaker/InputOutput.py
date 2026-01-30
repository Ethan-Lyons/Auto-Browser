import tkinter
import tkinter.filedialog
from pathlib import Path
import json
import os

from RoutineMaker.Routine import Routine
from RoutineMaker.Steps import Action
from RoutineMaker.Steps import ActionGroup
from RoutineMaker.Steps import Argument

def saveRoutine(routine, filePath=None):
    """
    Save a routine to a file.
    If a file path is not provided, a dialog box will appear to save the file.

    Args:
        routine (Routine): Routine to be saved.
        fileName (str): String with the address and name of the file to save the routine to.
            Defaults to None.
    """
    if not filePath:    # Prompt the user to select file output
        routineDir = os.path.join(os.path.dirname(__file__), "../Routines")
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

def outputRoutine(routineData, addr):
    """
    Outputs a routine as a JSON file to the address provided.
    
    Args:
        routineData (dict): The data dictionary of a Routine to be saved.
        addr (str): The address of the file to save to.
    """
    path = Path(addr)
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open('w') as outfile:
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

def actionsToDict(entry):
    """
    Recursively converts an Action or ActionGroup into a dictionary.
    
    Args:
        entry (Action or ActionGroup): The object to be converted.
    
    Returns:
        dict: The dictionary representation of the action or action group.
    """
    if isinstance(entry, Argument):  # Argument
        return {
            "type": "Argument",
            "name": str(entry),
            "value": entry.getValue(),
            "description": entry.getDescription()
        }
    elif isinstance(entry, Action): # Action
        result = {
            "type": "Action",
            "name": str(entry),
            "args": [actionsToDict(arg) for arg in entry.getArgs()],
            "description": entry.getDescription()
            }
        return result
    elif isinstance(entry, ActionGroup):    # ActionGroup
        return {
            "type": "ActionGroup",
            "name": str(entry),
            "selected": actionsToDict(entry.getSelected()),
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
    
def dictToActions(actionDict):
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
        
        selectedAction = newGroup.get(actionDict["selected"]["name"])    # Find the selected action
        newGroup.setSelected(selectedAction)
        return newGroup
    
    elif actionDict["type"] == "Routine":   # Routine
        newRoutine = Routine()
        for step in actionDict["steps"]:
            newRoutine.addStep(dictToActions(step))
        return newRoutine
    
    else:   # Unknown type
        raise TypeError(f"Unsupported type for dictToActions: {actionDict['type']}")