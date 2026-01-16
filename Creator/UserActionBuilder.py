from Steps import Action
from Steps import ActionGroup
from Steps import Argument
import ActionFactory as ActionFactory

class UserActionBuilder:
    def __init__(self):
        self.userActionGroup = None

    def _buildUserActions(self):
        r = ActionRegistry()

        # ---------- Arguments ----------
        variable = r.arg("variable")
        text = r.arg("text")
        url = r.arg("url")
        tab = r.arg("tab")
        milliseconds = r.arg("milliseconds")
        start = r.arg("start")
        end = r.arg("end")

        xpath = r.arg("xpath")
        css = r.arg("css")
        aria = r.arg("aria")

        true = r.arg("true")
        false = r.arg("false")

        # ---------- Groups ----------
        strict = r.group("strict", [true, false], "Strict or non-strict search")

        link = r.action("link", [text, strict])
        find = r.group(
            "Find",
            [xpath, css, text, link, aria],
            "Find an element and return locator"
        )
        info = r.group("info", [url, tab], "Return page or browser info")
        # TODO: tab info group, has like count, url, title, current tab index! etc.

        # TODO:  go forward, go back, refresh, hover, screenshot, title, url

        can_find = r.action(
            "can_find",
            [find],
            "If an element can be found, return true, else false"
        )
        condition = r.group("condition", [can_find, text])

        # ---------- Actions ----------
        find_text = r.action(
            "find_text",
            [find],
            "Find an element and return its text content"
        )
        storable = r.group(
            "storable",
            [find_text, text, variable, info]
        )
        store = r.userAction(
            "STORE",
            [storable, variable],
            "Store a value under a custom variable name"
        )

        urlNav = r.userAction("URL_NAV", [url], "Navigate to a URL")
        tabNav = r.userAction("TAB_NAV", [tab], "Navigate to a tab")
        newTab = r.userAction("NEW_TAB", [], "Open a new tab")

        click = r.userAction("CLICK", [find], "Click an element")
        typeA = r.userAction("TYPE", [find, text], "Type text into input")  # TODO: confirm this, does it need a find if click before
        wait = r.userAction("WAIT", [milliseconds], "Wait")

        # ---------- Conditionals ----------
        ifType = r.userAction("IF", [condition], "If condition")
        elseType = r.userAction("ELSE", [], "Else branch")
        endIfType = r.userAction("END_IF", [], "End if block")

        forType = r.userAction("FOR", [start, end], "Loop over a range of values")
        endforType = r.userAction("END_FOR", [], "End loop block")

        whileType = r.userAction("WHILE", [condition], "Loop while a condition is true")
        endwhileType = r.userAction("END_WHILE", [], "End loop block")

        return ActionFactory.createActionGroup("USER_ACTIONS", r.userActions)
    
    def createUserAction(self, name, args, description):
        newAction = ActionFactory.createAction(name, args, description)
        self.userSteps.append(newAction)
        return newAction
    
    def getUserActionGroup(self):
        """Returns the list of initial actions available to the user."""
        if self.userActionGroup is None:
            self.userActionGroup = self._buildUserActions()
        return self.userActionGroup

class ActionRegistry:
    def __init__(self):
        self.arguments = {}
        self.groups = {}
        self.actions = {}
        self.userActions = []

    def arg(self, name, description=""):
        argObj = ActionFactory.createArgument(name, description)
        self.arguments[name] = argObj
        return argObj

    def group(self, name, items, description=""):
        groupObj = ActionFactory.createActionGroup(name, items, description)
        self.groups[name] = groupObj
        return groupObj

    def action(self, name, args, description=""):
        actionObj = ActionFactory.createAction(name, args, description)
        self.actions[name] = actionObj
        return actionObj
    
    def userAction(self, name, args, description=""):
        actionObj = ActionFactory.createAction(name, args, description)
        self.actions[name] = actionObj
        self.userActions.append(actionObj)
        return actionObj

    