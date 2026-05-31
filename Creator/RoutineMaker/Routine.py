from Creator.RoutineMaker.UserStepBuilder import UserActionBuilder
from Creator.RoutineMaker.Steps import Action, ActionGroup, Argument
#from Creator.RoutineMaker.InputOutput import saveRoutine, outputRoutine, loadRoutine
from typing import Callable

class Routine:
    """A class for creating and editing a series of steps composed into a routine.
    
    Attributes:
        inputOutput (InputOutput): An instance of the InputOutput class used for saving and loading routines.
        UAB (UserActionBuilder): An instance of the UserActionBuilder class used to build user actions.
        steps (list): A list of steps in the routine.
    """
    def __init__(self):
        #self.inputOutput = inputOutput  # gives access to the InputOutput class functions
        self.UAB = UserActionBuilder()
        self.userActionGroup = self.UAB.getUserStepsActionGroup()
        self.steps = []
    
    def __eq__(self, other):
        return (
            isinstance(other, Routine)
            and self.steps == other.steps
        )

    def __str__(self):
        return f"Routine(steps={self.steps})"
    
    """def save(self, filePath=None):
        ""
        Save a routine to a file using the InputOutput class.

        Args:
            filePath (str): The path of the file to save the routine to. Defaults to None.
        ""
        saveRoutine(self, filePath)
    
    # Returns a bool indicating if the routine has been updated
    def load(self, filePath=None):
        ""
        Load a routine from a JSON file using the InputOutput class.

        Args:
            filePath (str): The path of the file to load the routine from. Defaults to None.
        
        Returns:
            bool: True if the routine has been updated, False otherwise.
        ""
        newRoutine = loadRoutine(filePath)
        if newRoutine:
            self.steps.clear()
            self.steps.extend(newRoutine.getSteps())
            return True
        return False"""

    def addStep(self, step: Action | ActionGroup | Argument):
        """Adds a step to the routine step list."""
        self.steps.append(step)
    
    def removeStep(self, step: Action | ActionGroup | Argument):
        """Removes a step from the routine step list."""
        if step in self.steps:
            self.steps.remove(step)

    def createDefStep(self) -> ActionGroup:
        """
        Creates a new ActionGroup in the routine by copying the default ActionGroup and adding it to the actions list.
        
        Returns:
            ActionGroup: The newly created ActionGroup.
        """
        defaultCopy = self._createUserAGCopy()
        self.steps.append(defaultCopy)
        return defaultCopy
    
    def _createUserAGCopy(self) -> ActionGroup:
        """Creates a copy of the default ActionGroup and returns it."""
        defaultType = self.userActionGroup.copy()

        if not isinstance(defaultType, ActionGroup):
            raise TypeError("Default user action group is not of type ActionGroup.")
        
        return defaultType

    def getSteps(self) -> list[Action | ActionGroup | Argument]:
        """Returns the list of steps in the routine."""
        return self.steps
    
    def getIndex(self, step: Action | ActionGroup | Argument) -> int:
        if step in self.steps:
            return self.steps.index(step)
        raise ValueError(f"Step \'{step}\' not found in routine.")
    
    def removeByIndex(self, index: int) -> Action | ActionGroup | Argument:
        """Removes the step at the given index from the routine."""
        return self.steps.pop(index)
    
    def moveStep(self, stepIndex: int, toIndex: int):
        """Move a step from one index to another in the routine."""
        if stepIndex < 0 or stepIndex >= len(self.steps) or toIndex < 0 or toIndex >= len(self.steps):
            raise ValueError("Invalid step index. " + str(stepIndex) + " to " + str(toIndex))
        movedAction = self.steps.pop(stepIndex)
        self.steps.insert(toIndex, movedAction)

    def replaceStep(self, oldStep: Action | ActionGroup | Argument, newStep: Action | ActionGroup | Argument):
        """Replace a step in the routine with a new step."""
        try:
            index = self.steps.index(oldStep)
            self.steps[index] = newStep
        except ValueError:
            print(f"Step \'{oldStep}\' not found in routine.")
