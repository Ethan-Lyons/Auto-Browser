import Creator.RoutineMaker.StepsFactory as StepsFactory

class UserActionBuilder:
    def __init__(self):
        self.userActionGroup = None

    def _buildUserActions(self):
        r = ActionRegistry()

        # ---------- Arguments ----------
        variable = r.arg("variable")
        text = r.arg("text")
        key = r.arg("key")
        fileName = r.arg("file_name")
        url = r.arg("url")
        tab = r.arg("tab")
        delayMs = r.arg("delay_ms")
        start = r.arg("start")
        end = r.arg("end")
        write = r.arg("WRITE")
        append = r.arg("APPEND")
        skipArg = r.arg("SKIP")

        # Selector types
        xpath = r.arg("xpath")
        css = r.arg("css")
        aria = r.arg("aria")

        # Bool
        true = r.arg("true")
        false = r.arg("false")

        # Tab info
        tabCount = r.arg("tab_count")
        title = r.arg("title")
        currentIndex = r.arg("current_index")

        # ---------- Groups ----------
        strict = r.group("strict", [true, false], "Strict or non-strict search")

        link = r.action("link", [text, strict])
        find = r.group(
            "Find",
            [text, link, aria, xpath, css],
            "Find an element and return locator"
        )
        info = r.group("info", [tabCount, url, title, currentIndex], "Return page or browser info")

        canFind = r.action(
            "can_find",
            [find],
            "If an element can be found, return true, else false"
        )
        condition = r.group("condition", [canFind, text], "Able to return either value true or false")

        # ---------- Actions ----------
        findText = r.action(
            "find_text",
            [find],
            "Find an element and return its text content"
        )
        storable = r.group(
            "storable",
            [findText, text, info, canFind]
        )
        store = r.userAction(
            "STORE",
            [storable, variable],
            "Store a value under a custom variable name"
        )

        goForward = r.arg("GO_FORWARD")
        goBackward = r.arg("GO_BACKWARD")
        historyMode = r.group(
            "HISTORY_MODE",
            [goForward, goBackward]
        )

        waitForNav = r.group(
            "WAIT_FOR_NAV",
            [true, false],
            "Defaults to false. Set to true if the action is expected to cause a navigation to a new page."
        )

        setFocus = r.group("SET_FOCUS", [skipArg, find])

        textMode = r.group("TEXT_MODE", [write, append])
        textFile = r.action("TEXT_FILE", [text, fileName, textMode])
        screenshot = r.action("SCREENSHOT", [fileName])
        canOutput = r.group("CAN_OUTPUT", [textFile, screenshot])
        output = r.userAction("OUTPUT", [canOutput])

        typeText = r.action("TYPE_TEXT", [text, delayMs, setFocus])

        modKeys = r.arg("MOD_KEY(S)", "Modifier key(s), such as shift, ctrl, alt, or meta. Keys are separated by spaces or '+'s. For example: 'alt shift' or 'ctrl + alt'")
        shortcut = r.action("SHORTCUT", [modKeys, key, waitForNav, setFocus])

        keyMode = r.group("KEY_MODE", [typeText, shortcut])
        keyboard = r.userAction("KEYBOARD", [keyMode])

        urlNav = r.userAction("URL_NAV", [url], "Navigate to a URL")
        tabNav = r.userAction("TAB_NAV", [tab], "Navigate to a tab")
        newTab = r.userAction("NEW_TAB", [], "Open a new tab")
        closeTab = r.userAction("CLOSE_TAB", [tab], "Close a specific tab, or the current tab if no tab is specified")

        click = r.userAction("CLICK", [find, waitForNav], "Click an element")

        wait = r.userAction("WAIT", [delayMs], "Wait")
        history = r.userAction("HISTORY", [historyMode], "Go forward or backward in the page history")

        # ---------- Conditionals ----------
        ifStep = r.userAction("IF", [condition], "If condition")
        elseStep = r.userAction("ELSE", [], "Else branch")
        endIfStep = r.userAction("END_IF", [], "End if block")

        forStep = r.userAction("FOR", [start, end], "Loop over a range of values")
        endforStep = r.userAction("END_FOR", [], "End loop block")

        whileStep = r.userAction("WHILE", [condition], "Loop while a condition is true")
        endwhileStep = r.userAction("END_WHILE", [], "End loop block")

        return StepsFactory.createActionGroup("USER_ACTIONS", r.userSteps)
    
    def createUserAction(self, name: str, args=[], description=""):
        newAction = StepsFactory.createAction(name, args, description)
        self.userSteps.append(newAction)
        return newAction
    
    def getUserActionGroup(self):
        """Returns the list of initial actions available to the user."""
        if self.userActionGroup is None:
            self.userActionGroup = self._buildUserActions()
        return self.userActionGroup

class ActionRegistry:
    """A class for registering and retrieving all configured step types."""
    def __init__(self):
        """
        Initializes the ActionRegistry with empty dictionaries for arguments, groups, actions, and userActions.
        """
        self.arguments = {}
        self.groups = {}
        self.actions = {}
        self.userSteps = []

    def arg(self, name: str, description=""):
        """Creates and returns an argument object with the given name and description."""
        argObj = StepsFactory.createArgument(name, description)
        self.arguments[name] = argObj
        return argObj

    def group(self, name: str, args, description=""):
        """Creates and returns an action group object with the given name, arguments, and description."""
        actionGroup = StepsFactory.createActionGroup(name, args, description)
        self.groups[name] = actionGroup
        return actionGroup

    def action(self, name: str, args, description=""):
        """Creates and returns an action object with the given name, arguments, and description."""
        action = StepsFactory.createAction(name, args, description)
        self.actions[name] = action
        return action
    
    def userAction(self, name: str, args: list, description: str = ""):
        """Creates and returns a user action object with the given name, arguments, and description."""
        userAction = StepsFactory.createAction(name, args, description)
        self.actions[name] = userAction
        self.userSteps.append(userAction)
        return userAction

    