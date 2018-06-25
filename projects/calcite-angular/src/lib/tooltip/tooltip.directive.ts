import {
  Directive,
  Input,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewContainerRef
} from "@angular/core";
import {
  OverlayRef,
  Overlay,
  OverlayConfig,
  ConnectionPositionPair,
  OriginConnectionPosition,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from "@angular/cdk/overlay";
import { AriaDescriber, FocusMonitor } from "@angular/cdk/a11y";
import { ComponentPortal } from "@angular/cdk/portal";
import { TooltipComponent } from "./tooltip.component";
import { Subscription } from "rxjs";
import { ScrollDispatcher } from "@angular/cdk/scrolling";

export type TooltipPosition = "left" | "right" | "top" | "bottom";

@Directive({
  selector: "[calciteTooltip]"
})
export class TooltipDirective implements OnDestroy {
  @Input("calciteTooltip")
  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this.ariaDescriber.removeDescription(this.element, this._message);
    this._message = value ? value.trim() : "";

    if (this._message) {
      this.updateTooltipMessage(this._message);
      this.ariaDescriber.describe(this.element, this._message);
    } else {
      this.hideTooltip();
    }
  }

  @Input("calciteTooltipPosition")
  get position(): TooltipPosition {
    return this._position;
  }
  set position(value: TooltipPosition) {
    this._position = value;
  }

  private overlayRef: OverlayRef;
  private _message = "";
  private _position: TooltipPosition = "bottom";
  private element: HTMLElement;
  private tooltipInstance: TooltipComponent;
  private strategySubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    private overlay: Overlay,
    private ariaDescriber: AriaDescriber,
    private focusMonitor: FocusMonitor,
    private ngZone: NgZone,
    private viewContainerRef: ViewContainerRef,
    private scrollDispatcher: ScrollDispatcher
  ) {
    this.element = this.elementRef.nativeElement;
    this.element.addEventListener("mouseenter", () => this.showTooltip());
    this.element.addEventListener("mouseleave", () => this.hideTooltip());

    // Focus monitor runs outside Angular and listens for focus changes to an element
    // Also adds and removes classes
    this.focusMonitor.monitor(this.element, true).subscribe(source => {
      if (!source) {
        this.ngZone.run(() => this.hideTooltip());

        // Don't show tooltip if focus is set programmatically or by the mouse
      } else if (!(source === "program" || source === "mouse")) {
        this.ngZone.run(() => {
          // Set timeout prevents changed after checked error
          setTimeout(() => {
            this.showTooltip();
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.tooltipInstance) {
      this.disposeTooltip();
    }

    this.element.removeEventListener("mouseenter", () => this.showTooltip());
    this.element.removeEventListener("mouseleave", () => this.hideTooltip());

    this.ariaDescriber.removeDescription(this.element, this.message);
    this.focusMonitor.stopMonitoring(this.element);
  }

  private createTooltip() {
    this.createOverlay();
    const portal = new ComponentPortal(TooltipComponent, this.viewContainerRef);
    this.tooltipInstance = this.overlayRef.attach(portal).instance;
  }

  private createOverlay() {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withFlexibleDimensions(false)
      .withViewportMargin(5)
      .withLockedPosition(true)
      .withPositions(this.getPositions());

    const scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(
      this.elementRef
    );
    strategy.withScrollableContainers(scrollableAncestors);

    this.strategySubscription = strategy.positionChanges.subscribe(change => {
      const { originX, originY } = change.connectionPair;
      let position: TooltipPosition = "bottom";
      if (originY === "top") {
        position = "top";
      } else if (originX === "start") {
        position = "left";
      } else if (originX === "end") {
        position = "right";
      }
      this.ngZone.run(() => this.updateTooltipPosition(position));
    });

    const config = new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef = this.overlay.create(config);
  }

  private showTooltip() {
    if (!this.message || this.tooltipInstance) {
      return;
    }

    this.createTooltip();
    this.updateTooltipMessage(this.message);
  }

  private hideTooltip() {
    if (this.tooltipInstance) {
      this.disposeTooltip();
    }
  }

  private updateTooltipMessage(message: string) {
    if (this.tooltipInstance) {
      this.tooltipInstance.message = message;
      this.tooltipInstance.markForCheck();
    }
  }

  private updateTooltipPosition(position: TooltipPosition) {
    if (this.tooltipInstance) {
      this.tooltipInstance.position = position;
      this.tooltipInstance.updateArrowPosition(this.element);
      this.tooltipInstance.markForCheck();
    }
  }

  private disposeTooltip() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.tooltipInstance = null;
    if (this.strategySubscription) {
      this.strategySubscription.unsubscribe();
    }
  }

  private getPositions() {
    let order: [HorizontalConnectionPos, VerticalConnectionPos][];

    switch (this.position) {
      case "top":
        order = [["center", "top"], ["center", "bottom"]];
        break;
      case "bottom":
        order = [["center", "bottom"], ["center", "top"]];
        break;
      case "left":
        order = [["start", "center"], ["end", "center"]];
        break;
      case "right":
        order = [["end", "center"], ["start", "center"]];
        break;
    }

    return order.map(([x, y]) => {
      return {
        originX: x,
        originY: y,
        overlayX: this.invertX(x),
        overlayY: this.invertY(y)
      };
    });
  }

  private invertX(value: HorizontalConnectionPos): HorizontalConnectionPos {
    switch (value) {
      case "start":
        return "end";
      case "end":
        return "start";
    }
    return value;
  }

  private invertY(value: VerticalConnectionPos): VerticalConnectionPos {
    switch (value) {
      case "top":
        return "bottom";
      case "bottom":
        return "top";
    }
    return value;
  }
}
