import tkinter
import tkinter.filedialog
from pathlib import Path
import json
import os

from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.RoutineIOConverter import stepsToDict, dictToSteps, routineToDict, dictToRoutine

ROUTINE_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "../../Routines")
    )

def saveRoutine(routine: Routine, filePath=None) -> None:
    """
    Save a routine to a file.
    If a file path is not provided, a dialog box will appear to save the file.

    Args:
        routine (Routine): Routine to be saved.
        filePath (str): The path of the file (directory + file name) to save the routine to. Defaults to None.
    """
    if not filePath:    # Prompt the user to select file output
        os.makedirs(ROUTINE_DIR, exist_ok=True)

        filePath = tkinter.filedialog.asksaveasfilename(
            initialdir = ROUTINE_DIR,
            title = "Select file",
            filetypes = (("json files", "*.json"), ("all files", "*.*")),
            defaultextension = ".json"
        )
    if filePath:
        rTD = routineToDict(routine)    # Convert and output routine
        outputDictRoutine(rTD, filePath)
        print("Saved routine to " + filePath)

def outputDictRoutine(routineData: dict, fullPath: str) -> None:
    """
    Outputs a routine dictionary as a JSON file to the address provided.
    
    Args:
        routineData (dict): The data dictionary of a Routine to be saved.
        fullPath (str): The path of the file (directory + file name) to save the routine to.
    """
    path = Path(fullPath)
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open('w', encoding='utf-8') as outfile:
        json.dump(routineData, outfile, indent=4)

def loadRoutine(filePath: str | None = None) -> Routine | None:
    """
    Create a Routine from a JSON file.
    If a file name is not provided, a dialog box will appear to select a file.

    Args:
        filePath (str): The path of the file to load the routine from. Defaults to None.

    Returns:
        Routine: The loaded routine.
    """
    if not filePath:    # Prompt the user to select file
        os.makedirs(ROUTINE_DIR, exist_ok=True)
        
        filePath = tkinter.filedialog.askopenfilename(
            initialdir = ROUTINE_DIR,
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
        
        output = dictToRoutine(data)    # Convert and output
        print("Loaded routine from " + filePath)
        return output
    else:
        print("No file selected, routine not loaded.")
        return