import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	private history: string[] = ["", "", "", "", "", "", "", ""];
	private toMatch: string = "lowrider";
	private listen: boolean = true;
	
	smileys: string = "";
	highrider: boolean = false;

	@HostListener('window:keydown', ['$event'])
	keyboardInput(event: KeyboardEvent) {
		console.log(event);
		if (this.listen) {
			this.history.shift();
			this.history.push(event.key);
			
			let history = this.history.join("");
			if (history === this.toMatch) {
				if (this.smileys.length === 4) {
					this.listen = false;
					this.smileys = this.smileys.replace(/\)/g, "(");
					this.highrider = true;
				}
				else {
					this.smileys += ")";
				}
			}
		}
	}
}
