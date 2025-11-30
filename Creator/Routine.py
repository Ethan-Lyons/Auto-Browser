from UserActionBuilder import UserActionBuilder

class Routine:
    def __init__(self, inputOutput=None):
        self.inputOutput = inputOutput  # gives access to the InputOutput class functions
        self.AB = UserActionBuilder()
        self.userActionGroup = self.AB.getUserActionGroup()
        self.steps = []

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
    
    def loadRoutine(self, filePath=None):
        """
        Load a routine from a JSON file using the InputOutput class.

        Args:
            filePath (str): The path of the file to load the routine from. Defaults to None.
        """
        newRoutine = self.inputOutput.loadRoutine(filePath)
        self.steps = newRoutine.getSteps()

    def addStep(self, action):
        """Adds an action to the routine step list."""
        self.steps.append(action)
    
    def removeAction(self, action):
        """Removes an action from the routine step list."""
        self.steps.remove(action)

    def createDefaultAG(self):
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
    
    def getActionFromName(self, name):
        """Returns the action with the given name from the routine."""
        return self.AB.getActionFromName(name)
    
    def getIndex(self, action):
        """
        Returns the index of the given action in the routine.

        Args:
            action (Action): The action to find the index of.

        Returns:
            The index of the action in the routine, or -1 if not found.
        """
        if action not in self.steps:
            print("Action not found in routine: " + str(action))
            return -1
        return self.steps.index(action)

    def getSteps(self):
        """Returns the list of steps in the routine."""
        return self.steps
    
    def getActionFromIndex(self, index):
        """Returns the action at the given index in the routine."""
        return self.steps[index]
    def removeByIndex(self, index):
        """Removes the action at the given index from the routine."""
        return self.steps.pop(index)
    
    def moveAction(self, actionIndex, toIndex):
        """Move an action from one index to another in the routine."""
        moved_action = self.steps.pop(actionIndex)
        self.steps.insert(toIndex, moved_action)
    def replaceAction(self, oldAction, newAction):
        """Replace an action in the routine with a new action."""
        try:
            index = self.steps.index(oldAction)
            self.steps[index] = newAction
        except ValueError:
            print(f"Action {oldAction} not found in routine.")
