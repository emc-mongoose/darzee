import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { setupRoutes } from "./mongoose-setup.routes";

@NgModule({
    imports: [RouterModule.forRoot(setupRoutes)],
    exports: [RouterModule]
})

export class SetUpRoutingModule {}