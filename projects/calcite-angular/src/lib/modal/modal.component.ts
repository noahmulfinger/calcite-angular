import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostBinding,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  AfterViewChecked,
  EventEmitter,
  Output
} from "@angular/core";
import { CalciteModalService } from "./modal.service";
import whenKey from "ally.js/esm/when/key.js";
import whenVisableArea from "ally.js/esm/when/visible-area.js";
import maintainHidden from "ally.js/esm/maintain/hidden.js";
import maintainDisabled from "ally.js/esm/maintain/disabled.js";
import maintainTabFocus from "ally.js/esm/maintain/tab-focus.js";
import queryFirstTabbable from "ally.js/esm/query/first-tabbable.js";
import queryTabbable from "ally.js/esm/query/tabbable.js";

@Component({
  selector: "calcite-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class CalciteModalComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @Input() name: string;
  @Input() isActive = false;
  @Input() label = "Modal";
  @Output() toggle = new EventEmitter();
  @HostBinding("hidden")
  @HostBinding("attr.aria-hidden")
  get hidden() {
    return !this.isActive;
  }

  @ViewChild("overlay") overlay: ElementRef;
  @ViewChild("content") content: ElementRef;

  private previousElement: Element;
  private previousState = false;
  private keyHandler: any;
  private disabledHandle: any;
  private hiddenHandle: any;
  private tabHandle: any;

  constructor(
    private modalService: CalciteModalService,
    private element: ElementRef
  ) {}

  ngOnInit() {
    this.modalService.register(this.name, this);
    this.initKeyHandler();
  }

  ngOnDestroy() {
    this.modalService.unregister(this.name);
    this.destroyKeyHandler();
    if (this.disabledHandle) {
      this.disabledHandle.disengage();
    }

    if (this.hiddenHandle) {
      this.hiddenHandle.disengage();
    }

    if (this.tabHandle) {
      this.tabHandle.disengage();
    }

    if (this.previousElement) {
      (this.previousElement as HTMLElement).focus();
    }
  }

  initKeyHandler() {
    this.keyHandler = whenKey({
      escape: () => {
        this.close();
      }
    });
  }

  destroyKeyHandler() {
    this.keyHandler.disengage();
  }

  open() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.toggle.emit(this.isActive);
  }

  close() {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.toggle.emit(this.isActive);
  }

  setInitialFocus() {
    const element = queryFirstTabbable({
      context: this.content.nativeElement,
      defaultToContext: true
    });

    if (element) {
      element.focus();
    }
  }

  ngAfterViewChecked() {
    if (!this.previousState && this.isActive) {
      this.previousElement = document.activeElement;
      this.previousState = this.isActive;

      const visibleHandle = whenVisableArea({
        context: this.overlay.nativeElement,
        callback: () => {
          this.disabledHandle = maintainDisabled({
            filter: this.element.nativeElement
          });

          this.hiddenHandle = maintainHidden({
            filter: this.element.nativeElement
          });

          this.tabHandle = maintainTabFocus({
            context: this.element.nativeElement
          });

          this.setInitialFocus();

          visibleHandle.disengage();
        }
      });
    }

    if (this.previousState && !this.isActive) {
      this.previousState = this.isActive;
      if (this.disabledHandle) {
        this.disabledHandle.disengage();
      }

      if (this.hiddenHandle) {
        this.hiddenHandle.disengage();
      }

      if (this.tabHandle) {
        this.tabHandle.disengage();
      }

      if (this.previousElement) {
        (this.previousElement as HTMLElement).focus();
      }
    }
  }
}
