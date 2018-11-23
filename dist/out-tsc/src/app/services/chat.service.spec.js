import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
describe('ChatService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(ChatService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=chat.service.spec.js.map