import tkinter as tk
import subprocess
from pathlib import Path

from Creator.RoutineMaker.StepFrameContainer import StepFrameContainer
from Creator.RoutineMaker.Routine import Routine
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument

class RoutineFrame:
    """Class representing a frame for a routine. Manages the step frames for the routine."""
    def __init__(self, parent: tk.Frame, routine: Routine):
        self.parent = parent
        self.routine = routine

        self.frame = tk.Frame(parent)
        self.sfContainer = self._buildSFContainer()
        self.stepFrames = []

        self.frame.rowconfigure(0, weight=1)
        self.frame.columnconfigure(0, weight=1)
        self.frame.grid(row=0, column=0, sticky="NSEW")
        
        self._buildFrame()


    def _buildFrame(self):
        """
        Builds and places the save, load, and add buttons, as well as the
        container for the step frames. Also adds a default step to the routine object if empty.
        """
        # Add a new default step if routine is empty
        if len(self.routine.getSteps()) == 0:
            self.routine.createDefStep()
            self.sfContainer.rebuild()

        # Create management buttons
        self.addButton = tk.Button(self.frame, text="+",
                                        command=lambda: self.sfContainer.addStepFrame())
        
        rManageFrame = self._buildRManageFrame(self.frame)
        
        # Arrange frame and buttons
        rManageFrame.grid(row=0, column=0, columnspan=4, pady=[0, 15], sticky="NSEW")
        self.sfContainer.grid(row=1, column=0, columnspan=4, sticky="NSEW")
        self.addButton.grid(row=2, column=0, sticky="NSEW")
        
    
    def _buildRManageFrame(self, parentFrame):
        rManageFrame = tk.Frame(parentFrame)

        saveButton = tk.Button(rManageFrame, text="Save", command=lambda: self.frameSave())
        loadButton = tk.Button(rManageFrame, text="Load", command=lambda: self.frameLoad())

        runButton = tk.Button(rManageFrame, text="Run", command=lambda: self.runRoutine())

        rManageFrame.rowconfigure(0, weight=1)
        rManageFrame.columnconfigure(0, weight=1)

        saveButton.grid(row=0, column=0, sticky="NSEW")
        loadButton.grid(row=0, column=1, sticky="NSEW")
        runButton.grid(row=0, column=2, sticky="NSEW")

        return rManageFrame

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
            self.sfContainer.rebuild()
    

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
        sfContainer = StepFrameContainer(
            parent=self.frame,
            getStepsCall=lambda: self.routine.getSteps(),
            createStepCall=lambda: self.routine.createDefStep(),
            removeStepCall=lambda step: self.routine.removeStep(step),
            moveStepCall=lambda stepIndex, toIndex: self.routine.moveStep(stepIndex, toIndex),
        )
        return sfContainer

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