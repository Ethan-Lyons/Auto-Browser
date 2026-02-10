import tkinter

from RoutineMaker.RoutineFrame import RoutineFrame
from RoutineMaker.Routine import Routine
import RoutineMaker.InputOutput as InputOutput

def createWindow():
    """
    Create a tkinter window with a RoutineFrame widget for creating a routine.

    Returns:
        tkinter.Tk: The root of the window.
    """
    root = tkinter.Tk()
    routine = Routine(inputOutput=InputOutput)
    root.title("Routine Maker")
    
    root.routineFrame = RoutineFrame(parent=root, routine=routine)
    return root

if __name__ == "__main__":
    root = createWindow()
    routineName = 'placeholder.json'
    root.mainloop()