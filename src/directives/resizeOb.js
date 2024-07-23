const map = new WeakMap();
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handler = map.get(entry.target);
    requestAnimationFrame(() => {
      if (handler) {
        const { inlineSize, blockSize } = entry.borderBoxSize[0];
        handler(inlineSize, blockSize);
      }
    });
  }
});

export default {
  bind(el, binding) {
    ob.observe(el);
    map.set(el, binding.value);
  },
  unbind(el) {
    ob.unobserve(el);
  }
};
