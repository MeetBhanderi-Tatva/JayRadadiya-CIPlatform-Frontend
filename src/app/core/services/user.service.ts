import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { RequestCountry } from '../Interfaces/request-country';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Interfaces/auth-response';
import { City } from '../Interfaces/city';
import { IMission } from '../Interfaces/mission';
import { FormLists } from '../Interfaces/form-lists';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getCities(countryId: number): Observable<AuthResponse<City[]>> {
    return this.http.get<AuthResponse<City[]>>(
      this.apiUrl + "/api/Home/cities/"+ countryId,
    );
  }
  getFormLists(): Observable<AuthResponse<FormLists>>{
    return this.http.get<AuthResponse<FormLists>>(
      this.apiUrl + "/api/Home/mission"
    );
  }

  getMissions(searchValue : string,country: number, cities: number[], themes : number[], skills : number[], sortingOption : number ):Observable<AuthResponse<IMission[]>>
  {
    let params = new HttpParams()
      .set('searchValue', searchValue)
      .set('country', country.toString())
      .set('sortingOption', sortingOption.toString());

    cities.forEach((city: number) => {
      params = params.append('cities', city.toString());
    });
    themes.forEach((theme: number) => {
      params = params.append('themes', theme.toString());
    });
    skills.forEach((skill: number) => {
      params = params.append('skills', skill.toString());
    });

    return this.http.get<AuthResponse<IMission[]>>(this.apiUrl + '/api/Home/missions/', { params });
  }

  createMission(data: FormData): Observable<AuthResponse<string>>{
    console.log(data);
    return this.http.post<AuthResponse<string>>(
      `${this.apiUrl}/api/Home/mission`,
      data
    );
  }
}
