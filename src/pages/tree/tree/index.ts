import { Tree } from "./Tree";
import { DataSource } from "./DataSource";

const svg = document.querySelector<SVGElement>('#simulation')!;
const tree = new Tree(svg, new DataSource());

export async function init() {
  tree.init();
  initTemporaryBtns();
}

function initTemporaryBtns() {
  document.querySelector('#addNodeBtn')!.addEventListener('click', async function() {
    tree.openPopupToAddNode();
  })

  document.querySelector('#removeNode')!.addEventListener('click', async function() {
    tree.removeNode();
  })

  document.querySelector('#clearChecked')!.addEventListener('click', function() {

  })

  document.querySelector('#addChildBtn')!.addEventListener('click', async function() {
    tree.openPopupToAddChildNode();
  })

  document.querySelector('#getSimpleTree')!.addEventListener('click', function() {
    tree.simpleTree();
  })

  document.querySelector('#loadChildren')!.addEventListener('click', function() {
    tree.loadChildrenForSelected();
  })
}

