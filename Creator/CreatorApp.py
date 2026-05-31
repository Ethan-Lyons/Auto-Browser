import tkinter

from Creator.RoutineMaker.RoutineFrame import RoutineFrame
from Creator.RoutineMaker.Routine import Routine
import Creator.RoutineMaker.RoutineIO as RoutineIO

def createWindow() -> tkinter.Tk:
    """
    Create a tkinter window with a RoutineFrame widget for creating a routine.

    Returns:
        tkinter.Tk: The root of the window.
    """
    root = tkinter.Tk()
    routine = Routine()
    root.title("Routine Maker")
    
    rootFrame = RoutineFrame(root=root, routine=routine)

    return root