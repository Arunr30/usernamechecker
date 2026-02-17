import { Component, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsernameService } from '../../service/usernameservice';

type UsernameState =
  | { type: 'empty' }
  | { type: 'short' }
  | { type: 'result'; data: { username: string; available: boolean } };

@Component({
  selector: 'app-username-checker',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './usernamecomponent.html',
})
export class UsernameCheckerComponent {
  usernameControl = new FormControl('');

  checking = signal(false);
  statusMessage = signal('');
  placeholderText = signal('Type username...');

  constructor(private usernameService: UsernameService) {
    // ✅ Let TypeScript infer the type automatically
    const usernameResult = toSignal(
      this.usernameControl.valueChanges.pipe(
        startWith(''),
        debounceTime(1000),

        switchMap((value) => {
          const clean = value?.trim() ?? '';

          // 1️⃣ Empty input
          if (!clean) {
            return of({ type: 'empty' } as UsernameState);
          }

          // 2️⃣ Too short
          if (clean.length < 3) {
            return of({ type: 'short' } as UsernameState);
          }

          // 3️⃣ Valid → call API
          this.checking.set(true);
          this.placeholderText.set('Checking...');

          return this.usernameService.checkUsername(clean).pipe(
            map(
              (result) =>
                ({
                  type: 'result',
                  data: result,
                }) as UsernameState,
            ),
          );
        }),
      ),
      { initialValue: { type: 'empty' } },
    );

    effect(() => {
      const result = usernameResult();

      // TypeScript safety guard (prevents undefined error)
      if (!result) return;

      // Reset common state
      this.checking.set(false);
      this.placeholderText.set('Type username...');

      if (result.type === 'empty') {
        this.statusMessage.set('');
        return;
      }

      if (result.type === 'short') {
        this.statusMessage.set('Username must be at least 3 characters ⚠️');
        return;
      }

      if (result.type === 'result') {
        this.statusMessage.set(
          result.data.available
            ? `"${result.data.username}" is available ✅`
            : `"${result.data.username}" is taken ❌`,
        );
      }
    });
  }
}
