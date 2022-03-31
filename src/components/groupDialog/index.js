import Vue from 'vue';
import DialogComponent from './groupDialog';
let instance;
function isInDocument (element) {
  return document.body.contains(element);
}
function initInstance () {
  if (instance) {
    instance.$destroy();
  }

  instance = new (Vue.extend(DialogComponent))({
    el: document.createElement('div'),
    // avoid missing animation when first rendered
    propsData: {
      lazyRender: false
    }
  });

  instance.$on('input', (value) => {
    instance.value = value;
  });
}
function Dialog (options) {
  return new Promise((resolve, reject) => {
    if (!instance || !isInDocument(instance.$el)) {
      initInstance();
    }

    Object.assign(instance, Dialog.currentOptions, options, {
      resolve,
      reject
    });
  });
}
Dialog.defaultOptions = {
  value: true,
  choice: [],
  showDialog: false,
  callback: (action, index) => {
    if (action === 'confirm') {
      instance.resolve(index);
    } else {
      instance.reject(index);
    }
  }
};
Dialog.show = (list) =>
  Dialog({
    showDialog: true,
    choice: list
  });
Dialog.close = () => {
  if (instance) {
    instance.value = false;
  }
};
Dialog.setDefaultOptions = (options) => {
  Object.assign(Dialog.currentOptions, options);
};
Dialog.resetDefaultOptions = () => {
  Dialog.currentOptions = { ...Dialog.defaultOptions };
};

Dialog.resetDefaultOptions();
Dialog.install = () => {
  Vue.use(DialogComponent);
};
Dialog.Component = DialogComponent;
export default Dialog;
