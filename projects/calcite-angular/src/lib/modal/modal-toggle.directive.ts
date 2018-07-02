import { Directive, Input, HostListener } from "@angular/core";
import { CalciteModalService } from "./modal.service";

@Directive({
  selector: "[calciteModalToggle]"
})
export class CalciteModalToggleDirective {
  @Input() calciteModalToggle: string;

  constructor(private modalService: CalciteModalService) {}

  @HostListener("click", ["$event"])
  onClick(e: MouseEvent) {
    this.modalService.toggle(this.calciteModalToggle);

    e.preventDefault();
    e.stopPropagation();
  }
}
