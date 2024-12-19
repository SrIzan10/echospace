export const bodyGen = (customData: string[]) => {
  const customFields = customData.map((data) => `"${data}": "${data}"`).join(',\n  ');
  return `{
  "message": "Hello, world!"${customData.length ? ',\n  ' : ''}${customFields}
}`;
};

export const bodyGenNoIdent = (customData: string[]) => {
  console.log(bodyGen(customData));
  return JSON.stringify(JSON.parse(bodyGen(customData)));
}