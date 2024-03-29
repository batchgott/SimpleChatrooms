import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../../../models/room.model";
import {environment} from "../../../../../environments/environment";
import {RoomService} from "../../../../services/room.service";
import {ToastService} from "../../../../services/toast.service";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";
import {SignalrService} from "../../../../services/signalr.service";

/**
 * The JoinRoomListItem is the list item in the the room list
 */
@Component({
  selector: 'app-join-room-list-item',
  templateUrl: './join-room-list-item.component.html',
  styleUrls: ['./join-room-list-item.component.scss'],
})
export class JoinRoomListItemComponent implements OnInit {

  @Input() room: Room;
  environment = environment;
  loading: boolean = false;

  constructor(private roomService: RoomService,
              private toastService: ToastService,
              private router: Router,
              private signalRService: SignalrService) {
  }

  ngOnInit() {
  }

  /**
   * Sends the user join request to the server
   */
  join() {
    this.loading = true;

    this.roomService.join(this.room.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe((room: Room) => {
        this.roomService.getAll();
        this.toastService.success('You joined the room!');
        this.router.navigate(['']);
        this.signalRService.restartConnection();
      }, error => this.toastService.error('An error occurred while joining the room'));
  }
}
