import './popup.scss';
import { merge, Observable, Subject, take, tap } from "rxjs";

type OnErrorClose<T> = { hasError: true, data: T };
type OnSuccessClose<T> = { hasError: false, data: T };

export type TPopupClosePayload<SuccessData, ErrorData> = OnSuccessClose<SuccessData> | OnErrorClose<ErrorData>;

export interface IPopupOpenInstance<SuccessData, ErrorData> {
  onClose$: Observable<TPopupClosePayload<SuccessData, ErrorData>>;
}

export interface IPopupConfig {
  title: string;
}

interface IPopupDataBase<T> {
  popupConfig: IPopupConfig;
  contentConfig: T;
}
export type TPopupData<T = void> = T extends void
  ? Omit<IPopupDataBase<T>, "contentConfig">
  : IPopupDataBase<T>
;

class Popup {
  container!: HTMLDivElement;
  static openedCount = 0;
  static readonly CLASSES = {
    TITLE: 'Popup__header-title',
    CONTAINER: 'popup-container',
    HEADER_CLOSE_BTN: 'Popup__header-close'
  };
  static template = `
    <div class="Popup-content">
      <div class="Popup__header">
          <h6 class="${Popup.CLASSES.TITLE}">Popup title</h6>
          <button class="Button Button--link ${Popup.CLASSES.HEADER_CLOSE_BTN}">x</button>
      </div>
      <div class="Popup__body"></div>
    </div>
  `;

  constructor() {
    this.initContainer();
  }

  // todo типизировать PopupContentClass (any -> AbstractPopupContent)
  open
  <
    PopupContentPayloadType = any,
    SuccessCloseDataType = any,
    ErrorCloseDataType = any
  >(
    PopupContentClass: any,
    config: TPopupData<PopupContentPayloadType>
  ): IPopupOpenInstance<SuccessCloseDataType | void, ErrorCloseDataType> {
    const popupContentInstance = new PopupContentClass((config as IPopupDataBase<any>).contentConfig);
    const openedPopupNode: HTMLDivElement = document.createElement('div');
    openedPopupNode.classList.add('Popup-overlay');
    openedPopupNode.innerHTML = Popup.template;
    openedPopupNode.querySelector('.Popup__body')!.appendChild(popupContentInstance.node);
    this.container.appendChild(openedPopupNode);

    this.initData(openedPopupNode, config.popupConfig);
    const popupOnClose$ = this.initClose(openedPopupNode);
    this.addOverflowToBody();
    Popup.openedCount++;

    return {
      onClose$:
        merge(
          popupContentInstance.onClose$,
          popupOnClose$
        )
        .pipe(
          // todo remove ts-ignore
          // @ts-ignore
          take(1),
          tap((data) => {
            openedPopupNode.remove();
            Popup.openedCount--;
            if (Popup.openedCount === 0) {
              this.removeOverflowFromBody();
            }
          })
      )
    }
  }

  private initContainer(): void {
    let container: HTMLDivElement | null = document.querySelector(`.${Popup.CLASSES.CONTAINER}`);
    if (container) {
      this.container = container;
      return;
    }

    container = document.createElement('div');
    container.classList.add(`${Popup.CLASSES.CONTAINER}`);
    this.container = container;
    document.body.appendChild(container);
  }

  private initData(node: HTMLDivElement, config: IPopupConfig): void {
    const { title } = config;
    node.querySelector(`.${Popup.CLASSES.TITLE}`)!.textContent = title;
  }

  private initClose(node: HTMLDivElement): Observable<void> {
    const close$ = new Subject<void>();
    node.querySelector(`.${Popup.CLASSES.HEADER_CLOSE_BTN}`)!.addEventListener('click', () => {
      close$.next();
      close$.complete();
    });
    return close$.pipe();
  }

  private addOverflowToBody(): void {
    document.body.classList.add('body-overflow');
  }

  private removeOverflowFromBody(): void {
    document.body.classList.remove('body-overflow');
  }
}

export const popup = new Popup();