import { canFind } from "./FindAlt.js";
import { resolveBoolean } from "./StoreVariables.js";

export async function routineIf(ifStep, routine) {
  let [condition] = ifStep.args;
  const ifName = ifStep.name;

  // Resolve different arg types to boolean
  condition = await ifArgHandler(condition);

  // Block contains:
  //  body: actions to execute if condition is true
  //  bodyPost: actions to execute if condition is false
  //  end: end marker
  const block = routine.popControlBlock(ifName);

  if (condition){ // Push items inside the if section
    routine.pushManyStack(block.body); 
  }
  else {  // Push items inside the else section
    routine.pushManyStack(block.bodyPost);
  }
}

export async function parseIf(ifStep) {
    let [condition] = ifStep.args;
    const ifName = ifStep.name;

    // Resolve different arg types to boolean
    condition = await ifArgHandler(condition);

    return { name: ifName, condition: condition}
}

async function ifArgHandler(conditionStep) {
  const type = conditionStep.selected
  const name = type.name.toLowerCase();

  // handle 'if' arg types
  if (name === "text") return resolveBoolean(type.value);
  else if (name === "can_find") return (await canFind(conditionStep));

  switch (name) {
        case "text":
            return resolveBoolean(type.value);

        case "can_find":
             return (await canFind(conditionStep));
             
        default:
            throw new Error(`ifHandler: unsupported if mode: ${}`);
  }

  // If arg type is unknown
  
}