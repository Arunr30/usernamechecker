import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';
import { UsernameService } from '../../service/usernameservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-username-checker',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './usernamecomponent.html',
})
export class UsernameCheckerComponent implements OnInit {
  usernameControl = new FormControl('');
  placeholderText = 'Type username...';
  checking = false;
  statusMessage = '';

  constructor(private usernameService: UsernameService) {}

  ngOnInit(): void {
    this.usernameControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300), // wait 300ms after every keystroke
        tap((value) => {
          if (!value) {
            // empty input: reset everything
            this.checking = false;
            this.statusMessage = '';
            this.placeholderText = 'Type username...';
          } else {
            // user typed something: show checking
            this.checking = true;
            this.placeholderText = 'Checking...';
          }
        }),
        switchMap((value) => {
          if (!value) return of(null); // skip API for empty input
          const safeUsername = value; // send raw value
          return this.usernameService.checkUsername(safeUsername);
        }),
        tap((result) => {
          if (!result) return;
          this.checking = false;
          this.placeholderText = 'Type username...';
          this.statusMessage = result.available
            ? `"${result.username}" is available ✅`
            : `"${result.username}" is taken ❌`;
        }),
      )
      .subscribe();
  }
}
