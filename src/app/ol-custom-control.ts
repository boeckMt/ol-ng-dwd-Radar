import { Control } from 'ol/control';
import { removeNode } from 'ol/dom';



interface OptionsEvent {
  type: keyof WindowEventMap;
  fn: () => boolean;
};
export interface ButtonControlOptions {
  className?: string;
  innerHTML?: string;
  event?: OptionsEvent | OptionsEvent[];
  [x: string]: any;
}

/**
 * .my-class {
        top: 65px;
        left: .5em;
        pointer-events: auto;
      }
 */

/**
 * Options:
 *  - className: string
 *  - event: {type:string , fn: ()=> }
 *
 * https://github.com/openlayers/openlayers/blob/v6.5.0/src/ol/control/Control.js
 */
export class ButtonControl extends Control {
  [x: string]: any;
  button: HTMLElement;
  constructor(opt_options: ButtonControlOptions = {}) {
    const options = opt_options;

    super({
      element: document.createElement('div'),
      target: options.target
    });



    const className =
      options.className !== undefined
        ? `${options.className} ol-unselectable ol-control`
        : 'custom-btn-ctrl ol-unselectable ol-control';

    const button = document.createElement('button');
    button.className = className;
    button.setAttribute('type', 'button');
    button.innerHTML = options.innerHTML || '';

    if (options.event) {
      if (Array.isArray(options.event)) {
        options.event.forEach(e => {
          button.addEventListener(e.type, e.fn.bind(this), false);
        });
      } else {
        button.addEventListener(options.event.type, options.event.fn.bind(this), false);
      }
    }

    this.button = button;
    const cssClasses = className + ' ';
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(button);
  }

  disposeInternal() {

    if (Array.isArray(this.options.event)) {
      this.options.event.forEach(e => {
        this.button.removeEventListener(e.type, e.fn.bind(this), false);
      });
    } else {
      this.button.addEventListener(this.options.event.type, this.options.event.fn.bind(this), false);
    }

    removeNode(this.element);
    super.disposeInternal();
  }
}
