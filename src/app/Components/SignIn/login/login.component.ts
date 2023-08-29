import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm! : FormGroup
  constructor(private fb: FormBuilder, private auth: AuthService, private router : Router){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',Validators.required ],
     password: ['',Validators.required ]
    })
  }
  onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      //send object to db
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(response)=>{
          console.log('Login response:', response); 
          alert(response.message);
          this.auth.storeToken(response.token)
          this.auth.storeDetails(response.userInfo.name, response.userInfo.id)
          this.router.navigate(['/dashboard'])
         this.loginForm.reset();
         
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
      
    }
    else{
      //throw error
      console.log("form is not valid")
      this.validateForm(this.loginForm)
      alert("Your form is invalid")
    }
  }
  private validateForm(formgroup: FormGroup){
    Object.keys(formgroup.controls).forEach(field => {
      const control = formgroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true})
      }else if(control instanceof FormGroup){
        this.validateForm(control)
      }
    });
  }
}
