import {Input, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { GiftsService } from '../../services/gifts.service';
import { UserService } from '../../services/user.service';
import { PeopleService } from '../../services/people.service';
import {Popup} from 'ng2-opd-popup';

@Component({
  selector: 'gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.css']
})
export class GiftCardComponent implements OnInit {
  @Input() gift;
  @Input() type;
  @Input() person;

  @ViewChild('popup1') popup1: Popup;
  @ViewChild('popup2') popup2: Popup;

  private active = false;

  constructor(private giftsService: GiftsService,
    private userService: UserService,
    private peopleService: PeopleService,
    private popup:Popup) { 

  }
  onMouseenter($event){
    this.active = true;
  }

  onMouseleave($event){
    this.active = false;
  }
  ngOnInit() {
  }

  deleteFromFavorites(){
    this.giftsService.DeleteGiftFromFavorites(this.gift)
    .subscribe(res => {
      if(res.success){          
        
      }
    });
  }




  private people;
  private selectedPersonId;

  showAddGiftToPersonPopup(){

    this.userService.getUserPeople()
    .subscribe(res => {
      if(res.people){          
        this.people = res.people;
        if(this.people.length != 0){
          this.selectedPersonId = this.people[0].id;
        }
      }
    });
    this.popup1.options = {
      header: "Добавление подарка другу",
      color: "rgb(92, 32, 64)",  
      widthProsentage: 40, 
      animationDuration: 0.5, 
      showButtons: true, 
      confirmBtnContent: "Добавить", 
      cancleBtnContent: "Отмена", 
      confirmBtnClass: "btn btn-info", 
      cancleBtnClass: "btn btn-info", 
      animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
  };
    this.popup1.show(this.popup1.options);
  }

  addGiftToPersonEvent(){
   
    this.giftsService.addGiftToPerson(this.gift, this.selectedPersonId)
    .subscribe(res => {
      if(res.person){          
        this.people.push(res.person);
      }
      this.popup1.hide();
    });
  }

  changeSelectedPerson($event){
    this.selectedPersonId = $event.target.value;
  }






  private holidays;
  private selectedHolidayId;

  showAddGiftToHolidayPopup(){    
        this.peopleService.getPerson(this.person)
        .subscribe(res => {
          if(res.person){          
            this.person = res.person;
            if(this.person.holidays.length != 0){
              this.selectedHolidayId = this.person.holidays[0].id;
            }
          }
        });
        this.popup2.options = {
          header: "Добавление подарка к событию",
          color: "rgb(92, 32, 64)",  
          widthProsentage: 40, 
          animationDuration: 0.5, 
          showButtons: true, 
          confirmBtnContent: "Добавить", 
          cancleBtnContent: "Отмена", 
          confirmBtnClass: "btn btn-info", 
          cancleBtnClass: "btn btn-info", 
          animation: "fadeInDown" 
      };
        this.popup2.show(this.popup2.options);
      }
    
      addGiftToHolidayEvent(){       
        this.giftsService.addGiftToHoliday(this.gift, this.selectedHolidayId)
        .subscribe(res => {
          this.popup2.hide();
        });
      }
    
      changeSelectedHoliday($event){
        this.selectedHolidayId = $event.target.value;
      }



}
