export const set = value => {
  localStorage.setItem("bookmarks", JSON.stringify(value));
};

export const get = () => {
  const data = localStorage.getItem("bookmarks");
  return data ? JSON.parse(data) : null;
};
