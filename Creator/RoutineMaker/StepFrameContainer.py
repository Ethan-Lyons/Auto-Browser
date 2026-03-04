import tkinter as tk
from Creator.RoutineMaker.StepFrame import StepFrame
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
from typing import Callable

class StepFrameContainer:
    """
    UI container responsible for displaying and managing all StepFrames.
    Routine steps are modified through callbacks.
    """
    def __init__(
        self,
        parent: tk.Frame,
        getStepsCall: Callable [[], list[Action | ActionGroup | Argument]],
        createStepCall: Callable [[], Action | ActionGroup | Argument],
        removeStepCall: Callable [[Action | ActionGroup | Argument], None],
        moveStepCall: Callable [[int, int], None]
    ):
        # Create the frame
        self.frame = tk.Frame(parent)

        # injected behavior
        self.routineGetSteps = getStepsCall
        self.routineCreateStep = createStepCall
        self.routineRemoveStep = removeStepCall
        self.routineMoveStep = moveStepCall

        # mutable values
        self.stepFrames = []

        self._build()

    def _build(self):
        """Build initial step frames from routine."""
        for step in self.routineGetSteps():
            self._createStepFrame(step)

    def _createStepFrame(self, step):
        """Creates a step frame and places it in the container.
        
        Args:
            step (Action | ActionGroup | Argument): The step to create a frame for.
        """
        stepFrame = StepFrame(
            parent=self.frame,
            step=step,
            removeStepFrame=self.removeStepFrame,
            moveStepFrame=self.moveStepFrame
        )
        
        stepFrame.getFrame().grid(row=len(self.stepFrames), column=0, sticky="NSEW")

        self.stepFrames.append(stepFrame)

    def addStepFrame(self):
        """Creates a new step in the routine object and creates a StepFrame for it."""
        step = self.routineCreateStep()
        self._createStepFrame(step)
    
    def removeStepFrame(self, stepFrame: StepFrame):
        """Removes a step from the routine object and destroys its frame."""
        self.routineRemoveStep(stepFrame.getStep())
        self._remove(stepFrame)

    def _remove(self, stepFrame: StepFrame):
        """Removes a step frame from the container and destroys it."""
        if stepFrame not in self.stepFrames:
            raise ValueError("StepFrame not found in container. stepFrame: " + str(stepFrame) + ", stepFrames: " + str(self.stepFrames))
        
        self.stepFrames.remove(stepFrame)
        stepFrame.destroy()

    def moveStepFrame(self, stepFrame: StepFrame, offset: int):
        """Moves a step frame in the container and in the routine object."""
        if offset == 0:
            return
        
        # Move step in the routine object
        index = self.stepFrames.index(stepFrame)
        toIndex = index + offset

        # Check if move is valid
        if toIndex < 0 or toIndex >= len(self.stepFrames) or index < 0 or index >= len(self.stepFrames):
            return
        
        self.routineMoveStep(index, toIndex)

        # Move step frame in the container
        self._reorderFrames()

    def _reorderFrames(self):
        """Reorders the step frames in the container to match the routine object."""
        rSteps = self.routineGetSteps()

        # Rebuild stepFrames order to match model
        newOrder = []
        for step in rSteps:
            for sf in self.stepFrames:
                if sf.getStep() is step:
                    newOrder.append(sf)
                    break

        self.stepFrames = newOrder

        # Re-grid in correct order
        for i, sf in enumerate(self.stepFrames):
            sf.getFrame().grid(row=i, column=0, sticky="NSEW")

    def grid(self, **kwargs):
        """Wrapper for grid() that calls grid() on the frame."""
        self.frame.grid(**kwargs)

    def destroy(self):
        """Destroys the container frame."""
        self.frame.destroy()
    
    def clear(self):
        """Removes all step frames from the container."""
        for sf in self.stepFrames:
            sf.destroy()
        self.stepFrames.clear()
    
    def rebuild(self):
        """Clears the container and rebuilds it from the routine object."""
        self.clear()
        self._build()
    
    def getStepFrames(self):
        return self.stepFrames