import tkinter as tk
from tkinter import ttk
import re
from Steps import Action
from Steps import ActionGroup
from Steps import Argument
from UserActionBuilder import UserActionBuilder

import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
jsHandlerPath = os.path.abspath(os.path.join(
    BASE_DIR,
    "..",
    "Interpreter",
    "WebHelpers",
    "StepsHandler.js"
))

class StepsGuide():
    def __init__(self, stepTypes=[]):
        self.stepTypes = stepTypes
        self.root = self.createWindow()
        self.root.mainloop()

    def createWindow(self):
        """
        Create

        Returns:
            tkinter.Tk: The root of the window.
        """
        root = tk.Tk()
        root.title("Action Viewer")
        sContainer = tk.Frame(root)
        self.frameLayout(sContainer)
        return root
    
    def frameLayout(self, sContainer):
        tree = self.createTree(self.stepTypes, sContainer)
        #for action in self.stepTypes:
            #newFrame = self.createTree(action, sContainer)
        sContainer.grid(row=0, column=0)
        tree.grid(row=0, column=0)

    
    def createTree(self, stepTypes, sContainer):
        tree = ttk.Treeview(sContainer, columns=("type", "description", "js"), show="tree headings")
        tree.heading("#0", text="Name")
        tree.heading("type", text="Type")
        tree.heading("description", text="Description")
        tree.heading("js", text="JS Handler?")
        tree.column("js", anchor="center")
        self.addTreeSteps(stepTypes, tree)
        treeRoot = tree.get_children("")[0]
        initialChildIDs = tree.get_children(treeRoot)
        self.jsUpdate(tree, initialChildIDs)


        return tree
    
    def addTreeSteps(self, currStep, tree, parent_id=""):
        if isinstance(currStep, (ActionGroup, Action)):
            node_id = tree.insert(
                parent_id,
                "end",
                text=currStep.getName(),
                values=(type(currStep).__name__, currStep.getDescription())
            )

            for subAction in currStep.getArgs():
                self.addTreeSteps(subAction, tree, node_id)

        elif isinstance(currStep, Argument):
            tree.insert(
                parent_id,
                "end",
                text=currStep.getName(),
                values=(type(currStep).__name__, currStep.getDescription())
            )

        else:
            raise TypeError(
                f"addTreeSteps: Unknown step type {currStep} ({type(currStep)})"
            )
        
    def jsUpdate(self, tree, entries):
        jsText = self.getFileContents(jsHandlerPath)
        for id in entries:
            curMatch = None
            name = tree.item(id, "text")
            expectedMatch = r"\.name\s*==\s*['\"]" + re.escape(name) + r"['\"]"
            curMatch = re.search(expectedMatch, jsText, re.IGNORECASE)
            if curMatch:
                tree.set(id, column="js", value="yes")
            else:
                tree.set(id, column="js", value="no")

    def getFileContents(self, filePath):
        with open(filePath, "r", encoding="utf-8") as file:
            return file.read()


if __name__ == "__main__":
    print(os.getcwd())
    print(BASE_DIR)
    print(jsHandlerPath)
    uAB = UserActionBuilder()
    uAG = uAB.getUserActionGroup()
    stepsGuide = StepsGuide(stepTypes=uAG)