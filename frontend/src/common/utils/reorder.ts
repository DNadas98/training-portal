export const reorder = <T extends { order: number }>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result.forEach((item, index) => {
    item.order = index + 1;
  });
  return result;
};
