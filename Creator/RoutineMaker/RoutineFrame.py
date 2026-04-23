import tkinter as tk
import subprocess
from pathlib import Path

from Creator.RoutineMaker.StepFrameContainer import StepFrameContainer
from Creator.RoutineMaker.ButtonFrameFactory import horizontalButtonFrame, verticalButtonFrame, ButtonInfo
from Creator.RoutineMaker.HelpFrame import HelpFrame
from Creator.RoutineMaker.Routine import Routine

class RoutineFrame:
    """Class representing a frame for a routine. Manages the step frames for the routine.
    
    Attributes:
        parent (tk.Frame): The parent frame to add the frame to
        routine (Routine): The routine to build a frame for
    """
    def __init__(self, parent: tk.Frame, routine: Routine):
        self.parent = parent
        self.routine = routine

        self.frame = tk.Frame(parent)
        self.sfContainer = self._buildSFContainer()
        self.stepFrames = []

        self.helpFrame = HelpFrame(self.frame, None)

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

        # Build sidebar and toolbar
        sidebarFrame = self._buildSidebar(self.frame)
        toolbarFrame = self._buildToolbar(self.frame)
        
        # Arrange frame and buttons
        toolbarFrame.grid(row=0, column=0, pady=[0, 15], sticky="NSEW")
        self.sfContainer.grid(row=1, column=0, columnspan=1, sticky="NSEW")
        sidebarFrame.grid(row=2, column=0, sticky="NSEW")
        self.helpFrame.getFrame().grid(row=0, column=1, rowspan=3, sticky="NSEW")

    def _buildSidebar(self, parent):
        """Builds and places the sidebar buttons"""
        buttonList = [ButtonInfo("+", lambda: self.sfContainer.addStepFrame())]
        
        sidebarFrame = verticalButtonFrame(parent, buttonList)
        return sidebarFrame
        
    
    def _buildToolbar(self, parent):
        """Builds and places the toolbar buttons"""
        buttonList = [
            ButtonInfo("Save", lambda: self.frameSave()),
            ButtonInfo("Load", lambda: self.frameLoad()),
            ButtonInfo("Run", lambda: self.runRoutine())
        ]

        toolbarFrame = horizontalButtonFrame(parent, buttonList)

        return toolbarFrame
    
    def updateHelpFrame(self, step):
        """Updates the help frame to display help for the given step"""
        if not isinstance(self.helpFrame, HelpFrame):
            raise TypeError(f"Cannot update, unexpected helpFrame type: {type(self.helpFrame)}")
        self.helpFrame.updateHelp(step)

    def frameSave(self, filePath=None):
        """Saves the routine to a file."""
        self.routine.saveRoutine(filePath)

    def frameLoad(self, filePath=None):
        """
        Loads a routine from a file and rebuilds the action frames accordingly.
        This function will destroy the existing action frames and rebuild the list from the loaded routine.
        """
        needUpdate = self.routine.loadRoutine(filePath)

        # Avoids error if window is closed without selecting a file
        if needUpdate:
            self.sfContainer.rebuild()
    

    def runRoutine(self):
        """Runs the routine using the CLI interface."""
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
            updateHelpFrame=lambda step: self.updateHelpFrame(step)
        )

        return sfContainer

    def getSteps(self):
        """Returns the list of steps in the routine."""
        return self.routine.getSteps()

    def getStepFrames(self):
        """Returns the list of action frames under the routine frame."""
        return self.sfContainer.getStepFrames()
    
    def getStepFrameContainer(self):
        return self.sfContainer

    def getFrame(self):
        """Returns the tkinter frame associated with this routine frame."""
        return self.frame

    def getRoutine(self):
        """Returns the routine object associated with this routine frame."""
        return self.routine