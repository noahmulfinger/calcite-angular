import {
  Component,
  OnInit,
  OnDestroy,
  forwardRef,
  Input,
  ViewChild,
  ElementRef,
  HostBinding,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  NG_VALIDATORS
} from "@angular/forms";
import _whenKey from "ally.js/esm/when/key.js";
import activeElement from "ally.js/esm/event/active-element.js";

// @HACK for whatever reason the import isn't available in the class so we reassign it
const whenKey = _whenKey;

const noop = () => {
  return;
};

@Component({
  selector: "calcite-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalciteSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CalciteSelectComponent),
      multi: true
    }
  ]
})
export class CalciteSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() suggestions: any = [];
  @Input() arbitrary = false;
  @Input() placeholder = "";
  @Input() display: "inline" | "external" | "none" = "none";
  @Input() required = false;
  @Input() validator: Function = null;
  @HostBinding("class.is-disabled")
  @Input()
  disabled = false;

  @ViewChild("input") input: ElementRef;
  public activeSelectedValue: any;
  public activeSuggestion: any;
  public activeSuggestions: any = [];
  public showSuggestions = false;
  public value: any = [];

  private activeElementHandle: any;
  private keyHandler: any;
  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;

  constructor(private element: ElementRef) {}

  getLabelForValue(value: string) {
    const label = this.suggestions.find(
      (suggestion: any) => suggestion.value === value
    );
    return label ? label.label : value;
  }

  emitValueChange() {
    this.value = this.value.filter(
      (value: string, index: number, self: any[]) => {
        return self.indexOf(value) === index;
      }
    );
    this.onTouchedCallback();
    this.onChangeCallback(this.value);
  }

  onInputBlur(event: Event) {
    this.activeSelectedValue = null;
    this.onTouchedCallback();

    if (!this.arbitrary) {
      return;
    }

    const input = event.target;
    const value = (input as HTMLInputElement).value;

    if (value) {
      this.handleEnterKey(event);
    }
  }

  onFocus() {
    this.activeSelectedValue = null;
    this.activeSuggestions = this.suggestions;
    this.activeSuggestions = true;
    this.activeSuggestion = null;
  }

  onInput(event: any) {
    if (event.keyCode === 38 || event.keyCode === 40) {
      return;
    }

    if (!(this.element.nativeElement as HTMLElement).contains(document.activeElement)) {
      return;
    }

    if (event.keyCode === 188 && this.arbitrary) {
      this.handleEnterKey(event);
      return;
    }

    const input = event.target;
    const value = (input as HTMLInputElement).value;

    if (event.keyCode !== 8) {
      this.activeSelectedValue = null;
    }

    this.buildSuggestions(value);
    this.showSuggestions = true;
  }

  onClick(event: MouseEvent) {
    // if focus is on an element outside <calcite-select> and someone hits enter
    // it will cause onClick to fire, this might be an Angular or browser bug.
    if (!(this.element.nativeElement as HTMLElement).contains(document.activeElement)) {
      console.log("returns");
      return;
    }

    this.toggleSuggestions();
  }

  toggleSuggestions() {
    this.activeSelectedValue = null;
    this.activeSuggestion = null;
    this.buildSuggestions();
    this.showSuggestions = !this.showSuggestions;
  }

  onSuggestionClick(value: string) {
    this.toggleSuggestion(value);
  }

  toggleSuggestion(valueToToggle: string) {
    const existingValue = this.value.find(
      (value: any) => value === valueToToggle
    );

    this.activeSuggestion = this.suggestions.find(
      (suggestion: any) => suggestion.value === valueToToggle
    );

    this.activeSuggestion.selected = true;

    if (existingValue) {
      this.removeValue(valueToToggle);
    } else {
      this.value = this.value.concat([valueToToggle]);
      this.emitValueChange();
    }

    this.activeSuggestion = null;
    this.input.nativeElement.focus();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    if (!this.element.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
      this.activeSuggestion = null;
    }
  }

  @HostListener("document:active-element", ["$event"])
  onDocumentActiveElement(event: CustomEvent) {
    if (!this.element.nativeElement.contains(event.detail.focus)) {
      this.showSuggestions = false;
      this.activeSuggestion = null;
    }
  }

  buildSuggestions(text?: string) {
    text = text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : null; // Escape any regex characters
    const regex = new RegExp(`^${text}`, "i");
    const filter = text
      ? (suggestion: any) => regex.test(suggestion.label)
      : () => true;

    this.activeSuggestions = this.suggestions
      .filter(filter)
      .map((suggestion: any) => {
        suggestion.selected = !!this.value.find(
          (value: string) => value === suggestion.value
        );
        return suggestion;
      });

    if (
      !this.arbitrary &&
      !this.activeSuggestion &&
      this.activeSuggestions.length
    ) {
      this.activeSuggestion = this.activeSuggestions[0];
    }

    if (
      !this.arbitrary &&
      this.activeSuggestion &&
      this.activeSuggestions.length <= 0
    ) {
      this.activeSuggestion = null;
    }
  }

  trackSuggetsionByValue(suggestion: any) {
    return suggestion.value;
  }

  trackByValue(value: string) {
    return value;
  }

  removeValue(valueToRemove: string) {
    if (this.disabled) {
      return;
    }

    this.value = this.value.filter((value: string) => value !== valueToRemove);
    this.emitValueChange();
    this.activeSelectedValue = null;

    const selectedSelection = this.activeSuggestions.find(
      (suggestion: any) => suggestion.value === valueToRemove
    );

    if (selectedSelection) {
      selectedSelection.selected = false;
    }

    this.onTouchedCallback();
  }

  ngOnInit() {
    this.initKeyBindings();
    this.initActiveElementListener();
  }

  ngOnDestroy() {
    this.destroyKeyBindings();
    this.destroyActiveElementListener();
  }

  handleEscapeKey(e: KeyboardEvent) {
    this.showSuggestions = false;
    this.activeSuggestion = null;
    this.input.nativeElement.value = "";
    this.input.nativeElement.focus();
  }

  handleUpArrowKey(e: KeyboardEvent) {
    if (this.activeSelectedValue) {
      this.selectPreviousValue(e);
    } else {
      this.selectPreviousSuggestion(e);
    }
  }

  handleDownArrowKey(e: KeyboardEvent) {
    if (this.activeSelectedValue) {
      this.selectNextValue(e);
    } else {
      this.selectNextSuggestion(e);
    }
  }

  handleLeftArrowKey(e: KeyboardEvent) {
    if (this.input.nativeElement.value) {
      return;
    }

    this.selectPreviousValue(e);
  }

  handleRightArrowKey(e: KeyboardEvent) {
    if (this.input.nativeElement.value) {
      return;
    }

    this.selectNextValue(e);
  }

  handleBackspaceKey(e: KeyboardEvent) {
    if (this.activeSelectedValue) {
      this.removeValue(this.activeSelectedValue);
      return;
    }

    if (this.input.nativeElement.value) {
      return;
    }

    this.activeSelectedValue = this.value[this.value.length - 1];

    e.preventDefault();
    e.stopPropagation();
  }

  selectPreviousSuggestion(e: KeyboardEvent) {
    const index = this.activeSuggestions.findIndex(
      (suggestion: any) => suggestion === this.activeSuggestion
    );

    const previous = index - 1;

    if (this.activeSuggestions[previous]) {
      this.activeSuggestion = this.activeSuggestions[previous];
    } else {
      this.activeSuggestion = this.activeSuggestions[
        this.activeSuggestions.length - 1
      ];
    }

    e.preventDefault();
  }

  selectNextSuggestion(e: KeyboardEvent) {
    const index = this.activeSuggestions.findIndex(
      (suggestion: any) => suggestion === this.activeSuggestion
    );

    const next = index + 1;

    if (this.activeSuggestions[next]) {
      this.activeSuggestion = this.activeSuggestions[next];
    } else {
      this.activeSuggestion = this.activeSuggestions[0];
    }

    e.preventDefault();
  }

  selectNextValue(e: KeyboardEvent) {
    const index = this.value.findIndex(
      (value: any) => value === this.activeSelectedValue
    );
    const next = index + 1;

    if (this.value[next]) {
      this.activeSelectedValue = this.value[next];
    } else {
      this.activeSelectedValue = this.value[0];
    }

    e.preventDefault();
  }

  selectPreviousValue(e: KeyboardEvent) {
    const index = this.value.findIndex(
      (value: any) => value === this.activeSelectedValue
    );
    const next = index - 1;

    if (this.value[next]) {
      this.activeSelectedValue = this.value[next];
    } else {
      this.activeSelectedValue = this.value[this.value.length - 1];
    }

    e.preventDefault();
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `writeValue`
   * is called whenever the value is updated from an outside source and the
   * value is a non-empty array.
   */
  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `registerOnChange`
   * gets passed a function that we need to call whenever we change the value
   * of our input.
   */
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `registerOnTouched`
   * gets passed a function that we need to call whenever the user "touches" or
   * focuses and unfocuses this input.
   */
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  validate(c: FormControl) {
    if (this.required) {
      return c.value && c.value.length ? null : { required: true };
    }
    return this.validator ? this.validator(c) : null;
  }

  private initActiveElementListener() {
    this.activeElementHandle = activeElement();
  }

  private destroyActiveElementListener() {
    if (this.activeElementHandle) {
      this.activeElementHandle.disengage();
    }
  }

  private initKeyBindings() {
    this.keyHandler = whenKey({
      context: this.input.nativeElement,
      up: (e: KeyboardEvent) => {
        this.handleUpArrowKey(e);
      },
      down: (e: KeyboardEvent) => {
        this.handleDownArrowKey(e);
      },
      left: (e: KeyboardEvent) => {
        this.handleLeftArrowKey(e);
      },
      right: (e: KeyboardEvent) => {
        this.handleRightArrowKey(e);
      },
      "alt+up": (e: KeyboardEvent) => {
        this.handleUpArrowKey(e);
      },
      "alt+down": (e: KeyboardEvent) => {
        this.handleDownArrowKey(e);
      },
      enter: (e: KeyboardEvent) => {
        this.handleEnterKey(e);
      },
      escape: (e: KeyboardEvent) => {
        this.handleEscapeKey(e);
      },
      backspace: (e: KeyboardEvent) => {
        this.handleBackspaceKey(e);
      },
      tab: (e: KeyboardEvent) => {
        this.handleTabKey(e);
      }
    });
  }

  private destroyKeyBindings() {
    this.keyHandler.disengage();
  }

  private handleTabKey(e: KeyboardEvent) {
    const value = this.input.nativeElement.value;

    if (this.activeSuggestion) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!this.activeSuggestion && this.arbitrary && value) {
      const exists =
        this.suggestions.findIndex(
          (suggestion: any) => suggestion.value === value
        ) > 0;

      if (!exists) {
        this.suggestions.push({
          value,
          label: value
        });
      }

      this.value = this.value.concat([value]);
      this.emitValueChange();
      this.input.nativeElement.value = "";
      this.showSuggestions = false;
    }
  }

  private handleEnterKey(e: Event) {
    const value = this.input.nativeElement.value.replace(",", "");

    if (!this.activeSuggestion && this.arbitrary && value) {
      const exists =
        this.suggestions.findIndex(
          (suggestion: any) => suggestion.value === value
        ) > 0;

      if (!exists) {
        this.suggestions.push({
          value,
          label: value
        });
      }

      this.value = this.value.concat([value]);
      this.emitValueChange();
      this.input.nativeElement.value = "";
      this.input.nativeElement.focus();
      this.showSuggestions = false;
      this.activeSuggestion = null;
    }

    if (this.activeSelectedValue) {
      this.removeValue(this.activeSelectedValue);
    }

    if (this.activeSuggestion) {
      this.toggleSuggestion(this.activeSuggestion.value);
      this.showSuggestions = true;
    }

    e.stopPropagation();
    e.preventDefault();
  }

  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
}
