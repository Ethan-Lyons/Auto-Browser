import tkinter as tk

class ButtonInfo:
    def __init__(self, text, onPressFunction):
        self.text = text
        self.onPressFunction = onPressFunction

    def getText(self):
        return self.text

    def getOnPressFunction(self):
        return self.onPressFunction

def createButton(parent: tk.Frame, text: str, onPressFunction: callable):
    return tk.Button(master=parent,
                     text=text,
                     command=lambda: onPressFunction())

def verticalButtonFrame(parent: tk.Frame, buttonList: list[ButtonInfo]):
    bFrame = tk.Frame(parent)
    tkList = infoToTkList(buttonList, bFrame)

    row = 0
    for button in tkList:
        button.grid(row=row, column=0, sticky="NSEW")
        row += 1

    return bFrame

def horizontalButtonFrame(parent: tk.Frame, buttonList: list[ButtonInfo]):
    bFrame = tk.Frame(parent)
    tkList = infoToTkList(buttonList, bFrame)

    column = 0
    for button in tkList:
        button.grid(row=0, column=column, sticky="NSEW")
        column += 1

    return bFrame


def infoToTkList(bInfoList: list[ButtonInfo], parent: tk.Frame) -> list[tk.Button]:
    """
    Converts a list of ButtonInfo objects to a list of tkinter.Button objects
    given a parent frame.

    Args:
        bInfoList (list[ButtonInfo]): A list of ButtonInfo objects
        parent (tk.Frame): The parent frame to which the buttons should be added

    Returns:
        A list of tkinter.Button objects
    """
    tkList = []
    for bInfo in bInfoList:
        text = bInfo.getText()
        onPressFunction = bInfo.getOnPressFunction()

        tkButton = createButton(parent, text, onPressFunction)
        tkList.append(tkButton)

    return tkList