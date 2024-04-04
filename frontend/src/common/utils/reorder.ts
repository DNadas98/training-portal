export const reorder = <T extends { order: number }>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result.forEach((item, index) => {
    item.order = index + 1;
  });
  return result;
};

export const reorderAfterDelete = <T extends { order: number, tempId: any }>(list: T[], tempId: any) => {
  let isRemoved = false;
  const result = list.reduce((acc: T[], current: T) => {
    if (current.tempId !== tempId) {
      if (isRemoved) {
        acc.push({...current, order: current.order - 1});
      } else {
        acc.push(current);
      }
    } else {
      isRemoved = true;
    }
    return acc;
  }, []);
  return result;
}
