export function augmentD3SelectionPrototypeForEasierSyntax() {
  if(!d3) return console.error("d3 not defined");

  const augmentations = ["for", "class", "id", "type", "placeholder", "required"];

  for (const name of augmentations) {
    d3.selection.prototype[name] = function (value) {
      return arguments.length
        ? this.attr(name, value)  // setter
        : this.attr(name);        // getter
    };
  }
}

