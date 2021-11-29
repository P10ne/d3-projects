import './styles.scss';
import { init } from "./tree";
import { Toolbar } from "./toolbar/Toolbar";

(function initToolbar() {
  const toolbar = new Toolbar();
  document.body.appendChild(toolbar.node);
})();





init();

