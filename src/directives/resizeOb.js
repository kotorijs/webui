import debounce from 'lodash/debounce';

const map = new WeakMap();
const debounceMap = new WeakMap();

const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handler = map.get(entry.target);
    if (!handler) continue;
    const { inlineSize, blockSize } = entry.borderBoxSize[0];
    requestAnimationFrame(() => {
      if (debounceMap.has(entry.target)) {
        debounceMap.get(entry.target)(inlineSize, blockSize);
      } else {
        handler(inlineSize, blockSize);
      }
    });
  }
});

export default {
  bind(el, binding) {
    const delay = binding.arg || false;
    const handler = binding.value;
    map.set(el, handler);
    if (delay) {
      const debounceHandler = debounce(handler, delay);
      debounceMap.set(el, debounceHandler);
    }
    ob.observe(el);
  },
  unbind(el) {
    ob.unobserve(el);
    map.delete(el);
    if (debounceMap.has(el)) {
      debounceMap.delete(el);
    }
  }
};
