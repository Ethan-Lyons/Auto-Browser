from __future__ import annotations
import tkinter as tk
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument
from Creator.RoutineMaker.ButtonFrameFactory import horizontalButtonFrame, ButtonInfo
from typing import Callable
from Creator.RoutineMaker.StepFrameFactory import buildSubStepFrame

class StepFrame:
    """Represents a frame for a step inside a routine frame

    Attributes:
        parent (tk.Frame): The parent frame to add the frame to
        step (Action, ActionGroup, or Argument): The step to build a frame for
        removeStepFrame (Callable [[StepFrame], None]): The function to call when a step is removed
        moveStepFrame (Callable [[StepFrame, int], None]): The function to call when a step is moved
        updateHelpFrame (Callable[[Action | ActionGroup | Argument], None]): The function to call when a step is updated
    """
    def __init__(
        self,
        parent: tk.Frame,
        step: Action | ActionGroup | Argument,
        removeStepFrame: Callable [[StepFrame], None],
        moveStepFrame: Callable [[StepFrame, int], None],
        updateHelpFrame: Callable[[Action | ActionGroup | Argument], None]
    ):
        # Create the frame
        self.frame = tk.Frame(parent)
        
        # injected behavior
        self.removeStepFrame = removeStepFrame
        self.moveStepFrame = moveStepFrame
        self.updateHelpFrame = updateHelpFrame
        
        # set argument values
        self.parent = parent
        self.step = step

        # mutable values
        self.buttonFrame = None
        self.groupSubFrames = {}
        self.stepFrames = []

        self._build()
    
    def __str__(self):
        return "(Frame for step: " + str(self.step) + ")"
    
    def getFrame(self):
        """Returns the tkinter frame associated with this step frame"""
        return self.frame

    def getStep(self):
        """Returns the step associated with this step frame"""
        return self.step

    def _build(self):
        """Builds and places the argument frame and button frame"""
        # Build subframe
        self.subStepFrame = buildSubStepFrame(
            self.step,
            self.frame,
            self.onGroupChange,
            self.storeGroupSubFrame
        )
        # Build button frame
        self.buttonFrame = self.buildButtonFrame(self.frame)
        
        # Layout frames
        self.subStepFrame.grid(row=0, column=0, sticky="NSEW")
        self.buttonFrame.grid(row=0, column=1, sticky="NSEW")
        
        # Add weights
        self.frame.grid_rowconfigure(0, weight=1)
        self.frame.grid_columnconfigure((0, 1), weight=1)

    def onGroupChange(self, group: ActionGroup, groupFrame: tk.Frame, selectStepStr: str):
        """Called when a group selected is changed, updates subframe to match new selected step

        Args:
            group (ActionGroup): The group that was changed
            groupFrame (tk.Frame): The frame for the group
            selectStepStr (str): The name of the step that was selected
        """
        # Destroy old subframe
        oldSubFrame = self.groupSubFrames.get(group)
        if oldSubFrame:
            oldSubFrame.destroy()

        # Gets the step associated with the selected string and sets it as selected
        selectStep = group.get(selectStepStr)
        group.setSelected(selectStep)

        # Build new subframe
        newSub = buildSubStepFrame(
            group.getSelected(),
            groupFrame,
            self.onGroupChange,
            self.storeGroupSubFrame
        )

        # Layout new subframe
        newSub.grid(row=0, column=2, sticky="NSEW")

        # Store new subframe
        self.storeGroupSubFrame(group, newSub)
    
    def storeGroupSubFrame(self, group: ActionGroup, subframe: tk.Frame):
        """Stores the subframe for the given group

        Args:
            group (ActionGroup): The group to store the subframe for
            subframe (tk.Frame): The subframe to store
        """
        self.groupSubFrames[group] = subframe

    def destroy(self):
        """Destroys the tkinter frame associated with this action frame"""
        self.frame.destroy()
    
    def buildButtonFrame(self, parentFrame: tk.Frame):
        """Builds and returns a frame containing buttons for moving and managing a step frame

        Args:
            parentFrame (tk.Frame): The parent frame to add the buttons to

        Returns:
            tk.Frame: A frame containing buttons for moving and managing a step frame
        """
        # Create buttons
        upButtonInfo = ButtonInfo("↑", lambda: self.moveStepFrame(self, -1))
        downButtonInfo = ButtonInfo("↓", lambda: self.moveStepFrame(self, 1))
        removeButtonInfo = ButtonInfo("X", lambda: self.removeStepFrame(self))
        helpButtonInfo = ButtonInfo("?", lambda: self.updateHelpFrame(self.getStep()))

        # Create button frame
        bFrame = horizontalButtonFrame(parentFrame, [upButtonInfo, downButtonInfo,
                                                     removeButtonInfo, helpButtonInfo])
        return bFrame