export const isValidId = (id: string | undefined) => {
  return (id?.length && !isNaN(parseInt(id)) && parseInt(id) > 0);
};
