import { Tree } from "./Tree";

const svg = document.querySelector<SVGElement>('#simulation')!;
const tree = new Tree(svg);

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
}

