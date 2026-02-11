import pytest
import tkinter as tk
from tkinter import ttk
import os

# Adjust this import to match your project structure
from Creator.StepsGuide import StepsGuide
from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument


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
    sg = StepsGuide()
    tree = sg.getTreeview()
    assert isinstance(tree, ttk.Treeview)

    sg.closeWindow()

def test_addTreeSteps_Argument():
    sg = StepsGuide()
    tree = sg.getTreeview()
    sg.addTreeStep(defArg, tree)

    # Root node should be inserted
    rootChildren = tree.get_children("")
    assert len(rootChildren) == 1

    argNode = rootChildren[0]
    assert tree.item(argNode, "text") == "argName"  # Initial column is separated for trees
    assert tree.item(argNode, "values") == ("Argument", "argDescription")

    sg.closeWindow()

def test_addTreeSteps_Action():
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

    sg.closeWindow()

def test_addTreeSteps_Group():
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

    sg.closeWindow()

def test_add_tree_steps_invalid_type_raises():
    """
    Ensure unknown types raise TypeError.
    """
    sg = StepsGuide()
    tree = sg.getTreeview()

    with pytest.raises(TypeError):
        sg.addTreeStep(1, tree)

    sg.closeWindow()


def test_jsUpdate_set_yes():
    """
    If JS file contains matching case statement,
    js column should be set to YES.
    """
    newFilePath = createTestFile("case \"actionName\":")
    sg = StepsGuide()
    tree = sg.getTreeview()
    sg.addTreeStep(defAction, tree)
    sg.jsUpdate(tree, [tree.get_children("")[0]], newFilePath)
    assert tree.item(tree.get_children("")[0], "values")[2] == "YES"
    os.remove(newFilePath)

def test_jsUpdate_set_no():
    """
    If JS file does not contain case,
    js column should be set to NO.
    """
    newFilePath = createTestFile("actionName")
    sg = StepsGuide()
    tree = sg.getTreeview()
    sg.addTreeStep(defAction, tree)
    sg.jsUpdate(tree, [tree.get_children("")[0]], newFilePath)
    assert tree.item(tree.get_children("")[0], "values")[2] == "NO"
    os.remove(newFilePath)

def test_get_file_contents_reads_file():
    """
    Ensure file reading returns exact file contents.
    """
    newFilePath = createTestFile("Test contents")
    sg = StepsGuide()
    contents = sg.getFileContents(newFilePath)
    assert contents == "Test contents"
    os.remove(newFilePath)
    
