from Action import Action
from Action import ActionGroup
from Action import Argument
import ActionBuilder

class UserActionBuilder:

    def __init__(self):
        self.userActions = []
        self.userActionGroup = self.buildUserActions()

    def buildUserActions(self):
        """
        Defines the user actions for the Action Builder.These are the base actions
        that are available to the user.

        Returns:
            ActionGroup: The ActionGroup of user actions
        """
        variable = ActionBuilder.createArgument("variable")
        text = ActionBuilder.createArgument("text")
        #text = self.createArgument("text")
        xPath = ActionBuilder.createArgument("xpath")
        css = ActionBuilder.createArgument("css")
        lIs = ActionBuilder.createArgument("is")
        lContains = ActionBuilder.createArgument("contains")
        links = ActionBuilder.createActionGroup("link", [lIs, lContains])
        selector = ActionBuilder.createActionGroup("selector type", [xPath, css, text, variable, links])

        url = ActionBuilder.createArgument("url")
        tab = ActionBuilder.createArgument("tab")
        saveAs = ActionBuilder.createArgument("save as")

        urlNavType = ActionBuilder.createAction("URL_NAV", [url], "Go to URL")
        tabNavType = ActionBuilder.createAction("TAB_NAV", [tab], "Navigate to an existing tab")
        newTabType = ActionBuilder.createAction("NEW_TAB", [], "Open a new tab")
        findType = ActionBuilder.createAction("FIND", [selector, saveAs], "Find and store")
        findGroupType = ActionBuilder.createAction("FIND_GROUP", [selector, saveAs], "Find and store group")
        clickType = ActionBuilder.createAction("CLICK", [selector], "Click")

        userActions = [urlNavType, tabNavType, findType, findGroupType, clickType, newTabType]
        userActionGroup = ActionBuilder.createActionGroup("USER_ACTIONS", userActions)
        return userActionGroup
        #userActionsGroup = self.createActionGroup("USER_ACTIONS", [urlNavType,tabNavType,findType,findGroupType,clickType, newTabType])
        #return userActionsGroup
    
    def getUserActionGroup(self):
        """Returns the user actions group"""
        return self.userActionGroup

    