export const isValidId = (id: string | undefined | null) => {
  return (id?.length && !isNaN(parseInt(id)) && parseInt(id) > 0);
};
