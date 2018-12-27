export const set = value => {
  localStorage.setItem("images", JSON.stringify(value));
};

export const get = () => {
  const data = localStorage.getItem("images");
  return data ? JSON.parse(data) : null;
};
