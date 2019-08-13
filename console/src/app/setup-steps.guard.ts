import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { RoutesList } from './modules/app-module/Routing/routes-list';

@Injectable({
  providedIn: 'root'
})
export class SetupStepsGuard implements CanActivate {

  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //  NOTE: Since set up steps' order is strctly defined, we're ...
    //  ... disabling the page refresh on steps higher than the first one.
    if (this.isPageRefresh()) {
      console.warn("All set up steps should be completed in a strict order.");
      this.router.navigateByUrl(RoutesList.MONGOOSE_SETUP);
      return false;
    }
    return true;
  }

  /**
   * @returns true if the current routing request is a part of page refresh.
   */
  private isPageRefresh(): boolean {
    return (!this.router.navigated);

  }

}
