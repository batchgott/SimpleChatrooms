import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateChatroomPage } from './create-chatroom.page';

/**
 * Declares routes for CreateChatroomPageModule
 */
const routes: Routes = [
  {
    path: '',
    component: CreateChatroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateChatroomPageRoutingModule {}
