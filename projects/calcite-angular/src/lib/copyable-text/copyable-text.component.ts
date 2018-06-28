import {
  Component,
  HostListener,
  Inject,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "calcite-copyable-text",
  templateUrl: "./copyable-text.component.html",
  styleUrls: ["./copyable-text.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalciteCopyableTextComponent {
  @Input() value: string = "";
  @Input() inputId: string;
  @Input() compact: boolean = false;
  @Input() tooltipString: string = "Click to Copy";
  @Input() tooltipDir: string;
  @Output() copy = new EventEmitter();

  @ViewChild("inputElement") inputElement: ElementRef;
  @ViewChild("copyElement") copyElement: ElementRef;

  tooltip: string = this.tooltipString;
  active: boolean = false;
  copying: boolean = false;

  constructor(@Inject(DOCUMENT) private document: any) {}

  @HostListener("blur")
  onBlur() {
    this.resetTooltip();
  }

  @HostListener("mouseenter")
  onMouseEnter() {
    this.resetTooltip();
  }

  copyToClipboard() {
    this.copying = true;

    try {
      this.copyElement.nativeElement.select();
      this.document.execCommand("copy");
      this.tooltip = "Copied!";
      this.copying = false;
    } catch (err) {
      this.inputElement.nativeElement.select();
      this.tooltip = "Press Ctrl+C to copy";
    } finally {
      this.active = true;
    }
  }

  resetTooltip() {
    if (!this.copying) {
      this.active = false;
      this.tooltip = this.tooltipString;
    }
  }
}
