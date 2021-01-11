// cmtip 实例化调用
import Vue from 'vue';
import Modal from './CmTip';

/* eslint-disable no-param-reassign */

Modal.newInstance = (properties) => {
  const _props = properties || {};

  const Instance = new Vue({
    name: 'instance-cm-tip',
    data: Object.assign({}, _props, {
      visible: false,
      tipTitle: '',
      tipContent: '',
    }),
    render(h) {
      return h(Modal, {
        props: {
          ...this.$data,
          closeFn: this.$options.methods.close.bind(this),
        },
      });
    },
    methods: {
      close() {
        console.log(this.$data, this.$children);
        this.$children[0].visible = false;
        if (this.onClose) this.onClose();
        this.remove();
      },
      remove() {
        setTimeout(() => {
          this.destroy();
        }, 0);
      },
      destroy() {
        this.$destroy();
        document.body.removeChild(this.$el);
        this.onRemove();
      },
      onRemove() {},
    },
  });

  const component = Instance.$mount();
  document.body.appendChild(component.$el);
  const modal = Instance.$children[0];

  return {
    show(props) {
      if ('tipTitle' in props) {
        modal.$parent.tipTitle = props.tipTitle;
      }

      if ('tipContent' in props) {
        modal.$parent.tipContent = props.tipContent;
      }

      if ('onClose' in props) {
        modal.$parent.onClose = props.onClose;
      }

      // notice when component destroy
      modal.$parent.onRemove = props.onRemove;

      modal.visible = true;
    },
    remove() {
      modal.visible = false;
      modal.$parent.remove();
    },
    component: modal,
  };
};

let modalInstance;

function getModalInstance(options = {}) {
  modalInstance = modalInstance || Modal.newInstance(options);

  return modalInstance;
}

Modal.confirm = (options = {}) => {
  const instance = getModalInstance();

  options.onRemove = () => {
    modalInstance = null;
  };

  instance.show(options);
};

Modal.remove = () => {
  if (!modalInstance) { // at loading status, remove after close
    return false;
  }

  const instance = getModalInstance();

  instance.remove();
  return instance;
};

export default Modal;
