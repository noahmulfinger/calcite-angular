import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ElementRef,
  OnChanges,
  SimpleChanges
} from "@angular/core";

@Component({
  selector: "calcite-select-suggestion",
  templateUrl: "./select-suggestion.component.html",
  styleUrls: ["./select-suggestion.component.scss"]
})
export class CalciteSelectSuggestionComponent implements OnChanges {
  @Input() value: string;
  @Input() label: string;
  @HostBinding("attr.aria-selected")
  @Input()
  selected: boolean;
  @Input() focused: boolean;
  @HostBinding("attr.role") role = "option";
  @HostBinding("attr.tabindex") tabindex = "-1";
  @Output() toggle = new EventEmitter();

  constructor(private element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes["focused"] &&
      changes["focused"].currentValue &&
      !changes["focused"].previousValue
    ) {
      const el = this.element.nativeElement;
      const elTop = el.offsetTop; // how far is the top of the element from the top of the list?
      const elBottom = elTop + el.clientHeight; // how far is the bottom of the element from the top of the list?
      const viewportHeight = el.parentNode.clientHeight; // how tall is the visable area of the displayed suggestions?
      const viewportMin = el.parentNode.scrollTop; // how offset is the top of the viewport from the top of the scroll area?
      const viewportMax = viewportMin + viewportHeight; // how offset is the bottom viewport from the top of the scroll area?
      const topInside = elTop >= viewportMin; // top of element is inside the top edge of the viewport
      const bottomInside = elBottom <= viewportMax; // bottom of element is inside bottom edge of the viewport

      if (topInside && !bottomInside) {
        el.parentNode.scrollTop = elBottom - viewportHeight;
      }

      if (!topInside && bottomInside) {
        el.parentNode.scrollTop = elTop;
      }
    }
  }
}
