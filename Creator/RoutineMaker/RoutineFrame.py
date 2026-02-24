import tkinter as tk
import subprocess
from pathlib import Path

from Creator.RoutineMaker.StepFrame import StepFrame
from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument

class RoutineFrame():
    """Class representing a frame for a routine. Manages the step frames for the routine."""
    def __init__(self, parent: tk.Frame, routine: Routine):
        self.parent = parent
        self.routine = routine

        self.frame = tk.Frame(parent)
        self.stepFrameContainer = None
        self.stepFrames = []
        
        self.frame.grid(row=0, column=0)
        self._buildFrame()


    def _buildFrame(self):
        """
        Builds and places the save, load, and add buttons, as well as the
        container for the step frames. Also adds a default step to the routine object if empty.
        """
        # Add a new step if routine is empty
        if len(self.routine.getSteps()) == 0:
            self.routine.createDefStep()
        
        # Create step frame container
        self.stepFrameContainer = self._buildSFContainer()

        # Create management buttons
        self.addButton = tk.Button(self.frame, text="+",
                                        command=lambda: self.addStepFrame())
        self.saveButton = tk.Button(self.frame, text="Save", command=lambda: self.frameSave())
        self.loadButton = tk.Button(self.frame, text="Load", command=lambda: self.frameLoad())

        self.runButton = tk.Button(self.frame, text="Run", command=lambda: self.runRoutine())



        # Arrange frame and buttons
        self.stepFrameContainer.grid(row=0, column=0, columnspan=4)
        self.addButton.grid(row=1, column=0)
        self.saveButton.grid(row=1, column=1)
        self.loadButton.grid(row=1, column=2)
        self.runButton.grid(row=1, column=3)

    def frameSave(self, filePath=None):
        """Saves the routine to a file."""
        self.routine.saveRoutine(filePath)

    def frameLoad(self, filePath=None):
        """
        Loads a routine from a file and rebuilds the action frames accordingly.
        This function will destroy the existing action frames and rebuild the list from the loaded routine.
        """
        needUpdate = self.routine.loadRoutine(filePath)  # load the routine from file and remove previous frames
        if needUpdate:
            self.stepFrameContainer.destroy()
            self.stepFrames = []

            self.stepFrameContainer = self._buildSFContainer()   # re-build the frame
            self.stepFrameContainer.grid(row=0, column=0)
    

    def runRoutine(self):
        # Ensure tmp dir exists
        tmpDir = Path(__file__).resolve().parent / "tmp"
        tmpDir.mkdir(exist_ok=True)

        # Save routine JSON
        fullPath = tmpDir / "RunningRoutine.json"
        self.routine.saveRoutine(str(fullPath))

        # Resolve CLI path
        cliPath = Path(__file__).resolve().parent.parent.parent / "Interpreter" / "AppCLI.js"

        # Run node CLI with routine path
        subprocess.run(
            ["node", str(cliPath), str(fullPath)],
            check=True
        )

        # Clean up (remove file)
        fullPath.unlink()


    def _buildSFContainer(self):
        """
        Builds and returns a frame containing all the step frames for the branches in the routine.
        """
        sfContainer = tk.Frame(self.frame)
        self.stepFrames = []
        stepList = self.routine.getSteps()

        for branch in stepList:  # create each step frame
            newFrame = self._createStepFrame(branch, sfContainer)
            self.stepFrames.append(newFrame)
            
        return sfContainer

    def addStepFrame(self):
        """
        Creates a new step branch in the routine and creates a new step frame for it.
        
        Returns:
            The new StepFrame object for the created action branch.
        """
        newBranch = self.routine.createDefStep()
        newFrame = self._createStepFrame(newBranch, parent=self.stepFrameContainer)
        self.stepFrames.append(newFrame)
        return newFrame

    def _createStepFrame(self, step: Action | ActionGroup | Argument, parent: tk.Frame):
        """
        Creates a new StepFrame for the given action and adds it to the container frame under the routine frame.
        
        Args:
            step (Action or ActionGroup or Argument): The action or action group or argument for the new step frame
            parent (Frame): The parent frame in which to place the step frame
        Returns:
            The new StepFrame object.
        """
        stepFrame = StepFrame(routineFrame=self, step=step, parent=parent)
        frame = stepFrame.getFrame()
        frame.grid(row=len(self.stepFrames), column=0)
        return stepFrame

    def moveStep(self, stepFrame: StepFrame, offset: int):
        """
        Moves an action frame to a new position in the routine frame's list, given by the offset.
        Also moves the action in the routine object accordingly.
        
        Args:
            stepFrame (StepFrame): The action frame to be moved
            offset (int): The offset of the new position from the current position
        """
        actionIndex = self.routine.getIndex(stepFrame.getStep())    # update action list in routine
        self.routine.moveAction(actionIndex, actionIndex + offset)

        stepFrameIndex = self.stepFrames.index(stepFrame)       # update stepFrames list in routineFrame
        popFrame = self.stepFrames.pop(stepFrameIndex)
        self.stepFrames.insert(actionIndex + offset, popFrame)

        self.reorderStepFrames()  # updates frames to match

    def reorderStepFrames(self):
        """
        Updates the action frames in the frame container to match their
        index in the list of action frames.
        """
        currentRow = 0
        for stepFrame in self.stepFrames:
            stepFrame.getFrame().grid(row=currentRow, column=0)
            currentRow += 1

    def removeStepFrame(self, stepFrame: StepFrame):
        """
        Removes a step frame from the routine frame and destroys it.
        
        Args: 
            stepFrame (StepFrame): The step frame to be removed.
        """
        for checkFrame in self.stepFrames:
            if checkFrame == stepFrame:
                self.routine.removeStep(stepFrame.getStep())
                self.stepFrames.remove(stepFrame)
                stepFrame.destroy()
                return

    def getSteps(self):
        """Returns the list of steps in the routine."""
        return self.routine.getSteps()

    def getStepFrames(self):
        """Returns the list of action frames under the routine frame."""
        return self.stepFrames

    def getFrame(self):
        """Returns the tkinter frame associated with this routine frame."""
        return self.frame

    def getRoutine(self):
        """Returns the routine object associated with this routine frame."""
        return self.routine