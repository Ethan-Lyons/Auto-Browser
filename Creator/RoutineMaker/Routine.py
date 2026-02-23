from Creator.RoutineMaker.UserStepBuilder import UserActionBuilder
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument

class Routine:
    """A class for creating and editing a series of steps composed into a routine."""
    def __init__(self, inputOutput=None):
        self.inputOutput = inputOutput  # gives access to the InputOutput class functions
        self.UAB = UserActionBuilder()
        self.userActionGroup = self.UAB.getUserActionGroup()
        self.steps = []
    
    def __eq__(self, other):
        return (
            isinstance(other, Routine)
            and self.steps == other.steps
        )

    def __str__(self):
        routineDict = {"actions": [self.inputOutput.actionsToDict(b) for b in self.steps]}
        return "[Routine: " + str(routineDict) + "]"
    
    def saveRoutine(self, filePath=None):
        """
        Save a routine to a file using the InputOutput class.

        Args:
            fileName (str): The name of the file to save the routine to. Defaults to None.
        """
        self.inputOutput.saveRoutine(self, filePath)
    
    # Returns a bool indicating if the routine has been updated
    def loadRoutine(self, filePath=None):
        """
        Load a routine from a JSON file using the InputOutput class.

        Args:
            filePath (str): The path of the file to load the routine from. Defaults to None.
        
        Returns:
            bool: True if the routine has been updated, False otherwise.
        """
        newRoutine = self.inputOutput.loadRoutine(filePath)
        if newRoutine:
            self.steps = newRoutine.getSteps()
            return True
        return False

    def addStep(self, step: Action | ActionGroup | Argument):
        """Adds a step to the routine step list."""
        self.steps.append(step)
    
    def removeStep(self, step: Action | ActionGroup | Argument):
        """Removes a step from the routine step list."""
        if step in self.steps:
            self.steps.remove(step)

    def createDefStep(self):
        """
        Creates a new ActionGroup in the routine by copying the default ActionGroup and adding it to the actions list.
        
        Returns:
            The newly created step in the ActionGroup.
        """
        defaultCopy = self._createUserAGCopy()
        self.steps.append(defaultCopy)
        return defaultCopy
    
    def _createUserAGCopy(self):
        """Creates a copy of the default ActionGroup and returns it."""
        defaultType = self.userActionGroup.copy()
        return defaultType

    def getSteps(self):
        """Returns the list of steps in the routine."""
        return self.steps
    
    def getIndex(self, step: Action | ActionGroup | Argument):
        if step in self.steps:
            return self.steps.index(step)
        raise ValueError(f"Step \'{step}\' not found in routine.")
    
    def removeByIndex(self, index: int):
        """Removes the action at the given index from the routine."""
        return self.steps.pop(index)
    
    def moveAction(self, actionIndex: int, toIndex: int):
        """Move an action from one index to another in the routine."""
        moved_action = self.steps.pop(actionIndex)
        self.steps.insert(toIndex, moved_action)

    def replaceStep(self, oldStep: Action | ActionGroup | Argument, newStep: Action | ActionGroup | Argument):
        """Replace a step in the routine with a new step."""
        try:
            index = self.steps.index(oldStep)
            self.steps[index] = newStep
        except ValueError:
            print(f"Step \'{oldStep}\' not found in routine.")
