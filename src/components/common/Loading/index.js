import Vue from 'vue';
import Loading from './Loading';

Loading.newInstance = (options) => {
  const _props = Object.assign(options, { show: true });
  const Instance = new Vue({
    name: 'loading-wrapper',
    data: _props,
    render(h) {
      return h(Loading, {
        props: this.$data,
      });
    },
  });
  const component = Instance.$mount();
  document.body.appendChild(component.$el);
  const loading = Instance.$children[0];

  return {
    component: loading,
    show() {
      Instance.show = true;
    },
    remove() {
      Instance.show = false;
    },
  };
};

let loadingInstance;
function getLoadingInstance(options = {}) {
  loadingInstance = loadingInstance || Loading.newInstance(options);
  return loadingInstance;
}

Loading.open = (options = {}) => {
  getLoadingInstance(options).show();
};

Loading.remove = () => {
  if (!loadingInstance) {
    return false;
  }
  const instance = getLoadingInstance();
  instance.remove();
  return instance;
};

export default Loading;
