function initMermaid() {
  mermaid.initialize({
    startOnLoad: true,
    flowchart: {
      curve: "linear",
    },
  });
  console.log("Interval!!");
}
window.onload = () => {
  setInterval(() => {
    initMermaid();
  }, 1000);
};
