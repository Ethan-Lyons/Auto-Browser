from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import Argument
import Creator.RoutineMaker.InputOutput as InputOutput

import os

FOLDER_NAME = "tmp"
TMP_DIR = os.path.join(os.path.dirname(__file__), FOLDER_NAME)

def test_save():
    initialDir = TMP_DIR
    filePath = os.path.join(initialDir, "testRoutine.json")
    routine = Routine(inputOutput=InputOutput)
    routine.createDefaultAG()
    routine.saveRoutine(filePath)
    assert os.path.exists(filePath)
    os.remove(filePath)

def test_load():
    testArg = Argument("test")
    testArg.setValue("testValue")
    testAction = Action(name="Action Name", args=[testArg], description="Action Description")
    testGroup = ActionGroup(name="Group Name", args=[testAction], description="Group Description")

    initialDir = TMP_DIR
    filePath = os.path.join(initialDir, "testRoutine.json")
    originalRoutine = Routine(inputOutput=InputOutput)
    originalRoutine.addStep(testGroup)
    originalRoutine.saveRoutine(filePath)

    blankRoutine = Routine(inputOutput=InputOutput)
    blankRoutine.loadRoutine(filePath)
    
    assert str(originalRoutine) == str(blankRoutine)

    originalRoutine.createDefaultAG()
    assert str(originalRoutine) != str(blankRoutine)

    os.remove(filePath)

"""def saveRoutine(routine, filePath=None):

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

    path = Path(addr)
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open('w') as outfile:
        json.dump(routineData, outfile, indent=4)

def loadRoutine(filePath=None):

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
        return {
            "type": "ActionGroup",
            "name": entry.getName(),
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
        raise TypeError(f"Unsupported type for dictToActions: {actionDict['type']}")"""

