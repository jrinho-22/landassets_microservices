type Sizes = {
  sm: { width: string; height: string };
  md: { width: string; height: string };
  lg: { width: string; height: string };
};

export const modalSizeConverter = (size: keyof Sizes): Sizes[keyof Sizes] => {
  const sizes: Sizes = {
    sm: { width: '300px', height: '300px' },
    md: { width: '500px', height: '400px' },
    lg: { width: '800px', height: '540px' },
  };
  return sizes[size];
};
