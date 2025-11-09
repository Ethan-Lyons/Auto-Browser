import tkinter as tk

class ButtonFrame:

    def __init__(self, parent, moveFunction, manageFunction):
        self.parent = parent
        self.buttonFrame = tk.Frame(self.parent)
        self.moveFunction = moveFunction
        self.manageFunction = manageFunction
        self.build()
    
    def getFrame(self):
        return self.buttonFrame
    
    def build(self):
        moveFrame = self.getMovementFrame()
        manageFrame = self.getManageFrame()

        moveFrame.grid(row=0, column=0)
        manageFrame.grid(row=0, column=1)

    def getMovementFrame(self):
        moveFrame = tk.Frame(self.buttonFrame)
        self.ActionButton(buttonName="UP", text="↑", parent=moveFrame,
                                          onPressFunction=self.moveFunction, row=0, column=0)
        self.ActionButton(buttonName="UP_DEEP", text="↑ (deep)", parent=moveFrame,
                                              onPressFunction=self.moveFunction, row=0, column=1)
        self.ActionButton(buttonName="DOWN", text="↓", parent=moveFrame,
                                            onPressFunction=self.moveFunction, row=0, column=2)
        
        return moveFrame
    
    def getManageFrame(self):
        manageFrame = tk.Frame(self.buttonFrame)
        self.ButtonRemove = self.ActionButton(buttonName="REMOVE", text="X", parent=manageFrame,
                                              onPressFunction=self.manageFunction, row=0, column=0)
        return manageFrame
    
    class ActionButton:
        def __init__(self, buttonName, text, parent, onPressFunction, row=0, column=0):
            self.button = tk.Button(master=parent, text=text, command=lambda:onPressFunction(buttonName))
            self.button.grid(row=row, column=column)
            #self.button.pack(side=tk.LEFT)
