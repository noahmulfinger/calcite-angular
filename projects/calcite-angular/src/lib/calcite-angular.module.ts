import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalciteCopyableTextComponent } from "./copyable-text/copyable-text.component";

@NgModule({
  imports: [CommonModule],
  declarations: [CalciteCopyableTextComponent],
  exports: [CalciteCopyableTextComponent]
})
export class CalciteAngularModule {}
