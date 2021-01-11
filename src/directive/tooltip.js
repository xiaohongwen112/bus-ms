/* eslint-disable */
import _ from 'lodash';

// const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
// Attach an event listener to an element
const eventOn = (el, evtName, handler) => {
  if (el && el.addEventListener) {
    el.addEventListener(evtName, handler);
  }
};

// // Remove an event listener from an element
// const eventOff = (el, evtName, handler) => {
//   if (el && el.removeEventListener) {
//     el.removeEventListener(evtName, handler)
//   }
// }

// Valid event triggers
const validTriggers = {
  'focus': true,
  'hover': true,
  'click': true,
  'blur': true
};

// const placementMap = ['top', 'bottom', 'left', 'right'];

const Defaults = {
  title: '',
  placement: 'top',
  trigger: ['hover', 'focus'],
  template: `<div class="tooltip-inner"></div>
  <div class="arrow-before"></div>
  <div class="arrow-after"></div>`,
  className: 'tooltip fade show',
  style: `position: absolute; 
  will-change: transform; 
  top: 0px; left: 0px; 
  transform: translate3d(0, 0, 0);`,
  container: false,
};

function parseBindings(bindings) {
  let config = {};
  // init
  if (typeof bindings.value === 'string') {
    config.title = bindings.value;
  } else if (typeof bindings.value === 'object') {
    config = bindings.value;
  }
  // If Argument, assume element ID of container element
  if (bindings.arg) {
    // Element ID specified as arg. We must prepend '#' to become a CSS selector
    config.container = `#${bindings.arg}`
  }

  // Process modifiers
  _.keys(bindings.modifiers).forEach((mod) => {
    if (/^html$/.test(mod)) {
        // Title allows HTML
      config.html = true;
    } else if (/^nofade$/.test(mod)) {
        // no animation
      config.animation = false;
    } else if (/^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(mod)) {
        // placement of tooltip
      config.placement = mod;
    } else if (/^(window|viewport)$/.test(mod)) {
        // bounday of tooltip
      config.boundary = mod;
    } else if (/^d\d+$/.test(mod)) {
        // delay value
      const delay = parseInt(mod.slice(1), 10) || 0;
      if (delay) {
        config.delay = delay;
      }
    } else if (/^o-?\d+$/.test(mod)) {
        // offset value. Negative allowed
      const offset = parseInt(mod.slice(1), 10) || 0;
      if (offset) {
        config.offset = offset;
      }
    }
  });

  // Special handling of event trigger modifiers
  const modifiersTrigger = [];
  _.keys(validTriggers).forEach(trigger => {
    if (bindings.modifiers[trigger]) {
      modifiersTrigger.push(trigger);
    }
  })
  if (modifiersTrigger.length > 0) {
    config.trigger = modifiersTrigger;
  }
  // console.log('config', config);
  return config;
}


export default {
  bind() {},
  inserted(el, bindings, vnode) {
    // console.log('directives', el, bindings);
    const parentEle = el;
    const node = document.createElement('div');
    // event
    let evnetFlag = true;
    // console.log(_.keys(bindings.modifiers).includes('ellipsis'),el.scrollWidth , el.offsetWidth, el.scrollWidth < el.offsetWidth);
    if (_.keys(bindings.modifiers).includes('ellipsis') && el.scrollWidth <= el.offsetWidth) {
      // 先判断
      evnetFlag = false;
    }

    if (evnetFlag) {
      eventOn(parentEle, 'mouseover', () => {
        const rect = parentEle.getBoundingClientRect();
        let translateX = rect.left;
        let translateY = rect.top;
        const config = Object.assign({}, Defaults, parseBindings(bindings));
        node.innerHTML = config.template;
        node.getElementsByClassName('tooltip-inner')[0].innerHTML = config.title;
        node.className = config.className;
        node.classList.add(`tooltip-${config.placement}`);
        node.style = config.style;
        switch (config.placement) {
          case 'top':
            translateX = rect.left + rect.width / 2;
            translateY = rect.top - 30;
            break;
          case 'bottom':
            translateX = rect.left + rect.width / 2;
            translateY = rect.top + rect.height;
            break;
          case 'left':
            translateX = rect.left - 50;
            translateY = rect.top + rect.height / 2;
            break;
          default:
            translateX = rect.left + rect.width;
            translateY = rect.top + rect.height / 2;
        }
        node.style.transform = `translate3d(${Math.round(translateX)}px, ${Math.round(translateY)}px, 0)`;
        // console.log('click', vnode.context.$root);
        // console.log(config.title);
        document.body.appendChild(node);
      });
      parentEle.onmouseout = () => {
        document.body.removeChild(node);
      };
    }
    
  },
  update() {},
  componentUpdated() {},
  unbind() {},
};
