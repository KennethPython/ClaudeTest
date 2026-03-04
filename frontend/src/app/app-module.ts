// ─────────────────────────────────────────────────────────────────────────────
// app-module.ts  (AppModule)
// The root NgModule — the starting point of the Angular app.
// Every component, service, and module that the app needs must be registered
// here (or in a child module). Angular reads this file at startup.
// ─────────────────────────────────────────────────────────────────────────────

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Required for Angular Material animations (fade-ins, ripples, etc.)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Enables template-driven reactive forms (FormBuilder, FormGroup, etc.)
import { ReactiveFormsModule } from '@angular/forms';
// HttpClientModule provides HttpClient for making HTTP calls.
// HTTP_INTERCEPTORS is the token used to register interceptors.
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// ── Angular Material modules ──────────────────────────────────────────────────
// Each module adds a set of Material components to the app.
import { MatCardModule }      from '@angular/material/card';       // <mat-card>
import { MatFormFieldModule } from '@angular/material/form-field'; // <mat-form-field>
import { MatInputModule }     from '@angular/material/input';      // matInput directive
import { MatButtonModule }    from '@angular/material/button';     // mat-raised-button etc.
import { MatIconModule }      from '@angular/material/icon';       // <mat-icon>
import { MatToolbarModule }   from '@angular/material/toolbar';    // <mat-toolbar>

// ── App-specific imports ──────────────────────────────────────────────────────
import { AppRoutingModule } from './app-routing-module'; // Route definitions
import { App }       from './app';
import { Login }     from './components/login/login';
import { Signup }    from './components/signup/signup';
import { Dashboard } from './components/dashboard/dashboard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  // declarations: components, directives, and pipes that belong to this module.
  declarations: [
    App,
    Login,
    Signup,
    Dashboard
  ],

  // imports: other modules whose exports are available to this module's templates.
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],

  // providers: services and tokens available for dependency injection.
  providers: [
    // Catches unhandled errors in the browser and logs them.
    provideBrowserGlobalErrorListeners(),

    // Register JwtInterceptor so Angular runs it for every HttpClient request.
    // multi: true means there can be more than one interceptor in the app.
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],

  // bootstrap: the root component Angular renders into index.html's <app-root>.
  bootstrap: [App]
})
export class AppModule { }
