export const bodyGen = (customData: string[]) => {
  // thankfully ai came in clutch with the comma brainfuck here
  return `{
  "message": "Hello, world!",
  ${customData.map((data) => `"${data}": "${data}"`).join(',\n  ')}
}`;
};

export const bodyGenNoIdent = (customData: string[]) => {
  return JSON.stringify(JSON.parse(bodyGen(customData)));
}