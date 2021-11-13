import './AddPersonPopup.scss';
import { AbstractPopupContent } from "../../AbstractPopupContent";
import { TPopupClosePayload } from "../../Popup";
import { INode, IPerson, TNewPerson } from "../../../tree/models";
import { getDateFromSimple, getSimpleDate } from "../../../utils";

type TAddPersonPopupClosePayload = TPopupClosePayload<TNewPerson, string>;

export interface IAddPersonPopupData {
  data: {
    node?: TNewPerson;
    parents: INode<IPerson>[];
    children: INode<IPerson>[];
  }
}

const CLASSES = {
  SUBMIT_BTN: 'js-submit-btn',
  PARENTS_GROUP: 'js-parents-group',
  PARENT_ITEM_LABEL: 'js-parent-item-label',
  PARENT_ITEM_INPUT: 'js-parent-item-input',
  CHILDREN_GROUP: 'js-children-group',
  CHILD_ITEM_LABEL: 'js-child-item-label',
  CHILD_ITEM_INPUT: 'js-child-item-input'
}
const FORM_IDS = {
  LAST_NAME: 'lastName',
  FIRST_NAME: 'firstName',
  MIDDLE_NAME: 'middleName',
  BIRTHDAY: 'birthday',
  DEPTH: 'depth',
  getParentId: (number: number) => `parent_${number}`,
  getChildId: (number: number) => `child_${number}`
}

const TEMPLATE = `
    <div class="AddPersonPopup">
      <form class="Form">
      <div class="Form__field">
          <label for="secondName">Фамилия:</label>
          <input type="text" id="${FORM_IDS.LAST_NAME}" />
      </div>
      <div class="Form__field">
          <label for="firstName">Имя: </label>
          <input type="text" id="${FORM_IDS.FIRST_NAME}" />
      </div>
      <div class="Form__field">
          <label for="middleName">Отчество: </label>
          <input type="text" id="${FORM_IDS.MIDDLE_NAME}" />
      </div>
      <div class="Form__field">
          <label for="birthday">Дата рождения: </label>
          <input type="date" id="${FORM_IDS.BIRTHDAY}" />
      </div>
      <div class="Form__field">
          <label for="depth">Уровень: </label>
          <input type="number" disabled id="${FORM_IDS.DEPTH}" />
      </div>
      
      <div class="Form__field-group ${CLASSES.PARENTS_GROUP}">
        <span class="Form__field-group-title">
            Родители
        </span>
      </div>
      
      <div class="Form__field-group ${CLASSES.CHILDREN_GROUP}">
        <span class="Form__field-group-title">
            Дети
        </span>
      </div>
      
      <div class="Form__actions">
          <button class="Button Button--link ${CLASSES.SUBMIT_BTN}">Сохранить</button>
      </div>
    </form>
    </div>
`;

const PARENT_FORM_FIELD_TEMPLATE = `
    <div class="Form__field">
      <label class="${CLASSES.PARENT_ITEM_LABEL}"></label>
      <input type="text" disabled class="${CLASSES.PARENT_ITEM_INPUT}" />
    </div>
`;

const CHILD_FORM_FIELD_TEMPLATE = `
  <div class="Form__field">
    <label for="secondName" class="${CLASSES.CHILD_ITEM_LABEL}"></label>
    <input type="text" disabled class="${CLASSES.CHILD_ITEM_INPUT}" />
  </div>
`

export class AddPersonPopup extends AbstractPopupContent<TAddPersonPopupClosePayload> {
  get lastNameInput(): HTMLInputElement {
    return this.node.querySelector<HTMLInputElement>(`#${FORM_IDS.LAST_NAME}`)!;
  }

  get firstNameInput(): HTMLInputElement {
    return this.node.querySelector<HTMLInputElement>(`#${FORM_IDS.FIRST_NAME}`)!;
  }

  get middleNameInput(): HTMLInputElement {
    return this.node.querySelector<HTMLInputElement>(`#${FORM_IDS.MIDDLE_NAME}`)!;
  }

  get birthdayInput(): HTMLInputElement {
    return this.node.querySelector<HTMLInputElement>(`#${FORM_IDS.BIRTHDAY}`)!;
  }

  get depthInput(): HTMLInputElement {
    return this.node.querySelector<HTMLInputElement>(`#${FORM_IDS.DEPTH}`)!;
  }



  constructor(data: IAddPersonPopupData) {
    super(TEMPLATE, data);
  }

  protected initData(data: IAddPersonPopupData): void {

    // todo похожие методы - заменить одним
    const initParents = () => {
      const parents = data.data.parents;
      if (parents.length ===0) return;
      const parentsGroup = this.node.querySelector<HTMLDivElement>(`.${CLASSES.PARENTS_GROUP}`)!;
      parents.forEach((parent, index) => {
        const parentFormItem = document.createElement('div');
        const parentId = FORM_IDS.getParentId(index);
        parentFormItem.innerHTML = PARENT_FORM_FIELD_TEMPLATE;

        const parentLabel = parentFormItem.querySelector<HTMLLabelElement>(`.${CLASSES.PARENT_ITEM_LABEL}`)!;
        parentLabel.textContent = `Родитель ${index + 1}:`;
        parentLabel.setAttribute('for', parentId);

        const parentInput = parentFormItem.querySelector<HTMLInputElement>(`.${CLASSES.PARENT_ITEM_INPUT}`)!;
        parentInput.setAttribute('id', parentId);
        parentInput.value = (() => {
          const { first, last, middle } = parent.data.name;
          return `${last} ${first} ${middle}`;
        })();
        parentsGroup.appendChild(parentFormItem.firstElementChild!);
      })

    }

    const initChildren = () => {
      const children = data.data.children;
      if (children.length === 0) return;
      const childrenGroup = this.node.querySelector<HTMLDivElement>(`.${CLASSES.CHILDREN_GROUP}`)!;
      children.forEach((child, index) => {
        const childFormItem = document.createElement('div');
        const childId = FORM_IDS.getChildId(index);
        childFormItem.innerHTML = CHILD_FORM_FIELD_TEMPLATE;

        const childLabel = childFormItem.querySelector<HTMLLabelElement>(`.${CLASSES.CHILD_ITEM_LABEL}`)!;
        childLabel.textContent = `Ребенок ${index + 1}:`;
        childLabel.setAttribute('for', childId);

        const childInput = childFormItem.querySelector<HTMLInputElement>(`.${CLASSES.CHILD_ITEM_INPUT}`)!;
        childInput.setAttribute('id', childId);
        childInput.value = (() => {
          const { first, last, middle } = child.data.name;
          return `${last} ${first} ${middle}`;
        })();
        childrenGroup.appendChild(childFormItem.firstElementChild!);
      })
    }

    if (data.data.node) {
      const { data: {name: { first, last, middle }, birthDate }, depth } = data.data.node;

      this.lastNameInput.value = last;
      this.firstNameInput.value = first;
      this.middleNameInput.value = middle || '';
      this.birthdayInput.value = getSimpleDate(birthDate);
      this.depthInput.value = depth.toString();
    }

    initParents();
    initChildren();
  }

  protected initHandlers(data: IAddPersonPopupData): void {

    const getNewNodeFromForm = (): TNewPerson => {
      return {
        data: {
          birthDate: getDateFromSimple(this.birthdayInput.value).toISOString(),
          name: {
            first: this.firstNameInput.value,
            last: this.lastNameInput.value,
            middle: this.middleNameInput.value
          }
        },
        depth: Number.parseInt(this.depthInput.value),
        parentIds: data.data.parents.map(parent => parent.id),
        childrenIds: data.data.children.map(child => child.id)
      }
    }

    this.node.querySelector(`.${CLASSES.SUBMIT_BTN}`)!.addEventListener('click', e => {
      e.preventDefault();
      const newNode = getNewNodeFromForm();
      this.close({ hasError: false, data: newNode});
    })
  }
}
