// ─────────────────────────────────────────────────────────────────────────────
// app.ts  (App — root component)
// The top-level component of the application. Its only job is to host the
// <router-outlet> in app.html, which is where Angular renders the active
// route's component (Login, Signup, or Dashboard).
// ─────────────────────────────────────────────────────────────────────────────

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',   // Matches <app-root> in src/index.html.
  templateUrl: './app.html',
  standalone: false,      // This component belongs to AppModule, not standalone.
  styleUrl: './app.scss'
})
export class App {}
