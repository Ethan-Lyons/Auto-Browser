from Steps import Action
from Steps import ActionGroup
from Steps import Argument
import ActionFactory as ActionFactory

class UserActionBuilder:

    def __init__(self):
        self.userActions = []
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

        urlNavType = ActionFactory.createAction("URL_NAV", [url], "Go to URL")
        tabNavType = ActionFactory.createAction("TAB_NAV", [tab], "Navigate to an existing tab")
        newTabType = ActionFactory.createAction("NEW_TAB", [], "Open a new tab")
        findType = ActionFactory.createAction("FIND", [selector, saveAs], "Find and store")
        findGroupType = ActionFactory.createAction("FIND_GROUP", [selector, saveAs], "Find and store group")
        clickType = ActionFactory.createAction("CLICK", [selector], "Click")

        userActions = [urlNavType, tabNavType, findType, findGroupType, clickType, newTabType]
        userActionGroup = ActionFactory.createActionGroup("USER_ACTIONS", userActions)
        return userActionGroup
        #userActionsGroup = self.createActionGroup("USER_ACTIONS", [urlNavType,tabNavType,findType,findGroupType,clickType, newTabType])
        #return userActionsGroup
    
    def getUserActionGroup(self):
        """Returns the user actions group"""
        if self.userActionGroup is None:
            self.userActionGroup = self._buildUserActions()
        return self.userActionGroup

    