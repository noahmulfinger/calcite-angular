import { Injectable } from "@angular/core";
import { CalciteModalComponent } from "./modal.component";

@Injectable()
export class CalciteModalService {
  modals: Map<string, CalciteModalComponent>;

  constructor() {
    this.modals = new Map<string, CalciteModalComponent>();
  }

  toggle(name: string) {
    const modal = this.modals.get(name);

    if (modal) {
      modal.isActive = !modal.isActive;
      modal.toggle.emit(modal.isActive);
    }
  }

  register(name: string, modal: CalciteModalComponent) {
    this.modals.set(name, modal);
  }

  unregister(name: string) {
    this.modals.delete(name);
  }
}
