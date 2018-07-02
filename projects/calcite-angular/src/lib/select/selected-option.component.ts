import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  HostBinding,
  ElementRef,
  OnInit,
  OnDestroy
} from "@angular/core";
import _whenKey from "ally.js/esm/when/key.js";

// @HACK for whatever reason the import isn't available in the class so we reassign it
const whenKey = _whenKey;

@Component({
  selector: "calcite-selected-option",
  templateUrl: "./selected-option.component.html",
  styleUrls: ["./selected-option.component.scss"]
})
export class CalciteSelectedOptionComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() value: string;
  @Input() disabled: boolean;

  @HostBinding("attr.aria-selected")
  @Input()
  selected = false;

  @Output() remove = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();

  @HostBinding("attr.role") role = "option";
  @HostBinding("attr.tabindex") tabindex = "-1";

  keyHandler: any;

  constructor(private element: ElementRef) {}

  @HostListener("click")
  onClick() {
    this.emitRemove();
  }

  ngOnInit() {
    this.keyHandler = whenKey({
      context: this.element.nativeElement,
      enter: (e: KeyboardEvent) => this.emitRemove(),
      delete: (e: KeyboardEvent) => this.emitRemove(),
      backspace: (e: KeyboardEvent) => this.emitRemove(),
      up: (e: KeyboardEvent) => this.next.emit(),
      "alt+up": (e: KeyboardEvent) => this.next.emit(),
      left: (e: KeyboardEvent) => this.next.emit(),
      down: (e: KeyboardEvent) => this.previous.emit(),
      "alt+down": (e: KeyboardEvent) => this.previous.emit(),
      right: (e: KeyboardEvent) => this.previous.emit()
    });
  }

  ngOnDestroy() {
    this.keyHandler.disengage();
  }

  emitRemove() {
    this.remove.emit(this.value);
  }
}
