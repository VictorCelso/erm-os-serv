// interceptors/offline.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NetworkService } from '../services/network.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  constructor(
    private network: NetworkService,
    private localStorage: LocalStorageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Se estiver offline e for uma requisição POST/PUT/DELETE
    if (!this.network.isOnline() && ['POST', 'PUT', 'DELETE'].includes(request.method)) {
      // Adiciona a operação à fila de sincronização
      const operation = {
        type: request.method.toLowerCase(),
        url: request.url,
        payload: request.body,
        timestamp: Date.now()
      };
      
      this.localStorage.addPendingOperation(operation);
      
      // Retorna um observable simulando sucesso
      return new Observable(subscriber => {
        subscriber.next(new HttpResponse({
          status: 202,
          body: { message: 'Operation queued for sync', operation }
        }));
        subscriber.complete();
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) { // Erro de conexão
          // Pode implementar lógica adicional aqui
          console.error('Network error:', error);
        }
        return throwError(error);
      })
    );
  }
}