import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {StorageService} from "../storage.service";
import {environment} from "../../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: BehaviorSubject<User>;

  public get user$(): Observable<User> {
    return this._user.asObservable();
  }

  public get user(): User {
    return this._user.value;
  }

  public get token(): string {
    return this._user.value?.token;
  }

  constructor(private http: HttpClient,
              private router: Router,
              private storageService: StorageService) {
    this._user = new BehaviorSubject<User>(null);
    this.storageService.get('user').then((user: User) => {
      if (user)
        this._user.next(user);
      else
        this._user.next(null);
    });
  }

  public register(firstname: string, lastname: string, username: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiURL + 'auth/register',
      {firstname, lastname, username, password})
      .pipe(
        tap((user: User) => {
          this._user.next(user);
          this.storageService.set('user', user).then(() => this.router.navigate(['']));
        })
      );
  }

  public login(username: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiURL + 'auth/login', {username, password})
      .pipe(
        tap((user: User) => {
          this._user.next(user);
          this.storageService.set('user', user).then(() => this.router.navigate(['']))
        })
      );
  }

  public reload(): void {
    this.http.get<User>(environment.apiURL + `users/${this._user.value.id}`).subscribe(
      (user: User) => {
        user.token = this.user.token;
        this.storageService.set('user', user);
        this._user.next(user);
      }
    );
  }

  public logout(): void {
    this.storageService.set('user', null);
    this.router.navigate(['/auth']);
  }

}
