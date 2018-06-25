import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from "@angular/core";
import { TooltipPosition } from "./tooltip.directive";

@Component({
  selector: "editor-tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  @ViewChild("tooltipArrow") arrowElementRef: ElementRef;
  message: string;
  position: TooltipPosition;

  constructor(private cd: ChangeDetectorRef, private elementRef: ElementRef) {}

  updateArrowPosition(sourceElement: HTMLElement) {
    const sourceElementRect = sourceElement.getBoundingClientRect();
    const tooltipRect = this.elementRef.nativeElement.getBoundingClientRect();
    const arrow = this.arrowElementRef.nativeElement;

    if (this.position === "top" || this.position === "bottom") {
      const offset =
        sourceElementRect.left +
        sourceElementRect.width / 2 -
        (tooltipRect.left + tooltipRect.width / 2);
      arrow.style.marginLeft = `${offset - 5}px`;
    } else {
      const offset =
        sourceElementRect.top +
        sourceElementRect.height / 2 -
        (tooltipRect.top + tooltipRect.height / 2);
      arrow.style.marginTop = `${offset - 5}px`;
    }
  }

  markForCheck() {
    this.cd.markForCheck();
  }
}
