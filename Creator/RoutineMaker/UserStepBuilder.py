import Creator.RoutineMaker.StepsFactory as StepsFactory

class UserActionBuilder:
    def __init__(self):
        self.userActionGroup = None

    def _buildUserActions(self):
        r = ActionRegistry()

        # ---------- Arguments ----------
        variable = r.arg("VARIABLE")
        text = r.arg("TEXT")
        fileName = r.arg("FILE_NAME")
        url = r.arg("URL")
        tab = r.arg("TAB")
        delayMs = r.arg("DELAY_MS")
        start = r.arg("START")
        end = r.arg("END")
        write = r.arg("WRITE")
        append = r.arg("APPEND")
        skipArg = r.arg("SKIP", "Does nothing", False)

        # Selector types
        xpath = r.arg("XPATH")
        css = r.arg("CSS")
        aria = r.arg("ARIA")

        # Bool
        true = r.arg("TRUE", "", False)
        false = r.arg("FALSE", "", False)

        # Tab info
        tabCount = r.arg("TAB_COUNT")
        title = r.arg("TITLE")
        currentIndex = r.arg("CURRENT_INDEX")

        # ---------- Groups ----------
        strict = r.group("STRICT", [true, false], "Strict or non-strict search")

        link = r.action("LINK", [text, strict])
        find = r.group(
            "FIND",
            [text, link, aria, xpath, css],
            "Find an element and return locator"
        )
        info = r.group("INFO", [tabCount, url, title, currentIndex], "Return page or browser info")

        canFind = r.action(
            "CAN_FIND",
            [find],
            "If an element can be found, return true, else false"
        )
        condition = r.group("CONDITION", [canFind, text], "Able to return either value true or false")

        # ---------- Actions ----------
        findText = r.action(
            "FIND_TEXT",
            [find],
            "Find an element and return its text content"
        )
        storable = r.group(
            "STORABLE",
            [findText, text, info, canFind]
        )
        store = r.userAction(
            "STORE",
            [storable, variable],
            "Store a value under a custom variable name"
        )

        goForward = r.arg("GO_FORWARD", "Move forward in the page history", False)
        goBackward = r.arg("GO_BACKWARD", "Move backward in the page history", False)
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

        keys = r.arg("KEYS", "Any keys (including modifier key(s), such as shift, ctrl, alt, or meta.) Keys are separated by spaces or '+'s. For example: 'alt shift' or 'ctrl + alt + a'")
        shortcut = r.action("SHORTCUT", [keys, waitForNav, setFocus])

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

    def arg(self, name: str, description="", hasValue=True):
        """Creates and returns an argument object with the given name and description."""
        argObj = StepsFactory.createArgument(name, description, hasValue)
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

    