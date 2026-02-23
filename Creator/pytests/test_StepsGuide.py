import pytest
from tkinter import ttk
import os

from Creator.StepsGuide import StepsGuide
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument

# Generic objects used for testing
defArg = Argument("argName", "argValue", "argDescription")
defAction = Action("actionName", [defArg], "actionDescription")
defActionGroup = ActionGroup("groupName", [defAction], "groupDescription")

def createTestFile(fileContent):
    """Create a temporary file for testing."""
    filePath = os.path.join(os.path.dirname(__file__), "testFile.txt")
    with open(filePath, "w") as f:
        f.write(fileContent)
    return filePath
    

def test_getTreeview():
    """Ensure treeview is created."""
    sg = StepsGuide()
    tree = sg.getTreeview()
    assert isinstance(tree, ttk.Treeview)

    sg.closeWindow()

def test_addTreeSteps_Argument():
    """Ensure arguments can be added to the tree."""
    sg = StepsGuide()
    tree = sg.getTreeview()
    sg.addTreeStep(defArg, tree)

    # Root node should be inserted
    rootChildren = tree.get_children("")
    assert len(rootChildren) == 1

    argNode = rootChildren[0]
    assert tree.item(argNode, "text") == "argName"  # Initial column is separated under tree text
    assert tree.item(argNode, "values") == ("Argument", "argDescription")

    # Clean up
    sg.closeWindow()

def test_addTreeSteps_Action():
    """Ensure actions can be added to the tree."""
    sg = StepsGuide()
    tree = sg.getTreeview()
    sg.addTreeStep(defAction, tree)

    # Root node should be inserted
    rootChildren = tree.get_children("")
    assert len(rootChildren) == 1

    actionNode = rootChildren[0]
    assert tree.item(actionNode, "text") == "actionName"  # Initial column is separated for trees
    assert tree.item(actionNode, "values") == ("Action", "actionDescription")

    # Child argument
    argList = tree.get_children(actionNode)
    assert len(argList) == 1

    argNode = argList[0]
    assert tree.item(argNode, "text") == "argName"
    assert tree.item(argNode, "values") == ("Argument", "argDescription")

    # Clean up
    sg.closeWindow()

def test_addTreeSteps_Group():
    """Ensure action groups can be added to the tree."""
    sg = StepsGuide()
    tree = sg.getTreeview()
    sg.addTreeStep(defActionGroup, tree)

    # Root node should be inserted
    rootChildren = tree.get_children("")
    assert len(rootChildren) == 1

    groupNode = rootChildren[0]
    assert tree.item(groupNode, "text") == "groupName"  # Initial column is separated for trees
    assert tree.item(groupNode, "values") == ("ActionGroup", "groupDescription")

    # Child action
    actionList = tree.get_children(groupNode)
    assert len(actionList) == 1

    actionNode = actionList[0]
    assert tree.item(actionNode, "text") == "actionName"
    assert tree.item(actionNode, "values") == ("Action", "actionDescription")

    # Child argument
    argList = tree.get_children(actionNode)
    assert len(argList) == 1

    argNode = argList[0]
    assert tree.item(argNode, "text") == "argName"
    assert tree.item(argNode, "values") == ("Argument", "argDescription")

    # Clean up
    sg.closeWindow()

def test_add_tree_steps_invalid_type_raises():
    """Ensure invalid step type raises error."""
    sg = StepsGuide()
    tree = sg.getTreeview()

    with pytest.raises(TypeError):
        sg.addTreeStep(1, tree)

    sg.closeWindow()


def test_jsUpdate_set_yes():
    """Ensure if JS file contains a case, it's js column should be set to YES."""
    sg = StepsGuide()
    tree = sg.getTreeview()

    newFilePath = createTestFile("case \"actionName\":")

    sg.addTreeStep(defAction, tree)

    sg.jsUpdate(tree, [tree.get_children("")[0]], newFilePath)
    assert tree.item(tree.get_children("")[0], "values")[2] == "YES"

    # Clean up
    os.remove(newFilePath)

def test_jsUpdate_set_no():
    """Ensure if JS file does not contain a case, it's js column should be set to NO."""
    sg = StepsGuide()
    tree = sg.getTreeview()
    newFilePath = createTestFile("actionName") # Not a match

    sg.addTreeStep(defAction, tree)
    sg.jsUpdate(tree, [tree.get_children("")[0]], newFilePath)

    assert tree.item(tree.get_children("")[0], "values")[2] == "NO"

    # Clean up
    os.remove(newFilePath)

def test_get_file_contents_reads_file():
    """Ensure file contents can be read."""
    sg = StepsGuide()
    newFilePath = createTestFile("Test contents")

    contents = sg.getFileContents(newFilePath)

    assert contents == "Test contents"

    # Clean up
    os.remove(newFilePath)
    
