import Creator.RoutineMaker.InputOutput as InputOutput
from Creator.RoutineMaker.Routine import Routine

TEST_OUTPUT_DIR = "./TestData"

def saveRoutine(routine: Routine, name: str):
    routine.saveRoutine(filePath=f"{TEST_OUTPUT_DIR}/{name}.json")

def newRoutine():
    return Routine(inputOutput=InputOutput)

def openPage(routine: Routine, urlValue: str):
    addNewTabStep(routine)
    addNavStep(routine, urlValue)

def addNavStep(routine: Routine, urlValue: str):
    ag = routine.createDefStep()
    nav = ag.get("URL_NAV")
    ag.setSelected(nav)

    urlArg = nav.get("url")
    urlArg.setValue(urlValue)

def addClickXpathStep(routine: Routine, xpathValue: str):
    ag = routine.createDefStep()
    click = ag.get("CLICK")
    ag.setSelected(click)

    waitNav = click.get("WAIT_FOR_NAV")
    trueStep = waitNav.get("true")
    waitNav.setSelected(trueStep)

    find = click.get("find")
    xpath = find.get("xpath")
    find.setSelected(xpath)

    xpath.setValue(xpathValue)

def addClickLinkStep(routine: Routine, linkValue: str, strictValue=False):
    ag = routine.createDefStep()
    click = ag.get("CLICK")
    ag.setSelected(click)   # click action

    waitNav = click.get("WAIT_FOR_NAV")
    trueStep = waitNav.get("true")
    waitNav.setSelected(trueStep)

    find = click.get("find")
    link = find.get("link")
    find.setSelected(link)  # link action

    text = link.get("text")
    text.setValue(linkValue)    # text argument

    strict = link.get("strict")
    if strictValue == True:
        true = strict.get("true")
        true.setValue("true")
        strict.setSelected(true)
    else:
        false = strict.get("false")
        false.setValue("false")
        strict.setSelected(false)    # strict action group


def addNewTabStep(routine: Routine):
    ag = routine.createDefStep()
    newTab = ag.get("NEW_TAB")
    ag.setSelected(newTab)

def addStoreTextAction(routine: Routine, storeName: str, varValue: str):
    ag = routine.createDefStep()
    store = ag.get("STORE")

    storable = store.get("storable")
    text = storable.get("text")
    storable.setSelected(text)
    text.setValue(varValue)

    variable = store.get("variable")
    variable.setValue(storeName)

def testBlank():
    routine = newRoutine()
    routine.createDefStep()
    saveRoutine(routine, "test_blank")

def testNav():
    routine = newRoutine()
    openPage(routine, "https://www.google.com")
    saveRoutine(routine, "test_nav")

def testClick():
    routine = newRoutine()

    openPage(routine, "https://www.google.com")

    addClickXpathStep(
        routine,
        '//a[@href="https://policies.google.com/privacy?hl=en&fg=1"]'
    )

    saveRoutine(routine, "test_click")

def testNewTab():
    routine = newRoutine()
    addNewTabStep(routine)
    saveRoutine(routine, "test_new_tab")

def testForLoop():
    routine = newRoutine()

    addNewTabStep(routine)

    # FOR i = 0..2
    ag = routine.createDefStep()
    forAction = ag.get("FOR")
    ag.setSelected(forAction)

    start = forAction.get("start")
    start.setValue(0)
    end = forAction.get("end")
    end.setValue(2)

    # Loop body: NAV
    addNewTabStep(routine)

    # END_FOR
    endAG = routine.createDefStep()
    endforAction = endAG.get("END_FOR")
    endAG.setSelected(endforAction)

    saveRoutine(routine, "test_for_loop")

def testForLoopWithStore():
    routine = newRoutine()

    addNewTabStep(routine)

    # First, store the start and end values
    addStoreTextAction(routine, "startIndex", "0")
    addStoreTextAction(routine, "endIndex", "2")

    # FOR i = {startIndex}..{endIndex}
    ag = routine.createDefStep()
    forAction = ag.get("FOR")
    ag.setSelected(forAction)

    start = forAction.get("start")
    start.setValue("{startIndex}")   # reference stored variable
    end = forAction.get("end")
    end.setValue("{endIndex}")       # reference stored variable

    # Loop body: NAV
    openPage(routine, "https://example.com")

    # Loop body: CLICK
    addClickLinkStep(routine, "example")

    # END_FOR
    endAG = routine.createDefStep()
    endforAction = endAG.get("END_FOR")
    endAG.setSelected(endforAction)

    saveRoutine(routine, "test_for_loop_store")
# -----------------------------
# IF tests using literal values
# -----------------------------
def testIfTrue():
    routine = newRoutine()
    addNewTabStep(routine)

    # IF
    ag = routine.createDefStep()
    ifAction = ag.get("IF")
    ag.setSelected(ifAction)

    condition = ifAction.get("condition")
    text = condition.get("text")
    condition.setSelected(text)
    text.setValue("true")  # literal value

    # If body: NAV
    openPage(routine, "https://example.com")

    # If body: CLICK
    addClickLinkStep(routine, "example")

    # END_IF
    endAG = routine.createDefStep()
    endifAction = endAG.get("END_IF")
    endAG.setSelected(endifAction)

    saveRoutine(routine, "test_if_true")

def testIfFalse():
    routine = newRoutine()
    addNewTabStep(routine)

    # IF
    ag = routine.createDefStep()
    ifAction = ag.get("IF")
    ag.setSelected(ifAction)

    condition = ifAction.get("condition")
    text = condition.get("text")
    condition.setSelected(text)
    text.setValue("false")  # literal value

    # If body: NAV
    openPage(routine, "https://example.com")

    # If body: CLICK
    addClickLinkStep(routine, "example")

    # END_IF
    endAG = routine.createDefStep()
    endifAction = endAG.get("END_IF")
    endAG.setSelected(endifAction)

    saveRoutine(routine, "test_if_false")


# -----------------------------
# IF tests using a stored value
# -----------------------------
def testIfTrueStore():
    routine = newRoutine()
    storeName = "boolToCheck"
    #addNewTabStep(routine)

    # Store the value
    addStoreTextAction(routine, storeName, "true")

    # IF
    ag = routine.createDefStep()
    ifAction = ag.get("IF")
    ag.setSelected(ifAction)

    condition = ifAction.get("condition")
    text = condition.get("text")
    condition.setSelected(text)
    text.setValue("{" + storeName + "}")  # reference the stored variable

    # If body: NAV
    openPage(routine, "https://example.com")

    # If body: CLICK
    addClickLinkStep(routine, "example")

    # END_IF
    endAG = routine.createDefStep()
    endifAction = endAG.get("END_IF")
    endAG.setSelected(endifAction)

    saveRoutine(routine, "test_if_true_store")


def testIfFalseStore():
    routine = newRoutine()
    storeName = "boolToCheck"
    #addNewTabStep(routine)

    # Store the value
    addStoreTextAction(routine, storeName, "false")

    # IF
    ag = routine.createDefStep()
    ifAction = ag.get("IF")
    ag.setSelected(ifAction)

    condition = ifAction.get("condition")
    text = condition.get("text")
    condition.setSelected(text)
    text.setValue("{" + storeName + "}")  # reference the stored variable

    # If body: NAV
    openPage(routine, "https://example.com")

    # If body: CLICK
    addClickLinkStep(routine, "example")

    # END_IF
    endAG = routine.createDefStep()
    endifAction = endAG.get("END_IF")
    endAG.setSelected(endifAction)

    saveRoutine(routine, "test_if_false_store")


def testWhileFalse():
    routine = newRoutine()
    storeName = "boolToCheck"
    addNewTabStep(routine)

    addStoreTextAction(routine, storeName, "false")

    # IF
    ag = routine.createDefStep()
    ifAction = ag.get("WHILE")
    ag.setSelected(ifAction)

    condition = ifAction.get("condition")
    text = condition.get("text")
    condition.setSelected(text)
    text.setValue("false")
    

    # If body: NAV
    openPage(routine, "https://example.com")

    # If body: CLICK
    addClickLinkStep(routine, "example")

    # END_IF
    endAG = routine.createDefStep()
    endifAction = endAG.get("END_WHILE")
    endAG.setSelected(endifAction)

    saveRoutine(routine, "test_while_false")

def testWhileFalseStore():
    routine = newRoutine()
    storeName = "boolToCheck"
    #addNewTabStep(routine)

    addStoreTextAction(routine, storeName, "false")

    # WHILE
    ag = routine.createDefStep()
    whileAction = ag.get("WHILE")
    ag.setSelected(whileAction)

    condition = whileAction.get("condition")
    text = condition.get("text")
    condition.setSelected(text)
    text.setValue("{" + storeName + "}")

    # While body (should NOT execute)
    openPage(routine, "https://example.com")
    addClickLinkStep(routine, "example")

    # END_WHILE
    endAG = routine.createDefStep()
    endwhileAction = endAG.get("END_WHILE")
    endAG.setSelected(endwhileAction)

    saveRoutine(routine, "test_while_false_store")

def testHistoryBackward():
    routine = newRoutine()
    addNewTabStep(routine)

    addNavStep(routine, "https://example.com")
    addNavStep(routine, "https://example.org")

    ag = routine.createDefStep()
    history = ag.get("HISTORY")
    ag.setSelected(history)

    mode = history.get("history_mode")
    backward = mode.get("go_backward")
    mode.setSelected(backward)

    saveRoutine(routine, "test_history_backward")

def testHistoryForward():
    routine = newRoutine()
    addNewTabStep(routine)

    addNavStep(routine, "https://example.com")
    addNavStep(routine, "https://example.org")

    # go back first
    ag1 = routine.createDefStep()
    history1 = ag1.get("HISTORY")
    ag1.setSelected(history1)
    mode1 = history1.get("history_mode")
    mode1.setSelected(mode1.get("go_backward"))

    # then go forward
    ag2 = routine.createDefStep()
    history2 = ag2.get("HISTORY")
    ag2.setSelected(history2)
    mode2 = history2.get("history_mode")
    mode2.setSelected(mode2.get("go_forward"))

    saveRoutine(routine, "test_history_forward")

def generate_test_data():
    testBlank()
    testNav()
    testClick()
    testForLoop()
    testNewTab()
    testIfTrue()
    testIfFalse()
    testIfTrueStore()
    testIfFalseStore()
    testWhileFalse()
    testWhileFalseStore()
    testForLoopWithStore()
    testHistoryBackward()
    testHistoryForward()

generate_test_data()