import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  selectSuggestions = [
    { label: "one", value: "one" },
    { label: "two", value: "two" },
    { label: "three", value: "three" },
    { label: "four", value: "four" }
  ];
}
