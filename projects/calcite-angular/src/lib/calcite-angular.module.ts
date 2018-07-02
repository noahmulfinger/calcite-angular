import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalciteCopyableTextComponent } from "./copyable-text/copyable-text.component";
import { CalciteModalComponent } from "./modal/modal.component";
import { CalciteModalToggleDirective } from "./modal/modal-toggle.directive";
import { CalciteModalService } from "./modal/modal.service";
import { CalciteSelectComponent } from "./select/select.component";
import { CalciteSelectSuggestionComponent } from "./select/select-suggestion.component";
import { CalciteSelectedOptionComponent } from "./select/selected-option.component";

@NgModule({
  imports: [CommonModule],
  declarations: [
    CalciteCopyableTextComponent,
    CalciteModalComponent,
    CalciteModalToggleDirective,
    CalciteSelectComponent,
    CalciteSelectSuggestionComponent,
    CalciteSelectedOptionComponent
  ],
  providers: [CalciteModalService],
  exports: [
    CalciteCopyableTextComponent,
    CalciteModalComponent,
    CalciteModalToggleDirective,
    CalciteSelectComponent
  ]
})
export class CalciteAngularModule {}
