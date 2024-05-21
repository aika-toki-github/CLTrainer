mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  fontFamily: '"Roboto Mono", monospace',
  flowchart: {
    curve: "linear",
  },
});
setTimeout(() => {
  document.querySelector("#regenerate").addEventListener("click", drawFlowchart, false);
  [...document.querySelectorAll(".spoiler")].forEach((e) => e.addEventListener("click", () => e.classList.toggle("show")));
  drawFlowchart();
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "github-dark" : "github";
  document.querySelector("#hljscss").href = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/" + theme + ".min.css";
}, 500);
const patterns = [
  ["c1---|Y|x1---y1---e\nc1---|N|x2---y2-->e", "10110", "[p:p]"],
  ["c1---|Y|x1---y1---e\nc1-->|N|e", "10100", "[p:n]"],
  ["c1---|Y|c2---|Y|x1---y1---e\nc2---|N|x2---y2-->e\nc1---|N|x3---y3-->e", "11111", "[[p:p]:p]"],
  ["c1---|Y|c2---|Y|x1---y1---e\nc2---|N|x2---y2-->e\nc1-->|N|e", "11110", "[[p:p]:n]"],
  ["c1---|Y|c2---|Y|x1---y1---e\nc2-->|N|e\nc1-->|N|e", "11100", "[[p:n]:n]"],
  ["c1---|Y|c2---|Y|x1---y1---e\nc2-->|N|e\nc1---|N|x2---y2-->e", "11110", "[[p:n]:p]"],
  ["c1---|Y|x1---y1---e\nc1---|N|c2---|Y|x2---y2-->e\nc2---|N|x3---y3-->e", "11111", "[p:[p:p]]"],
  ["c1---|Y|x1---y1---e\nc1---|N|c2---|Y|x2---y2-->e\nc2-->|N|e", "11110", "[p:[p:n]]"],
];
function tof() {
  return [true, false][Math.floor(Math.random() * 2)];
}
const conditions = ["abcrstuxyz", "abcrstuxyz0123456789", "=≠<≦>≧", ["AND", "OR"]];
function generateCondition() {
  const isMulti = tof();
  let availableFirstCharacters = conditions[0];
  let availableSecondCharacters = conditions[1];
  const condition = [];
  let firstCharacter = availableFirstCharacters[Math.floor(Math.random() * availableFirstCharacters.length)];
  availableFirstCharacters = availableFirstCharacters.replace(firstCharacter, "");
  availableSecondCharacters = availableSecondCharacters.replace(firstCharacter, "");
  let secondCharacter = availableSecondCharacters[Math.floor(Math.random() * availableSecondCharacters.length)];
  availableFirstCharacters = availableFirstCharacters.replace(secondCharacter, "");
  availableSecondCharacters = availableSecondCharacters.replace(secondCharacter, "");
  let comparisonOperator = conditions[2][Math.floor(Math.random() * conditions[2].length)];
  condition.push(firstCharacter, comparisonOperator, secondCharacter);
  if (isMulti) {
    let logicalOperator = conditions[3][Math.floor(Math.random() * conditions[3].length)];
    firstCharacter = availableFirstCharacters[Math.floor(Math.random() * availableFirstCharacters.length)];
    availableFirstCharacters = availableFirstCharacters.replace(firstCharacter, "");
    availableSecondCharacters = availableSecondCharacters.replace(firstCharacter, "");
    secondCharacter = availableSecondCharacters[Math.floor(Math.random() * availableSecondCharacters.length)];
    comparisonOperator = conditions[2][Math.floor(Math.random() * conditions[2].length)];
    condition.push("\n", logicalOperator, "\n", firstCharacter, comparisonOperator, secondCharacter);
  }
  return condition.join(" ");
}
const processes = ["+-×÷", "abcrstuxyz23456789"];
function generateProcess() {
  const process = [
    ["x", "←"],
    ["y", "←"],
  ];
  for (let i = 0; i < 2; i++) {
    const isCalculation = tof();
    let availableCharacter = processes[1].replace(process[i][0], "");
    const firstCharacter = availableCharacter[Math.floor(Math.random() * availableCharacter.length)];
    availableCharacter = availableCharacter.replace(firstCharacter, "");
    process[i].push(firstCharacter);
    if (isCalculation) {
      const operator = processes[0][Math.floor(Math.random() * processes[0].length)];
      const secondCharacter = availableCharacter[Math.floor(Math.random() * availableCharacter.length)];
      process[i].push(operator, secondCharacter);
    }
  }
  return process.map((e) => e.join(" "));
}
function generateFlowchart() {
  const template = ["flowchart TB\nclassDef h display:none;\ns( ):::h\nc( ):::h\ne( ):::h", "s---c1\ne---c"];
  const variables = {
    values: [, , [,], [,], [,]],
    hidePattern: 10100,
  };
  const patternID = Math.floor(Math.random() * patterns.length);
  const [chartPattern, hidePatterns, codePattern] = patterns[patternID];
  variables["hidePattern"] = hidePatterns;
  variables.values[0] = generateCondition();
  variables.values[1] = variables.hidePattern[1] == 1 ? generateCondition() : "";
  variables.values[2] = generateProcess();
  variables.values[3] = variables.hidePattern[3] == 1 ? generateProcess() : ["", ""];
  variables.values[4] = variables.hidePattern[4] == 1 ? generateProcess() : ["", ""];
  const suffix = [":::h\n", "\n"];
  const variableDeclaration = [
    ["c1{ ", variables.values[0], " }", suffix[variables.hidePattern[0]]],
    ["c2{ ", variables.values[1], " }", suffix[variables.hidePattern[1]]],
    ["x1[ ", variables.values[2][0], " ]", suffix[variables.hidePattern[2]]],
    ["y1[ ", variables.values[2][1], " ]", suffix[variables.hidePattern[2]]],
    ["x2[ ", variables.values[3][0], " ]", suffix[variables.hidePattern[3]]],
    ["y2[ ", variables.values[3][1], " ]", suffix[variables.hidePattern[3]]],
    ["x3[ ", variables.values[4][0], " ]", suffix[variables.hidePattern[4]]],
    ["y3[ ", variables.values[4][1], " ]", suffix[variables.hidePattern[4]]],
  ]
    .map((e) => e.join(""))
    .join("");
  console.log(patternID);
  return [
    [template[0], variableDeclaration, chartPattern, template[1]],
    [variables, codePattern],
  ];
}
function generateCode(variables, codePattern) {
  console.log([variables, codePattern]);
  const values = variables.values.map((e) => {
    if (typeof e == "string") {
      const r = (b, a) => {
        e = e.replaceAll(b, a);
      };
      r("\n OR \n", "||");
      r("\n AND \n", "&&");
      r("=", "==");
      r("≠", "!=");
      r("≦", "<=");
      r("≧", ">=");
    } else {
      e = e.map((e) => {
        const r = (b, a) => {
          e = e.replaceAll(b, a);
        };
        r("×", "*");
        r("÷", "/");
        r("←", "=");
        return e;
      });
    }
    return e;
  });
  let code = [],
    codePart = "",
    indent = 0,
    conditionIndex = 0,
    processIndex = 2;
  codePattern = codePattern.replaceAll(":n", "");
  [...codePattern].forEach((e) => {
    codePart = "";
    switch (e) {
      case "[":
        codePart = "".padStart(indent, " ") + "if (" + values[conditionIndex++] + ")\n" + "".padStart(indent++, "  ") + "{";
        break;
      case "]":
        codePart = "".padStart(--indent, " ") + "}";
        break;
      case ":":
        codePart = "".padStart(--indent, " ") + "}\n" + "".padStart(indent, " ") + "else\n" + "".padStart(indent++, " ") + "{";
        break;
      case "p":
        codePart = "".padStart(indent, " ") + values[processIndex][0] + "\n" + "".padStart(indent, " ") + values[processIndex++][1];
        break;
      default:
        break;
    }
    code.push(codePart);
  });
  return code.join("\n");
}
function drawFlowchart() {
  document.querySelector("#code").textContent = "";
  document.querySelector("#answer").classList.remove("show");
  setTimeout(() => {
    const flowchart = generateFlowchart();
    document.querySelector("#flowchart").textContent = flowchart[0].join("\n");
    console.debug(flowchart[0][2]);
    document.querySelector("#flowchart").removeAttribute("data-processed");
    document.querySelector("#code").textContent = generateCode(...flowchart[1]);
    document.querySelector("#code").removeAttribute("data-highlighted");
    initMermaid();
    initCode();
  }, 200);
}
function initMermaid() {
  mermaid.init();
  setTimeout(() => {
    [...document.querySelectorAll(".mermaid>svg")].map((e) => e.classList.add("column"));
  }, 1000);
}
function initCode() {
  const codes = document.querySelectorAll("figure.highlight");
  [...codes].map((e) => {
    hljs.highlightElement(e.querySelector("code"));
    e.querySelector("code").removeAttribute("data-highlighted");
  });
}
