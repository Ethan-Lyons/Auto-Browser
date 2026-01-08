from Steps import Action
from Steps import ActionGroup
from Steps import Argument
import ActionFactory as ActionFactory

class UserActionBuilder:

    def __init__(self):
        
        self.userActionGroup = None

    def _buildUserActions(self):
        """
        Defines the user actions for the Action Builder.These are the base actions
        that are available to the user.

        Returns:
            ActionGroup: The ActionGroup of user actions
        """
        self.userSteps = []
        
        variable = ActionFactory.createArgument("variable")
        text = ActionFactory.createArgument("text")
        xPath = ActionFactory.createArgument("xpath")
        css = ActionFactory.createArgument("css")
        aria = ActionFactory.createArgument("aria")

        trueArg = ActionFactory.createArgument("true")
        falseArg = ActionFactory.createArgument("false")
        exact = ActionFactory.createActionGroup("strict", [trueArg, falseArg])
        link = ActionFactory.createAction("link", [text, exact])

        selector = ActionFactory.createActionGroup("selector", [xPath, css, text, variable, link, aria])

        url = ActionFactory.createArgument("url")
        tabNum = ActionFactory.createArgument("tab_number")
        tab = ActionFactory.createArgument("tab")
        #saveAs = ActionFactory.createArgument("save as")

        # if action group
        # if [find] [succeeds, fails]
        # end if

        #variable = ActionFactory.createArgument("variable")
        #create action group for saving to variable or outputs
        # [findType, text, variable, info]
        # create info action group with methods for info access (tab number, page url, etc)

        infoSelect = ActionFactory.createActionGroup("info_select", [url, tabNum])

        urlNavType = self.createUserAction("URL_NAV", [url], "Go to URL")
        tabNavType = self.createUserAction("TAB_NAV", [tab], "Navigate to an existing tab")
        newTabType = self.createUserAction("NEW_TAB", [], "Open a new tab")

        findType = self.createUserAction("FIND", [selector], "Find an element")
        clickType = self.createUserAction("CLICK", [findType], "Click an element")
        infoType = self.createUserAction("INFO", [infoSelect], "Retrieve page or browser info")

        storableType = ActionFactory.createActionGroup("storable", [findType, text, variable, infoType])
        storeType = self.createUserAction("STORE", [storableType, variable], "Store a value under a custom variable name")

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

    