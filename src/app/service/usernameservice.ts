import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsernameService {
  private takenUsernames = ['arun', 'admin', 'user123'];

  checkUsername(username: string): Observable<{ username: string; available: boolean }> {
    return of(username).pipe(
      delay(500), // simulate API delay
      map((name) => ({
        username: name,
        available: !this.takenUsernames.includes(name.toLowerCase()),
      })),
    );
  }
}
