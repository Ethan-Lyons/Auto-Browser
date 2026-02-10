import tkinter as tk

class ButtonFrame:
    """A class for creating a frame containing buttons for moving and managing a step frame"""
    def __init__(self, parent: tk.Frame, moveFunction: callable, manageFunction: callable):
        self.parent = parent
        self.buttonFrame = tk.Frame(self.parent)
        self.moveFunction = moveFunction
        self.manageFunction = manageFunction
        self.build()
    
    def getFrame(self):
        """Returns the tkinter frame associated with this button frame"""
        return self.buttonFrame
    
    def build(self):
        """Builds and places the move and manage buttons"""
        moveFrame = self.getMovementFrame()
        manageFrame = self.getManageFrame()

        moveFrame.grid(row=0, column=0)
        manageFrame.grid(row=0, column=1)

    def getMovementFrame(self):
        """Builds and returns a frame containing buttons for moving a step frame up and down"""
        moveFrame = tk.Frame(self.buttonFrame)
        self.ActionButton(buttonName="UP", text="↑", parent=moveFrame,
                                          onPressFunction=self.moveFunction, row=0, column=0)
        self.ActionButton(buttonName="UP_DEEP", text="↑ (deep)", parent=moveFrame,
                                              onPressFunction=self.moveFunction, row=0, column=1)
        self.ActionButton(buttonName="DOWN", text="↓", parent=moveFrame,
                                            onPressFunction=self.moveFunction, row=0, column=2)
        return moveFrame
    
    def getManageFrame(self):
        """Builds and returns a frame containing a button for removing a step frame"""
        manageFrame = tk.Frame(self.buttonFrame)
        self.ButtonRemove = self.ActionButton(buttonName="REMOVE", text="X", parent=manageFrame,
                                              onPressFunction=self.manageFunction, row=0, column=0)
        return manageFrame
    
    class ActionButton:
        """A class for creating a button which calls a given function when pressed"""
        def __init__(self, buttonName, text, parent, onPressFunction, row=0, column=0):
            self.button = tk.Button(master=parent, text=text, command=lambda:onPressFunction(buttonName))
            self.button.grid(row=row, column=column)
