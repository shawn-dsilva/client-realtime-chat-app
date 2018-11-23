var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { map } from 'rxjs/operators';
var ChatService = /** @class */ (function () {
    function ChatService(wsService) {
        this.wsService = wsService;
        this.messages = wsService
            .connect()
            .pipe(map(function (response) {
            return response;
        }));
    }
    ChatService.prototype.sendMsg = function (msg) {
        this.messages.next(msg);
    };
    ChatService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [WebsocketService])
    ], ChatService);
    return ChatService;
}());
export { ChatService };
//# sourceMappingURL=chat.service.js.map