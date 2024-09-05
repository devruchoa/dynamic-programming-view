import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ComparisonRequest {
  sizes: number[];
  numSamples: number;
}

export interface ComparisonResult {
  sizes: number[];
  timesRecMemo: number[];
  timesIter: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {

  private apiUrl = 'http://localhost:8080/api/v1/algorithm/compare';

  constructor(private http: HttpClient) { }

  compareAlgorithms(request: ComparisonRequest): Observable<ComparisonResult> {
    return this.http.post<ComparisonResult>(this.apiUrl, request);
  }
}
