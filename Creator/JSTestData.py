import InputOutput
from Routine import Routine

TEST_OUTPUT_DIR = "./TestData"

def saveRoutine(routine, name):
    routine.saveRoutine(filePath=f"{TEST_OUTPUT_DIR}/{name}.json")

def newRoutine():
    return Routine(inputOutput=InputOutput)

def addNavStep(routine, urlValue):
    ag = routine.createDefaultAG()
    nav = ag.get("URL_NAV")
    ag.setSelected(nav)

    url_arg = nav.get("url")
    url_arg.setValue(urlValue)

def addClickXpathStep(routine, xpathValue):
    ag = routine.createDefaultAG()
    click = ag.get("CLICK")
    ag.setSelected(click)

    find = click.get("find")
    xpath = find.get("xpath")
    find.setSelected(xpath)

    xpath.setValue(xpathValue)

def addClickLinkStep(routine, linkValue, strictValue=False):
    ag = routine.createDefaultAG()
    click = ag.get("CLICK")
    ag.setSelected(click)   # click action

    find = click.get("find")
    link = find.get("link")
    find.setSelected(link)  # link action

    text = link.get("text")
    text.setValue(linkValue)    # text argument

    strict = link.get("strict")
    if strictValue == True:
        true = strict.get("true")
        strict.setSelected(true)
    else:
        false = strict.get("false")
        strict.setSelected(false)    # strict action group


def addNewTabStep(routine):
    ag = routine.createDefaultAG()
    new_tab = ag.get("NEW_TAB")
    ag.setSelected(new_tab)

def testBlank():
    routine = newRoutine()
    routine.createDefaultAG()
    saveRoutine(routine, "test_blank")

def testNav():
    routine = newRoutine()
    addNavStep(routine, "https://www.google.com")
    saveRoutine(routine, "test_nav")

def testClick():
    routine = newRoutine()

    addNavStep(routine, "https://www.google.com")

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

    # FOR i = 0..2
    ag = routine.createDefaultAG()
    forAction = ag.get("FOR")
    ag.setSelected(forAction)

    start = forAction.get("start")
    end = forAction.get("end")

    start.setValue(0)
    end.setValue(2)

    # Loop body: NAV
    addNavStep(routine, "https://example.com")

    # Loop body: CLICK
    addClickLinkStep(routine, "example")

    # ENDFOR
    endAG = routine.createDefaultAG()
    endforAction = endAG.get("END_FOR")
    endAG.setSelected(endforAction)

    saveRoutine(routine, "test_for_loop")

def generate_test_data():
    testBlank()
    testNav()
    testClick()
    testForLoop()
    testNewTab()

generate_test_data()