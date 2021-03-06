import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from "./chat-service";

import {FormControl, FormGroup} from "@angular/forms";
import {Message} from "./message";
import {User} from "../users/user";
import {UserService} from "../users/user.service";
import {RideListService} from "../rides/ride-list.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: []
})
export class ChatComponent implements OnInit {

  // feedId is set in the ride-list component when the chat dialog is opened.
  @Input() feedId: string;
  public messages: Message[];

  public loggedInUserId: string = localStorage.getItem('oid');
  public loggedInUserName: string = localStorage.getItem('userFullName');
  public loggedInUserAvatar: string = localStorage.getItem('pictureUrl');

  public messageToSend: Message;
  public sendMessageForm = new FormGroup({
    messageToSend: new FormControl()
  });

  constructor(public chatService: ChatService) {
    this.messageToSend = {
      from_id: this.loggedInUserId,
      from_name: this.loggedInUserName,
      from_avatar: this.loggedInUserAvatar,
      body: "",
      sent: ChatComponent.currentDate(),
    };
  }

  public sendMessage() {
    if (this.messageToSend.body.length > 0) {
      console.log("Sending message to chat: " + this.feedId);

      this.messageToSend.sent = ChatComponent.currentDate();
      this.chatService.sendMessage(this.messageToSend, this.feedId);
      this.messageToSend.body = "";
      this.getMessages();
      this.getMessages();
    }
  }

  public getMessages() {

    this.chatService.getMessages(this.feedId).then(feedData => {
      this.messages = [];
      let i;
      for (i = 0; i < feedData.length; i++) {
        this.messages.push(JSON.parse(feedData[i]['object']));
      }
      this.messages.reverse();
    });
  }

  deleteChat() {
    this.chatService.deleteChat(this.feedId);
    this.getMessages();
    this.getMessages();
  }

  ngOnInit() {
    this.getMessages();
  }

  private static currentDate(): Date {
    return new Date(Date.now());
  }

}
