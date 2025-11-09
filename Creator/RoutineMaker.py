import tkinter
from RoutineFrame import RoutineFrame
from Routine import Routine
import InputOutput

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

# TODO
# Add a toolbar for routine frame (delete duplicate add save etc.)
# Add if function (if then? else? (need like an end if/then/else))
# Add for function 
# Add let function (i.e. let var scoobert = # of tabs) (let var = length of custom variable (for groups))
# Add wait function

# TODO - interpreter
# Add support for custom variables (store as), (maintain dictionary)