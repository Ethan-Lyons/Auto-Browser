from Steps import Action
from Steps import ActionGroup
from Steps import Argument
import ActionFactory as ActionFactory

class UserActionBuilder:

    def __init__(self):
        self.userSteps = []
        self.userActionGroup = None

    def _buildUserActions(self):
        """
        Defines the user actions for the Action Builder.These are the base actions
        that are available to the user.

        Returns:
            ActionGroup: The ActionGroup of user actions
        """
        variable = ActionFactory.createArgument("variable")
        text = ActionFactory.createArgument("text")
        #text = self.createArgument("text")
        xPath = ActionFactory.createArgument("xpath")
        css = ActionFactory.createArgument("css")
        lIs = ActionFactory.createArgument("is")
        lContains = ActionFactory.createArgument("contains")
        links = ActionFactory.createActionGroup("link", [lIs, lContains])
        selector = ActionFactory.createActionGroup("selector", [xPath, css, text, variable, links])

        url = ActionFactory.createArgument("url")
        tab = ActionFactory.createArgument("tab")
        saveAs = ActionFactory.createArgument("save as")

        urlNavType = self.createUserAction("URL_NAV", [url], "Go to URL")
        tabNavType = self.createUserAction("TAB_NAV", [tab], "Navigate to an existing tab")
        newTabType = self.createUserAction("NEW_TAB", [], "Open a new tab")
        findType = self.createUserAction("FIND", [selector, saveAs], "Find and store")
        findGroupType = self.createUserAction("FIND_GROUP", [selector, saveAs], "Find and store group")
        clickType = self.createUserAction("CLICK", [selector], "Click")
        fakeAction = self.createUserAction("FAKE_ACTION", [], "Fake Action")

        userActionGroup = ActionFactory.createActionGroup("USER_ACTIONS", self.userSteps)
        return userActionGroup
    
    def createUserAction(self, name, args, description):
        newAction = ActionFactory.createAction(name, args, description)
        self.userSteps.append(newAction)
        return newAction
    
    def getUserActionGroup(self):
        """Returns the user actions group"""
        if self.userActionGroup is None:
            self.userActionGroup = self._buildUserActions()
        return self.userActionGroup

    