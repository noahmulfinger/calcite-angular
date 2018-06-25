import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from "@angular/cdk/overlay";
import { TooltipDirective } from './tooltip/tooltip.directive';
import { TooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [TooltipDirective, TooltipComponent],
  exports: [TooltipDirective],
  entryComponents: [TooltipComponent]
})
export class CalciteAngularModule { }
