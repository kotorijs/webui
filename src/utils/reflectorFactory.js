const reflectorFactory = (origin) => {
  return (data) => {
    return Object.keys(data).map((key) => ({ name: origin[key], value: data[key] }));
  };
};

export default reflectorFactory;
