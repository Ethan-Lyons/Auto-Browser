from __future__ import annotations
import tkinter as tk
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument
from Creator.RoutineMaker.ButtonFrameFactory import horizontalButtonFrame, ButtonInfo
from typing import Callable
from Creator.RoutineMaker.StepFrameFactory import buildSubStepFrame

class StepFrame:
    """Represents a frame for a step inside a routine frame"""
    def __init__(
        self,
        parent: tk.Frame,
        step: Action | ActionGroup | Argument,
        removeStepFrame: Callable[[StepFrame], None],
        moveStepFrame: Callable[[StepFrame, int], None]
    ):
        # Create the frame
        self.frame = tk.Frame(parent)
        
        # injected behavior
        self.removeStepFrame = removeStepFrame
        self.moveStepFrame = moveStepFrame
        
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

        self.subStepFrame = buildSubStepFrame(
            self.step,
            self.frame,
            self.onGroupChange,
            self.storeGroupSubFrame
        )
        self.buttonFrame = self.buildButtonFrame(self.frame)
        
        self.subStepFrame.grid(row=0, column=0, sticky="NSEW")
        self.buttonFrame.grid(row=0, column=2, sticky="NSEW")

    def onGroupChange(self, group: ActionGroup, groupFrame: tk.Frame, selectStepStr: str):
        oldSubFrame = self.groupSubFrames.get(group)
        if oldSubFrame:
            oldSubFrame.destroy()

        selectStep = group.get(selectStepStr)
        group.setSelected(selectStep)

        newSub = buildSubStepFrame(
            group.getSelected(),
            groupFrame,
            self.onGroupChange,
            self.storeGroupSubFrame
        )
        newSub.grid(row=0, column=2)

        self.groupSubFrames[group] = newSub
    
    def storeGroupSubFrame(self, group, subframe):
        self.groupSubFrames[group] = subframe

    def destroy(self):
        """Destroys the tkinter frame associated with this action frame"""
        self.frame.destroy()
    
    def buildButtonFrame(self, parentFrame: tk.Frame):
        """Builds and returns a frame containing buttons for moving and managing a step frame"""
        upButtonInfo = ButtonInfo("↑", lambda: self.moveStepFrame(self, -1))
        downButtonInfo = ButtonInfo("↓", lambda: self.moveStepFrame(self, 1))
        removeButtonInfo = ButtonInfo("X", lambda: self.removeStepFrame(self))

        bFrame = horizontalButtonFrame(parentFrame, [upButtonInfo, downButtonInfo, removeButtonInfo])
        return bFrame