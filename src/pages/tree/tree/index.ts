import { Tree } from "./Tree";
import dataSource from "./DataSource";

const svg = document.querySelector<SVGElement>('#simulation')!;
const tree = new Tree(svg, dataSource);

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

  document.querySelector('#stepByStep')!.addEventListener('click', function () {
    tree.initSingleNode();
  })

  document.querySelector('#getParents')!.addEventListener('click', function () {
    tree.loadParentsForSelected();
  })
}

