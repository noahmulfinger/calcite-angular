import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CopyableTextComponent } from "./copyable-text/copyable-text.component";

@NgModule({
  imports: [CommonModule],
  declarations: [CopyableTextComponent],
  exports: [CopyableTextComponent]
})
export class CalciteAngularModule {}
