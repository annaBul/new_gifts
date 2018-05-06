import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../services/admin.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users = [];
  error ='';

  constructor(private adminService:AdminService,
    private router: Router) {
    this.adminService.getUsers()
    .subscribe(res => {
      if(res.users){          
        this.users = res.users;         
      }
     });
   }

  ngOnInit() {
  }

  changeUserBlocked(user){
    this.adminService.changeUserBlocked(user['id'], user.blocked)
    .subscribe(res => {
      if(res.error){          
        this.error = res.error;
      } else {
        this.error = '';
      }
    });
  }

  changeUserRole(newRole, user){
    var modifiableUser = {
      id: user['id'],
      newRole: newRole    
    }
    this.adminService.changeUserRole(modifiableUser)
    .subscribe(res => {
      if(res.error){          
        this.error = res.error;
      } else {
        this.error = '';
      }
    });
  }

}
