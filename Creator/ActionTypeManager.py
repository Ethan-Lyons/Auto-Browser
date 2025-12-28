from Steps import Action
class ActionBuilderManager:
    VAR = "variable"
    SELECTOR_TYPES = ["xpath", "css", "text", VAR]
    SAVE_AS = "save as"
    TAB = "tab"
    URL = "url"

    class ActionBuilder:
        #change to action builder
        def __init__(self, name, args=[], description=""):
            self.name = name
            self.description = description
            self.builderArgs = args
            self.actionArgs = []
        def getName(self):
            return self.name
        def getDescription(self):
            return self.description
        def getArgs(self):
            return self.builderArgs
        def createAction(self):
            if not self.actionArgs:
                self.actionArgs = self.buildArgs(self.builderArgs)
            return Action(name=self.name, description=self.description, args=self.actionArgs)
        
        def buildArgs(self, inputItem):
            if isinstance(inputItem, list):
                # Recursively convert each item in the list
                subConverted = [
                    self.buildArgs(subArg) if isinstance(subArg, ActionBuilderManager.ActionBuilder) else subArg
                    for subArg in inputItem
                ]
                return subConverted
            elif isinstance(inputItem, ActionBuilderManager.ActionBuilder):
                # Recursively convert the nested ActionBuilder
                name = inputItem.getName()
                description = inputItem.getDescription()
                args = inputItem.getArgs()
                newAction = Action(name=name, description=description, args=self.buildArgs(args))
                return newAction
            elif isinstance(inputItem, str):
                return inputItem
            else:
                print("Unknown input type for buildArgs: " + str(inputItem) + ", Type: " + str(type(inputItem)))
                #return inputItem

    class BuilderGroup:
        def __init__(self, name, actions=[], description=""):
            self.name = name
            self.actions = actions
            self.checkActions()
            self.description = description
            self.selected = actions[0]
        def checkActions(self):
            for action in self.actions:
                self.checkAction(action)
                
        def checkAction(self, action):
            try:
                assert isinstance(action, ActionBuilderManager.ActionBuilder)
            except AssertionError:
                    print("Failed to add action to group: " + str(action) + "\n\tExpected type: "
                            + str(ActionBuilderManager.ActionBuilder) + "\n\tActual type: " + str(type(action)))
        def getActions(self):
            return self.actions
        def getName(self):
            return self.name
        def getDescription(self):
            return self.description
        def getSelected(self):
            return self.selected
        def setSelected(self, action):
            self.checkAction(action)
            self.selected = action
    
    def __init__(self):
        self.allActions = []
        self.nameToActionBuilder = {}
        self.userActionBuilders = self.buildActionBuilders()

    def buildActionBuilders(self):
        variableType = self.createActionBuilder("Variable", "variable")
        textType = self.createActionBuilder("Text", "text")
        xPathType = self.createActionBuilder("XPath", "xpath")
        cssType = self.createActionBuilder("CSS", "css")
        selectorType = self.createActionGroup("Selector Type", [xPathType, cssType, textType, variableType])

        urlNavType = self.createActionBuilder("URL_NAV", [self.URL], "Go to URL")
        tabNavType = self.createActionBuilder("TAB_NAV", [self.TAB], "Navigate to tab")
        findType = self.createActionBuilder("FIND", [selectorType, self.SAVE_AS], "Find and store")
        findGroupType = self.createActionBuilder("FIND_GROUP", [selectorType, self.SAVE_AS], "Find and store group")
        clickType = self.createActionBuilder("CLICK", [selectorType], "Click")

        userActions = self.ActionBuilder("USER_ACTIONS", [urlNavType, tabNavType, findType, findGroupType, clickType])
        return userActions
    
    def createActionBuilder(self, name, args, description=""):
        if isinstance(args, str):
            args = [args]
        newBuilder = self.ActionBuilder(name, args, description)
        self.allActions.append(newBuilder)
        self.nameToActionBuilder[newBuilder.getName()] = newBuilder
        return newBuilder
    def createActionGroup(self, name, actions=[], description=""):
        newActionGroup = self.BuilderGroup(name, actions, description)
        self.allActions.append(newActionGroup)
        return newActionGroup

    def buildNamesToBuilders(self):
        nameToBuild = {}
        for action in self.userActionBuilders:
            nameToBuild[action.getName()] = action
        return nameToBuild
    
    def getActionFromName(self, name):
        try:
            builder = self.nameToActionBuilder[name]
            newAction = builder.createAction()
            return newAction
        except KeyError:
            print("Action with name: " + name + " not found in action manager")
            print("Available actions: " + str(self.nameToActionBuilder.keys()))
    
    def getUserActionBuilders(self):
        return self.userActionBuilders
    
    def getNamesToActionBuilder(self):
        return self.nameToActionBuilder