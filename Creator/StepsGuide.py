import tkinter as tk
from tkinter import ttk
import re
import os

from Creator.RoutineMaker.Steps import Action
from Creator.RoutineMaker.Steps import ActionGroup
from Creator.RoutineMaker.Steps import Argument
from Creator.RoutineMaker.UserStepBuilder import UserActionBuilder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
jsHandlerPath = os.path.abspath(os.path.join(
    BASE_DIR,
    "..",
    "Interpreter",
    "WebHelpers",
    "StepsHandler.js"
))

class StepsGuide():
    """
    A class for creating a window that displays a list of steps along with their types and descriptions.
    Steps are arranged in a hierarchical tree structure.
    """
    def __init__(self, stepTypes: list = None):
        self.stepTypes = stepTypes or []  # All steps that can be performed.
        self.root = self.createWindow()
        self.container = self.createContainer(self.root)
        self.tree = self.createTree(self.container)
    
    def run(self):
        self.root.mainloop()

    def createWindow(self):
        """
        Entry point for creating the root tkinter window.

        Returns:
            tkinter.Tk: The root of the window.
        """
        root = tk.Tk()
        root.title("Action Viewer")

        return root
    
    def createContainer(self, parent: tk.Frame):
        """
        Handles the layout of the main window including the step container and the step tree.
        
        Args:
            sContainer (tk.Frame): The parent container for the step tree
        """
        sContainer = tk.Frame(parent)
        sContainer.grid(row=0, column=0)

        return sContainer
        

    
    def createTree(self, parent: tk.Frame):
        """
        Creates the step tree widget and populates it with the given step types.

        Args:
            stepTypes (list): A list of step types to add to the tree.
            sContainer (tk.Frame): The parent container for the step tree.

        Returns:
            ttk.Treeview: The step tree.
        """
        tree = ttk.Treeview(parent, columns=("type", "description", "js"), show="tree headings")

        # Configure the column headings
        tree.heading("#0", text="Name")
        tree.heading("type", text="Type")
        tree.heading("description", text="Description")

        tree.heading("js", text="JS Handler?")
        tree.column("js", anchor="center")

        # Add the steps to the tree
        for step in self.stepTypes:
            self.addTreeStep(step, tree)

        # Update the JS handler column values for top-level steps
        rootChildren = tree.get_children("")
        if rootChildren:
            treeRoot = rootChildren[0]
            initialChildIDs = tree.get_children(treeRoot)
            self.jsUpdate(tree, initialChildIDs)

        tree.grid(row=0, column=0)

        return tree
    
    def addTreeStep(self, currStep: Action | ActionGroup | Argument, tree: ttk.Treeview, parentID: str = ""):
        """
        Adds a single step and its sub-actions to the step tree.

        Args:
            currStep (Action | ActionGroup | Argument): The step to add to the tree.
            tree (ttk.Treeview): The tree to add the step to.
            parentID (str): The ID of the parent node of the current step.
        """
        # If the current step is a group or action, add it to the tree
        if isinstance(currStep, (ActionGroup, Action)):
            stepType = type(currStep).__name__
            nodeID = tree.insert(
                parentID,
                "end",
                text=currStep.getName(),
                values=(stepType, currStep.getDescription())
            )

            # Create a tree node for each sub-action
            for subAction in currStep.getArgs():
                self.addTreeStep(subAction, tree, nodeID)

        # If the current step is an argument, add it to the tree
        elif isinstance(currStep, Argument):
            stepType = type(currStep).__name__
            tree.insert(
                parentID,
                "end",
                text=currStep.getName(),
                values=(stepType, currStep.getDescription())
            )

        else:
            raise TypeError(
                f"addTreeSteps: Unknown step type {currStep} ({type(currStep)})"
            )
        
    def jsUpdate(self, tree: ttk.Treeview, entries: list, filePath: str = jsHandlerPath):
        """
        Updates the JS handler column for the given tree entries.

        Args:
            tree (ttk.Treeview): The tree to update.
            entries (list): A list of tree entry IDs.
        """
        searchText = self.getFileContents(filePath)

        for id in entries:
            name = tree.item(id, "text")    # Get the name of the step
            expectedRegex = r"case [\'\"]" + re.escape(name) + r"[\'\"]:"   # Expected format: 'case "name":'
            match = re.search(expectedRegex, searchText, re.IGNORECASE)

            if match:
                tree.set(id, column="js", value="YES")
            else:
                tree.set(id, column="js", value="NO")

    def getFileContents(self, filePath: str):
        """Reads and returns the contents of a file."""
        with open(filePath, "r", encoding="utf-8") as file:
            return file.read()
    
    def getTreeview(self):
        return self.tree
    
    def closeWindow(self):
        if self.root:
            self.root.destroy()