import { Component, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html',
    styleUrls: ['app.breadcrumb.scss']
})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];
    selectedCourt:SelectItem;

    constructor(public breadcrumbService: BreadcrumbService, private app: AppComponent) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
